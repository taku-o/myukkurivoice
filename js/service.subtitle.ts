var _fs: any, fs     = () => { _fs = _fs || require('fs'); return _fs; };
var _path: any, path = () => { _path = _path || require('path'); return _path; };

// angular subtitle service
angular.module('SubtitleServices', ['MessageServices']);

// TextSubtitleService
class TextSubtitleService implements yubo.TextSubtitleService {
  private readonly waveExt: string = '.wav';
  private readonly sourceExt: string = '.txt';
  constructor(
    private $q: ng.IQService,
    private MessageService: yubo.MessageService
  ) {}

  sourceFname(wavFilePath: string): string {
    const dir = path().dirname(wavFilePath);
    const basename = path().basename(wavFilePath, this.waveExt);
    const filename = basename + this.sourceExt;
    return path().join(dir, filename);
  }

  save(filePath: string, sourceText: string): ng.IPromise<string> {
    const d = this.$q.defer<string>();
    fs().writeFile(filePath, sourceText, 'utf-8', (err: Error) => {
      if (err) {
        this.MessageService.syserror('メッセージファイルの書き込みに失敗しました。', err);
        d.reject(err); return;
      }
      d.resolve(filePath);
    });
    return d.promise;
  }
}
angular.module('SubtitleServices')
  .service('TextSubtitleService', [
    '$q',
    'MessageService',
    TextSubtitleService,
  ]);