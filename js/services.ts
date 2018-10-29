var _storage, storage           = () => { _storage = _storage || require('electron-json-storage'); return _storage; };
var _log, log                   = () => { _log = _log || require('electron-log'); return _log; };
var _fs, fs                     = () => { _fs = _fs || require('fs'); return _fs; };
var _ffi, ffi                   = () => { _ffi = _ffi || require('ffi'); return _ffi; };
var _ref, ref                   = () => { _ref = _ref || require('ref'); return _ref; };
var _StructType, StructType     = () => { _StructType = _StructType || require('ref-struct'); return _StructType; };
var _temp, temp                 = () => { _temp = _temp || require('temp').track(); return _temp; };
var _path, path                 = () => { _path = _path || require('path'); return _path; };
var _exec, exec                 = () => { _exec = _exec || require('child_process').exec; return _exec; };
var _WaveRecorder, WaveRecorder = () => { _WaveRecorder = _WaveRecorder || require('wave-recorder'); return _WaveRecorder; };
var _epath, epath               = () => { _epath = _epath || require('electron-path'); return _epath; };
var _WavEncoder, WavEncoder = () => { _WavEncoder = _WavEncoder || require('wave-encoder'); return _WavEncoder; };

var unpackedPath = epath().getUnpackedPath();

// angular service
angular.module('yvoiceService', ['yvoiceMessageService', 'yvoiceLicenseService', 'yvoiceModel'])
  .factory('DataService', ['$q', 'YVoice', 'YVoiceInitialData', 'MessageService', 
  ($q, YVoice: yubo.YVoice, YVoiceInitialData: yubo.YVoice[], MessageService: yubo.MessageService): yubo.DataService => {

    function uniqId(): string {
      return ('0000' + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4);
    }

    return {
      load: function(): ng.IPromise<yubo.YVoice[]> {
        const d = $q.defer();
        storage().get('data', function(error: Error, data: yubo.YVoice[]) {
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
      initialData: function(): yubo.YVoice[] {
        const dataList = angular.copy(YVoiceInitialData);
        return dataList;
      },
      create: function(): yubo.YVoice {
        const cloned = angular.copy(YVoice);
        cloned['id'] = uniqId();
        return cloned;
      },
      copy: function(original: yubo.YVoice): yubo.YVoice {
        const cloned = angular.copy(original);
        cloned['id'] = uniqId();
        return cloned;
      },
      save: function(dataList: yubo.YVoice[]): ng.IPromise<boolean> {
        const d = $q.defer();
        storage().set('data', dataList, function(error: Error) {
          if (error) {
            MessageService.syserror('ボイス設定の保存に失敗しました。', error);
            d.reject(error); return;
          }
          MessageService.info('ボイス設定を保存しました。');
          d.resolve(true);
        });
        return d.promise;
      },
      clear: function(): ng.IPromise<boolean> {
        const d = $q.defer();
        storage().remove('data', function(error: Error) {
          if (error) {
            MessageService.syserror('ボイス設定の削除に失敗しました。', error);
            d.reject(error); return;
          }
          MessageService.info('ボイス設定を削除しました。');
          d.resolve(true);
        });
        return d.promise;
      },
    };
  }])
  .factory('MasterService', ['YPhontList', (YPhontList: yubo.YPhont[]): yubo.MasterService => {
    const phontList = YPhontList;
    return {
      getPhontList: function(): yubo.YPhont[] {
        return phontList;
      },
    };
  }])
  .factory('AquesService', ['$q', 'MessageService', 'LicenseService',
  ($q, MessageService: yubo.MessageService, LicenseService: yubo.LicenseService): yubo.AquesService => {
    const ptr_void  = ref().refType(ref().types.void);
    const ptr_int   = ref().refType(ref().types.int);
    const ptr_char  = ref().refType(ref().types.char);
    const ptr_uchar = ref().refType(ref().types.uchar);

    const AQTK_VOICE = StructType()({
      bas: ref().types.int,
      spd: ref().types.int,
      vol: ref().types.int,
      pit: ref().types.int,
      acc: ref().types.int,
      lmd: ref().types.int,
      fsc: ref().types.int,
    });
    const ptr_AQTK_VOICE = ref().refType(AQTK_VOICE);

    // void * AqKanji2Koe_Create (const char *pathDic, int *pErr)
    // void AqKanji2Koe_Release (void * hAqKanji2Koe)
    // int AqKanji2Koe_Convert (void * hAqKanji2Koe, const char *kanji, char *koe, int nBufKoe)
    let frameworkPath = null;
    frameworkPath = `${unpackedPath}/vendor/AqKanji2Koe.framework/Versions/A/AqKanji2Koe`;
    const ptr_AqKanji2Koe_Create  = ffi().DynamicLibrary(frameworkPath).get('AqKanji2Koe_Create');
    const ptr_AqKanji2Koe_Release = ffi().DynamicLibrary(frameworkPath).get('AqKanji2Koe_Release');
    const ptr_AqKanji2Koe_Convert = ffi().DynamicLibrary(frameworkPath).get('AqKanji2Koe_Convert');
    const fn_AqKanji2Koe_Create   = ffi().ForeignFunction(ptr_AqKanji2Koe_Create, ptr_void, ['string', ptr_int]);
    const fn_AqKanji2Koe_Release  = ffi().ForeignFunction(ptr_AqKanji2Koe_Release, 'void', [ptr_void]);
    const fn_AqKanji2Koe_Convert  = ffi().ForeignFunction(ptr_AqKanji2Koe_Convert, 'int', [ptr_void, 'string', ptr_char, 'int']);

    // unsigned char * AquesTalk2_Synthe_Utf8(const char *koe, int iSpeed, int * size, void *phontDat)
    // void AquesTalk2_FreeWave (unsigned char *wav)
    frameworkPath = `${unpackedPath}/vendor/AquesTalk2.framework/Versions/A/AquesTalk2`;
    const ptr_AquesTalk2_Synthe_Utf8 = ffi().DynamicLibrary(frameworkPath).get('AquesTalk2_Synthe_Utf8');
    const ptr_AquesTalk2_FreeWave    = ffi().DynamicLibrary(frameworkPath).get('AquesTalk2_FreeWave');
    const fn_AquesTalk2_Synthe_Utf8  = ffi().ForeignFunction(ptr_AquesTalk2_Synthe_Utf8, ptr_uchar, ['string', 'int', ptr_int, ptr_void]);
    const fn_AquesTalk2_FreeWave     = ffi().ForeignFunction(ptr_AquesTalk2_FreeWave, 'void', [ptr_uchar]);

    // unsigned char * AquesTalk_Synthe_Utf8(const AQTK_VOICE *pParam, const char *koe, int *size)
    // void AquesTalk_FreeWave(unsigned char *wav)
    // int AquesTalk_SetDevKey(const char *key)
    // int AquesTalk_SetUsrKey(const char *key)
    frameworkPath = `${unpackedPath}/vendor/AquesTalk10.framework/Versions/A/AquesTalk`;
    const ptr_AquesTalk10_Synthe_Utf8 = ffi().DynamicLibrary(frameworkPath).get('AquesTalk_Synthe_Utf8');
    const ptr_AquesTalk10_FreeWave    = ffi().DynamicLibrary(frameworkPath).get('AquesTalk_FreeWave');
    const ptr_AquesTalk10_SetDevKey   = ffi().DynamicLibrary(frameworkPath).get('AquesTalk_SetDevKey');
    const ptr_AquesTalk10_SetUsrKey   = ffi().DynamicLibrary(frameworkPath).get('AquesTalk_SetUsrKey');
    const fn_AquesTalk10_Synthe_Utf8  = ffi().ForeignFunction(ptr_AquesTalk10_Synthe_Utf8, ptr_uchar, [ptr_AQTK_VOICE, 'string', ptr_int]);
    const fn_AquesTalk10_FreeWave     = ffi().ForeignFunction(ptr_AquesTalk10_FreeWave, 'void', [ptr_uchar]);
    const fn_AquesTalk10_SetDevKey    = ffi().ForeignFunction(ptr_AquesTalk10_SetDevKey, 'int', ['string']);
    const fn_AquesTalk10_SetUsrKey    = ffi().ForeignFunction(ptr_AquesTalk10_SetUsrKey, 'int', ['string']);

    function errorTable_AqKanji2Koe(code: number): string {
      if (code == 101)               { return '関数呼び出し時の引数がNULLになっている'; }
      if (code == 105)               { return '入力テキストが長すぎる'; }
      if (code == 107)               { return '変換できない文字コードが含まれている'; }
      if (code >= 200 && code < 300) { return 'システム辞書(aqdic.bin)が不正'; }
      if (code >= 300 && code < 400) { return 'ユーザ辞書(aq_user.dic)が不正'; }
      if (code == 100)               { return 'その他のエラー'; }
      return '';
    }

    function errorTable_AquesTalk2(code: number): string {
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

    function errorTable_AquesTalk10(code: number): string {
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

    let _isAquesTalk10LicensekeySet = false;
    return {
      encode: function(source: string): string {
        if (!source) {
          MessageService.syserror('音記号列に変換するメッセージが入力されていません。');
          return '';
        }

        const allocInt = ref().alloc('int');
        const aqKanji2Koe = fn_AqKanji2Koe_Create(`${unpackedPath}/vendor/aq_dic_large`, allocInt);
        const errorCode = allocInt.deref();
        if (errorCode != 0) {
          MessageService.syserror(errorTable_AqKanji2Koe(errorCode));
          log().warn(`fn_AqKanji2Koe_Create raise error. error_code:${errorTable_AqKanji2Koe(errorCode)}`);
          return '';
        }

        const sourceLength = (new Blob([source], {type: 'text/plain'})).size;
        const encodedLength = sourceLength >= 512? sourceLength * 4 : 512;
        const buf = Buffer.alloc(sourceLength >= 512? sourceLength * 4 : 512);
        const r = fn_AqKanji2Koe_Convert(aqKanji2Koe, source, buf, encodedLength);
        if (r != 0) {
          MessageService.syserror(errorTable_AqKanji2Koe(r));
          log().info(`fn_AqKanji2Koe_Convert raise error. error_code:${errorTable_AqKanji2Koe(r)}`);
          return '';
        }
        const encoded = ref().readCString(buf, 0);

        fn_AqKanji2Koe_Release(aqKanji2Koe);
        return encoded;
      },
      wave: function(encoded: string, phont: yubo.YPhont, speed: number, options: yubo.WaveOptions): ng.IPromise<any> {
        const d = $q.defer();
        if (!encoded) {
          MessageService.syserror('音記号列が入力されていません。');
          d.reject(null); return d.promise;
        }

        // version 1
        if (phont.version == 'talk1') {
          // write encoded to tempory file
          const fsprefix = `_myubow${Date.now().toString(36)}`;
          temp().open(fsprefix, (err: Error, info) => {
            if (err) {
              MessageService.syserror('一時作業ファイルを作れませんでした。', err);
              d.reject(null); return;
            }

          fs().writeFile(info.path, encoded, (err: Error) => {
            if (err) {
              MessageService.syserror('一時作業ファイルの書き込みに失敗しました。', err);
              d.reject(err); return;
            }

          const cmdOptions: yubo.CmdOptions = {
            env: {
              VOICE: phont.idVoice,
              SPEED: speed,
            },
            encoding: 'binary',
          };
          const waverCmd = `${unpackedPath.replace(' ', '\\ ')}/vendor/maquestalk1`;
          exec()(`cat ${info.path} | VOICE=${phont.idVoice} SPEED=${speed} ${waverCmd}`, cmdOptions, (err: Error, stdout, stderr) => {
            if (err) {
              log().info(`maquestalk1 failed. ${err}`);
              d.reject(err); return;
            }
            // @ts-ignore
            const bufWav = new Buffer(stdout, 'binary');
            d.resolve(bufWav);
          }).on('close', (statusCode) => {
            if (statusCode < 0) {
              const errorCode = statusCode * -1; // maquestalk1 library result
              MessageService.syserror(errorTable_AquesTalk2(errorCode));
              log().info(`AquesTalk_SyntheMV raise error. error_code:${errorTable_AquesTalk2(errorCode)}`);
            }
          }); // maquestalk1
          }); // fs.writeFile
          }); // temp.open

        // version 2
        } else if (phont.version == 'talk2') {
          fs().readFile(phont.path, (err: Error, phontData) => {
            if (err) {
              MessageService.syserror('phontファイルの読み込みに失敗しました。', err);
              d.reject(err); return;
            }

            const allocInt = ref().alloc('int');
            const r = fn_AquesTalk2_Synthe_Utf8(encoded, speed, allocInt, phontData);
            if (ref().isNull(r)) {
              const errorCode = allocInt.deref();
              MessageService.syserror(errorTable_AquesTalk2(errorCode));
              log().info(`fn_AquesTalk2_Synthe_Utf8 raise error. error_code:${errorTable_AquesTalk2(errorCode)}`);
              d.reject(null); return;
            }

            const bufWav = ref().reinterpret(r, allocInt.deref(), 0);
            const managedBuf = Buffer.from(bufWav); // copy bufWav to managed buffer
            fn_AquesTalk2_FreeWave(r);
            d.resolve(managedBuf);
          });

        // version 10
        } else if (phont.version == 'talk10') {
          // get and set aquesTalk10 developer key
          LicenseService.consumerKey('aquesTalk10DevKey').then((licenseKey) => {
            // set license key if is not set.
            if (! _isAquesTalk10LicensekeySet) {
              const devKey = fn_AquesTalk10_SetDevKey(licenseKey);
              if (devKey != 0) {
                MessageService.syserror('AquesTalk10開発ライセンスキーが正しくありません。');
                d.reject(null); return;
              }

              // get and set aquesTalk10 use key
              const passPhrase = options.passPhrase;
              const encryptedUseKey = options.aq10UseKeyEncrypted;
              const aquesTalk10UseKey = encryptedUseKey?
                LicenseService.decrypt(passPhrase, encryptedUseKey):
                '';
              if (encryptedUseKey && !aquesTalk10UseKey) {
                MessageService.error('AquesTalk10使用ライセンスキーの復号に失敗しました。環境設定で使用ライセンスキーを設定し直してください');
                d.reject(null); return;
              }

              if (encryptedUseKey) {
                const usrKey = fn_AquesTalk10_SetUsrKey(aquesTalk10UseKey);
                if (usrKey != 0) {
                  MessageService.error(`${'AquesTalk10使用ライセンスキーが正しくありません。環境設定で使用ライセンスキーを設定してください。'}${aquesTalk10UseKey}`);
                  d.reject(null); return;
                }
                MessageService.info('AquesTalk10使用ライセンスキーを設定しました。');
              }
              _isAquesTalk10LicensekeySet = true;
            }

            // create struct
            const aqtkVoiceVal = new AQTK_VOICE;
            aqtkVoiceVal.bas = options.bas? options.bas: phont.struct.bas;
            aqtkVoiceVal.spd = speed;
            aqtkVoiceVal.vol = phont.struct.vol;
            aqtkVoiceVal.pit = options.pit? options.pit: phont.struct.pit;
            aqtkVoiceVal.acc = options.acc? options.acc: phont.struct.acc;
            aqtkVoiceVal.lmd = options.lmd? options.lmd: phont.struct.lmd;
            aqtkVoiceVal.fsc = options.fsc? options.fsc: phont.struct.fsc;
            const ptr_aqtkVoiceVal = aqtkVoiceVal.ref();

            // create wave buffer
            const allocInt = ref().alloc('int');
            const r = fn_AquesTalk10_Synthe_Utf8(ptr_aqtkVoiceVal, encoded, allocInt);
            if (ref().isNull(r)) {
              const errorCode = allocInt.deref();
              MessageService.syserror(errorTable_AquesTalk10(errorCode));
              log().info(`fn_AquesTalk10_Synthe_Utf8 raise error. error_code:${errorTable_AquesTalk10(errorCode)}`);
              d.reject(null); return;
            }

            const bufWav = ref().reinterpret(r, allocInt.deref(), 0);
            const managedBuf = Buffer.from(bufWav); // copy bufWav to managed buffer
            fn_AquesTalk10_FreeWave(r);
            d.resolve(managedBuf);
          })
          .catch((err: Error) => {
            MessageService.syserror('AquesTalk10開発ライセンスキーの読み込みに失敗しました。', err);
            d.reject(err);
          });
        }
        return d.promise;
      },
    };
  }])
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
          MessageService.record(`${'音声ファイルを保存しました。path: '}${wavFilePath}`, wavFilePath);
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
          const offlineCtx = new OfflineAudioContext(decodedData.numberOfChannels, decodedData.length, decodedData.sampleRate);
          const inSourceNode = offlineCtx.createBufferSource();
          inSourceNode.buffer = decodedData;

          const nodeList = [];

          //// playbackRate
          //if (options.playbackRate && options.playbackRate != 1.0) {
          //  inSourceNode.playbackRate.value = options.playbackRate;
          //}
          //// detune
          //if (options.detune && options.detune != 0) {
          //  inSourceNode.detune.value = options.detune;
          //}
          //// gain
          //const gainNode = offlineCtx.createGain();
          //gainNode.gain.value = options.volume;
          //nodeList.push(gainNode);

          // connect
          let lastNode = inSourceNode;
          //angular.forEach(nodeList, (node) => {
          //  lastNode.connect(node); lastNode = node;
          //});
          lastNode.connect(offlineCtx.destination);

                   log().error('start'); 
          // and start
          inSourceNode.start();

                   log().error('startRendering'); 
          offlineCtx.startRendering().then((renderedBuffer) => {
            // TODO save AudioBuffer
            console.log(renderedBuffer);


            var audioData = {
              sampleRate: renderedBuffer.sampleRate,
              channelData: []
            };
            for (var i = 0; i < renderedBuffer.numberOfChannels; i++) {
              audioData.channelData[i] = renderedBuffer.getChannelData(i);
            }

            WavEncoder().encode(audioData).then((buffer) => {
                fs().writeFile('/Users/taku.omi/Desktop/test.wav', Buffer.from(buffer), function(e) {
                   log().error(wavFilePath); 
                    if (e) {
                        log().error(e);
                        console.log(e)
            d.reject(e);
                    } else {
                        log().error('Success');
                        console.log("Success")
            MessageService.record(`${'音声ファイルを保存しました。path: '}${wavFilePath}`, wavFilePath);
            d.resolve('ok');
                    }
                });
            });



            //WavEncoder.encode(audioData).then(function(buffer) {
            //  var blob = new Blob([buffer], {
            //    type: "audio/wav"
            //  });
            //  fileCallback(URL.createObjectURL(blob));
            //});


          });


        })
        .catch((err: Error) => {
          MessageService.syserror('音源の再生に失敗しました。', err);
          d.reject(err); return;
        });
        return d.promise;
      },
    };
  }])
  .factory('AudioSourceService', ['$q', 'MessageService', ($q, MessageService: yubo.MessageService): yubo.AudioSourceService => {
    const waveExt = '.wav';
    const sourceExt = '.txt';

    return {
      sourceFname: function(wavFilePath: string): string {
        const dir = path().dirname(wavFilePath);
        const basename = path().basename(wavFilePath, waveExt);
        const filename = basename + sourceExt;
        return path().join(dir, filename);
      },
      save: function(filePath: string, sourceText: string): ng.IPromise<string> {
        const d = $q.defer();
        fs().writeFile(filePath, sourceText, 'utf-8', function(err: Error) {
          if (err) {
            MessageService.syserror('メッセージファイルの書き込みに失敗しました。', err);
            d.reject(err); return;
          }
          MessageService.info(`${'メッセージファイルを保存しました。path: '}${filePath}`);
          d.resolve(filePath);
        });
        return d.promise;
      },
    };
  }])
  .factory('SeqFNameService', ['$q', 'MessageService', ($q, MessageService: yubo.MessageService): yubo.SeqFNameService => {
    const ext = '.wav';
    const numPattern = '[0-9]{4}';
    const limit = 9999;

    return {
      splitFname: function(filePath: string): {dir: string, basename: string} {
        const dir = path().dirname(filePath);
        const basename = path().basename(filePath, ext);
        return {
          dir: dir,
          basename: basename,
        };
      },
      nextFname: function(prefix: string, num: number): string {
        const formatted = ('0000'+ num).slice(-4);
        return prefix + formatted + ext;
      },
      nextNumber: function(dir: string, prefix: string): ng.IPromise<number> {
        const d = $q.defer();
        fs().readdir(dir, (err: Error, files) => {
          if (err) {
            MessageService.syserror('ディレクトリを参照できませんでした。', err);
            d.reject(err); return;
          }

          const pattern = new RegExp(`^${prefix}(${numPattern})${ext}$`);

          const npList = [];
          files.forEach((file) => {
            try {
              if (pattern.test(file)) {
                const matched = pattern.exec(file);
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

          const maxNum = Math.max.apply(null, npList);
          if (maxNum >= limit) {
            MessageService.syserror(`${limit}${'までファイルが作られているので、これ以上ファイルを作成できません。'}`);
            d.reject(null); return;
          }
          const next = maxNum + 1;
          d.resolve(next);
        });
        return d.promise;
      },
    };
  }])
  .factory('AppUtilService', ['$rootScope', ($rootScope): yubo.AppUtilService => {
    return {
      disableRhythm: function(encoded: string): string {
        return encoded.replace(/['/]/g, '');
      },
      reportDuration: function(duration: number): void {
        $rootScope.$broadcast('duration', duration);
      },
    };
  }]);

