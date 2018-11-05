var _fs, fs                     = () => { _fs = _fs || require('fs'); return _fs; };
var _temp, temp                 = () => { _temp = _temp || require('temp').track(); return _temp; };
var _WaveRecorder, WaveRecorder = () => { _WaveRecorder = _WaveRecorder || require('wave-recorder'); return _WaveRecorder; };

// angular audio service
angular.module('yvoiceAudioService', ['yvoiceMessageService', 'yvoiceUtilService'])
  .factory('AudioService1', ['$q', 'MessageService', ($q, MessageService: yubo.MessageService): yubo.AudioService1 => {
    // Audio base AudioService
    let audio = null;

    return {
      play: function(bufWav: any, options: yubo.PlayOptions, parallel: boolean = false): ng.IPromise<string> {
        const d = $q.defer();
        if (!bufWav) {
          MessageService.syserror('再生する音源が渡されませんでした。');
          d.reject(null); return d.promise;
        }
        if (!parallel) {
          if (audio) { audio.pause(); }
        }

        const fsprefix = `_myubop${Date.now().toString(36)}`;
        temp().open(fsprefix, (err: Error, info) => {
          if (err) {
            MessageService.syserror('一時作業ファイルを作れませんでした。', err);
            d.reject(null); return;
          }

          fs().writeFile(info.path, bufWav, (err: Error) => {
            if (err) {
              MessageService.syserror('一時作業ファイルの書き込みに失敗しました。', err);
              d.reject(err); return;
            }

            let inAudio = null;
            if (parallel) {
              inAudio = new Audio('');
            } else {
              audio = new Audio('');
              inAudio = audio;
            }
            inAudio.autoplay = false;
            inAudio.src = info.path;
            inAudio.onended = () => {
              d.resolve('ok');
            };
            inAudio.play();
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
          d.reject(null); return d.promise;
        }
        if (!bufWav) {
          MessageService.syserror('保存する音源が渡されませんでした。');
          d.reject(null); return d.promise;
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
  .factory('AudioService2', ['$q', '$timeout', 'MessageService', 'AppUtilService',
  ($q, $timeout, MessageService: yubo.MessageService, AppUtilService: yubo.AppUtilService): yubo.AudioService2 => {
    // Web Audio API base AudioService
    // @ts-ignore
    const audioCtx = new window.AudioContext();
    let sourceNode = null;

    function toArrayBuffer(bufWav): any {
      const aBuffer = new ArrayBuffer(bufWav.length);
      const view = new Uint8Array(aBuffer);
      for (let i = 0; i < bufWav.length; ++i) {
        view[i] = bufWav[i];
      }
      return aBuffer;
    }

    return {
      play: function(bufWav: any, options: yubo.PlayOptions, parallel: boolean = false): ng.IPromise<string> {
        const d = $q.defer();
        if (!bufWav) {
          MessageService.syserror('再生する音源が渡されませんでした。');
          d.reject(null); return d.promise;
        }
        if (!parallel) {
          if (sourceNode) { sourceNode.stop(0); sourceNode = null; }
        }

        const aBuffer = toArrayBuffer(bufWav);
        audioCtx.decodeAudioData(aBuffer).then((decodedData) => {
          // report duration
          AppUtilService.reportDuration(decodedData.duration + (options.writeMarginMs / 1000.0));

          // source
          let inSourceNode = null;
          if (parallel) {
            inSourceNode = audioCtx.createBufferSource();
          } else {
            sourceNode = audioCtx.createBufferSource();
            inSourceNode = sourceNode;
          }
          inSourceNode.buffer = decodedData;
          inSourceNode.onended = () => {
            // onendedのタイミングでは出力が終わっていない
            $timeout(() => {
              d.resolve('ok');
            }, options.writeMarginMs);
          };

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
          const gainNode = audioCtx.createGain();
          gainNode.gain.value = options.volume;
          nodeList.push(gainNode);

          // connect
          let lastNode = inSourceNode;
          angular.forEach(nodeList, (node) => {
            lastNode.connect(node); lastNode = node;
          });
          lastNode.connect(audioCtx.destination);

          // and start
          inSourceNode.start(0);
        })
        .catch((err: Error) => {
          MessageService.syserror('音源の再生に失敗しました。', err);
          d.reject(err); return;
        });
        return d.promise;
      },
      stop: function(): void {
        if (sourceNode) { sourceNode.stop(0); sourceNode = null; }
      },
      record: function(wavFilePath: string, bufWav: any, options: yubo.PlayOptions): ng.IPromise<string> {
        const d = $q.defer();
        if (!wavFilePath) {
          MessageService.syserror('音声ファイルの保存先が指定されていません。');
          d.reject(null); return d.promise;
        }
        if (!bufWav) {
          MessageService.syserror('保存する音源が渡されませんでした。');
          d.reject(null); return d.promise;
        }

        const aBuffer = toArrayBuffer(bufWav);
        audioCtx.decodeAudioData(aBuffer).then((decodedData) => {
          // report duration
          AppUtilService.reportDuration(decodedData.duration + (options.writeMarginMs / 1000.0));

          // source
          const inSourceNode = audioCtx.createBufferSource();
          inSourceNode.buffer = decodedData;
          inSourceNode.onended = () => {
            // onendedのタイミングでは出力が終わっていない
            $timeout(() => {
              recorder.end();
              d.resolve('ok');
            }, options.writeMarginMs);
          };

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
          const gainNode = audioCtx.createGain();
          gainNode.gain.value = options.volume;
          nodeList.push(gainNode);

          // recorder
          const recorder = WaveRecorder()(audioCtx, {
            channels: 1,  // 1 or 2
            bitDepth: 16, // 16 or 32
          });
          recorder.pipe(fs().createWriteStream(wavFilePath));

          // connect
          let lastNode = inSourceNode;
          angular.forEach(nodeList, (node) => {
            lastNode.connect(node); lastNode = node;
          });
          lastNode.connect(recorder.input);

          // and start
          inSourceNode.start(0);
        })
        .catch((err: Error) => {
          MessageService.syserror('音源の再生に失敗しました。', err);
          d.reject(err); return;
        });
        return d.promise;
      },
    };
  }]);

