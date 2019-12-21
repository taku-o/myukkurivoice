var app = require('electron').remote.app;
var _log: any, log = () => { _log = _log || require('electron-log'); return _log; };

// angular security service
class SecurityService implements yubo.SecurityService {
  constructor(
    private $q,
    private BookmarkService: yubo.BookmarkService,
  ) {}

  saveBookmark(filePath: string, bookmark: string): ng.IPromise<boolean> {
alert(`save bookmark: ${filePath}, ${bookmark}`);
console.log(`save bookmark: ${filePath}, ${bookmark}`);
log().warn(`save bookmark: ${filePath}, ${bookmark}`);
    const d = this.$q.defer();
    if (!process.mas) {
      d.resolve(true); return d.promise;
    }

    this.BookmarkService.add(filePath, bookmark)
    .then((result: boolean) => {
      d.resolve(result); return d.promise;
    });
    return d.promise;
  }

  startAccessingSecurityScopedResource(filePath: string): ng.IPromise<Function> {
alert(`call startAccessingSecurityScopedResource`);
console.log(`call startAccessingSecurityScopedResource`);
log().warn(`call startAccessingSecurityScopedResource`);
    const d = this.$q.defer();
    if (!process.mas) {
      d.resolve(() => {}); return d.promise;
    }

    this.BookmarkService.get(filePath)
    .then((bookmark: string) => {
alert(`retribe bookmark: ${filePath}, ${bookmark}`);
console.log(`retribe bookmark: ${filePath}, ${bookmark}`);
log().warn(`retribe bookmark: ${filePath}, ${bookmark}`);
      if (!bookmark) {
        d.resolve(() => {}); return d.promise;
      }
      const stopAccessingSecurityScopedResource = app.startAccessingSecurityScopedResource(bookmark);
      d.resolve(stopAccessingSecurityScopedResource); return d.promise;
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
