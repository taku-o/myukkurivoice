var app = require('electron').remote.app;
var _storage, storage   = () => { _storage = _storage || require('electron-json-storage'); return _storage; };
var _lruCache, lruCache = () => { _lruCache = _lruCache || require('lru-cache'); return _lruCache; };
var _log, log           = () => { _log = _log || require('electron-log'); return _log; };
var _monitor, monitor   = () => { _monitor = _monitor || require('electron-performance-monitor'); return _monitor; };

var MONITOR = process.env.MONITOR != null;

// angular data service
angular.module('DataServices', ['MessageServices', 'mainModels'])
  .factory('DataService', ['$q', 'YVoice', 'YVoiceInitialData', 'MessageService', 
  ($q, YVoice: yubo.YVoice, YVoiceInitialData: yubo.YVoice[], MessageService: yubo.MessageService): yubo.DataService => {

    function uniqId(): string {
      return ('0000' + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4);
    }

    return {
      load: function(ok = null, ng = null): ng.IPromise<yubo.YVoice[]> {
        if (MONITOR) { log().warn(monitor().format('srv.data', 'data load called')); }
        const d = $q.defer();
        setTimeout(() => {
          const configPath = `${app.getPath('userData')}/data.json`;
          let data = null;
          try {
            data = require(configPath);
          } catch(error) {
            MessageService.syserror('ボイス設定の読込に失敗しました。', error);
            if (ng) { ng(error); }
            d.reject(error); return;
          }
          if (MONITOR) { log().warn(monitor().format('srv.data', 'data load done')); }
          if (Object.keys(data).length === 0) {
            if (ok) { ok([]); }
            d.resolve([]);
          } else {
            if (ok) { ok(data); }
            d.resolve(data);
          }
        }, 0);
        return d.promise;
      },
      initialData: function(): yubo.YVoice[] {
        const dataList = angular.copy(YVoiceInitialData);
        return dataList;
      },
      create: function(): yubo.YVoice {
        const cloned = angular.copy(YVoice);
        cloned['id'] = uniqId();
        return cloned;
      },
      copy: function(original: yubo.YVoice): yubo.YVoice {
        const cloned = angular.copy(original);
        cloned['id'] = uniqId();
        return cloned;
      },
      save: function(dataList: yubo.YVoice[]): ng.IPromise<boolean> {
        const d = $q.defer();
        storage().set('data', dataList, function(error: Error) {
          if (error) {
            MessageService.syserror('ボイス設定の保存に失敗しました。', error);
            d.reject(error); return;
          }
          MessageService.info('ボイス設定を保存しました。');
          d.resolve(true);
        });
        return d.promise;
      },
      clear: function(): ng.IPromise<boolean> {
        const d = $q.defer();
        storage().remove('data', function(error: Error) {
          if (error) {
            MessageService.syserror('ボイス設定の削除に失敗しました。', error);
            d.reject(error); return;
          }
          MessageService.info('ボイス設定を削除しました。');
          d.resolve(true);
        });
        return d.promise;
      },
    };
  }])
  .factory('MasterService', ['YPhontList', (YPhontList: yubo.YPhont[]): yubo.MasterService => {
    const phontList = YPhontList;
    return {
      getPhontList: function(): yubo.YPhont[] {
        return phontList;
      },
    };
  }])
  .factory('HistoryService', ['$q', ($q): yubo.HistoryService => {
    const MS_MAX_AGE = 1000 * 60 * 60 * 24 * 30; // 30 days
    let _cache;
    function cache(): any {
      if (! _cache) {
        _cache = new (lruCache())({max: 20});
      }
      return _cache;
    }

    return {
      load: function(): ng.IPromise<any> {
        if (MONITOR) { log().warn(monitor().format('srv.data', 'hist load called')); }
        const d = $q.defer();
        setTimeout(() => {
          const configPath = `${app.getPath('userData')}/history.json`;
          let data = null;
          try {
            data = require(configPath);
          } catch(error) {
            d.reject(error); return;
          }
          if (MONITOR) { log().warn(monitor().format('srv.data', 'hist load done')); }
          cache().load(data);
          d.resolve(cache());
        }, 0);
        return d.promise;
      },
      save: function(): ng.IPromise<boolean> {
        const d = $q.defer();
        const data = cache().dump();
        storage().set('history', data, function(err: Error) {
          if (err) {
            d.reject(err); return;
          }
          d.resolve(true);
        });
        return d.promise;
      },
      clear: function(): ng.IPromise<boolean> {
        const d = $q.defer();
        cache().reset();
        storage().remove('history', function(err: Error) {
          if (err) {
            d.reject(err); return;
          }
          d.resolve(true);
        });
        return d.promise;
      },
      get: function(wavFilePath: string): yubo.IRecordMessage {
        const r = cache().get(wavFilePath);
        return r;
      },
      add: function(record: yubo.IRecordMessage): void {
        cache().set(record.wavFilePath, record, MS_MAX_AGE);
      },
      getList: function(): yubo.IRecordMessage[] {
        const historyList = cache().values();
        historyList.sort((a, b) => {
          if (a.created > b.created) {
              return -1;
          } else if (a.created < b.created) {
              return 1;
          } else {
              return 0;
          }
        });
        return historyList;
      },
    };
  }]);

