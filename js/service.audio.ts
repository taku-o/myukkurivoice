var _fs: any, fs                           = () => { _fs = _fs || require('fs'); return _fs; };
var _temp: any, temp                       = () => { _temp = _temp || require('temp').track(); return _temp; };
var _WavEncoder: any, WavEncoder           = () => { _WavEncoder = _WavEncoder || require('wav-encoder'); return _WavEncoder; };
var _wavDuration: any, wavDuration         = () => { _wavDuration = _wavDuration || require('wav-audio-length').default; return _wavDuration; };
var _fcpxRoleEncoder: any, fcpxRoleEncoder = () => { _fcpxRoleEncoder = _fcpxRoleEncoder || require('fcpx-audio-role-encoder').default; return _fcpxRoleEncoder; };

// env
var TEST = process.env.NODE_ENV == 'test';

// angular audio service
angular.module('AudioServices', ['MessageServices', 'AudioAnalyzerServices', 'UtilServices']);

// Audio base AudioService
class AudioService1 implements yubo.AudioService1 {
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
        d.reject(err); return;
      }

      // report duration
      const wavSec = wavDuration()(bufWav);
      this.AppUtilService.reportDuration(wavSec);

      fs().writeFile(info.path, bufWav, (err: Error) => {
        if (err) {
          this.MessageService.syserror('一時作業ファイルの書き込みに失敗しました。', err);
          d.reject(err); return;
        }

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

    fs().writeFile(wavFilePath, rBufWav, (err: Error) => {
      if (err) {
        this.MessageService.syserror('音声ファイルの書き込みに失敗しました。', err);
        d.reject(err); return;
      }
      d.resolve({duration: wavSec});
    });
    return d.promise;
  }
}
angular.module('AudioServices')
  .service('AudioService1', [
    '$q',
    'MessageService',
    'AppUtilService',
    AudioService1,
  ]);

// Web Audio API base AudioService
class AudioService2 implements yubo.AudioService2 {
  private runningNode: AudioBufferSourceNode = null;
  constructor(
    private $q: ng.IQService,
    private MessageService: yubo.MessageService,
    private AudioAnalyzerService: yubo.AudioAnalyzerService,
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
    const audioCtx = new window.AudioContext();
    const processNodeList: AudioNode[] = [];
    let sourceNode: AudioBufferSourceNode = null;
    let audioPlayNode: AudioBufferSourceNode = null;
    let analyserNode: AnalyserNode = null;
    audioCtx.decodeAudioData(aBuffer).then((decodedData: AudioBuffer) => {
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
      const bufFrameCount = decodedData.length * prate * drate;
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
      // analyzer
      analyserNode = offlineCtx.createAnalyser();
      processNodeList.push(analyserNode);

      // connect
      let lastNode: AudioNode = sourceNode;
      angular.forEach(processNodeList, (node) => {
        lastNode.connect(node); lastNode = node;
      });
      lastNode.connect(offlineCtx.destination);

      // and start
      sourceNode.start(0);

      // rendering
      return offlineCtx.startRendering().then((renderedBuffer: AudioBuffer) => {
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
          dInPlay.resolve({duration: nAudioBuffer.duration});
        };
        audioPlayNode.start(0);

        this.runningNode = audioPlayNode;
        return dInPlay.promise;
      }); // offlineCtx.startRendering
    })
    .then((audioParams: {duration: number}) => {
      // analyser
      let data = new Uint8Array(analyserNode.frequencyBinCount);
      analyserNode.getByteFrequencyData(data);
      this.AudioAnalyzerService.report(data);

      this.runningNode = null;
      d.resolve(audioParams);
    })
    .catch((err: Error) => {
      this.MessageService.syserror('音源の再生に失敗しました。', err);
      d.reject(err); return;
    })
    .finally(() => {
      // close audio context
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
    const audioCtx = new window.AudioContext();
    const processNodeList: AudioNode[] = [];
    let sourceNode: AudioBufferSourceNode = null;
    let analyserNode: AnalyserNode = null;
    audioCtx.decodeAudioData(aBuffer).then((decodedData: AudioBuffer) => {
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
      const bufFrameCount = decodedData.length * prate * drate;
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
      // analyzer
      analyserNode = offlineCtx.createAnalyser();
      processNodeList.push(analyserNode);

      // connect
      let lastNode: AudioNode = sourceNode;
      angular.forEach(processNodeList, (node) => {
        lastNode.connect(node); lastNode = node;
      });
      lastNode.connect(offlineCtx.destination);

      // and start
      sourceNode.start(0);

      // rendering
      return offlineCtx.startRendering().then((renderedBuffer: AudioBuffer) => {
        // trim unused empty buffer.
        const nAudioBuffer = this.buildCorrectAudioBuffer(renderedBuffer);

        // report duration
        this.AppUtilService.reportDuration(nAudioBuffer.duration);

        // create audioData parameter for wav-encoder
        const audioData: WavEncoder.AudioData = {
          sampleRate: nAudioBuffer.sampleRate,
          channelData: [],
        };
        for (let i = 0; i < nAudioBuffer.numberOfChannels; i++) {
          audioData.channelData[i] = nAudioBuffer.getChannelData(i);
        }
        // create wav file.
        const dInEncode = this.$q.defer<{duration: number}>();
        WavEncoder().encode(audioData).then((buffer: ArrayBuffer) => {
          const inBufWav = Buffer.from(buffer);

          // extensions.fcpx
          let rBufWav = options.fcpxIxml?
            new (fcpxRoleEncoder())().encodeSync(inBufWav, options.fcpxIxmlOptions.audioRole):
            inBufWav;

          fs().writeFile(wavFilePath, rBufWav, 'binary', (err: Error) => {
            if (err) {
              dInEncode.reject(err); return;
            }
            dInEncode.resolve({duration: nAudioBuffer.duration});
          });
        });
        return dInEncode.promise;
      }); // offlineCtx.startRendering
    })
    .then((audioParams: {duration: number}) => {
      // analyser
      let data = new Uint8Array(analyserNode.frequencyBinCount);
      analyserNode.getByteFrequencyData(data);
      this.AudioAnalyzerService.report(data);

      d.resolve(audioParams);
    })
    .catch((err: Error) => {
      this.MessageService.syserror('音声ファイルの作成に失敗しました。', err);
      d.reject(err); return;
    })
    .finally(() => {
      // close audio context
      if (sourceNode) {
        sourceNode.buffer = null;
        sourceNode.disconnect();
      }
      angular.forEach(processNodeList, (node) => {
        node.disconnect();
      });
      audioCtx.close();
    });
    return d.promise;
  }
}
angular.module('AudioServices')
  .service('AudioService2', [
    '$q',
    'MessageService',
    'AudioAnalyzerService',
    'AppUtilService',
    AudioService2,
  ]);
