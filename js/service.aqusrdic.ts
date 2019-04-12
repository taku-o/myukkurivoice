var _fs, fs       = () => { _fs = _fs || require('fs'); return _fs; };
var _ffi, ffi     = () => { _ffi = _ffi || require('ffi'); return _ffi; };
var _epath, epath = () => { _epath = _epath || require('electron-path'); return _epath; };
var unpackedPath  = epath().getUnpackedPath();

// aquestalk dictionary service
angular.module('AqUsrDicServices', []);

// AqUsrDicLib
class AqUsrDicLib implements yubo.AqUsrDicLib {
  // int AqUsrDic_Import(const char * pathUserDic, const char * pathDicCsv)
  // int AqUsrDic_Export(const char * pathUserDic, const char * pathDicCsv)
  // int AqUsrDic_Check(const char * surface, const char * yomi, int posCode)
  // const char * AqUsrDic_GetLastError()
  private fn_AqUsrDic_Import: (pathUserDic: string, pathDicCsv: string) => number;
  private fn_AqUsrDic_Export: (pathUserDic: string, pathDicCsv: string) => number;
  private fn_AqUsrDic_Check: (surface: string, yomi: string, posCode: number) => number;
  private fn_AqUsrDic_GetLastError: () => string;
  constructor() {
    const frameworkPath: string = `${unpackedPath}/vendor/AqUsrDic.framework/Versions/A/AqUsrDic`;
    const ptr_AqUsrDic_Import       = ffi().DynamicLibrary(frameworkPath).get('AqUsrDic_Import');
    const ptr_AqUsrDic_Export       = ffi().DynamicLibrary(frameworkPath).get('AqUsrDic_Export');
    const ptr_AqUsrDic_Check        = ffi().DynamicLibrary(frameworkPath).get('AqUsrDic_Check');
    const ptr_AqUsrDic_GetLastError = ffi().DynamicLibrary(frameworkPath).get('AqUsrDic_GetLastError');
    this.fn_AqUsrDic_Import         = ffi().ForeignFunction(ptr_AqUsrDic_Import, 'int', ['string', 'string']);
    this.fn_AqUsrDic_Export         = ffi().ForeignFunction(ptr_AqUsrDic_Export, 'int', ['string', 'string']);
    this.fn_AqUsrDic_Check          = ffi().ForeignFunction(ptr_AqUsrDic_Check, 'int', ['string', 'string', 'int']);
    this.fn_AqUsrDic_GetLastError   = ffi().ForeignFunction(ptr_AqUsrDic_GetLastError, 'string', []);
  }

  importDic(pathUserDic: string, pathDicCsv: string): number {
    return this.fn_AqUsrDic_Import(pathUserDic, pathDicCsv);
  }

  exportDic(pathUserDic: string, pathDicCsv: string): number {
    return this.fn_AqUsrDic_Export(pathUserDic, pathDicCsv);
  }

  check(surface: string, yomi: string, posCode: number): number {
    return this.fn_AqUsrDic_Check(surface, yomi, posCode);
  }

  getLastError(): string {
    return this.fn_AqUsrDic_GetLastError();
  }
}
angular.module('AqUsrDicServices')
  .service('AqUsrDicLib', [
    AqUsrDicLib,
  ]);

// AqUsrDicService
class AqUsrDicService implements yubo.AqUsrDicService {
  constructor(
    private aqUsrDicLib: yubo.AqUsrDicLib
  ) {}

  generateUserDict(inCsvPath: string, outUserDicPath: string): {success:boolean, message:string} {
    try {
      fs().chmodSync(outUserDicPath, 0o644); // chmod 644 if exists
    } catch (err) {
      fs().closeSync(fs().openSync(outUserDicPath, 'a+')); // create with 644 permission.
    }
    const result = this.aqUsrDicLib.importDic(outUserDicPath, inCsvPath);
    if (result == 0) {
      return {success:true, message:null};
    } else {
      const errorMsg = this.aqUsrDicLib.getLastError();
      return {success:false, message:errorMsg};
    }
  }

  generateCSV(inUserDicPath: string, outCsvPath: string): {success:boolean, message:string} {
    const result = this.aqUsrDicLib.exportDic(inUserDicPath, outCsvPath);
    if (result == 0) {
      return {success:true, message:null};
    } else {
      const errorMsg = this.aqUsrDicLib.getLastError();
      return {success:false, message:errorMsg};
    }
  }

  validateInput(surface: string, yomi: string, posCode: number): {success:boolean, message:string} {
    const result = this.aqUsrDicLib.check(surface, yomi, posCode);
    if (result == 0) {
      return {success:true, message:null};
    } else {
      const errorMsg = this.aqUsrDicLib.getLastError();
      return {success:false, message:errorMsg};
    }
  }

  getLastError(): string {
    return this.aqUsrDicLib.getLastError();
  }
}
angular.module('AqUsrDicServices')
  .service('AqUsrDicService', [
    'AqUsrDicLib',
    AqUsrDicService,
  ]);
