"use strict";
var _ffi, ffi = function () { _ffi = _ffi || require('ffi'); return _ffi; };
var _epath, epath = function () { _epath = _epath || require('electron-path'); return _epath; };
var unpackedPath = epath().getUnpackedPath();
angular.module('dictAquesService', [])
    .factory('AquesService', [function () {
        // int AqUsrDic_Import(const char * pathUserDic, const char * pathDicCsv)
        // int AqUsrDic_Export(const char * pathUserDic, const char * pathDicCsv)
        // int AqUsrDic_Check(const char * surface, const char * yomi, int posCode)
        // const char * AqUsrDic_GetLastError()
        var frameworkPath = null;
        frameworkPath = unpackedPath + "/vendor/AqUsrDic.framework/Versions/A/AqUsrDic";
        var ptr_AqUsrDic_Import = ffi().DynamicLibrary(frameworkPath).get('AqUsrDic_Import');
        var ptr_AqUsrDic_Export = ffi().DynamicLibrary(frameworkPath).get('AqUsrDic_Export');
        var ptr_AqUsrDic_Check = ffi().DynamicLibrary(frameworkPath).get('AqUsrDic_Check');
        var ptr_AqUsrDic_GetLastError = ffi().DynamicLibrary(frameworkPath).get('AqUsrDic_GetLastError');
        var fn_AqUsrDic_Import = ffi().ForeignFunction(ptr_AqUsrDic_Import, 'int', ['string', 'string']);
        var fn_AqUsrDic_Export = ffi().ForeignFunction(ptr_AqUsrDic_Export, 'int', ['string', 'string']);
        var fn_AqUsrDic_Check = ffi().ForeignFunction(ptr_AqUsrDic_Check, 'int', ['string', 'string', 'int']);
        var fn_AqUsrDic_GetLastError = ffi().ForeignFunction(ptr_AqUsrDic_GetLastError, 'string', []);
        return {
            generateUserDict: function (inCsvPath, outUserDicPath) {
                var result = fn_AqUsrDic_Import(outUserDicPath, inCsvPath);
                if (result == 0) {
                    return { success: true, message: null };
                }
                else {
                    var errorMsg = fn_AqUsrDic_GetLastError();
                    return { success: false, message: errorMsg };
                }
            },
            generateCSV: function (inUserDicPath, outCsvPath) {
                var result = fn_AqUsrDic_Export(inUserDicPath, outCsvPath);
                if (result == 0) {
                    return { success: true, message: null };
                }
                else {
                    var errorMsg = fn_AqUsrDic_GetLastError();
                    return { success: false, message: errorMsg };
                }
            },
            validateInput: function (surface, yomi, posCode) {
                var result = fn_AqUsrDic_Check(surface, yomi, posCode);
                if (result == 0) {
                    return { success: true, message: null };
                }
                else {
                    var errorMsg = fn_AqUsrDic_GetLastError();
                    return { success: false, message: errorMsg };
                }
            },
            getLastError: function () {
                return fn_AqUsrDic_GetLastError();
            }
        };
    }]);
