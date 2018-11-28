var _storage, storage = () => { _storage = _storage || require('electron-json-storage'); return _storage; };

// angular data service
angular.module('DataServices', ['MessageServices', 'mainModels'])
  .factory('DataService', ['$q', 'YVoice', 'YVoiceInitialData', 'MessageService', 
  ($q, YVoice: yubo.YVoice, YVoiceInitialData: yubo.YVoice[], MessageService: yubo.MessageService): yubo.DataService => {

    function uniqId(): string {
      return ('0000' + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4);
    }

    return {
      load: function(ok = null, ng = null): ng.IPromise<yubo.YVoice[]> {
        const d = $q.defer();
        storage().get('data', function(error: Error, data: yubo.YVoice[]) {
          if (error) {
            MessageService.syserror('ボイス設定の読込に失敗しました。', error);
            if (ng) { ng(error); }
            d.reject(error); return;
          }
          if (Object.keys(data).length === 0) {
            if (ok) { ok([]); }
            d.resolve([]);
          } else {
            if (ok) { ok(data); }
            d.resolve(data);
          }
        });
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
  }]);

