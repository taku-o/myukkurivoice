var _fs, fs                 = () => { _fs = _fs || require('fs'); return _fs; };
var _temp, temp             = () => { _temp = _temp || require('temp').track(); return _temp; };
var _WavEncoder, WavEncoder = () => { _WavEncoder = _WavEncoder || require('wav-encoder'); return _WavEncoder; };

// angular audio service
angular.module('AudioServices', ['MessageServices', 'UtilServices'])
  .factory('AudioService1', ['$q', 'MessageService', ($q, MessageService: yubo.MessageService): yubo.AudioService1 => {
    // Audio base AudioService
    let audio = null;

    return {
      play: function(bufWav: any, options: yubo.PlayOptions): ng.IPromise<string> {
        const d = $q.defer();
        if (!bufWav) {
          MessageService.syserror('再生する音源が渡されませんでした。');
          d.reject(new Error('再生する音源が渡されませんでした。')); return d.promise;
        }
        // if audio playing, stop current playing
        if (audio) { audio.pause(); }

        const fsprefix = `_myubop${Date.now().toString(36)}`;
        temp().open(fsprefix, (err: Error, info) => {
          if (err) {
            MessageService.syserror('一時作業ファイルを作れませんでした。', err);
            d.reject(err); return;
          }

          fs().writeFile(info.path, bufWav, (err: Error) => {
            if (err) {
              MessageService.syserror('一時作業ファイルの書き込みに失敗しました。', err);
              d.reject(err); return;
            }

            audio = new Audio('');
            audio.autoplay = false;
            audio.src = info.path;
            audio.onended = () => {
              d.resolve('ok');
            };
            audio.play();
          });
        });
        return d.promise;
      },
      stop: function(): void {
        if (!audio) { return; }
        audio.pause();
      },
      record: function(wavFilePath: string, bufWav: any, options: yubo.PlayOptions): ng.IPromise<string> {
        const d = $q.defer();
        if (!wavFilePath) {
          MessageService.syserror('音声ファイルの保存先が指定されていません。');
          d.reject(new Error('音声ファイルの保存先が指定されていません。')); return d.promise;
        }
        if (!bufWav) {
          MessageService.syserror('保存する音源が渡されませんでした。');
          d.reject(new Error('保存する音源が渡されませんでした。')); return d.promise;
        }

        fs().writeFile(wavFilePath, bufWav, (err: Error) => {
          if (err) {
            MessageService.syserror('音声ファイルの書き込みに失敗しました。', err);
            d.reject(err); return;
          }
          d.resolve('ok');
        });
        return d.promise;
      },
    };
  }])
  .factory('AudioService2', ['$q', 'MessageService', 'AppUtilService',
  ($q, MessageService: yubo.MessageService, AppUtilService: yubo.AppUtilService): yubo.AudioService2 => {
    // Web Audio API base AudioService
    // @ts-ignore
    const audioCtx = new window.AudioContext();
    let runningNode = null;

    function toArrayBuffer(bufWav): any {
      const aBuffer = new ArrayBuffer(bufWav.length);
      const view = new Uint8Array(aBuffer);
      for (let i = 0; i < bufWav.length; ++i) {
        view[i] = bufWav[i];
      }
      return aBuffer;
    }

    function correctFrameCount(audioBuffer): number {
      let max = 0;
      for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
        const buffer = audioBuffer.getChannelData(i);
        const count = correctBufferLength(buffer);
        if (max < count) {
          max = count;
        }
      }
      return max;
    }
    function correctBufferLength(buffer): number {
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
    function buildCorrectAudioBuffer(audioBuffer): any {
      const frameCount = correctFrameCount(audioBuffer);
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

    return {
      play: function(bufWav: any, options: yubo.PlayOptions): ng.IPromise<string> {
        const d = $q.defer();
        if (!bufWav) {
          MessageService.syserror('再生する音源が渡されませんでした。');
          d.reject(new Error('再生する音源が渡されませんでした。')); return d.promise;
        }
        // if audio playing, stop current playing
        if (runningNode) { runningNode.stop(0); runningNode = null; }

        const aBuffer = toArrayBuffer(bufWav);
        audioCtx.decodeAudioData(aBuffer).then((decodedData) => {
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
          const inSourceNode = offlineCtx.createBufferSource();
          inSourceNode.buffer = decodedData;

          const nodeList = [];

          // playbackRate
          if (options.playbackRate && options.playbackRate != 1.0) {
            inSourceNode.playbackRate.value = options.playbackRate;
          }
          // detune
          if (options.detune && options.detune != 0) {
            inSourceNode.detune.value = options.detune;
          }
          // gain
          const gainNode = offlineCtx.createGain();
          gainNode.gain.value = options.volume;
          nodeList.push(gainNode);

          // connect
          let lastNode = inSourceNode;
          angular.forEach(nodeList, (node) => {
            lastNode.connect(node); lastNode = node;
          });
          lastNode.connect(offlineCtx.destination);

          // and start
          inSourceNode.start(0);

          // rendering
          offlineCtx.startRendering().then((renderedBuffer) => {
            // trim unused empty buffer.
            const nAudioBuffer = buildCorrectAudioBuffer(renderedBuffer);

            // report duration
            AppUtilService.reportDuration(nAudioBuffer.duration);

            // play voice
            runningNode = audioCtx.createBufferSource();
            runningNode.buffer = nAudioBuffer;
            runningNode.connect(audioCtx.destination);
            runningNode.onended = () => {
              d.resolve('ok');
            };
            runningNode.start(0);
          }); // offlineCtx.startRendering
        })
        .catch((err: Error) => {
          MessageService.syserror('音源の再生に失敗しました。', err);
          d.reject(err); return;
        });
        return d.promise;
      },
      stop: function(): void {
        if (runningNode) { runningNode.stop(0); runningNode = null; }
      },
      record: function(wavFilePath: string, bufWav: any, options: yubo.PlayOptions): ng.IPromise<string> {
        const d = $q.defer();
        if (!wavFilePath) {
          MessageService.syserror('音声ファイルの保存先が指定されていません。');
          d.reject(new Error('音声ファイルの保存先が指定されていません。')); return d.promise;
        }
        if (!bufWav) {
          MessageService.syserror('保存する音源が渡されませんでした。');
          d.reject(new Error('保存する音源が渡されませんでした。')); return d.promise;
        }

        const aBuffer = toArrayBuffer(bufWav);
        audioCtx.decodeAudioData(aBuffer).then((decodedData) => {
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
          const inSourceNode = offlineCtx.createBufferSource();
          inSourceNode.buffer = decodedData;

          const nodeList = [];

          // playbackRate
          if (options.playbackRate && options.playbackRate != 1.0) {
            inSourceNode.playbackRate.value = options.playbackRate;
          }
          // detune
          if (options.detune && options.detune != 0) {
            inSourceNode.detune.value = options.detune;
          }
          // gain
          const gainNode = offlineCtx.createGain();
          gainNode.gain.value = options.volume;
          nodeList.push(gainNode);

          // connect
          let lastNode = inSourceNode;
          angular.forEach(nodeList, (node) => {
            lastNode.connect(node); lastNode = node;
          });
          lastNode.connect(offlineCtx.destination);

          // and start
          inSourceNode.start(0);

          // rendering
          offlineCtx.startRendering().then((renderedBuffer) => {
            // trim unused empty buffer.
            const nAudioBuffer = buildCorrectAudioBuffer(renderedBuffer);

            // report duration
            AppUtilService.reportDuration(nAudioBuffer.duration);

            // create audioData parameter for wav-encoder
            const audioData = {
              sampleRate: nAudioBuffer.sampleRate,
              channelData: [],
            };
            for (let i = 0; i < nAudioBuffer.numberOfChannels; i++) {
              audioData.channelData[i] = nAudioBuffer.getChannelData(i);
            }
            // create wav file.
            WavEncoder().encode(audioData).then((buffer) => {
              fs().writeFile(wavFilePath, Buffer.from(buffer), 'binary', (err) => {
                if (err) {
                  MessageService.syserror('音声ファイルの作成に失敗しました。', err);
                  d.reject(err); return;
                }
                d.resolve('ok');
              });
            });
          }); // offlineCtx.startRendering
        })
        .catch((err: Error) => {
          MessageService.syserror('音源の再生に失敗しました。', err);
          d.reject(err); return;
        });
        return d.promise;
      },
    };
  }]);

