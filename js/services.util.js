"use strict";
var _fs, fs = function () { _fs = _fs || require('fs'); return _fs; };
var _path, path = function () { _path = _path || require('path'); return _path; };
// angular util service
angular.module('yvoiceUtilService', ['yvoiceMessageService'])
    .factory('AudioSourceService', ['$q', 'MessageService', function ($q, MessageService) {
        var waveExt = '.wav';
        var sourceExt = '.txt';
        return {
            sourceFname: function (wavFilePath) {
                var dir = path().dirname(wavFilePath);
                var basename = path().basename(wavFilePath, waveExt);
                var filename = basename + sourceExt;
                return path().join(dir, filename);
            },
            save: function (filePath, sourceText) {
                var d = $q.defer();
                fs().writeFile(filePath, sourceText, 'utf-8', function (err) {
                    if (err) {
                        MessageService.syserror('メッセージファイルの書き込みに失敗しました。', err);
                        d.reject(err);
                        return;
                    }
                    d.resolve(filePath);
                });
                return d.promise;
            }
        };
    }])
    .factory('SeqFNameService', ['$q', 'MessageService', function ($q, MessageService) {
        var ext = '.wav';
        var numPattern = '[0-9]{4}';
        var limit = 9999;
        return {
            splitFname: function (filePath) {
                var dir = path().dirname(filePath);
                var basename = path().basename(filePath, ext);
                return {
                    dir: dir,
                    basename: basename
                };
            },
            nextFname: function (prefix, num) {
                var formatted = ('0000' + num).slice(-4);
                return prefix + formatted + ext;
            },
            nextNumber: function (dir, prefix) {
                var d = $q.defer();
                fs().readdir(dir, function (err, files) {
                    if (err) {
                        MessageService.syserror('ディレクトリを参照できませんでした。', err);
                        d.reject(err);
                        return;
                    }
                    var pattern = new RegExp("^" + prefix + "(" + numPattern + ")" + ext + "$");
                    var npList = [];
                    files.forEach(function (file) {
                        try {
                            if (pattern.test(file)) {
                                var matched = pattern.exec(file);
                                npList.push(Number(matched[1]));
                            }
                        }
                        catch (err) {
                            if (err.code != 'ENOENT') {
                                MessageService.syserror('ファイル参照時にエラーが起きました。', err);
                                d.reject(err);
                                return;
                            }
                        }
                    });
                    if (npList.length < 1) {
                        d.resolve(0);
                        return;
                    }
                    var maxNum = Math.max.apply(null, npList);
                    if (maxNum >= limit) {
                        MessageService.syserror("" + limit + 'までファイルが作られているので、これ以上ファイルを作成できません。');
                        d.reject(new Error("" + limit + 'までファイルが作られているので、これ以上ファイルを作成できません。'));
                        return;
                    }
                    var next = maxNum + 1;
                    d.resolve(next);
                });
                return d.promise;
            }
        };
    }])
    .factory('AppUtilService', ['$rootScope', function ($rootScope) {
        return {
            disableRhythm: function (encoded) {
                return encoded.replace(/['/]/g, '');
            },
            reportDuration: function (duration) {
                $rootScope.$broadcast('duration', duration);
            }
        };
    }]);
