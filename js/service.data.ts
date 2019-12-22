var app = require('electron').remote.app;
var _storage: any, storage   = () => { _storage = _storage || require('electron-json-storage'); return _storage; };
var _lruCache: any, lruCache = () => { _lruCache = _lruCache || require('lru-cache'); return _lruCache; };
var _log: any, log           = () => { _log = _log || require('electron-log'); return _log; };
var _uniqid: any, uniqid     = () => { _uniqid = _uniqid || require('uniqid'); return _uniqid; };
var _monitor: any, monitor   = () => { _monitor = _monitor || require('electron-performance-monitor'); return _monitor; };

var MONITOR = process.env.MONITOR != null;

// angular data service
angular.module('DataServices', ['MessageServices', 'mainModels']);

// DataService
class DataService implements yubo.DataService {
  constructor(
    private $q: ng.IQService,
    private $timeout: ng.ITimeoutService,
    private YVoice: yubo.YVoice,
    private YVoiceInitialData: yubo.YVoice[],
    private MessageService: yubo.MessageService
  ) {}

  load(ok: (dataList: yubo.YVoice[]) => void, ng: (err: Error) => void): ng.IPromise<yubo.YVoice[]> {
    if (MONITOR) { log().warn(monitor().format('srv.data', 'data load called')); }
    const d = this.$q.defer<yubo.YVoice[]>();
    this.$timeout(() => {
      const configPath = `${app.getPath('userData')}/data.json`;
      let data: yubo.YVoice[] = null;
      try {
        data = require(configPath);
      } catch(error) {
        data = [];
      }
      delete require.cache[configPath];

      if (MONITOR) { log().warn(monitor().format('srv.data', 'data load done')); }
      if (Object.keys(data).length === 0) {
        if (ok) { ok([]); }
        d.resolve([]);
      } else {
        if (ok) { ok(data); }
        d.resolve(data);
      }
    }, 0, false);
    return d.promise;
  }

  initialData(): yubo.YVoice[] {
    const dataList = angular.copy(this.YVoiceInitialData);
    return dataList;
  }

  create(): yubo.YVoice {
    const cloned = angular.copy(this.YVoice);
    cloned['id'] = uniqid()();
    return cloned;
  }

  copy(original: yubo.YVoice): yubo.YVoice {
    const cloned = angular.copy(original);
    cloned['id'] = uniqid()();
    return cloned;
  }

  save(dataList: yubo.YVoice[]): ng.IPromise<boolean> {
    const d = this.$q.defer<boolean>();
    storage().set('data', dataList, (error: Error) => {
      if (error) {
        this.MessageService.syserror('ボイス設定の保存に失敗しました。', error);
        d.reject(error); return;
      }
      this.MessageService.info('ボイス設定を保存しました。');
      d.resolve(true);
    });
    return d.promise;
  }

  clear(): ng.IPromise<boolean> {
    const d = this.$q.defer<boolean>();
    storage().remove('data', (error: Error) => {
      if (error) {
        this.MessageService.syserror('ボイス設定の削除に失敗しました。', error);
        d.reject(error); return;
      }
      this.MessageService.info('ボイス設定を削除しました。');
      d.resolve(true);
    });
    return d.promise;
  }
}
angular.module('DataServices')
  .service('DataService', [
    '$q',
    '$timeout',
    'YVoice',
    'YVoiceInitialData',
    'MessageService',
    DataService,
  ]);

// HistoryService
class HistoryService implements yubo.HistoryService {
  private readonly MS_MAX_AGE: number = 1000 * 60 * 60 * 24 * 30; // 30 days
  private _cache: LRUCache.Cache;
  constructor(
    private $q: ng.IQService,
    private $timeout: ng.ITimeoutService
  ) {}

  private cache(): LRUCache.Cache {
    if (! this._cache) {
      this._cache = new (lruCache())({max: 20});
    }
    return this._cache;
  }

  private _loaded: boolean = false;
  load(): ng.IPromise<LRUCache.Cache> {
    if (MONITOR) { log().warn(monitor().format('srv.data', 'hist load called')); }
    const d = this.$q.defer<LRUCache.Cache>();
    //this.$timeout(() => {
      const configPath = `${app.getPath('userData')}/history.json`;
      let data: yubo.IRecordMessage[] = null;
      try {
        data = require(configPath);
      } catch(error) {
        data = [];
      }
      delete require.cache[configPath];

      if (MONITOR) { log().warn(monitor().format('srv.data', 'hist load done')); }
      this.cache().load(data);
      this._loaded = true;
      d.resolve(this.cache());
    //}, 0, false);
    return d.promise;
  }

  loaded(): boolean {
    return this._loaded;
  }

  save(): ng.IPromise<boolean> {
    const d = this.$q.defer<boolean>();
    const data = this.cache().dump();
    storage().set('history', data, (err: Error) => {
      if (err) {
        d.reject(err); return;
      }
      d.resolve(true);
    });
    return d.promise;
  }

  clear(): ng.IPromise<boolean> {
    const d = this.$q.defer<boolean>();
    this.cache().reset();
    storage().remove('history', (err: Error) => {
      if (err) {
        d.reject(err); return;
      }
      d.resolve(true);
    });
    return d.promise;
  }

  get(wavFilePath: string): yubo.IRecordMessage {
    const r = this.cache().get(wavFilePath);
    return r;
  }

  add(record: yubo.IRecordMessage): void {
    this.cache().set(record.wavFilePath, record, this.MS_MAX_AGE);
  }

  getList(): yubo.IRecordMessage[] {
    const historyList = this.cache().values();
    historyList.sort((a: yubo.IRecordMessage, b: yubo.IRecordMessage) => {
      if (a.created > b.created) {
          return -1;
      } else if (a.created < b.created) {
          return 1;
      } else {
          return 0;
      }
    });
    return historyList;
  }
}
angular.module('DataServices')
  .service('HistoryService', [
    '$q',
    '$timeout',
    HistoryService,
  ]);

// BookmarkService
class BookmarkService implements yubo.BookmarkService {
  private isLoaded: boolean = false;
  private bookmarkMap: {[key: string]: string} = {};
  constructor(
    private $q: ng.IQService,
  ) {}

  load(): ng.IPromise<boolean> {
    const d = this.$q.defer<boolean>();
    if (this.isLoaded) {
      d.resolve(true); return d.promise;
    }

    storage().get('bookmark', (error, data) => {
      if (error) {
        d.reject(error); return;
      }
      if (data) {
        this.bookmarkMap = data;
      }
      this.isLoaded = true;
      d.resolve(true);
    });
    return d.promise;
  }

  add(filePath: string, bookmark: string): ng.IPromise<boolean> {
    const d = this.$q.defer<boolean>();
    if (!bookmark) {
      d.resolve(true); return d.promise;
    }

    Promise.resolve(true).then(() => {
      return this.isLoaded?
        true:
        this.load();
    })
    .then(() => {
      this.bookmarkMap[filePath] = bookmark;
      d.resolve(true);
    });
    return d.promise;
  }

  get(filePath: string): ng.IPromise<string> {
    const d = this.$q.defer<string>();

    Promise.resolve(true).then(() => {
      return this.isLoaded?
        true:
        this.load();
    })
    .then(() => {
      const bookmark: string = this.bookmarkMap[filePath];
      d.resolve(bookmark);
    });
    return d.promise;
  }

  clear(): ng.IPromise<boolean> {
    const d = this.$q.defer<boolean>();
    storage().remove('bookmark', (error) => {
      if (error) {
        d.reject(error); return;
      }
      this.bookmarkMap = {};
      d.resolve(true);
    });
    return d.promise;
  }

  prune(filePaths: string[]): ng.IPromise<boolean> {
    const d = this.$q.defer<boolean>();

    Promise.resolve(true).then(() => {
      return this.isLoaded?
        true:
        this.load();
    })
    .then(() => {
      const resultMap = {};
      for (let fp of filePaths) {
        const bookmark = this.bookmarkMap[fp];
        if (bookmark) {
          resultMap[fp] = bookmark;
        }
      }

      storage().set('bookmark', resultMap, (error: Error) => {
        if (error) {
          d.reject(error); return;
        }
        this.bookmarkMap = resultMap;
        d.resolve(true);
      });
    });
    return d.promise;
  }
}
angular.module('DataServices')
  .service('BookmarkService', [
    '$q',
    BookmarkService,
  ]);

