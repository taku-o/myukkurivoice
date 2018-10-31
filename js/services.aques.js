"use strict";
var _log, log = function () { _log = _log || require('electron-log'); return _log; };
var _fs, fs = function () { _fs = _fs || require('fs'); return _fs; };
var _ffi, ffi = function () { _ffi = _ffi || require('ffi'); return _ffi; };
var _ref, ref = function () { _ref = _ref || require('ref'); return _ref; };
var _StructType, StructType = function () { _StructType = _StructType || require('ref-struct'); return _StructType; };
var _temp, temp = function () { _temp = _temp || require('temp').track(); return _temp; };
var _exec, exec = function () { _exec = _exec || require('child_process').exec; return _exec; };
var _epath, epath = function () { _epath = _epath || require('electron-path'); return _epath; };
var unpackedPath = epath().getUnpackedPath();
// angular aques service
angular.module('yvoiceAquesService', ['yvoiceMessageService', 'yvoiceLicenseService'])
    .factory('AquesService', ['$q', 'MessageService', 'LicenseService',
    function ($q, MessageService, LicenseService) {
        var ptr_void = ref().refType(ref().types["void"]);
        var ptr_int = ref().refType(ref().types.int);
        var ptr_char = ref().refType(ref().types.char);
        var ptr_uchar = ref().refType(ref().types.uchar);
        var AQTK_VOICE = StructType()({
            bas: ref().types.int,
            spd: ref().types.int,
            vol: ref().types.int,
            pit: ref().types.int,
            acc: ref().types.int,
            lmd: ref().types.int,
            fsc: ref().types.int
        });
        var ptr_AQTK_VOICE = ref().refType(AQTK_VOICE);
        // void * AqKanji2Koe_Create (const char *pathDic, int *pErr)
        // void AqKanji2Koe_Release (void * hAqKanji2Koe)
        // int AqKanji2Koe_Convert (void * hAqKanji2Koe, const char *kanji, char *koe, int nBufKoe)
        var frameworkPath = null;
        frameworkPath = unpackedPath + "/vendor/AqKanji2Koe.framework/Versions/A/AqKanji2Koe";
        var ptr_AqKanji2Koe_Create = ffi().DynamicLibrary(frameworkPath).get('AqKanji2Koe_Create');
        var ptr_AqKanji2Koe_Release = ffi().DynamicLibrary(frameworkPath).get('AqKanji2Koe_Release');
        var ptr_AqKanji2Koe_Convert = ffi().DynamicLibrary(frameworkPath).get('AqKanji2Koe_Convert');
        var fn_AqKanji2Koe_Create = ffi().ForeignFunction(ptr_AqKanji2Koe_Create, ptr_void, ['string', ptr_int]);
        var fn_AqKanji2Koe_Release = ffi().ForeignFunction(ptr_AqKanji2Koe_Release, 'void', [ptr_void]);
        var fn_AqKanji2Koe_Convert = ffi().ForeignFunction(ptr_AqKanji2Koe_Convert, 'int', [ptr_void, 'string', ptr_char, 'int']);
        // unsigned char * AquesTalk2_Synthe_Utf8(const char *koe, int iSpeed, int * size, void *phontDat)
        // void AquesTalk2_FreeWave (unsigned char *wav)
        frameworkPath = unpackedPath + "/vendor/AquesTalk2.framework/Versions/A/AquesTalk2";
        var ptr_AquesTalk2_Synthe_Utf8 = ffi().DynamicLibrary(frameworkPath).get('AquesTalk2_Synthe_Utf8');
        var ptr_AquesTalk2_FreeWave = ffi().DynamicLibrary(frameworkPath).get('AquesTalk2_FreeWave');
        var fn_AquesTalk2_Synthe_Utf8 = ffi().ForeignFunction(ptr_AquesTalk2_Synthe_Utf8, ptr_uchar, ['string', 'int', ptr_int, ptr_void]);
        var fn_AquesTalk2_FreeWave = ffi().ForeignFunction(ptr_AquesTalk2_FreeWave, 'void', [ptr_uchar]);
        // unsigned char * AquesTalk_Synthe_Utf8(const AQTK_VOICE *pParam, const char *koe, int *size)
        // void AquesTalk_FreeWave(unsigned char *wav)
        // int AquesTalk_SetDevKey(const char *key)
        // int AquesTalk_SetUsrKey(const char *key)
        frameworkPath = unpackedPath + "/vendor/AquesTalk10.framework/Versions/A/AquesTalk";
        var ptr_AquesTalk10_Synthe_Utf8 = ffi().DynamicLibrary(frameworkPath).get('AquesTalk_Synthe_Utf8');
        var ptr_AquesTalk10_FreeWave = ffi().DynamicLibrary(frameworkPath).get('AquesTalk_FreeWave');
        var ptr_AquesTalk10_SetDevKey = ffi().DynamicLibrary(frameworkPath).get('AquesTalk_SetDevKey');
        var ptr_AquesTalk10_SetUsrKey = ffi().DynamicLibrary(frameworkPath).get('AquesTalk_SetUsrKey');
        var fn_AquesTalk10_Synthe_Utf8 = ffi().ForeignFunction(ptr_AquesTalk10_Synthe_Utf8, ptr_uchar, [ptr_AQTK_VOICE, 'string', ptr_int]);
        var fn_AquesTalk10_FreeWave = ffi().ForeignFunction(ptr_AquesTalk10_FreeWave, 'void', [ptr_uchar]);
        var fn_AquesTalk10_SetDevKey = ffi().ForeignFunction(ptr_AquesTalk10_SetDevKey, 'int', ['string']);
        var fn_AquesTalk10_SetUsrKey = ffi().ForeignFunction(ptr_AquesTalk10_SetUsrKey, 'int', ['string']);
        function errorTable_AqKanji2Koe(code) {
            if (code == 101) {
                return '関数呼び出し時の引数がNULLになっている';
            }
            if (code == 105) {
                return '入力テキストが長すぎる';
            }
            if (code == 107) {
                return '変換できない文字コードが含まれている';
            }
            if (code >= 200 && code < 300) {
                return 'システム辞書(aqdic.bin)が不正';
            }
            if (code >= 300 && code < 400) {
                return 'ユーザ辞書(aq_user.dic)が不正';
            }
            if (code == 100) {
                return 'その他のエラー';
            }
            return '';
        }
        function errorTable_AquesTalk2(code) {
            if (code == 100) {
                return 'その他のエラー';
            }
            if (code == 101) {
                return 'メモリ不足';
            }
            if (code == 102) {
                return '音記号列に未定義の読み記号が指定された';
            }
            if (code == 103) {
                return '韻律データの時間長がマイナスなっている';
            }
            if (code == 104) {
                return '内部エラー(未定義の区切りコード検出)';
            }
            if (code == 105) {
                return '音記号列に未定義の読み記号が指定された';
            }
            if (code == 106) {
                return '音記号列のタグの指定が正しくない';
            }
            if (code == 107) {
                return 'タグの長さが制限を越えている(または[>]がみつからない)';
            }
            if (code == 108) {
                return 'タグ内の値の指定が正しくない';
            }
            if (code == 109) {
                return 'WAVE再生ができない(サウンドドライバ関連の問題)';
            }
            if (code == 110) {
                return 'WAVE再生ができない(サウンドドライバ関連の問題 非同期再生)';
            }
            if (code == 111) {
                return '発すべきデータがない';
            }
            if (code == 200) {
                return '音記号列が長すぎる';
            }
            if (code == 201) {
                return '1つのフレーズ中の読み記号が多すぎる';
            }
            if (code == 202) {
                return '音記号列が長い(内部バッファオーバー1)';
            }
            if (code == 203) {
                return 'ヒープメモリ不足';
            }
            if (code == 204) {
                return '音記号列が長い(内部バッファオーバー1)';
            }
            if (code == 205) {
                return 'ライセンスキーが正しくない。または、設定されていない。';
            }
            if (code >= 1000 && code <= 1008) {
                return 'Phontデータが正しくない';
            }
            return '';
        }
        function errorTable_AquesTalk10(code) {
            if (code == 100) {
                return 'その他のエラー';
            }
            if (code == 101) {
                return 'メモリ不足';
            }
            if (code == 103) {
                return '音声記号列指定エラー(語頭の長音、促音の連続など)';
            }
            if (code == 104) {
                return '音声記号列に有効な読みがない';
            }
            if (code == 105) {
                return '音声記号列に未定義の読み記号が指定された';
            }
            if (code == 106) {
                return '音声記号列のタグの指定が正しくない';
            }
            if (code == 107) {
                return 'タグの長さが制限を越えている(または[>]がみつからない)';
            }
            if (code == 108) {
                return 'タグ内の値の指定が正しくない';
            }
            if (code == 120) {
                return '音声記号列が長すぎる';
            }
            if (code == 121) {
                return '1つのフレーズ中の読み記号が多すぎる';
            }
            if (code == 122) {
                return '音声記号列が長い(内部バッファオーバー1)';
            }
            return '';
        }
        var _isAquesTalk10LicensekeySet = false;
        return {
            encode: function (source) {
                if (!source) {
                    MessageService.syserror('音記号列に変換するメッセージが入力されていません。');
                    return '';
                }
                var allocInt = ref().alloc('int');
                var aqKanji2Koe = fn_AqKanji2Koe_Create(unpackedPath + "/vendor/aq_dic_large", allocInt);
                var errorCode = allocInt.deref();
                if (errorCode != 0) {
                    MessageService.syserror(errorTable_AqKanji2Koe(errorCode));
                    log().warn("fn_AqKanji2Koe_Create raise error. error_code:" + errorTable_AqKanji2Koe(errorCode));
                    return '';
                }
                var sourceLength = (new Blob([source], { type: 'text/plain' })).size;
                var encodedLength = sourceLength >= 512 ? sourceLength * 4 : 512;
                var buf = Buffer.alloc(sourceLength >= 512 ? sourceLength * 4 : 512);
                var r = fn_AqKanji2Koe_Convert(aqKanji2Koe, source, buf, encodedLength);
                if (r != 0) {
                    MessageService.syserror(errorTable_AqKanji2Koe(r));
                    log().info("fn_AqKanji2Koe_Convert raise error. error_code:" + errorTable_AqKanji2Koe(r));
                    return '';
                }
                var encoded = ref().readCString(buf, 0);
                fn_AqKanji2Koe_Release(aqKanji2Koe);
                return encoded;
            },
            wave: function (encoded, phont, speed, options) {
                var d = $q.defer();
                if (!encoded) {
                    MessageService.syserror('音記号列が入力されていません。');
                    d.reject(null);
                    return d.promise;
                }
                // version 1
                if (phont.version == 'talk1') {
                    // write encoded to tempory file
                    var fsprefix = "_myubow" + Date.now().toString(36);
                    temp().open(fsprefix, function (err, info) {
                        if (err) {
                            MessageService.syserror('一時作業ファイルを作れませんでした。', err);
                            d.reject(null);
                            return;
                        }
                        fs().writeFile(info.path, encoded, function (err) {
                            if (err) {
                                MessageService.syserror('一時作業ファイルの書き込みに失敗しました。', err);
                                d.reject(err);
                                return;
                            }
                            var cmdOptions = {
                                env: {
                                    VOICE: phont.idVoice,
                                    SPEED: speed
                                },
                                encoding: 'binary'
                            };
                            var waverCmd = unpackedPath.replace(' ', '\\ ') + "/vendor/maquestalk1";
                            exec()("cat " + info.path + " | VOICE=" + phont.idVoice + " SPEED=" + speed + " " + waverCmd, cmdOptions, function (err, stdout, stderr) {
                                if (err) {
                                    log().info("maquestalk1 failed. " + err);
                                    d.reject(err);
                                    return;
                                }
                                // @ts-ignore
                                var bufWav = new Buffer(stdout, 'binary');
                                d.resolve(bufWav);
                            }).on('close', function (statusCode) {
                                if (statusCode < 0) {
                                    var errorCode = statusCode * -1; // maquestalk1 library result
                                    MessageService.syserror(errorTable_AquesTalk2(errorCode));
                                    log().info("AquesTalk_SyntheMV raise error. error_code:" + errorTable_AquesTalk2(errorCode));
                                }
                            }); // maquestalk1
                        }); // fs.writeFile
                    }); // temp.open
                    // version 2
                }
                else if (phont.version == 'talk2') {
                    fs().readFile(phont.path, function (err, phontData) {
                        if (err) {
                            MessageService.syserror('phontファイルの読み込みに失敗しました。', err);
                            d.reject(err);
                            return;
                        }
                        var allocInt = ref().alloc('int');
                        var r = fn_AquesTalk2_Synthe_Utf8(encoded, speed, allocInt, phontData);
                        if (ref().isNull(r)) {
                            var errorCode = allocInt.deref();
                            MessageService.syserror(errorTable_AquesTalk2(errorCode));
                            log().info("fn_AquesTalk2_Synthe_Utf8 raise error. error_code:" + errorTable_AquesTalk2(errorCode));
                            d.reject(null);
                            return;
                        }
                        var bufWav = ref().reinterpret(r, allocInt.deref(), 0);
                        var managedBuf = Buffer.from(bufWav); // copy bufWav to managed buffer
                        fn_AquesTalk2_FreeWave(r);
                        d.resolve(managedBuf);
                    });
                    // version 10
                }
                else if (phont.version == 'talk10') {
                    // get and set aquesTalk10 developer key
                    LicenseService.consumerKey('aquesTalk10DevKey').then(function (licenseKey) {
                        // set license key if is not set.
                        if (!_isAquesTalk10LicensekeySet) {
                            var devKey = fn_AquesTalk10_SetDevKey(licenseKey);
                            if (devKey != 0) {
                                MessageService.syserror('AquesTalk10開発ライセンスキーが正しくありません。');
                                d.reject(null);
                                return;
                            }
                            // get and set aquesTalk10 use key
                            var passPhrase = options.passPhrase;
                            var encryptedUseKey = options.aq10UseKeyEncrypted;
                            var aquesTalk10UseKey = encryptedUseKey ?
                                LicenseService.decrypt(passPhrase, encryptedUseKey) :
                                '';
                            if (encryptedUseKey && !aquesTalk10UseKey) {
                                MessageService.error('AquesTalk10使用ライセンスキーの復号に失敗しました。環境設定で使用ライセンスキーを設定し直してください');
                                d.reject(null);
                                return;
                            }
                            if (encryptedUseKey) {
                                var usrKey = fn_AquesTalk10_SetUsrKey(aquesTalk10UseKey);
                                if (usrKey != 0) {
                                    MessageService.error("" + 'AquesTalk10使用ライセンスキーが正しくありません。環境設定で使用ライセンスキーを設定してください。' + aquesTalk10UseKey);
                                    d.reject(null);
                                    return;
                                }
                                MessageService.info('AquesTalk10使用ライセンスキーを設定しました。');
                            }
                            _isAquesTalk10LicensekeySet = true;
                        }
                        // create struct
                        var aqtkVoiceVal = new AQTK_VOICE;
                        aqtkVoiceVal.bas = options.bas ? options.bas : phont.struct.bas;
                        aqtkVoiceVal.spd = speed;
                        aqtkVoiceVal.vol = phont.struct.vol;
                        aqtkVoiceVal.pit = options.pit ? options.pit : phont.struct.pit;
                        aqtkVoiceVal.acc = options.acc ? options.acc : phont.struct.acc;
                        aqtkVoiceVal.lmd = options.lmd ? options.lmd : phont.struct.lmd;
                        aqtkVoiceVal.fsc = options.fsc ? options.fsc : phont.struct.fsc;
                        var ptr_aqtkVoiceVal = aqtkVoiceVal.ref();
                        // create wave buffer
                        var allocInt = ref().alloc('int');
                        var r = fn_AquesTalk10_Synthe_Utf8(ptr_aqtkVoiceVal, encoded, allocInt);
                        if (ref().isNull(r)) {
                            var errorCode = allocInt.deref();
                            MessageService.syserror(errorTable_AquesTalk10(errorCode));
                            log().info("fn_AquesTalk10_Synthe_Utf8 raise error. error_code:" + errorTable_AquesTalk10(errorCode));
                            d.reject(null);
                            return;
                        }
                        var bufWav = ref().reinterpret(r, allocInt.deref(), 0);
                        var managedBuf = Buffer.from(bufWav); // copy bufWav to managed buffer
                        fn_AquesTalk10_FreeWave(r);
                        d.resolve(managedBuf);
                    })["catch"](function (err) {
                        MessageService.syserror('AquesTalk10開発ライセンスキーの読み込みに失敗しました。', err);
                        d.reject(err);
                    });
                }
                return d.promise;
            }
        };
    }]);