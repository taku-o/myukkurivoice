var _fs: any, fs     = () => { _fs = _fs || require('fs'); return _fs; };
var _path: any, path = () => { _path = _path || require('path'); return _path; };

// angular util service
angular.module('UtilServices', ['MessageServices']);

// SeqFNameService
class SeqFNameService implements yubo.SeqFNameService {
  private readonly ext: string = '.wav';
  private readonly numPattern: string = '[0-9]{4}';
  private readonly limit: number = 9999;
  constructor(
    private $q: ng.IQService,
    private MessageService: yubo.MessageService
  ) {}

  splitFname(filePath: string): {dir: string, basename: string} {
    const dir = path().dirname(filePath);
    const basename = path().basename(filePath, this.ext);
    return {
      dir: dir,
      basename: basename,
    };
  }

  nextFname(prefix: string, num: number): string {
    const formatted = ('0000'+ num).slice(-4);
    return prefix + formatted + this.ext;
  }

  nextNumber(dir: string, prefix: string): ng.IPromise<number> {
    const d = this.$q.defer<number>();
    fs().readdir(dir, (err: Error, files: string[]) => {
      if (err) {
        this.MessageService.syserror('ディレクトリを参照できませんでした。', err);
        return d.reject(err);
      }

      const pattern = new RegExp(`^${prefix}(${this.numPattern})${this.ext}$`);

      const npList: number[] = [];
      files.forEach((file) => {
        try {
          if (pattern.test(file)) {
            const matched = pattern.exec(file);
            npList.push(Number(matched![1]));
          }
        } catch(err) {
          if (err.code != 'ENOENT') {
            this.MessageService.syserror('ファイル参照時にエラーが起きました。', err);
            return d.reject(err);
          }
        }
      });
      if (npList.length < 1) {
        return d.resolve(0);
      }

      const maxNum = Math.max.apply(null, npList);
      if (maxNum >= this.limit) {
        this.MessageService.syserror(`${this.limit}${'までファイルが作られているので、これ以上ファイルを作成できません。'}`);
        return d.reject(new Error(`${this.limit}${'までファイルが作られているので、これ以上ファイルを作成できません。'}`));
      }
      const next = maxNum + 1;
      return d.resolve(next);
    });
    return d.promise;
  }
}
angular.module('UtilServices')
  .service('SeqFNameService', [
    '$q',
    'MessageService',
    SeqFNameService,
  ]);

// AppUtilService
class AppUtilService implements yubo.AppUtilService {
  constructor(
    private $rootScope: ng.IRootScopeService
  ) {}

  disableRhythm(encoded: string): string {
    return encoded.replace(/['/]/g, '');
  }

  reportDuration(duration: number): void {
    this.$rootScope.$broadcast('duration', duration);
  }
}
angular.module('UtilServices')
  .service('AppUtilService', [
    '$rootScope',
    AppUtilService,
  ]);
