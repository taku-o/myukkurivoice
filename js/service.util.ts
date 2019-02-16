var _fs, fs     = () => { _fs = _fs || require('fs'); return _fs; };
var _path, path = () => { _path = _path || require('path'); return _path; };

// angular util service
angular.module('UtilServices', ['MessageServices'])
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

          const npList: number[] = [];
          files.forEach((file) => {
            try {
              if (pattern.test(file)) {
                const matched = pattern.exec(file);
                npList.push(Number(matched![1]));
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
            d.reject(new Error(`${limit}${'までファイルが作られているので、これ以上ファイルを作成できません。'}`)); return;
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

