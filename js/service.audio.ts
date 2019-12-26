var _WavEncoder: any, WavEncoder           = () => { _WavEncoder = _WavEncoder || require('wav-encoder'); return _WavEncoder; };
var _customError: any, customError         = () => { _customError = _customError || require('custom-error'); return _customError; };
var _fcpxRoleEncoder: any, fcpxRoleEncoder = () => { _fcpxRoleEncoder = _fcpxRoleEncoder || require('fcpx-audio-role-encoder').default; return _fcpxRoleEncoder; };
var _fs: any, fs                           = () => { _fs = _fs || require('fs'); return _fs; };
var _path: any, path                       = () => { _path = _path || require('path'); return _path; };
var _temp: any, temp                       = () => { _temp = _temp || require('temp').track(); return _temp; };
var _wavDuration: any, wavDuration         = () => { _wavDuration = _wavDuration || require('wav-audio-length').default; return _wavDuration; };

var BreakChain = customError()('BreakChain');

// env
var TEST = process.env.NODE_ENV == 'test';

// application settings
var defaultSaveDir = process.mas? `${app.getPath('music')}/MYukkuriVoice`: app.getPath('desktop');

// angular audio service
angular.module('AudioServices', ['MessageServices', 'UtilServices']);

// Audio base AudioService
class HTML5AudioService implements yubo.HTML5AudioService {
  private audio: HTMLAudioElement = null;
  constructor(
    private $q: ng.IQService,
    private MessageService: yubo.MessageService,
    private AppUtilService: yubo.AppUtilService
  ) {}

  play(bufWav: Buffer, options: yubo.PlayOptions): ng.IPromise<{duration: number}> {
    const d = this.$q.defer<{duration: number}>();
    if (!bufWav) {
      this.MessageService.syserror('再生する音源が渡されませんでした。');
      d.reject(new Error('再生する音源が渡されませんでした。')); return d.promise;
    }
    // if audio playing, stop current playing
    if (this.audio) { this.audio.pause(); }

    const fsprefix = `_myubop${Date.now().toString(36)}`;
    temp().open(fsprefix, (err: Error, info: temp.FileDescriptor) => {
      if (err) {
        this.MessageService.syserror('一時作業ファイルを作れませんでした。', err);
        d.reject(err); throw BreakChain();
      }

      // report duration
      const wavSec = wavDuration()(bufWav);
      this.AppUtilService.reportDuration(wavSec);

      fs().promises.writeFile(info.path, bufWav)
      .catch((err: Error) => {
        this.MessageService.syserror('一時作業ファイルの書き込みに失敗しました。', err);
        d.reject(err); throw BreakChain();
      })
      .then(() => {
        this.audio = new Audio('');
        this.audio.autoplay = false;
        this.audio.src = info.path;
        if (TEST) {
          this.audio.volume = options.volume;
        }
        this.audio.onended = () => {
          d.resolve({duration: wavSec});
        };
        this.audio.play();
      });
    });
    return d.promise;
  }

  stop(): void {
    if (!this.audio) { return; }
    this.audio.pause();
  }

  record(wavFilePath: string, bufWav: Buffer, options: yubo.RecordOptions): ng.IPromise<{duration: number}> {
    const d = this.$q.defer<{duration: number}>();
    if (!wavFilePath) {
      this.MessageService.syserror('音声ファイルの保存先が指定されていません。');
      d.reject(new Error('音声ファイルの保存先が指定されていません。')); return d.promise;
    }
    if (!bufWav) {
      this.MessageService.syserror('保存する音源が渡されませんでした。');
      d.reject(new Error('保存する音源が渡されませんでした。')); return d.promise;
    }

    // report duration
    const wavSec = wavDuration()(bufWav);
    this.AppUtilService.reportDuration(wavSec);

    // extensions.fcpx
    let rBufWav = options.fcpxIxml?
      new (fcpxRoleEncoder())().encodeSync(bufWav, options.fcpxIxmlOptions.audioRole):
      bufWav;

    Promise.resolve(true).then(() => {
      return process.mas && path().dirname(wavFilePath) == defaultSaveDir?
        fs().promises.mkdir(path().dirname(wavFilePath), {recursive: true}):
        true;
    })
    .then(() => {
      return fs().promises.writeFile(wavFilePath, rBufWav);
    })
    .catch((err: Error) => {
      this.MessageService.syserror('音声ファイルの書き込みに失敗しました。', err);
      d.reject(err); throw BreakChain();
    })
    .then(() => {
      return d.resolve({duration: wavSec});
    });
    return d.promise;
  }
}
angular.module('AudioServices')
  .service('HTML5AudioService', [
    '$q',
    'MessageService',
    'AppUtilService',
    HTML5AudioService,
  ]);

// Web Audio API base AudioService
class WebAPIAudioService implements yubo.WebAPIAudioService {
  public sampleRate?: number = null;
  private runningNode: AudioBufferSourceNode = null;
  constructor(
    private $q: ng.IQService,
    private $timeout: ng.ITimeoutService,
    private MessageService: yubo.MessageService,
    private AppUtilService: yubo.AppUtilService
  ) {}

  private toArrayBuffer(bufWav: Buffer): ArrayBuffer {
    const aBuffer = new ArrayBuffer(bufWav.length);
    const view = new Uint8Array(aBuffer);
    for (let i = 0; i < bufWav.length; ++i) {
      view[i] = bufWav[i];
    }
    return aBuffer;
  }

  private correctFrameCount(audioBuffer: AudioBuffer): number {
    let max = 0;
    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
      const buffer: Float32Array = audioBuffer.getChannelData(i);
      const count = this.correctBufferLength(buffer);
      if (max < count) {
        max = count;
      }
    }
    return max;
  }
  private correctBufferLength(buffer: Float32Array): number {
    let pos = 0;
    for (let i = buffer.length - 1; i >= 0; i--) {
      if (buffer[i] !== 0x00) {
        pos = i;
        break;
      }
    }
    pos ++;
    if (pos % 2 != 0) {
      pos += 1;
    }
    return pos;
  }
  private buildCorrectAudioBuffer(audioBuffer: AudioBuffer): AudioBuffer {
    const frameCount = this.correctFrameCount(audioBuffer);
    const nAudioBuffer = new AudioBuffer({
      numberOfChannels: audioBuffer.numberOfChannels,
      length: frameCount,
      sampleRate: audioBuffer.sampleRate,
    });

    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
      const buffer = audioBuffer.getChannelData(i);
      const trimmed = buffer.slice(0, frameCount);
      nAudioBuffer.copyToChannel(trimmed, i, 0);
    }
    return nAudioBuffer;
  }

  play(bufWav: Buffer, options: yubo.PlayOptions): ng.IPromise<{duration: number}> {
    const d = this.$q.defer<{duration: number}>();
    if (!bufWav) {
      this.MessageService.syserror('再生する音源が渡されませんでした。');
      d.reject(new Error('再生する音源が渡されませんでした。')); return d.promise;
    }
    // if audio playing, stop current playing
    if (this.runningNode) { this.runningNode.stop(0); this.runningNode = null; }

    const aBuffer = this.toArrayBuffer(bufWav);

    // @ts-ignore
    const audioCtx = this.sampleRate? new window.AudioContext({sampleRate: this.sampleRate}): new window.AudioContext();
    const processNodeList: AudioNode[] = [];
    let sourceNode: AudioBufferSourceNode = null;
    let audioPlayNode: AudioBufferSourceNode = null;

    // decodeAudioData
    audioCtx.decodeAudioData(aBuffer)
    .then((decodedData: AudioBuffer) => {
      // create long size OfflineAudioContext. trim this buffer length lator.
      const prate =
        (!options.playbackRate)? 1:
        (options.playbackRate >= 1.0)? 1:
        (options.playbackRate >= 0.5)? 2:
        2.5; // 0.4
      const drate =
        (!options.detune)? 1:
        (options.detune >= 0)? 1:
        2; // -1200
      const margin = 1.1;
      const bufFrameCount = decodedData.length * prate * drate * margin;
      const offlineCtx = new OfflineAudioContext(decodedData.numberOfChannels, bufFrameCount, decodedData.sampleRate);

      // source
      sourceNode = offlineCtx.createBufferSource();
      sourceNode.buffer = decodedData;

      // playbackRate
      if (options.playbackRate && options.playbackRate != 1.0) {
        sourceNode.playbackRate.value = options.playbackRate;
      }
      // detune
      if (options.detune && options.detune != 0) {
        sourceNode.detune.value = options.detune;
      }
      // gain
      const gainNode: GainNode = offlineCtx.createGain();
      gainNode.gain.value = options.volume;
      processNodeList.push(gainNode);

      // connect
      let lastNode: AudioNode = sourceNode;
      angular.forEach(processNodeList, (node) => {
        lastNode.connect(node); lastNode = node;
      });
      lastNode.connect(offlineCtx.destination);

      // and start
      sourceNode.start(0);

      // rendering
      return offlineCtx.startRendering();
    })
    .then((renderedBuffer: AudioBuffer) => {
      // trim unused empty buffer.
      const nAudioBuffer = this.buildCorrectAudioBuffer(renderedBuffer);

      // report duration
      this.AppUtilService.reportDuration(nAudioBuffer.duration);

      const dInPlay = this.$q.defer<{duration: number}>();
      // play voice
      audioPlayNode = audioCtx.createBufferSource();
      audioPlayNode.buffer = nAudioBuffer;
      audioPlayNode.connect(audioCtx.destination);
      audioPlayNode.onended = () => {
        return dInPlay.resolve({duration: nAudioBuffer.duration});
      };
      audioPlayNode.start(0);

      this.runningNode = audioPlayNode;
      return dInPlay.promise;
    })
    .catch((err: Error) => {
      this.MessageService.syserror('音源の再生に失敗しました。', err);
      d.reject(err); throw BreakChain();
    })
    .then((audioParams: {duration: number}) => {
      this.runningNode = null;
      return d.resolve(audioParams);
    })
    .finally(() => {
      // close audio context
      // (delay closing)
      this.$timeout(() => {
        if (sourceNode) {
          sourceNode.buffer = null;
          sourceNode.disconnect();
        }
        angular.forEach(processNodeList, (node) => {
          node.disconnect();
        });
        if (audioPlayNode) {
          audioPlayNode.buffer = null;
          audioPlayNode.disconnect();
        }
        audioCtx.close();
      }, 500, false);
    });
    return d.promise;
  }

  stop(): void {
    if (this.runningNode) { this.runningNode.stop(0); this.runningNode = null; }
  }

  record(wavFilePath: string, bufWav: Buffer, options: yubo.RecordOptions): ng.IPromise<{duration: number}> {
    const d = this.$q.defer<{duration: number}>();
    if (!wavFilePath) {
      this.MessageService.syserror('音声ファイルの保存先が指定されていません。');
      d.reject(new Error('音声ファイルの保存先が指定されていません。')); return d.promise;
    }
    if (!bufWav) {
      this.MessageService.syserror('保存する音源が渡されませんでした。');
      d.reject(new Error('保存する音源が渡されませんでした。')); return d.promise;
    }

    const aBuffer = this.toArrayBuffer(bufWav);

    // @ts-ignore
    const audioCtx = this.sampleRate? new window.AudioContext({sampleRate: this.sampleRate}): new window.AudioContext();
    const processNodeList: AudioNode[] = [];
    let sourceNode: AudioBufferSourceNode = null;
    let generatedAudioBuffer: AudioBuffer = null;
    // decodeAudioData
    audioCtx.decodeAudioData(aBuffer)
    .then((decodedData: AudioBuffer) => {
      // create long size OfflineAudioContext. trim this buffer length lator.
      const prate =
        (!options.playbackRate)? 1:
        (options.playbackRate >= 1.0)? 1:
        (options.playbackRate >= 0.5)? 2:
        2.5; // 0.4
      const drate =
        (!options.detune)? 1:
        (options.detune >= 0)? 1:
        2; // -1200
      const margin = 1.1;
      const bufFrameCount = decodedData.length * prate * drate * margin;
      const offlineCtx = new OfflineAudioContext(decodedData.numberOfChannels, bufFrameCount, decodedData.sampleRate);

      // source
      sourceNode = offlineCtx.createBufferSource();
      sourceNode.buffer = decodedData;

      // playbackRate
      if (options.playbackRate && options.playbackRate != 1.0) {
        sourceNode.playbackRate.value = options.playbackRate;
      }
      // detune
      if (options.detune && options.detune != 0) {
        sourceNode.detune.value = options.detune;
      }
      // gain
      const gainNode: GainNode = offlineCtx.createGain();
      gainNode.gain.value = options.volume;
      processNodeList.push(gainNode);

      // connect
      let lastNode: AudioNode = sourceNode;
      angular.forEach(processNodeList, (node) => {
        lastNode.connect(node); lastNode = node;
      });
      lastNode.connect(offlineCtx.destination);

      // and start
      sourceNode.start(0);

      // rendering
      return offlineCtx.startRendering();
    })
    .then((renderedBuffer: AudioBuffer) => {
      // trim unused empty buffer.
      generatedAudioBuffer = this.buildCorrectAudioBuffer(renderedBuffer);

      // report duration
      this.AppUtilService.reportDuration(generatedAudioBuffer.duration);

      // create audioData parameter for wav-encoder
      const audioData: WavEncoder.AudioData = {
        sampleRate: generatedAudioBuffer.sampleRate,
        channelData: [],
      };
      for (let i = 0; i < generatedAudioBuffer.numberOfChannels; i++) {
        audioData.channelData[i] = generatedAudioBuffer.getChannelData(i);
      }
      // create wav file.
      return WavEncoder().encode(audioData);
    })
    .then((buffer: ArrayBuffer) => {
      const inBufWav = Buffer.from(buffer);

      // extensions.fcpx
      let rBufWav = options.fcpxIxml?
        new (fcpxRoleEncoder())().encodeSync(inBufWav, options.fcpxIxmlOptions.audioRole):
        inBufWav;

      return Promise.resolve(true).then(() => {
        return process.mas && path().dirname(wavFilePath) == defaultSaveDir?
          fs().promises.mkdir(path().dirname(wavFilePath), {recursive: true}):
          true;
      })
      .then(() => {
        return fs().promises.writeFile(wavFilePath, rBufWav, 'binary');
      })
      .catch((err: Error) => {
        this.MessageService.syserror('音声ファイルの作成に失敗しました。', err);
        d.reject(err); throw BreakChain();
      });
    })
    .then(() => {
      return d.resolve({duration: generatedAudioBuffer.duration});
    })
    .finally(() => {
      // close audio context
      // (delay closing)
      this.$timeout(() => {
        if (sourceNode) {
          sourceNode.buffer = null;
          sourceNode.disconnect();
        }
        angular.forEach(processNodeList, (node) => {
          node.disconnect();
        });
        audioCtx.close();
      }, 500, false);
    });
    return d.promise;
  }
}
angular.module('AudioServices')
  .service('WebAPIAudioService', [
    '$q',
    '$timeout',
    'MessageService',
    'AppUtilService',
    WebAPIAudioService,
  ]);
