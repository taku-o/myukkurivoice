var _fs, fs       = () => { _fs = _fs || require('fs'); return _fs; };
var _ffi, ffi     = () => { _ffi = _ffi || require('ffi'); return _ffi; };
var _epath, epath = () => { _epath = _epath || require('electron-path'); return _epath; };
var unpackedPath  = epath().getUnpackedPath();

angular.module('dictAquesService', [])
  .factory('AquesService', [() => {

    // int AqUsrDic_Import(const char * pathUserDic, const char * pathDicCsv)
    // int AqUsrDic_Export(const char * pathUserDic, const char * pathDicCsv)
    // int AqUsrDic_Check(const char * surface, const char * yomi, int posCode)
    // const char * AqUsrDic_GetLastError()
    let frameworkPath = null;
    frameworkPath = `${unpackedPath}/vendor/AqUsrDic.framework/Versions/A/AqUsrDic`;
    const ptr_AqUsrDic_Import       = ffi().DynamicLibrary(frameworkPath).get('AqUsrDic_Import');
    const ptr_AqUsrDic_Export       = ffi().DynamicLibrary(frameworkPath).get('AqUsrDic_Export');
    const ptr_AqUsrDic_Check        = ffi().DynamicLibrary(frameworkPath).get('AqUsrDic_Check');
    const ptr_AqUsrDic_GetLastError = ffi().DynamicLibrary(frameworkPath).get('AqUsrDic_GetLastError');

    const fn_AqUsrDic_Import       = ffi().ForeignFunction(ptr_AqUsrDic_Import, 'int', ['string', 'string']);
    const fn_AqUsrDic_Export       = ffi().ForeignFunction(ptr_AqUsrDic_Export, 'int', ['string', 'string']);
    const fn_AqUsrDic_Check        = ffi().ForeignFunction(ptr_AqUsrDic_Check, 'int', ['string', 'string', 'int']);
    const fn_AqUsrDic_GetLastError = ffi().ForeignFunction(ptr_AqUsrDic_GetLastError, 'string', []);

    return {
      generateUserDict: function(inCsvPath: string, outUserDicPath: string): {success:boolean, message:string} {
        try {
          fs().chmodSync(outUserDicPath, 0o644); // chmod 644 if exists
        } catch (err) {
          fs().closeSync(fs().openSync(outUserDicPath, 'a+')); // create with 644 permission.
        }
        const result = fn_AqUsrDic_Import(outUserDicPath, inCsvPath);
        if (result == 0) {
          return {success:true, message:null};
        } else {
          const errorMsg = fn_AqUsrDic_GetLastError();
          return {success:false, message:errorMsg};
        }
      },
      generateCSV: function(inUserDicPath: string, outCsvPath: string): {success:boolean, message:string} {
        const result = fn_AqUsrDic_Export(inUserDicPath, outCsvPath);
        if (result == 0) {
          return {success:true, message:null};
        } else {
          const errorMsg = fn_AqUsrDic_GetLastError();
          return {success:false, message:errorMsg};
        }
      },
      validateInput: function(surface: string, yomi: string, posCode: number): {success:boolean, message:string} {
        const result = fn_AqUsrDic_Check(surface, yomi, posCode);
        if (result == 0) {
          return {success:true, message:null};
        } else {
          const errorMsg = fn_AqUsrDic_GetLastError();
          return {success:false, message:errorMsg};
        }
      },
      getLastError: function(): string {
        return fn_AqUsrDic_GetLastError();
      },
    };
  }]);
