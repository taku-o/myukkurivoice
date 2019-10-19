var app = require('electron').remote.app;
var _log: any, log               = () => { _log = _log || require('electron-log'); return _log; };
var _fs: any, fs                 = () => { _fs = _fs || require('fs'); return _fs; };
var _ffi: any, ffi               = () => { _ffi = _ffi || require('ffi'); return _ffi; };
var _os: any, os                 = () => { _os = _os || require('os'); return _os; };
var _ref: any, ref               = () => { _ref = _ref || require('ref'); return _ref; };
var _semver: any, semver         = () => { _semver = _semver || require('semver'); return _semver; };
var _StructType: any, StructType = () => { _StructType = _StructType || require('ref-struct'); return _StructType; };
var _temp: any, temp             = () => { _temp = _temp || require('temp').track(); return _temp; };
var _exec: any, exec             = () => { _exec = _exec || require('child_process').exec; return _exec; };
var _epath: any, epath           = () => { _epath = _epath || require('electron-path'); return _epath; };
var _waitUntil: any, waitUntil   = () => { _waitUntil = _waitUntil || require('wait-until'); return _waitUntil; };

var unpackedPath = epath().getUnpackedPath();

// angular aques service
angular.module('AquesServices', ['MessageServices', 'LicenseServices']);

// AqKanji2Koe
class AqKanji2KoeLib implements yubo.AqKanji2KoeLib {
  // void * AqKanji2Koe_Create (const char *pathDic, int *pErr)
  // void AqKanji2Koe_Release (void * hAqKanji2Koe)
  // int AqKanji2Koe_Convert (void * hAqKanji2Koe, const char *kanji, char *koe, int nBufKoe)
  // int AqKanji2Koe_SetDevKey (const char *key)
  private fn_AqKanji2Koe_Create: (pathDic: string, pErr: Buffer) => Buffer;
  private fn_AqKanji2Koe_Release: (hAqKanji2Koe: Buffer) => void;
  private fn_AqKanji2Koe_Convert: (hAqKanji2Koe: Buffer, kanji: string, koe: Buffer, nBufKoe: number) => number;
  private fn_AqKanji2Koe_SetDevKey: (key: string) => number;
  constructor() {
    const ptr_void = ref().refType(ref().types.void);
    const ptr_int  = ref().refType(ref().types.int);
    const ptr_char = ref().refType(ref().types.char);

    const frameworkPath: string = `${unpackedPath}/vendor/AqKanji2Koe.framework/Versions/A/AqKanji2Koe`;
    const ptr_AqKanji2Koe_Create    = ffi().DynamicLibrary(frameworkPath).get('AqKanji2Koe_Create');
    const ptr_AqKanji2Koe_Release   = ffi().DynamicLibrary(frameworkPath).get('AqKanji2Koe_Release');
    const ptr_AqKanji2Koe_Convert   = ffi().DynamicLibrary(frameworkPath).get('AqKanji2Koe_Convert');
    const ptr_AqKanji2Koe_SetDevKey = ffi().DynamicLibrary(frameworkPath).get('AqKanji2Koe_SetDevKey');
    this.fn_AqKanji2Koe_Create      = ffi().ForeignFunction(ptr_AqKanji2Koe_Create, ptr_void, ['string', ptr_int]);
    this.fn_AqKanji2Koe_Release     = ffi().ForeignFunction(ptr_AqKanji2Koe_Release, 'void', [ptr_void]);
    this.fn_AqKanji2Koe_Convert     = ffi().ForeignFunction(ptr_AqKanji2Koe_Convert, 'int', [ptr_void, 'string', ptr_char, 'int']);
    this.fn_AqKanji2Koe_SetDevKey   = ffi().ForeignFunction(ptr_AqKanji2Koe_SetDevKey, 'int', ['string']);
  }

  create(pathDic: string, pErr: Buffer): Buffer {
    return this.fn_AqKanji2Koe_Create(pathDic, pErr);
  }
  release(hAqKanji2Koe: Buffer): void {
    this.fn_AqKanji2Koe_Release(hAqKanji2Koe);
  }
  convert(hAqKanji2Koe: Buffer, kanji: string, koe: Buffer, nBufKoe: number): number {
    return this.fn_AqKanji2Koe_Convert(hAqKanji2Koe, kanji, koe, nBufKoe);
  }
  setDevKey(key: string): number {
    return this.fn_AqKanji2Koe_SetDevKey(key);
  }

  errorTable(code: number): string {
    if (code == 101)               { return '関数呼び出し時の引数がNULLになっている'; }
    if (code == 104)               { return '初期化されていない(初期化ルーチンが呼ばれていない)'; }
    if (code == 105)               { return '入力テキストが長すぎる'; }
    if (code == 106)               { return 'システム辞書データが指定されていない'; }
    if (code == 107)               { return '変換できない文字コードが含まれている'; }
    if (code >= 200 && code < 300) { return 'システム辞書(aqdic.bin)が不正'; }
    if (code >= 300 && code < 400) { return 'ユーザ辞書(aq_user.dic)が不正'; }
    if (code == 100)               { return 'その他のエラー'; }
    return '';
  }
}
angular.module('AquesServices')
  .service('AqKanji2KoeLib', [
    AqKanji2KoeLib,
  ]);

// AquesTalk1
class AquesTalk1Lib implements yubo.AquesTalk1Lib {
  readonly SUPPORTED_LAST_VERSION: string = '19.0.0'; // Catalina
  readonly DEFAULT_GENERATOR_PATH = `${unpackedPath.replace(' ', '\\ ')}/vendor/maquestalk1`;
  readonly IOS_GENERATOR_PATH = `${unpackedPath.replace(' ', '\\ ')}/vendor/maquestalk1-ios`;

  private release: string;
  constructor() {}

  generator(version?): string {
    return this.isDefaultSupported(version)? this.DEFAULT_GENERATOR_PATH: this.IOS_GENERATOR_PATH;
  }

  isDefaultSupported(version?: string): boolean {
    if (version) {
      return semver().lt(version, this.SUPPORTED_LAST_VERSION);
    } else {
      this.release = this.release || os().release();
      return semver().lt(this.release, this.SUPPORTED_LAST_VERSION);
    }
  }

  isSupportedPhont(phont: yubo.YPhont, version?: string): boolean {
    return this.isDefaultSupported(version)? true: phont.catalina;
  }
}
angular.module('AquesServices')
  .service('AquesTalk1Lib', [
    AquesTalk1Lib,
  ]);

// AquesTalk2
class AquesTalk2Lib implements yubo.AquesTalk2Lib {
  // unsigned char * AquesTalk2_Synthe_Utf8(const char *koe, int iSpeed, int * size, void *phontDat)
  // void AquesTalk2_FreeWave (unsigned char *wav)
  private fn_AquesTalk2_Synthe_Utf8: (koe: string, iSpeed: number, size: Buffer, phontDat: Buffer) => Buffer;
  private fn_AquesTalk2_FreeWave: (wav: Buffer) => void;
  constructor() {
    const ptr_void  = ref().refType(ref().types.void);
    const ptr_int   = ref().refType(ref().types.int);
    const ptr_uchar = ref().refType(ref().types.uchar);

    const frameworkPath = `${unpackedPath}/vendor/AquesTalk2.framework/Versions/A/AquesTalk2`;
    const ptr_AquesTalk2_Synthe_Utf8 = ffi().DynamicLibrary(frameworkPath).get('AquesTalk2_Synthe_Utf8');
    const ptr_AquesTalk2_FreeWave    = ffi().DynamicLibrary(frameworkPath).get('AquesTalk2_FreeWave');
    this.fn_AquesTalk2_Synthe_Utf8   = ffi().ForeignFunction(ptr_AquesTalk2_Synthe_Utf8, ptr_uchar, ['string', 'int', ptr_int, ptr_void]);
    this.fn_AquesTalk2_FreeWave      = ffi().ForeignFunction(ptr_AquesTalk2_FreeWave, 'void', [ptr_uchar]);
  }

  synthe(koe: string, iSpeed: number, size: Buffer, phontDat: Buffer): Buffer {
    return this.fn_AquesTalk2_Synthe_Utf8(koe, iSpeed, size, phontDat);
  }
  freeWave(wav: Buffer): void {
    return this.fn_AquesTalk2_FreeWave(wav);
  }

  errorTable(code: number): string {
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
}
angular.module('AquesServices')
  .service('AquesTalk2Lib', [
    AquesTalk2Lib,
  ]);

// AquesTalk10
class AquesTalk10Lib implements yubo.AquesTalk10Lib {
  // unsigned char * AquesTalk_Synthe_Utf8(const AQTK_VOICE *pParam, const char *koe, int *size)
  // void AquesTalk_FreeWave(unsigned char *wav)
  // int AquesTalk_SetDevKey(const char *key)
  // int AquesTalk_SetUsrKey(const char *key)
  private fn_AquesTalk10_Synthe_Utf8: (pParam: Buffer, koe: string, size: Buffer) => Buffer;
  private fn_AquesTalk10_FreeWave: (wav: Buffer) => void;
  private fn_AquesTalk10_SetDevKey: (key: string) => number;
  private fn_AquesTalk10_SetUsrKey: (key: string) => number;
  public AQTK_VOICE: refStruct.StructType;
  constructor() {
    const ptr_int   = ref().refType(ref().types.int);
    const ptr_uchar = ref().refType(ref().types.uchar);

    this.AQTK_VOICE = StructType()({
      bas: ref().types.int,
      spd: ref().types.int,
      vol: ref().types.int,
      pit: ref().types.int,
      acc: ref().types.int,
      lmd: ref().types.int,
      fsc: ref().types.int,
    });
    const ptr_AQTK_VOICE = ref().refType(this.AQTK_VOICE);

    const frameworkPath = `${unpackedPath}/vendor/AquesTalk10.framework/Versions/A/AquesTalk`;
    const ptr_AquesTalk10_Synthe_Utf8 = ffi().DynamicLibrary(frameworkPath).get('AquesTalk_Synthe_Utf8');
    const ptr_AquesTalk10_FreeWave    = ffi().DynamicLibrary(frameworkPath).get('AquesTalk_FreeWave');
    const ptr_AquesTalk10_SetDevKey   = ffi().DynamicLibrary(frameworkPath).get('AquesTalk_SetDevKey');
    const ptr_AquesTalk10_SetUsrKey   = ffi().DynamicLibrary(frameworkPath).get('AquesTalk_SetUsrKey');
    this.fn_AquesTalk10_Synthe_Utf8  = ffi().ForeignFunction(ptr_AquesTalk10_Synthe_Utf8, ptr_uchar, [ptr_AQTK_VOICE, 'string', ptr_int]);
    this.fn_AquesTalk10_FreeWave     = ffi().ForeignFunction(ptr_AquesTalk10_FreeWave, 'void', [ptr_uchar]);
    this.fn_AquesTalk10_SetDevKey    = ffi().ForeignFunction(ptr_AquesTalk10_SetDevKey, 'int', ['string']);
    this.fn_AquesTalk10_SetUsrKey    = ffi().ForeignFunction(ptr_AquesTalk10_SetUsrKey, 'int', ['string']);
  }

  synthe(pParam: Buffer, koe: string, size: Buffer): Buffer {
    return this.fn_AquesTalk10_Synthe_Utf8(pParam, koe, size);
  }
  freeWave(wav: Buffer): void {
    this.fn_AquesTalk10_FreeWave(wav);
  }
  setDevKey(key: string): number {
    return this.fn_AquesTalk10_SetDevKey(key);
  }
  setUsrKey(key: string): number {
    return this.fn_AquesTalk10_SetUsrKey(key);
  }

  errorTable(code: number): string {
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
}
angular.module('AquesServices')
  .service('AquesTalk10Lib', [
    AquesTalk10Lib,
  ]);

// AquesTalk frontend
class AquesService implements yubo.AquesService {
  private aqDictPath: string = `${unpackedPath}/vendor/aq_dic_large`;

  constructor(
    private $q: ng.IQService,
    private $timeout: ng.ITimeoutService,
    private MessageService: yubo.MessageService,
    private LicenseService: yubo.LicenseService,
    private aqKanji2KoeLib: yubo.AqKanji2KoeLib,
    private aquesTalk1Lib: yubo.AquesTalk1Lib,
    private aquesTalk2Lib: yubo.AquesTalk2Lib,
    private aquesTalk10Lib: yubo.AquesTalk10Lib
  ) {
    // load custom dictionary if exists
    const customDictPath = `${app.getPath('userData')}/userdict`;
    fs().stat(`${customDictPath}/aqdic.bin`, (err: Error, stats: fs.Stats) => {
      if (err) { return; }
      this.aqDictPath = customDictPath;
    });
  }

  // get developer key in background.
  // delay loading. UI表示で必要な処理の後に呼ぶ
  private aqKanji2KoeDevKey: string = null;
  private aquesTalk10DevKey: string = null;
  init(): void {
    this.$timeout(() => {
      this.LicenseService.consumerKey('aqKanji2KoeDevKey').then((licenseKey) => {
        this.aqKanji2KoeDevKey = licenseKey;
      });
      this.LicenseService.consumerKey('aquesTalk10DevKey').then((licenseKey) => {
        this.aquesTalk10DevKey = licenseKey;
      });
    }, 0, false);
  }

  private _isAqKanji2KoeDevkeySet: boolean = false;
  private _isAquesTalk10LicensekeySet: boolean = false;
  encode(source: string): string {
    if (!source) {
      this.MessageService.syserror('音記号列に変換するメッセージが入力されていません。');
      return '';
    }

    // set developer key if is not set.
    if (! this._isAqKanji2KoeDevkeySet) {
      if (this.aqKanji2KoeDevKey == null) {
        waitUntil()(300, 5, () => {
          return this.aqKanji2KoeDevKey != null;
        },
        () => {
          // wait
        });
      }
      if (this.aqKanji2KoeDevKey == null) {
        this.MessageService.syserror('まだ初期化処理が完了していないので1秒ほど待ってください。');
        return '';
      }
      const devKey = this.aqKanji2KoeLib.setDevKey(this.aqKanji2KoeDevKey);
      if (devKey != 0) {
        this.MessageService.syserror('AqKanji2Koe開発ライセンスキーが正しくありません。');
        return '';
      }
    }
    this._isAqKanji2KoeDevkeySet = true;

    const allocInt = ref().alloc('int');
    const aqKanji2Koe = this.aqKanji2KoeLib.create(this.aqDictPath, allocInt);
    const errorCode = allocInt.deref();
    if (errorCode != 0) {
      this.MessageService.syserror(this.aqKanji2KoeLib.errorTable(errorCode));
      log().warn(`fn_AqKanji2Koe_Create raise error. error_code:${this.aqKanji2KoeLib.errorTable(errorCode)}`);
      return '';
    }

    const sourceLength = (new Blob([source], {type: 'text/plain'})).size;
    const encodedLength = sourceLength >= 512? sourceLength * 4 : 512;
    const buf = Buffer.alloc(sourceLength >= 512? sourceLength * 4 : 512);
    const r = this.aqKanji2KoeLib.convert(aqKanji2Koe, source, buf, encodedLength);
    if (r != 0) {
      this.MessageService.syserror(this.aqKanji2KoeLib.errorTable(r));
      log().info(`fn_AqKanji2Koe_Convert raise error. error_code:${this.aqKanji2KoeLib.errorTable(r)}`);
      return '';
    }
    const encoded = ref().readCString(buf, 0);

    this.aqKanji2KoeLib.release(aqKanji2Koe);
    return encoded;
  }

  wave(encoded: string, phont: yubo.YPhont, speed: number, options: yubo.WaveOptions): ng.IPromise<Buffer> {
    const d = this.$q.defer<Buffer>();
    if (!encoded) {
      this.MessageService.syserror('音記号列が入力されていません。');
      d.reject(new Error('音記号列が入力されていません。')); return d.promise;
    }

    // version 1
    if (phont.version == 'talk1') {
      // not supported version validator
      if (!this.aquesTalk1Lib.isSupportedPhont(phont)) {
        this.MessageService.error('この声種はCatalina以降のOSではサポートされません。');
        d.reject(new Error('この声種はCatalina以降のOSではサポートされません。')); return d.promise;
      }

      // write encoded to tempory file
      const fsprefix = `_myubow${Date.now().toString(36)}`;
      temp().open(fsprefix, (err: Error, info: temp.FileDescriptor) => {
        if (err) {
          this.MessageService.syserror('一時作業ファイルを作れませんでした。', err);
          d.reject(err); return;
        }

      fs().writeFile(info.path, encoded, (err: Error) => {
        if (err) {
          this.MessageService.syserror('一時作業ファイルの書き込みに失敗しました。', err);
          d.reject(err); return;
        }

      const cmdOptions: yubo.CmdOptions = {
        env: {
          VOICE: phont.idVoice,
          SPEED: speed,
        },
        encoding: 'binary',
      };
      const waverCmd = this.aquesTalk1Lib.generator();
      exec()(`cat ${info.path} | VOICE=${phont.idVoice} SPEED=${speed} ${waverCmd}`, cmdOptions, (err: Error, stdout: string, stderr: string) => {
        if (err) {
          log().info(`maquestalk1 failed. ${err}`);
          d.reject(err); return;
        }
        // @ts-ignore
        const bufWav = Buffer.from(stdout, 'binary');
        d.resolve(bufWav);
      }).on('close', (statusCode: number) => {
        if (statusCode < 0) {
          const errorCode = statusCode * -1; // maquestalk1 library result
          this.MessageService.syserror(this.aquesTalk2Lib.errorTable(errorCode));
          log().info(`AquesTalk_SyntheMV raise error. error_code:${this.aquesTalk2Lib.errorTable(errorCode)}`);
        }
      }); // maquestalk1
      }); // fs.writeFile
      }); // temp.open

    // version 2
    } else if (phont.version == 'talk2') {
      fs().readFile(phont.path, (err: Error, phontData: Buffer) => {
        if (err) {
          this.MessageService.syserror('phontファイルの読み込みに失敗しました。', err);
          d.reject(err); return;
        }

        const allocInt = ref().alloc('int');
        const r = this.aquesTalk2Lib.synthe(encoded, speed, allocInt, phontData);
        if (ref().isNull(r)) {
          const errorCode = allocInt.deref();
          this.MessageService.syserror(this.aquesTalk2Lib.errorTable(errorCode));
          log().info(`fn_AquesTalk2_Synthe_Utf8 raise error. error_code:${this.aquesTalk2Lib.errorTable(errorCode)}`);
          d.reject(new Error(`fn_AquesTalk2_Synthe_Utf8 raise error. error_code:${this.aquesTalk2Lib.errorTable(errorCode)}`)); return;
        }

        const bufWav = ref().reinterpret(r, allocInt.deref(), 0);
        const managedBuf = Buffer.from(bufWav); // copy bufWav to managed buffer
        this.aquesTalk2Lib.freeWave(r);
        d.resolve(managedBuf);
      });

    // version 10
    } else if (phont.version == 'talk10') {
      // set license key if is not set.
      if (! this._isAquesTalk10LicensekeySet) {
        if (this.aquesTalk10DevKey == null) {
          waitUntil()(300, 5, () => {
            return this.aquesTalk10DevKey != null;
          },
          () => {
            // wait
          });
        }
        if (this.aquesTalk10DevKey == null) {
          this.MessageService.syserror('まだ初期化処理が完了していないので1秒ほど待ってください。');
          d.reject(new Error('まだ初期化処理が完了していないので1秒ほど待ってください。')); return d.promise;
        }
        const devKey = this.aquesTalk10Lib.setDevKey(this.aquesTalk10DevKey);
        if (devKey != 0) {
          this.MessageService.syserror('AquesTalk10開発ライセンスキーが正しくありません。');
          d.reject(new Error('AquesTalk10開発ライセンスキーが正しくありません。')); return d.promise;
        }

        // get and set aquesTalk10 use key
        const passPhrase = options.passPhrase;
        const encryptedUseKey = options.aq10UseKeyEncrypted;
        const aquesTalk10UseKey = encryptedUseKey?
          this.LicenseService.decrypt(passPhrase, encryptedUseKey):
          '';
        if (encryptedUseKey && !aquesTalk10UseKey) {
          this.MessageService.error('AquesTalk10使用ライセンスキーの復号に失敗しました。環境設定で使用ライセンスキーを設定し直してください');
          d.reject(new Error('AquesTalk10使用ライセンスキーの復号に失敗しました。環境設定で使用ライセンスキーを設定し直してください')); return d.promise;
        }

        if (encryptedUseKey) {
          const usrKey = this.aquesTalk10Lib.setUsrKey(aquesTalk10UseKey);
          if (usrKey != 0) {
            this.MessageService.error(`${'AquesTalk10使用ライセンスキーが正しくありません。環境設定で使用ライセンスキーを設定してください。'}${aquesTalk10UseKey}`);
            d.reject(new Error(`${'AquesTalk10使用ライセンスキーが正しくありません。環境設定で使用ライセンスキーを設定してください。'}${aquesTalk10UseKey}`)); return d.promise;
          }
          this.MessageService.info('AquesTalk10使用ライセンスキーを設定しました。');
        }
        this._isAquesTalk10LicensekeySet = true;
      }

      // create struct
      const aqtkVoiceVal = new this.aquesTalk10Lib.AQTK_VOICE;
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
      const r = this.aquesTalk10Lib.synthe(ptr_aqtkVoiceVal, encoded, allocInt);
      if (ref().isNull(r)) {
        const errorCode = allocInt.deref();
        this.MessageService.syserror(this.aquesTalk10Lib.errorTable(errorCode));
        log().info(`fn_AquesTalk10_Synthe_Utf8 raise error. error_code:${this.aquesTalk10Lib.errorTable(errorCode)}`);
        d.reject(new Error(`fn_AquesTalk10_Synthe_Utf8 raise error. error_code:${this.aquesTalk10Lib.errorTable(errorCode)}`)); return d.promise;
      }

      const bufWav = ref().reinterpret(r, allocInt.deref(), 0);
      const managedBuf = Buffer.from(bufWav); // copy bufWav to managed buffer
      this.aquesTalk10Lib.freeWave(r);
      d.resolve(managedBuf);
    }
    return d.promise;
  }
}
angular.module('AquesServices')
  .service('AquesService', [
    '$q',
    '$timeout',
    'MessageService',
    'LicenseService',
    'AqKanji2KoeLib',
    'AquesTalk1Lib',
    'AquesTalk2Lib',
    'AquesTalk10Lib',
    AquesService,
  ]);
