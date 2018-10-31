"use strict";
var _storage, storage = function () { _storage = _storage || require('electron-json-storage'); return _storage; };
// angular data service
angular.module('yvoiceDataService', ['yvoiceMessageService', 'yvoiceModel'])
    .factory('DataService', ['$q', 'YVoice', 'YVoiceInitialData', 'MessageService',
    function ($q, YVoice, YVoiceInitialData, MessageService) {
        function uniqId() {
            return ('0000' + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
        }
        return {
            load: function () {
                var d = $q.defer();
                storage().get('data', function (error, data) {
                    if (error) {
                        MessageService.syserror('ボイス設定の読込に失敗しました。', error);
                        d.reject(error);
                        return;
                    }
                    if (Object.keys(data).length === 0) {
                        d.resolve([]);
                    }
                    else {
                        d.resolve(data);
                    }
                });
                return d.promise;
            },
            initialData: function () {
                var dataList = angular.copy(YVoiceInitialData);
                return dataList;
            },
            create: function () {
                var cloned = angular.copy(YVoice);
                cloned['id'] = uniqId();
                return cloned;
            },
            copy: function (original) {
                var cloned = angular.copy(original);
                cloned['id'] = uniqId();
                return cloned;
            },
            save: function (dataList) {
                var d = $q.defer();
                storage().set('data', dataList, function (error) {
                    if (error) {
                        MessageService.syserror('ボイス設定の保存に失敗しました。', error);
                        d.reject(error);
                        return;
                    }
                    MessageService.info('ボイス設定を保存しました。');
                    d.resolve(true);
                });
                return d.promise;
            },
            clear: function () {
                var d = $q.defer();
                storage().remove('data', function (error) {
                    if (error) {
                        MessageService.syserror('ボイス設定の削除に失敗しました。', error);
                        d.reject(error);
                        return;
                    }
                    MessageService.info('ボイス設定を削除しました。');
                    d.resolve(true);
                });
                return d.promise;
            }
        };
    }])
    .factory('MasterService', ['YPhontList', function (YPhontList) {
        var phontList = YPhontList;
        return {
            getPhontList: function () {
                return phontList;
            }
        };
    }]);
