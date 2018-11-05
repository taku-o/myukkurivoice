"use strict";
var _path, path = function () { _path = _path || require('path'); return _path; };
// angular message service
angular.module('yvoiceMessageService', [])
    .factory('MessageService', ['$rootScope', function ($rootScope) {
        return {
            action: function (message) {
                var post = {
                    created: new Date(),
                    body: message,
                    type: 'action'
                };
                $rootScope.$broadcast('message', post);
            },
            record: function (message, wavFilePath, srcTextPath) {
                var wavFileName = path().basename(wavFilePath);
                var post = {
                    created: new Date(),
                    body: message,
                    wavFilePath: wavFilePath,
                    wavFileName: wavFileName,
                    srcTextPath: srcTextPath,
                    quickLookPath: wavFilePath,
                    type: 'record'
                };
                $rootScope.$broadcast('message', post);
                $rootScope.$broadcast('wavGenerated', post);
            },
            recordSource: function (message, srcTextPath) {
                var post = {
                    created: new Date(),
                    body: message,
                    srcTextPath: srcTextPath,
                    quickLookPath: srcTextPath,
                    type: 'source'
                };
                $rootScope.$broadcast('message', post);
            },
            info: function (message) {
                var post = {
                    created: new Date(),
                    body: message,
                    type: 'info'
                };
                $rootScope.$broadcast('message', post);
            },
            error: function (message, err) {
                if (err === void 0) { err = null; }
                if (err) {
                    message = message + err.message;
                }
                var post = {
                    created: new Date(),
                    body: message,
                    type: 'error'
                };
                $rootScope.$broadcast('message', post);
            },
            syserror: function (message, err) {
                if (err === void 0) { err = null; }
                if (err) {
                    message = message + err.message;
                }
                var post = {
                    created: new Date(),
                    body: message,
                    type: 'syserror'
                };
                $rootScope.$broadcast('message', post);
            }
        };
    }]);
