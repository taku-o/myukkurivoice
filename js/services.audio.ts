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
          d.reject(new Error('再生する音源が渡されませんでした。')); return d.promise;
        }
        if (!parallel) {
          if (audio) { audio.pause(); }
        }

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
          d.reject(new Error('再生する音源が渡されませんでした。')); return d.promise;
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
          d.reject(new Error('音声ファイルの保存先が指定されていません。')); return d.promise;
        }
        if (!bufWav) {
          MessageService.syserror('保存する音源が渡されませんでした。');
          d.reject(new Error('保存する音源が渡されませんでした。')); return d.promise;
        }

        const aBuffer = toArrayBuffer(bufWav);
        audioCtx.decodeAudioData(aBuffer).then((decodedData) => {
          // report duration
          AppUtilService.reportDuration(decodedData.duration + (options.writeMarginMs / 1000.0));

          const offlineCtx = new OfflineAudioContext(decodedData.numberOfChannels, 44 + decodedData.length * 4, decodedData.sampleRate);

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

          offlineCtx.startRendering().then((renderedBuffer) => {
              var audioBuffer = renderedBuffer.getChannelData(0);

              let wbuffer = Buffer.alloc(44 + decodedData.length * 4);
              // 1-4 Chunk ID "RIFF"
              Buffer.from('RIFF').copy(wbuffer, 0, 0, 4)
              // 5-8 Chunk Size
              wbuffer.writeUIntLE(36 + decodedData.length * 4, 4, 4);
              // 9-12  Format "WAVE"
              Buffer.from('WAV').copy(wbuffer, 8, 0, 4)

              // 1-4 Subchunk1 ID "fmt"
              Buffer.from('fmt ').copy(wbuffer, 12, 0, 4)
              // 5-8 Subchunk1 Size "16"
              wbuffer.writeUIntLE(16, 16, 4);
              // 9-10 Audio Format "1"
              wbuffer.writeUIntLE(1, 20, 2);
              // 11-12 Num Channels
              wbuffer.writeUIntLE(decodedData.numberOfChannels, 22, 2);
              // 13-16 Sample Rate
              wbuffer.writeUIntLE(decodedData.sampleRate, 24, 4);
              // 17-20 Byte Rate
              wbuffer.writeUIntLE(88200, 28, 4);
              // 21-22 Block Align
              wbuffer.writeUIntLE(2, 32, 2);
              // 23-24 Bits Per Sample
              wbuffer.writeUIntLE(16, 34, 2);

              // 1-4 Subchunk2 ID "data"
              Buffer.from('data').copy(wbuffer, 36, 0, 4)
              // 5-8 Subchunk2 Size
              wbuffer.writeUIntLE(decodedData.length * 4, 40, 4);
              // 9-   Subchunk2 data
              //const aBuffer = new Buffer(new Uint32Array(audioBuffer).buffer);
              const aBuffer = new Buffer(audioBuffer.length * 4);
              for(let i = 0; i < audioBuffer.length; i++) {
                  console.log(audioBuffer[i]);
                aBuffer.writeFloatLE(audioBuffer[i], i * 4);
              }
              aBuffer.copy(wbuffer, 44, 0, decodedData.length * 4);


              // write
              fs().writeFile('/Users/taku.omi/Desktop/sample-out.wav', wbuffer, 'binary', (err) => {
                if (err) {
                  console.error(err); return;
                }
                console.log('write done.');
              });




          });

        })
        .catch((err: Error) => {
          MessageService.syserror('音源の再生に失敗しました。', err);
          d.reject(err); return;
        });
        return d.promise;
      },
    };
  }]);

