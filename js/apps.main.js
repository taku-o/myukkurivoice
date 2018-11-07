"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var app = require('electron').remote.app;
var _ipcRenderer, ipcRenderer = function () { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };
var _clipboard, clipboard = function () { _clipboard = _clipboard || require('electron').clipboard; return _clipboard; };
var _path, path = function () { _path = _path || require('path'); return _path; };
var _fs, fs = function () { _fs = _fs || require('fs'); return _fs; };
var _log, log = function () { _log = _log || require('electron-log'); return _log; };
// application settings
var desktopDir = app.getPath('desktop');
// handle uncaughtException
process.on('uncaughtException', function (err) {
    log().error('main:event:uncaughtException');
    log().error(err);
    log().error(err.stack);
});
// angular app
angular.module('yvoiceApp', ['input-highlight', 'yvoiceDirective', 'yvoiceService', 'yvoiceModel'])
    .config(['$qProvider', function ($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
    }])
    // controller
    .controller('MainController', ['$scope', '$timeout', '$q', 'MessageService', 'DataService', 'MasterService', 'AquesService',
    'AudioService1', 'AudioService2', 'AudioSourceService', 'SeqFNameService', 'AppUtilService', 'CommandService', 'IntroService',
    'YInput', 'YInputInitialData',
    function ($scope, $timeout, $q, MessageService, DataService, MasterService, AquesService, audioServVer1, audioServVer2, AudioSourceService, SeqFNameService, AppUtilService, CommandService, IntroService, YInput, YInputInitialData) {
        // event listener
        $scope.$on('message', function (event, message) {
            $scope.messageList.unshift(message);
            while ($scope.messageList.length > 5) {
                $scope.messageList.pop();
            }
            $timeout(function () { $scope.$apply(); });
        });
        $scope.$on('wavGenerated', function (event, wavFileInfo) {
            $scope.lastWavFile = wavFileInfo;
            $timeout(function () { $scope.$apply(); });
        });
        $scope.$on('duration', function (event, duration) {
            $scope.duration = duration;
            $timeout(function () { $scope.$apply(); });
        });
        // shortcut
        ipcRenderer().on('shortcut', function (event, action) {
            switch (action) {
                case 'play':
                    document.getElementById('play').click();
                    break;
                case 'stop':
                    document.getElementById('stop').click();
                    break;
                case 'record':
                    document.getElementById('record').click();
                    break;
                case 'fromClipboard':
                    document.getElementById('from-clipboard').click();
                    break;
                case 'putVoiceName':
                    ctrl.putVoiceName();
                    break;
                case 'moveToSource':
                    document.getElementById('source').focus();
                    break;
                case 'moveToEncoded':
                    document.getElementById('encoded').focus();
                    break;
                case 'swichNextConfig':
                    {
                        var indexToN = $scope.yvoiceList.indexOf($scope.yvoice);
                        if ($scope.yvoiceList.length > indexToN + 1) {
                            $scope.yvoice = $scope.yvoiceList[indexToN + 1];
                        }
                        else {
                            $scope.yvoice = $scope.yvoiceList[0];
                        }
                        $scope.display = 'main';
                        $timeout(function () { $scope.$apply(); });
                    }
                    break;
                case 'swichPreviousConfig':
                    {
                        var indexToP = $scope.yvoiceList.indexOf($scope.yvoice);
                        if (indexToP - 1 >= 0) {
                            $scope.yvoice = $scope.yvoiceList[indexToP - 1];
                        }
                        else {
                            $scope.yvoice = $scope.yvoiceList[$scope.yvoiceList.length - 1];
                        }
                        $scope.display = 'main';
                        $timeout(function () { $scope.$apply(); });
                    }
                    break;
                case 'encode':
                    document.getElementById('encode').click();
                    break;
            }
        });
        // menu
        ipcRenderer().on('menu', function (event, action) {
            switch (action) {
                case 'clear':
                    document.getElementById('clear').click();
                    $timeout(function () { $scope.$apply(); });
                    break;
                case 'plus':
                    document.getElementById('plus').click();
                    $timeout(function () { $scope.$apply(); });
                    break;
                case 'minus':
                    {
                        var indexForM = $scope.yvoiceList.indexOf($scope.yvoice);
                        ctrl.minus(indexForM);
                        $timeout(function () { $scope.$apply(); });
                    }
                    break;
                case 'copy':
                    {
                        var indexForCP = $scope.yvoiceList.indexOf($scope.yvoice);
                        ctrl.copy(indexForCP);
                        $timeout(function () { $scope.$apply(); });
                    }
                    break;
                case 'save':
                    document.getElementById('save').click();
                    break;
                case 'reset':
                    ctrl.reset();
                    break;
                case 'shortcut':
                    document.getElementById('shortcut').click();
                    break;
                case 'tutorial':
                    document.getElementById('tutorial').click();
                    break;
                case 'devtron':
                    require('devtron').install();
                    break;
            }
        });
        // dropTextFile event
        ipcRenderer().on('dropTextFile', function (event, filePath) {
            fs().readFile(filePath, 'utf-8', function (err, data) {
                if (err) {
                    MessageService.error('テキストファイルを読み込めませんでした。', err);
                    return;
                }
                if ($scope.yinput) {
                    var win = require('electron').remote.getCurrentWindow();
                    win.focus();
                    $scope.yinput.source = data;
                    $timeout(function () { $scope.$apply(); });
                }
            });
        });
        // application settings
        var appCfg = require('electron').remote.getGlobal('appCfg');
        var AudioService = appCfg.audioServVer == 'html5audio' ? audioServVer1 : audioServVer2;
        $scope.appCfg = appCfg;
        // init
        var ctrl = this;
        $scope.display = 'main';
        $scope.phontList = MasterService.getPhontList();
        $scope.aq10BasList = [{ name: 'F1E', id: 0 }, { name: 'F2E', id: 1 }, { name: 'M1E', id: 2 }];
        $scope.yinput = angular.copy(YInput);
        $scope.messageList = [];
        $scope.lastWavFile = null;
        $scope.alwaysOnTop = false;
        $scope.isTest = appCfg.isTest;
        loadData();
        // util
        function loadData() {
            DataService.load().then(function (dataList) {
                if (dataList.length < 1) {
                    MessageService.info('初期データを読み込みます。');
                    dataList = DataService.initialData();
                }
                $scope.yvoiceList = dataList;
                $scope.yvoice = $scope.yvoiceList[0];
                $timeout(function () { $scope.$apply(); });
            });
        }
        function selectedSource() {
            var textarea = document.getElementById('source');
            var start = textarea.selectionStart;
            var end = textarea.selectionEnd;
            var selectedText = textarea.value.substring(start, end);
            return selectedText;
        }
        function selectedEncoded() {
            var textarea = document.getElementById('encoded');
            var start = textarea.selectionStart;
            var end = textarea.selectionEnd;
            var selectedText = textarea.value.substring(start, end);
            return selectedText;
        }
        // selected text highlight
        $scope.sourceHighlight = {
            '#619FFF': '{{ sourceHighlight["#619FFF"] }}'
        };
        $scope.encodedHighlight = {
            '#619FFF': '{{ encodedHighlight["#619FFF"] }}'
        };
        ctrl.blurOnSource = function () {
            $scope.sourceHighlight['#619FFF'] = selectedSource();
        };
        ctrl.blurOnEncoded = function () {
            $scope.encodedHighlight['#619FFF'] = selectedEncoded();
        };
        ctrl.focusOnSource = function () {
            clearSourceSelection();
            clearEncodedSelection();
        };
        ctrl.focusOnEncoded = function () {
            clearSourceSelection();
            clearEncodedSelection();
        };
        function clearSourceSelection() {
            $scope.sourceHighlight['#619FFF'] = '';
            var textarea = document.getElementById('source');
            textarea.selectionStart = 0;
            textarea.selectionEnd = 0;
        }
        function clearEncodedSelection() {
            $scope.encodedHighlight['#619FFF'] = '';
            var textarea = document.getElementById('encoded');
            textarea.selectionStart = 0;
            textarea.selectionEnd = 0;
        }
        // list box selection changed
        ctrl.onChangePhont = function () {
            var phont = null;
            angular.forEach($scope.phontList, function (value, key) {
                if (value.id == $scope.yvoice.phont) {
                    phont = value;
                }
            });
            if (!phont) {
                return;
            }
            $scope.yvoice.version = phont.version;
            if (phont.version == 'talk10') {
                $scope.yvoice.bas = phont.struct.bas;
                $scope.yvoice.pit = phont.struct.pit;
                $scope.yvoice.acc = phont.struct.acc;
                $scope.yvoice.lmd = phont.struct.lmd;
                $scope.yvoice.fsc = phont.struct.fsc;
            }
            else {
                delete $scope.yvoice.bas;
                delete $scope.yvoice.pit;
                delete $scope.yvoice.acc;
                delete $scope.yvoice.lmd;
                delete $scope.yvoice.fsc;
            }
        };
        // action
        ctrl.play = function () {
            return __awaiter(this, void 0, void 0, function () {
                var encoded, _selectedEncoded, source, _selectedSource, parsedListForEnc, _i, parsedListForEnc_1, cinput, _a, i, parsedList;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            MessageService.action('start to play voice.');
                            if (!$scope.yinput.source && !$scope.yinput.encoded) {
                                MessageService.error('メッセージ、音記号列、どちらも入力されていません。');
                                return [2 /*return*/, false];
                            }
                            encoded = $scope.yinput.encoded;
                            _selectedEncoded = selectedEncoded();
                            if (_selectedEncoded) {
                                encoded = _selectedEncoded;
                                clearSourceSelection();
                            }
                            if (!!encoded) return [3 /*break*/, 7];
                            source = $scope.yinput.source;
                            _selectedSource = selectedSource();
                            if (_selectedSource) {
                                source = _selectedSource;
                            }
                            if (!CommandService.containsCommand(source, $scope.yvoiceList)) return [3 /*break*/, 5];
                            parsedListForEnc = CommandService.parseInput(source, $scope.yvoiceList, $scope.yvoice);
                            _i = 0, parsedListForEnc_1 = parsedListForEnc;
                            _b.label = 1;
                        case 1:
                            if (!(_i < parsedListForEnc_1.length)) return [3 /*break*/, 4];
                            cinput = parsedListForEnc_1[_i];
                            _a = cinput;
                            return [4 /*yield*/, AquesService.encode(cinput.text)];
                        case 2:
                            _a.text = _b.sent();
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            for (i = 0; i < parsedListForEnc.length; i++) {
                                if (!parsedListForEnc[i].text) {
                                    MessageService.error('一部テキストを音記号列に変換できませんでした。');
                                    return [2 /*return*/, false];
                                }
                            }
                            encoded = CommandService.toString(parsedListForEnc);
                            return [3 /*break*/, 7];
                        case 5: return [4 /*yield*/, AquesService.encode(source)];
                        case 6:
                            encoded = _b.sent();
                            if (!encoded) {
                                MessageService.error('音記号列に変換できませんでした。');
                                return [2 /*return*/, false];
                            }
                            _b.label = 7;
                        case 7:
                            parsedList = CommandService.parseInput(encoded, $scope.yvoiceList, $scope.yvoice);
                            parsedList.reduce(function (p, cinput) {
                                if (p.then === undefined) {
                                    p.resolve();
                                    p = p.promise;
                                }
                                return p.then(function () {
                                    return playEach(cinput);
                                });
                            }, $q.defer());
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        function playEach(cinput) {
            var d = $q.defer();
            var encoded = cinput.text;
            var yvoice = CommandService.detectVoiceConfig(cinput, $scope.yvoiceList);
            // phont
            var phont = null;
            angular.forEach($scope.phontList, function (value, key) {
                if (value.id == yvoice.phont) {
                    phont = value;
                }
            });
            if (!phont) {
                MessageService.error('声の種類が未指定です。');
                d.reject(null);
                return d.promise;
            }
            // disable rhythm if option is on
            if (!yvoice.rhythmOn) {
                encoded = AppUtilService.disableRhythm(encoded);
            }
            var speed = yvoice.speed;
            if (!(Number(yvoice.writeMarginMs) === parseInt("" + yvoice.writeMarginMs))) {
                yvoice.writeMarginMs = 150;
            }
            var waveOptions = {
                passPhrase: appCfg.passPhrase,
                aq10UseKeyEncrypted: appCfg.aq10UseKeyEncrypted
            };
            if (phont.version == 'talk10') {
                waveOptions.bas = yvoice.bas;
                waveOptions.pit = yvoice.pit;
                waveOptions.acc = yvoice.acc;
                waveOptions.lmd = yvoice.lmd;
                waveOptions.fsc = yvoice.fsc;
            }
            var playOptions = {
                volume: yvoice.volume,
                playbackRate: yvoice.playbackRate,
                detune: yvoice.detune,
                writeMarginMs: yvoice.writeMarginMs
            };
            AquesService.wave(encoded, phont, speed, waveOptions).then(function (bufWav) {
                return AudioService.play(bufWav, playOptions).then(function () {
                    d.resolve('ok');
                })["catch"](function (err) {
                    MessageService.error('音声データを再生できませんでした。', err);
                    d.reject(err);
                });
            })["catch"](function (err) {
                MessageService.error('音声データを作成できませんでした。', err);
                d.reject(err);
            });
            return d.promise;
        }
        ctrl.stop = function () {
            MessageService.action('stop playing voice.');
            AudioService.stop();
        };
        ctrl.record = function () {
            return __awaiter(this, void 0, void 0, function () {
                var phont, encoded, _selectedEncoded, source, _selectedSource, parsedListForEnc, _i, parsedListForEnc_2, cinput, _a, i, dir_1, prefix_1, parsedList, sourceFname_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            MessageService.action('record voice.');
                            if (!$scope.yinput.source && !$scope.yinput.encoded) {
                                MessageService.error('メッセージ、音記号列、どちらも入力されていません。');
                                return [2 /*return*/, false];
                            }
                            phont = null;
                            angular.forEach($scope.phontList, function (value, key) {
                                if (value.id == $scope.yvoice.phont) {
                                    phont = value;
                                }
                            });
                            if (!phont) {
                                MessageService.error('声の種類が未指定です。');
                                return [2 /*return*/, false];
                            }
                            encoded = $scope.yinput.encoded;
                            _selectedEncoded = selectedEncoded();
                            if (_selectedEncoded) {
                                encoded = _selectedEncoded;
                                clearSourceSelection();
                            }
                            if (!!encoded) return [3 /*break*/, 7];
                            source = $scope.yinput.source;
                            _selectedSource = selectedSource();
                            if (_selectedSource) {
                                source = _selectedSource;
                            }
                            if (!CommandService.containsCommand(source, $scope.yvoiceList)) return [3 /*break*/, 5];
                            parsedListForEnc = CommandService.parseInput(source, $scope.yvoiceList, $scope.yvoice);
                            _i = 0, parsedListForEnc_2 = parsedListForEnc;
                            _b.label = 1;
                        case 1:
                            if (!(_i < parsedListForEnc_2.length)) return [3 /*break*/, 4];
                            cinput = parsedListForEnc_2[_i];
                            _a = cinput;
                            return [4 /*yield*/, AquesService.encode(cinput.text)];
                        case 2:
                            _a.text = _b.sent();
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            for (i = 0; i < parsedListForEnc.length; i++) {
                                if (!parsedListForEnc[i].text) {
                                    MessageService.error('一部テキストを音記号列に変換できませんでした。');
                                    return [2 /*return*/, false];
                                }
                            }
                            encoded = CommandService.toString(parsedListForEnc);
                            return [3 /*break*/, 7];
                        case 5: return [4 /*yield*/, AquesService.encode(source)];
                        case 6:
                            encoded = _b.sent();
                            if (!encoded) {
                                MessageService.error('音記号列に変換できませんでした。');
                                return [2 /*return*/, false];
                            }
                            _b.label = 7;
                        case 7:
                            // 連番保存
                            if ($scope.yvoice.seqWrite) {
                                dir_1 = $scope.yvoice.seqWriteOptions.dir;
                                prefix_1 = $scope.yvoice.seqWriteOptions.prefix;
                                if (!dir_1) {
                                    dir_1 = desktopDir;
                                }
                                parsedList = CommandService.parseInput(encoded, $scope.yvoiceList, $scope.yvoice);
                                sourceFname_1 = null;
                                // record wave files
                                parsedList.reduce(function (p, cinput) {
                                    if (p.then === undefined) {
                                        p.resolve();
                                        p = p.promise;
                                    }
                                    return p.then(function (fp) {
                                        return recordEach(cinput, dir_1, prefix_1)
                                            .then(function (fp) {
                                            if ($scope.yvoice.sourceWrite && !sourceFname_1) {
                                                sourceFname_1 = AudioSourceService.sourceFname(fp);
                                            }
                                            MessageService.record("" + '音声ファイルを保存しました。path: ' + fp, fp, sourceFname_1);
                                            return fp;
                                        });
                                    });
                                }, $q.defer())
                                    // record source message
                                    .then(function (fp) {
                                    if (!sourceFname_1) {
                                        return;
                                    }
                                    AudioSourceService.save(sourceFname_1, $scope.yinput.source).then(function () {
                                        MessageService.recordSource("" + 'メッセージファイルを保存しました。path: ' + sourceFname_1, sourceFname_1);
                                    })["catch"](function (err) {
                                        MessageService.error('メッセージファイルを作成できませんでした。', err);
                                    });
                                });
                                // 通常保存
                            }
                            else {
                                ipcRenderer().once('showSaveDialog', function (event, filePath) {
                                    if (!filePath) {
                                        MessageService.error('保存先が指定されませんでした。');
                                        return;
                                    }
                                    var splitted = SeqFNameService.splitFname(filePath);
                                    var dir = splitted.dir;
                                    var prefix = splitted.basename;
                                    // record
                                    var containsCommand = CommandService.containsCommand(encoded, $scope.yvoiceList);
                                    var parsedList = CommandService.parseInput(encoded, $scope.yvoiceList, $scope.yvoice);
                                    var sourceFname = null;
                                    // record wave files
                                    parsedList.reduce(function (p, cinput) {
                                        if (p.then === undefined) {
                                            p.resolve();
                                            p = p.promise;
                                        }
                                        return p.then(function (fp) {
                                            if (containsCommand) {
                                                return recordEach(cinput, dir, prefix)
                                                    .then(function (fp) {
                                                    if ($scope.yvoice.sourceWrite && !sourceFname) {
                                                        sourceFname = AudioSourceService.sourceFname(fp);
                                                    }
                                                    MessageService.record("" + '音声ファイルを保存しました。path: ' + fp, fp, sourceFname);
                                                    return fp;
                                                });
                                            }
                                            else {
                                                return recordSolo(cinput, filePath)
                                                    .then(function (fp) {
                                                    if ($scope.yvoice.sourceWrite && !sourceFname) {
                                                        sourceFname = AudioSourceService.sourceFname(fp);
                                                    }
                                                    MessageService.record("" + '音声ファイルを保存しました。path: ' + fp, fp, sourceFname);
                                                    return fp;
                                                });
                                            }
                                        });
                                    }, $q.defer())
                                        // record source message
                                        .then(function (fp) {
                                        if (!sourceFname) {
                                            return;
                                        }
                                        AudioSourceService.save(sourceFname, $scope.yinput.source).then(function () {
                                            MessageService.recordSource("" + 'メッセージファイルを保存しました。path: ' + sourceFname, sourceFname);
                                        })["catch"](function (err) {
                                            MessageService.error('メッセージファイルを作成できませんでした。', err);
                                        });
                                    });
                                });
                                ipcRenderer().send('showSaveDialog', 'wav');
                            }
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        function recordSolo(cinput, filePath) {
            var d = $q.defer();
            var encoded = cinput.text;
            var yvoice = CommandService.detectVoiceConfig(cinput, $scope.yvoiceList);
            // phont
            var phont = null;
            angular.forEach($scope.phontList, function (value, key) {
                if (value.id == yvoice.phont) {
                    phont = value;
                }
            });
            if (!phont) {
                MessageService.error('声の種類が未指定です。');
                d.reject(null);
                return d.promise;
            }
            // disable rhythm if option is on
            if (!yvoice.rhythmOn) {
                encoded = AppUtilService.disableRhythm(encoded);
            }
            var speed = yvoice.speed;
            if (!(Number(yvoice.writeMarginMs) === parseInt("" + yvoice.writeMarginMs))) {
                yvoice.writeMarginMs = 150;
            }
            var waveOptions = {
                passPhrase: appCfg.passPhrase,
                aq10UseKeyEncrypted: appCfg.aq10UseKeyEncrypted
            };
            if (phont.version == 'talk10') {
                waveOptions.bas = yvoice.bas;
                waveOptions.pit = yvoice.pit;
                waveOptions.acc = yvoice.acc;
                waveOptions.lmd = yvoice.lmd;
                waveOptions.fsc = yvoice.fsc;
            }
            var playOptions = {
                volume: yvoice.volume,
                playbackRate: yvoice.playbackRate,
                detune: yvoice.detune,
                writeMarginMs: yvoice.writeMarginMs
            };
            AquesService.wave(encoded, phont, speed, waveOptions).then(function (bufWav) {
                return AudioService.record(filePath, bufWav, playOptions).then(function () {
                    d.resolve(filePath);
                })["catch"](function (err) {
                    MessageService.error('音声データを記録できませんでした。', err);
                    d.reject(err);
                });
            })["catch"](function (err) {
                MessageService.error('音声データを作成できませんでした。', err);
                d.reject(err);
            });
            return d.promise;
        }
        function recordEach(cinput, dir, fnameprefix) {
            var d = $q.defer();
            var encoded = cinput.text;
            var yvoice = CommandService.detectVoiceConfig(cinput, $scope.yvoiceList);
            // phont
            var phont = null;
            angular.forEach($scope.phontList, function (value, key) {
                if (value.id == yvoice.phont) {
                    phont = value;
                }
            });
            if (!phont) {
                MessageService.error('声の種類が未指定です。');
                d.reject(null);
                return d.promise;
            }
            // disable rhythm if option is on
            if (!yvoice.rhythmOn) {
                encoded = AppUtilService.disableRhythm(encoded);
            }
            var speed = yvoice.speed;
            if (!(Number(yvoice.writeMarginMs) === parseInt("" + yvoice.writeMarginMs))) {
                yvoice.writeMarginMs = 150;
            }
            var waveOptions = {
                passPhrase: appCfg.passPhrase,
                aq10UseKeyEncrypted: appCfg.aq10UseKeyEncrypted
            };
            if (phont.version == 'talk10') {
                waveOptions.bas = yvoice.bas;
                waveOptions.pit = yvoice.pit;
                waveOptions.acc = yvoice.acc;
                waveOptions.lmd = yvoice.lmd;
                waveOptions.fsc = yvoice.fsc;
            }
            var playOptions = {
                volume: yvoice.volume,
                playbackRate: yvoice.playbackRate,
                detune: yvoice.detune,
                writeMarginMs: yvoice.writeMarginMs
            };
            SeqFNameService.nextNumber(dir, fnameprefix).then(function (nextNum) {
                var nextFname = SeqFNameService.nextFname(fnameprefix, nextNum);
                var filePath = path().join(dir, nextFname);
                AquesService.wave(encoded, phont, speed, waveOptions).then(function (bufWav) {
                    return AudioService.record(filePath, bufWav, playOptions).then(function () {
                        d.resolve(filePath);
                    })["catch"](function (err) {
                        MessageService.error('音声データを記録できませんでした。', err);
                        d.reject(err);
                    });
                })["catch"](function (err) {
                    MessageService.error('音声データを作成できませんでした。', err);
                    d.reject(err);
                });
            });
            return d.promise;
        }
        ctrl.showSystemWindow = function () {
            if (!appCfg.isTest) {
                return;
            }
            ipcRenderer().send('showSystemWindow', 'system');
        };
        ctrl.showSpecWindow = function () {
            if (!appCfg.isTest) {
                return;
            }
            ipcRenderer().send('showSpecWindow', 'spec');
        };
        ctrl.help = function () {
            MessageService.action('open help window.');
            ipcRenderer().send('showHelpWindow', 'help');
        };
        ctrl.tutorial = function () {
            if ($scope.display == 'main') {
                MessageService.action('run main tutorial.');
                IntroService.mainTutorial();
            }
            else {
                MessageService.action('run settings tutorial.');
                IntroService.settingsTutorial();
            }
        };
        ctrl.shortcut = function () {
            MessageService.action('show shortcut key help.');
            if ($scope.display == 'main') {
                IntroService.shortcut();
            }
            else {
                $scope.display = 'main';
                MessageService.info('標準の画面に切り替えます。');
                $timeout(function () {
                    $scope.$apply();
                    IntroService.shortcut();
                });
            }
        };
        ctrl.select = function (index) {
            MessageService.action('switch voice config.');
            $scope.yvoice = $scope.yvoiceList[index];
            $scope.display = 'main';
        };
        ctrl.plus = function () {
            MessageService.action('add new voice config.');
            var newYvoice = DataService.create();
            $scope.yvoiceList.push(newYvoice);
        };
        ctrl.minus = function (index) {
            MessageService.action('delete voice config.');
            if ($scope.yvoiceList.length < 2) {
                MessageService.error('ボイス設定は1件以上必要です。');
                return;
            }
            $scope.yvoiceList.splice(index, 1);
            $scope.yvoice = $scope.yvoiceList[0];
            $scope.display = 'main';
        };
        ctrl.copy = function (index) {
            MessageService.action('copy and create new voice config.');
            var original = $scope.yvoiceList[index];
            var newYvoice = DataService.copy(original);
            $scope.yvoiceList.push(newYvoice);
        };
        ctrl.save = function () {
            MessageService.action('save voice config.');
            DataService.save($scope.yvoiceList);
        };
        ctrl.reset = function () {
            MessageService.action('reset all voice config data.');
            // voice data clear
            DataService.clear();
            // set initial data
            $scope.yvoiceList = DataService.initialData();
            $scope.yvoice = $scope.yvoiceList[0];
            $scope.yinput = angular.copy(YInputInitialData);
            $scope.display = 'main';
            clearSourceSelection();
            clearEncodedSelection();
        };
        ctrl.quickLookMessage = function (message) {
            if (message.type != 'record' && message.type != 'source') {
                return;
            }
            var quickLookPath = message.quickLookPath;
            fs().stat(quickLookPath, function (err, stats) {
                if (err) {
                    return;
                }
                //MessageService.action(`open with Quick Look. file: ${wavFilePath}`);
                var win = require('electron').remote.getCurrentWindow();
                win.previewFile(quickLookPath);
            });
        };
        ctrl.encode = function () {
            return __awaiter(this, void 0, void 0, function () {
                var source, _selectedSource, parsedList, _i, parsedList_1, cinput, _a, encoded;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            MessageService.action('encode source text.');
                            source = $scope.yinput.source;
                            _selectedSource = selectedSource();
                            if (_selectedSource) {
                                source = _selectedSource;
                            }
                            if (!CommandService.containsCommand(source, $scope.yvoiceList)) return [3 /*break*/, 5];
                            parsedList = CommandService.parseInput(source, $scope.yvoiceList, $scope.yvoice);
                            _i = 0, parsedList_1 = parsedList;
                            _b.label = 1;
                        case 1:
                            if (!(_i < parsedList_1.length)) return [3 /*break*/, 4];
                            cinput = parsedList_1[_i];
                            _a = cinput;
                            return [4 /*yield*/, AquesService.encode(cinput.text)];
                        case 2:
                            _a.text = _b.sent();
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            $scope.yinput.encoded = CommandService.toString(parsedList);
                            clearEncodedSelection();
                            return [3 /*break*/, 7];
                        case 5: return [4 /*yield*/, AquesService.encode(source)];
                        case 6:
                            encoded = _b.sent();
                            $scope.yinput.encoded = encoded;
                            clearEncodedSelection();
                            _b.label = 7;
                        case 7:
                            $timeout(function () { $scope.$apply(); });
                            return [2 /*return*/, $scope.yinput.encoded];
                    }
                });
            });
        };
        ctrl.clear = function () {
            MessageService.action('clear input text.');
            $scope.yinput.source = '';
            $scope.yinput.encoded = '';
            clearSourceSelection();
            clearEncodedSelection();
        };
        ctrl.fromClipboard = function () {
            MessageService.action('paste clipboard text to source.');
            var text = clipboard().readText();
            if (text) {
                $scope.yinput.source = text;
                $scope.yinput.encoded = '';
                clearSourceSelection();
                clearEncodedSelection();
            }
            else {
                MessageService.info('クリップボードにデータがありません。');
            }
        };
        ctrl.putVoiceName = function () {
            var field = document.activeElement;
            if (field.id != 'source' && field.id != 'encoded') {
                return;
            }
            var pos = field.selectionStart;
            var length = field.value.length;
            // top
            if (pos == 0) {
                $scope.yinput[field.id] = "" + $scope.yvoice.name + '＞' + field.value;
                field.selectionStart = ("" + $scope.yvoice.name + '＞').length;
                field.selectionEnd = ("" + $scope.yvoice.name + '＞').length;
                // last
            }
            else if (pos == length) {
                if (field.value.substring(pos - 1, pos) == '\n') {
                    $scope.yinput[field.id] = "" + field.value + $scope.yvoice.name + '＞';
                    field.selectionStart = (field.value).length;
                    field.selectionEnd = (field.value).length;
                }
                else {
                    $scope.yinput[field.id] = field.value + "\n" + $scope.yvoice.name + '＞';
                    field.selectionStart = (field.value).length;
                    field.selectionEnd = (field.value).length;
                }
                // in text
            }
            else {
                if (field.value.substring(pos - 1, pos) == '\n') {
                    $scope.yinput[field.id] = "" + field.value.substring(0, pos) + $scope.yvoice.name + '＞' + field.value.substring(pos, length);
                    field.selectionStart = ("" + field.value.substring(0, pos) + $scope.yvoice.name + '＞').length;
                    field.selectionEnd = ("" + field.value.substring(0, pos) + $scope.yvoice.name + '＞').length;
                }
                else {
                    $scope.yinput[field.id] = field.value.substring(0, pos) + "\n" + $scope.yvoice.name + '＞' + field.value.substring(pos, length);
                    field.selectionStart = (field.value.substring(0, pos) + "\n" + $scope.yvoice.name + '＞').length;
                    field.selectionEnd = (field.value.substring(0, pos) + "\n" + $scope.yvoice.name + '＞').length;
                }
            }
            $timeout(function () { $scope.$apply(); });
        };
        ctrl.directory = function () {
            MessageService.action('select directory.');
            if (!$scope.yvoice.seqWrite) {
                MessageService.error('連番ファイル設定が無効です。');
                return;
            }
            ipcRenderer().once('showDirDialog', function (event, dirs) {
                if (!dirs || dirs.length < 1) {
                    return;
                }
                $scope.yvoice.seqWriteOptions.dir = dirs[0];
                $timeout(function () { $scope.$apply(); });
            });
            var optDir = $scope.yvoice.seqWriteOptions.dir;
            if (!optDir) {
                optDir = desktopDir;
            }
            ipcRenderer().send('showDirDialog', optDir);
        };
        ctrl.switchSettingsView = function () {
            MessageService.action('switch to settings view.');
            $scope.display = 'settings';
        };
        ctrl.switchMainView = function () {
            MessageService.action('switch to main view.');
            $scope.display = 'main';
        };
        ctrl.switchAlwaysOnTop = function () {
            MessageService.action('switch alwaysOnTop option.');
            ipcRenderer().send('switchAlwaysOnTop', 'mainWindow');
        };
        ipcRenderer().on('switchAlwaysOnTop', function (event, newflg) {
            $scope.alwaysOnTop = newflg;
            MessageService.info("update alwaysOnTop option " + (newflg ? 'ON' : 'OFF'));
            $timeout(function () { $scope.$apply(); });
        });
    }]);
