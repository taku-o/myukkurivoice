var app = require('electron').remote.app;
var _log: any, log = () => { _log = _log || require('electron-log'); return _log; };

// env
var DEBUG = process.env.DEBUG != null;

// angular security service
class SecurityService implements yubo.SecurityService {
  constructor(
    private $q,
    private BookmarkService: yubo.BookmarkService,
  ) {}

  addBookmark(filePath: string, bookmark: string): ng.IPromise<boolean> {
    if (DEBUG) { log().info(`call addBookmark(): ${filePath}, ${bookmark}`); }
    const d = this.$q.defer();
    if (!process.mas) {
      d.resolve(true); return d.promise;
    }

    this.BookmarkService.add(filePath, bookmark)
    .then((result: boolean) => {
      if (DEBUG) { log().info('in addBookmark(), add bookmark.'); }
      return d.resolve(result);
    });
    return d.promise;
  }

  clearBookmark(): ng.IPromise<boolean> {
    if (DEBUG) { log().info(`call clearBookmark()`); }
    return this.BookmarkService.clear();
  }

  saveBookmark(yvoiceList: yubo.YVoice[]): ng.IPromise<boolean> {
    if (DEBUG) { log().info(`call saveBookmark()`); }
    const d = this.$q.defer();
    const dirs = [];
    for (let yvoice of yvoiceList) {
      let dir = yvoice.seqWriteOptions.dir;
      dirs.push(dir);
    }
    this.BookmarkService.prune(dirs)
    .then((result: boolean) => {
      if (DEBUG) { log().info(`in saveBookmark(), prune bookmarks`); }
      d.resolve(result);
    });
    return d.promise;
  }

  startAccessingSecurityScopedResource(filePath: string): ng.IPromise<Function> {
    if (DEBUG) { log().info(`call startAccessingSecurityScopedResource(): ${filePath}`); }
    const d = this.$q.defer();
    if (!process.mas) {
      d.resolve(() => {}); return d.promise;
    }

    this.BookmarkService.get(filePath)
    .then((bookmark: string) => {
      if (!bookmark) {
        if (DEBUG) { log().info('in startAccessingSecurityScopedResource(), can not get bookmark.'); }
        return d.resolve(() => {});
      }

      if (DEBUG) { log().info('in startAccessingSecurityScopedResource(), get bookmark.'); }
      const stopAccessingSecurityScopedResource = app.startAccessingSecurityScopedResource(bookmark);
      return d.resolve(stopAccessingSecurityScopedResource);
    });
    return d.promise;
  }
}

angular.module('SecurityService', ['DataServices'])
  .service('SecurityService', [
    '$q',
    'BookmarkService',
    SecurityService,
  ]);
