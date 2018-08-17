var storage      = require('electron-json-storage');
var log          = require('electron-log');
var fs           = require('fs');
var ffi          = require('ffi');
var ref          = require('ref');
var StructType   = require('ref-struct');
var temp         = require('temp').track();
var path         = require('path');
var exec         = require('child_process').exec;
var WaveRecorder = require('wave-recorder');

var app = require('electron').remote.app;
var appPath = app.getAppPath();
var unpackedPath = appPath.replace('app.asar', 'app.asar.unpacked');

// angular service
angular.module('yvoiceService', ['yvoiceMessageService', 'yvoiceLicenseService', 'yvoiceModel'])
  .factory('DataService', ['$q', 'YVoice', 'YVoiceInitialData', 'MessageService', function($q, YVoice, YVoiceInitialData, MessageService) {

    function uniqId() {
      return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
    }

    return {
      load: function() {
        var d = $q.defer();
        storage.get('data', function (error, data) {
          if (error) {
            MessageService.syserror('ボイス設定の読込に失敗しました。', error);
            d.reject(error); return;
          }
          if (Object.keys(data).length === 0) {
            d.resolve([]);
          } else {
            d.resolve(data);
          }
        });
        return d.promise;
      },
      initialData: function() {
        var dataList = angular.copy(YVoiceInitialData);
        return dataList;
      },
      create: function() {
        cloned = angular.copy(YVoice);
        cloned['id'] = uniqId();
        return cloned;
      },
      copy: function(original) {
        cloned = angular.copy(original);
        cloned['id'] = uniqId();
        return cloned;
      },
      save: function(dataList) {
        storage.set('data', dataList, function(error) {
          if (error) {
            MessageService.syserror('ボイス設定の保存に失敗しました。', error);
            throw error;
          }
          MessageService.info('ボイス設定を保存しました。');
        });
      },
      clear: function() {
        var d = $q.defer();
        storage.remove('data', function(error) {
          if (error) {
            MessageService.syserror('ボイス設定の削除に失敗しました。', error);
            d.reject(error); return;
          }
          MessageService.info('ボイス設定を削除しました。');
          d.resolve(true);
        });
        return d.promise;
      }
    }
  }])
  .factory('MasterService', ['YPhontList', function(YPhontList) {
    var phontList = YPhontList;
    return {
      getPhontList: function() {
        return phontList;
      }
    }
  }])
  .factory('AquesService', ['$q', 'MessageService', 'LicenseService', function($q, MessageService, LicenseService) {
    var ptr_void  = ref.refType(ref.types.void);
    var ptr_int   = ref.refType(ref.types.int);
    var ptr_char  = ref.refType(ref.types.char);
    var ptr_uchar = ref.refType(ref.types.uchar);

    var AQTK_VOICE = StructType({
      bas: ref.types.int,
      spd: ref.types.int,
      vol: ref.types.int,
      pit: ref.types.int,
      acc: ref.types.int,
      lmd: ref.types.int,
      fsc: ref.types.int
    })
    var ptr_AQTK_VOICE = ref.refType(AQTK_VOICE);

    // void * AqKanji2Koe_Create (const char *pathDic, int *pErr)
    // void AqKanji2Koe_Release (void * hAqKanji2Koe)
    // int AqKanji2Koe_Convert (void * hAqKanji2Koe, const char *kanji, char *koe, int nBufKoe)
    var frameworkPath = unpackedPath + '/vendor/AqKanji2Koe.framework/Versions/A/AqKanji2Koe';
    var ptr_AqKanji2Koe_Create  = ffi.DynamicLibrary(frameworkPath).get('AqKanji2Koe_Create');
    var ptr_AqKanji2Koe_Release = ffi.DynamicLibrary(frameworkPath).get('AqKanji2Koe_Release');
    var ptr_AqKanji2Koe_Convert = ffi.DynamicLibrary(frameworkPath).get('AqKanji2Koe_Convert')
    var fn_AqKanji2Koe_Create   = ffi.ForeignFunction(ptr_AqKanji2Koe_Create, ptr_void, [ 'string', ptr_int ]);
    var fn_AqKanji2Koe_Release  = ffi.ForeignFunction(ptr_AqKanji2Koe_Release, 'void', [ ptr_void ]);
    var fn_AqKanji2Koe_Convert  = ffi.ForeignFunction(ptr_AqKanji2Koe_Convert, 'int', [ ptr_void, 'string', ptr_char, 'int' ]);

    // unsigned char * AquesTalk2_Synthe_Utf8(const char *koe, int iSpeed, int * size, void *phontDat)
    // void AquesTalk2_FreeWave (unsigned char *wav)
    var frameworkPath = unpackedPath + '/vendor/AquesTalk2.framework/Versions/A/AquesTalk2';
    var ptr_AquesTalk2_Synthe_Utf8 = ffi.DynamicLibrary(frameworkPath).get('AquesTalk2_Synthe_Utf8');
    var ptr_AquesTalk2_FreeWave    = ffi.DynamicLibrary(frameworkPath).get('AquesTalk2_FreeWave');
    var fn_AquesTalk2_Synthe_Utf8  = ffi.ForeignFunction(ptr_AquesTalk2_Synthe_Utf8, ptr_uchar, [ 'string', 'int', ptr_int, ptr_void ]);
    var fn_AquesTalk2_FreeWave     = ffi.ForeignFunction(ptr_AquesTalk2_FreeWave, 'void', [ ptr_uchar ]);

    // unsigned char * AquesTalk_Synthe_Utf8(const AQTK_VOICE *pParam, const char *koe, int *size)
    // void AquesTalk_FreeWave(unsigned char *wav)
    // int AquesTalk_SetDevKey(const char *key)
    // int AquesTalk_SetUsrKey(const char *key)
    var frameworkPath = unpackedPath + '/vendor/AquesTalk10.framework/Versions/A/AquesTalk';
    var ptr_AquesTalk10_Synthe_Utf8 = ffi.DynamicLibrary(frameworkPath).get('AquesTalk_Synthe_Utf8');
    var ptr_AquesTalk10_FreeWave    = ffi.DynamicLibrary(frameworkPath).get('AquesTalk_FreeWave');
    var ptr_AquesTalk10_SetDevKey   = ffi.DynamicLibrary(frameworkPath).get('AquesTalk_SetDevKey');
    var ptr_AquesTalk10_SetUsrKey   = ffi.DynamicLibrary(frameworkPath).get('AquesTalk_SetUsrKey');
    var fn_AquesTalk10_Synthe_Utf8  = ffi.ForeignFunction(ptr_AquesTalk10_Synthe_Utf8, ptr_uchar, [ ptr_AQTK_VOICE, 'string', ptr_int ]);
    var fn_AquesTalk10_FreeWave     = ffi.ForeignFunction(ptr_AquesTalk10_FreeWave, 'void', [ ptr_uchar ]);
    var fn_AquesTalk10_SetDevKey    = ffi.ForeignFunction(ptr_AquesTalk10_SetDevKey, 'int', [ 'string' ]);
    var fn_AquesTalk10_SetUsrKey    = ffi.ForeignFunction(ptr_AquesTalk10_SetUsrKey, 'int', [ 'string' ]);

    function errorTable_AqKanji2Koe(code) {
      if (code == 101)               { return '関数呼び出し時の引数がNULLになっている'; }
      if (code == 105)               { return '入力テキストが長すぎる'; }
      if (code == 107)               { return '変換できない文字コードが含まれている'; }
      if (code >= 200 && code < 300) { return 'システム辞書(aqdic.bin)が不正'; }
      if (code >= 300 && code < 400) { return 'ユーザ辞書(aq_user.dic)が不正'; }
      if (code == 100)               { return 'その他のエラー'; }
      return '';
    }

    function errorTable_AquesTalk2(code) {
      if (code == 100)                  { return 'その他のエラー'; }
      if (code == 101)                  { return 'メモリ不足'; }
      if (code == 102)                  { return '音記号列に未定義の読み記号が指定された'; }
      if (code == 103)                  { return '韻律データの時間長がマイナスなっている'; }
      if (code == 104)                  { return '内部エラー(未定義の区切りコード検出)'; }
      if (code == 105)                  { return '音記号列に未定義の読み記号が指定された'; }
      if (code == 106)                  { return '音記号列のタグの指定が正しくない'; }
      if (code == 107)                  { return 'タグの長さが制限を越えている(または[>]がみつからない)'; }
      if (code == 108)                  { return 'タグ内の値の指定が正しくない'; }
      if (code == 109)                  { return 'WAVE再生ができない(サウンドドライバ関連の問題)'; }
      if (code == 110)                  { return 'WAVE再生ができない(サウンドドライバ関連の問題 非同期再生)'; }
      if (code == 111)                  { return '発すべきデータがない'; }
      if (code == 200)                  { return '音記号列が長すぎる'; }
      if (code == 201)                  { return '1つのフレーズ中の読み記号が多すぎる'; }
      if (code == 202)                  { return '音記号列が長い(内部バッファオーバー1)'; }
      if (code == 203)                  { return 'ヒープメモリ不足'; }
      if (code == 204)                  { return '音記号列が長い(内部バッファオーバー1)'; }
      if (code == 205)                  { return 'ライセンスキーが正しくない。または、設定されていない。'; }
      if (code >= 1000 && code <= 1008) { return 'Phontデータが正しくない'; }
      return '';
    }

    function errorTable_AquesTalk10(code) {
      if (code == 100) { return 'その他のエラー'; }
      if (code == 101) { return 'メモリ不足'; }
      if (code == 103) { return '音声記号列指定エラー(語頭の長音、促音の連続など)'; }
      if (code == 104) { return '音声記号列に有効な読みがない'; }
      if (code == 105) { return '音声記号列に未定義の読み記号が指定された'; }
      if (code == 106) { return '音声記号列のタグの指定が正しくない'; }
      if (code == 107) { return 'タグの長さが制限を越えている(または[>]がみつからない)'; }
      if (code == 108) { return 'タグ内の値の指定が正しくない'; }
      if (code == 120) { return '音声記号列が長すぎる'; }
      if (code == 121) { return '1つのフレーズ中の読み記号が多すぎる'; }
      if (code == 122) { return '音声記号列が長い(内部バッファオーバー1)'; }
      return '';
    }

    var _isAquesTalk10LicensekeySet = false;
    return {
      encode: function(source) {
        if (!source) {
          MessageService.syserror('音記号列に変換するメッセージが入力されていません。');
          return '';
        }

        var allocInt = ref.alloc('int');
        var aqKanji2Koe = fn_AqKanji2Koe_Create(unpackedPath + '/vendor/aq_dic_large', allocInt);
        var errorCode = allocInt.deref();
        if (errorCode != 0) {
          MessageService.syserror(errorTable_AqKanji2Koe(errorCode));
          log.warn('fn_AqKanji2Koe_Create raise error. error_code:' + errorTable_AqKanji2Koe(errorCode));
          return '';
        }

        var sourceLength = (new Blob([sourceLength], {type: "text/plain"})).size;
        var encodedLength = sourceLength >= 512? sourceLength * 4 : 512;
        var buf = Buffer.alloc(sourceLength >= 512? sourceLength * 4 : 512);
        var r = fn_AqKanji2Koe_Convert(aqKanji2Koe, source, buf, encodedLength);
        if (r != 0) {
          MessageService.syserror(errorTable_AqKanji2Koe(r));
          log.info('fn_AqKanji2Koe_Convert raise error. error_code:' + errorTable_AqKanji2Koe(r));
          return '';
        }
        var encoded = ref.readCString(buf, 0);

        fn_AqKanji2Koe_Release(aqKanji2Koe);
        return encoded;
      },
      wave: function(encoded, phont, speed, options) {
        var d = $q.defer();
        if (!encoded) {
          MessageService.syserror('音記号列が入力されていません。');
          d.reject(null); return d.promise;
        }

        // version 1
        if (phont.version == 'talk1') {
          // write encoded to tempory file
          var fsprefix = '_myubow' + Date.now().toString(36);
          temp.open(fsprefix, function(err, info) {
            if (err) {
              MessageService.syserror('一時作業ファイルを作れませんでした。', err);
              d.reject(null); return;
            }

          fs.writeFile(info.path, encoded, function(err) {
            if (err) {
              MessageService.syserror('一時作業ファイルの書き込みに失敗しました。', err);
              d.reject(err); return;
            }

          var cmdOptions = {
            env: {
              VOICE: phont.idVoice,
              SPEED: speed
            },
            encoding: 'binary'
          };
          var waverCmd = unpackedPath.replace(' ', '\\ ') + '/vendor/maquestalk1';
          exec('cat '+ info.path +' | VOICE='+ phont.idVoice+ ' SPEED='+ speed+ ' '+ waverCmd, cmdOptions, (err, stdout, stderr) => {
            if (err) {
              log.info('maquestalk1 failed. ' + err);
              d.reject(err); return;
            }
            bufWav = new Buffer(stdout, 'binary');
            d.resolve(bufWav);
          }).on('close', (statusCode) => {
            if (statusCode < 0) {
              var errorCode = statusCode * -1; // maquestalk1 library result
              MessageService.syserror(errorTable_AquesTalk2(errorCode));
              log.info('AquesTalk_SyntheMV raise error. error_code:' + errorTable_AquesTalk2(errorCode));
            }
          }); // maquestalk1
          }); // fs.writeFile
          }); // temp.open

        // version 2
        } else if (phont.version == 'talk2') {
          fs.readFile(phont.path, function(err, phontData) {
            if (err) {
              MessageService.syserror('phontファイルの読み込みに失敗しました。', err);
              d.reject(err); return;
            }

            var allocInt = ref.alloc('int');
            var r = fn_AquesTalk2_Synthe_Utf8(encoded, speed, allocInt, phontData);
            if (ref.isNull(r)) {
              var errorCode = allocInt.deref();
              MessageService.syserror(errorTable_AquesTalk2(errorCode));
              log.info('fn_AquesTalk2_Synthe_Utf8 raise error. error_code:' + errorTable_AquesTalk2(errorCode));
              d.reject(null); return;
            }

            var bufWav = ref.reinterpret(r, allocInt.deref(), 0);
            var managedBuf = Buffer.from(bufWav); // copy bufWav to managed buffer
            fn_AquesTalk2_FreeWave(r);
            d.resolve(managedBuf);
          });

        // version 10
        } else if (phont.version == 'talk10') {
          // get and set aquesTalk10 developer key
          LicenseService.consumerKey('aquesTalk10DevKey').then(
          function(licenseKey) {
            // set license key if is not set.
            if (! _isAquesTalk10LicensekeySet) {
              var devKey = fn_AquesTalk10_SetDevKey(licenseKey);
              if (devKey != 0) {
                MessageService.syserror('AquesTalk10開発ライセンスキーが正しくありません。');
                d.reject(null); return;
              }

              // get and set aquesTalk10 use key
              var passPhrase = options.passPhrase;
              var encryptedUseKey = options.aq10UseKeyEncrypted;
              var aquesTalk10UseKey = encryptedUseKey?
                LicenseService.decrypt(passPhrase, encryptedUseKey):
                '';
              if (encryptedUseKey && !aquesTalk10UseKey) {
                MessageService.error('AquesTalk10使用ライセンスキーの復号に失敗しました。環境設定で使用ライセンスキーを設定し直してください');
                d.reject(null); return;
              }

              if (encryptedUseKey) {
                var usrKey = fn_AquesTalk10_SetUsrKey(aquesTalk10UseKey);
                if (usrKey != 0) {
                  MessageService.error('AquesTalk10使用ライセンスキーが正しくありません。環境設定で使用ライセンスキーを設定してください。' + aquesTalk10UseKey);
                  d.reject(null); return;
                }
                MessageService.info('AquesTalk10使用ライセンスキーを設定しました。');
              }
              _isAquesTalk10LicensekeySet = true;
            }

            // create struct
            var aqtkVoiceVal = new AQTK_VOICE;
            aqtkVoiceVal.bas = options.bas? options.bas: phont.struct.bas;
            aqtkVoiceVal.spd = speed;
            aqtkVoiceVal.vol = phont.struct.vol;
            aqtkVoiceVal.pit = options.pit? options.pit: phont.struct.pit;
            aqtkVoiceVal.acc = options.acc? options.acc: phont.struct.acc;
            aqtkVoiceVal.lmd = options.lmd? options.lmd: phont.struct.lmd;
            aqtkVoiceVal.fsc = options.fsc? options.fsc: phont.struct.fsc;
            ptr_aqtkVoiceVal = aqtkVoiceVal.ref();

            // create wave buffer
            var allocInt = ref.alloc('int');
            var r = fn_AquesTalk10_Synthe_Utf8(ptr_aqtkVoiceVal, encoded, allocInt);
            if (ref.isNull(r)) {
              var errorCode = allocInt.deref();
              MessageService.syserror(errorTable_AquesTalk10(errorCode));
              log.info('fn_AquesTalk10_Synthe_Utf8 raise error. error_code:' + errorTable_AquesTalk10(errorCode));
              d.reject(null); return;
            }

            var bufWav = ref.reinterpret(r, allocInt.deref(), 0);
            var managedBuf = Buffer.from(bufWav); // copy bufWav to managed buffer
            fn_AquesTalk10_FreeWave(r);
            d.resolve(managedBuf);
          },
          function(err) {
            MessageService.syserror('AquesTalk10開発ライセンスキーの読み込みに失敗しました。', err);
            d.reject(err);
          });
        }
        return d.promise;
      }
    }
  }])
  .factory('AudioService1', ['$q', 'MessageService', function($q, MessageService) {
    // Audio base AudioService
    var audio = null;

    return {
      play: function(bufWav, options, parallel=false) {
        var d = $q.defer();
        if (!bufWav) {
          MessageService.syserror('再生する音源が渡されませんでした。');
          d.reject(null); return d.promise;
        }
        if (!parallel) {
          if (audio) { audio.pause(); }
        }

        var fsprefix = '_myubop' + Date.now().toString(36);
        temp.open(fsprefix, function(err, info) {
          if (err) {
            MessageService.syserror('一時作業ファイルを作れませんでした。', err);
            d.reject(null); return;
          }

          fs.writeFile(info.path, bufWav, function(err) {
            if (err) {
              MessageService.syserror('一時作業ファイルの書き込みに失敗しました。', err);
              d.reject(err); return;
            }

            var inAudio = null;
            if (parallel) {
              inAudio = new Audio('');
            } else {
              audio = new Audio('');
              inAudio = audio;
            }
            inAudio.autoplay = false;
            inAudio.src = info.path;
            inAudio.onended = function() {
              d.resolve('ok');
            };
            inAudio.play();
          });
        });
        return d.promise;
      },
      stop: function() {
        if (!audio) { return; }
        audio.pause();
      },
      record: function(wavFilePath, bufWav, options) {
        var d = $q.defer();
        if (!wavFilePath) {
          MessageService.syserror('音声ファイルの保存先が指定されていません。');
          d.reject(null); return d.promise;
        }
        if (!bufWav) {
          MessageService.syserror('保存する音源が渡されませんでした。');
          d.reject(null); return d.promise;
        }

        fs.writeFile(wavFilePath, bufWav, function(err) {
          if (err) {
            MessageService.syserror('音声ファイルの書き込みに失敗しました。', err);
            d.reject(err); return;
          }
          MessageService.record('音声ファイルを保存しました。path: ' + wavFilePath, wavFilePath);
          d.resolve('ok');
        });
        return d.promise;
      }
    }
  }])
  .factory('AudioService2', ['$q', '$timeout', 'MessageService', 'AppUtilService',
    function($q, $timeout, MessageService, AppUtilService) {
    // Web Audio API base AudioService
    var audioCtx = new window.AudioContext();
    var sourceNode = null;

    function toArrayBuffer(bufWav) {
      var aBuffer = new ArrayBuffer(bufWav.length);
      var view = new Uint8Array(aBuffer);
      for (var i = 0; i < bufWav.length; ++i) {
        view[i] = bufWav[i];
      }
      return aBuffer;
    };

    return {
      play: function(bufWav, options, parallel=false) {
        var d = $q.defer();
        if (!bufWav) {
          MessageService.syserror('再生する音源が渡されませんでした。');
          d.reject(null); return d.promise;
        }
        if (!parallel) {
          if (sourceNode) { sourceNode.stop(0); sourceNode = null; }
        }

        var aBuffer = toArrayBuffer(bufWav);
        audioCtx.decodeAudioData(aBuffer).then(
          function(decodedData) {
            // report duration
            AppUtilService.reportDuration(decodedData.duration + (options.writeMarginMs / 1000.0));

            // source
            var inSourceNode = null;
            if (parallel) {
              inSourceNode = audioCtx.createBufferSource();
            } else {
              sourceNode = audioCtx.createBufferSource();
              inSourceNode = sourceNode;
            }
            inSourceNode.buffer = decodedData;
            inSourceNode.onended = function() {
              // onendedのタイミングでは出力が終わっていない
              $timeout(function() {
                d.resolve('ok');
              }, options.writeMarginMs);
            };

            var nodeList = [];

            // playbackRate
            if (options.playbackRate && options.playbackRate != 1.0) {
              inSourceNode.playbackRate.value = options.playbackRate;
            }
            // detune
            if (options.detune && options.detune != 0) {
              inSourceNode.detune.value = options.detune;
            }
            // gain
            var gainNode = audioCtx.createGain();
            gainNode.gain.value = options.volume;
            nodeList.push(gainNode);

            // connect
            var lastNode = inSourceNode;
            angular.forEach(nodeList, function(node) {
              lastNode.connect(node); lastNode = node;
            });
            lastNode.connect(audioCtx.destination);

            // and start
            inSourceNode.start(0);
          },
          function(err) {
            MessageService.syserror('音源の再生に失敗しました。', err);
            d.reject(err); return;
          }
        );
        return d.promise;
      },
      stop: function() {
        if (sourceNode) { sourceNode.stop(0); sourceNode = null; }
      },
      record: function(wavFilePath, bufWav, options) {
        var d = $q.defer();
        if (!wavFilePath) {
          MessageService.syserror('音声ファイルの保存先が指定されていません。');
          d.reject(null); return d.promise;
        }
        if (!bufWav) {
          MessageService.syserror('保存する音源が渡されませんでした。');
          d.reject(null); return d.promise;
        }

        var aBuffer = toArrayBuffer(bufWav);
        audioCtx.decodeAudioData(aBuffer).then(
          function(decodedData) {
            // report duration
            AppUtilService.reportDuration(decodedData.duration + (options.writeMarginMs / 1000.0));

            // source
            var inSourceNode = audioCtx.createBufferSource();
            inSourceNode.buffer = decodedData;
            inSourceNode.onended = function() {
              // onendedのタイミングでは出力が終わっていない
              $timeout(function() {
                recorder.end();
                MessageService.record('音声ファイルを保存しました。path: ' + wavFilePath, wavFilePath);
                d.resolve('ok');
              }, options.writeMarginMs);
            };

            var nodeList = [];

            // playbackRate
            if (options.playbackRate && options.playbackRate != 1.0) {
              inSourceNode.playbackRate.value = options.playbackRate;
            }
            // detune
            if (options.detune && options.detune != 0) {
              inSourceNode.detune.value = options.detune;
            }
            // gain
            var gainNode = audioCtx.createGain();
            gainNode.gain.value = options.volume;
            nodeList.push(gainNode);

            // recorder
            var recorder = WaveRecorder(audioCtx, {
              channels: 1, // 1 or 2
              bitDepth: 16 // 16 or 32
            });
            recorder.pipe(fs.createWriteStream(wavFilePath));

            // connect
            var lastNode = inSourceNode;
            angular.forEach(nodeList, function(node) {
              lastNode.connect(node); lastNode = node;
            });
            lastNode.connect(recorder.input);

            // and start
            inSourceNode.start(0);
          },
          function(err) {
            MessageService.syserror('音源の再生に失敗しました。', err);
            d.reject(err); return;
          }
        );
        return d.promise;
      }
    }
  }])
  .factory('AudioSourceService', ['$q', 'MessageService', function($q, MessageService) {
    var waveExt = '.wav';
    var sourceExt = '.txt';

    return {
      sourceFname: function(wavFilePath) {
        var dir = path.dirname(wavFilePath);
        var basename = path.basename(wavFilePath, waveExt);
        var filename = basename + sourceExt;
        return path.join(dir, filename);
      },
      save: function(filePath, sourceText) {
        var d = $q.defer();
        fs.writeFile(filePath, sourceText, 'utf-8', function(err) {
          if (err) {
            MessageService.syserror('メッセージファイルの書き込みに失敗しました。', err);
            d.reject(err); return;
          }
          MessageService.info('メッセージファイルを保存しました。path: ' + filePath);
        });
        return d.promise;
      }
    }
  }])
  .factory('SeqFNameService', ['$q', 'MessageService', function($q, MessageService) {
    var ext = '.wav';
    var numPattern = '[0-9]{4}';
    var limit = 9999;

    return {
      splitFname: function(filePath) {
        var dir = path.dirname(filePath);
        var basename = path.basename(filePath, ext);
        return {
          dir: dir,
          basename: basename
        };
      },
      nextFname: function(prefix, num) {
        formatted = ("0000"+ num).slice(-4)
        return prefix + formatted + ext;
      },
      nextNumber: function(dir, prefix) {
        var d = $q.defer();
        fs.readdir(dir, function(err, files) {
          if (err) {
            MessageService.syserror('ディレクトリを参照できませんでした。', err);
            d.reject(err); return;
          }

          var pattern = new RegExp('^'+ prefix+ '('+ numPattern+ ')'+ ext+ '$');

          var npList = [];
          files.forEach(function (file) {
            try {
              if (pattern.test(file)) {
                var matched = pattern.exec(file);
                npList.push(Number(matched[1]));
              }
            } catch(err) {
              if (err.code != 'ENOENT') {
                MessageService.syserror('ファイル参照時にエラーが起きました。', err);
                d.reject(err); return;
              }
            }
          });
          if (npList.length < 1) {
            d.resolve(0); return;
          }

          var maxNum = Math.max.apply(null, npList);
          if (maxNum >= limit) {
            MessageService.syserror(limit + 'までファイルが作られているので、これ以上ファイルを作成できません。');
            d.reject(null); return;
          }
          var next = maxNum + 1;
          d.resolve(next);
        });
        return d.promise;
      }
    }
  }])
  .factory('AppUtilService', ['$rootScope', function($rootScope) {
    return {
      disableRhythm: function(encoded) {
        return encoded.replace(/['\/]/g, '');
      },
      reportDuration: function(duration) {
        $rootScope.$broadcast("duration", duration);
      },
    }
  }]);

