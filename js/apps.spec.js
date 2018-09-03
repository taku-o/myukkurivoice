"use strict";
// application spec app
angular.module('yvoiceSpec', ['yvoiceService', 'yvoiceLicenseService'])
    .config(['$qProvider', function ($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
    }])
    .controller('SpecController', ['$scope',
    'YPhontList', 'YVoice', 'YVoiceInitialData', 'YInput', 'YInputInitialData', 'YCommandInput',
    'LicenseService',
    'DataService', 'MasterService',
    'AquesService', 'AudioService1', 'AudioService2', 'AudioSourceService',
    'AppUtilService', 'SeqFNameService',
    function ($scope, YPhontList, YVoice, YVoiceInitialData, YInput, YInputInitialData, YCommandInput, LicenseService, DataService, MasterService, AquesService, AudioService1, AudioService2, AudioSourceService, AppUtilService, SeqFNameService) {
        // init
        var ctrl = this;
        // YPhontList
        ctrl.getYPhontList = function () {
            var r = YPhontList;
            $scope.getYPhontListResult = JSON.stringify(r);
        };
        // YVoice
        ctrl.getYVoice = function () {
            var r = YVoice;
            $scope.getYVoiceResult = JSON.stringify(r);
        };
        // YVoiceInitialData
        ctrl.getYVoiceInitialData = function () {
            var r = YVoiceInitialData;
            $scope.getYVoiceInitialDataResult = JSON.stringify(r);
        };
        // YInput
        ctrl.getYInput = function () {
            var r = YInput;
            $scope.getYInputResult = JSON.stringify(r);
        };
        // YInputInitialData
        ctrl.getYInputInitialData = function () {
            var r = YInputInitialData;
            $scope.getYInputInitialDataResult = JSON.stringify(r);
        };
        // YCommandInput
        ctrl.getYCommandInput = function () {
            var r = YCommandInput;
            $scope.getYCommandInputResult = JSON.stringify(r);
        };
        // LicenseService
        ctrl.encrypt = function () {
            var r = LicenseService.encrypt($scope.passPhrase, $scope.plainKey);
            $scope.encryptedKey = r;
        };
        ctrl.decrypt = function () {
            var r = LicenseService.decrypt($scope.passPhrase, $scope.encryptedKey);
            $scope.plainKey = r;
        };
        ctrl.consumerKey = function () {
            LicenseService.consumerKey($scope.licenseType).then(function (value) {
                $scope.consumerKeyResult = value;
                $scope.consumerKeyDone = 'ok';
            })["catch"](function (err) {
                $scope.consumerKeyErr = err;
            });
        };
        // TODO
        // IntroService
        ctrl.mainTutorial = function () {
            //IntroService.mainTutorial();
        };
        ctrl.settingsTutorial = function () {
            //IntroService.settingsTutorial();
        };
        ctrl.shortcut = function () {
            //IntroService.shortcut();
        };
        // DataService
        ctrl.load = function () {
            DataService.load().then(function (list) {
                $scope.loadResult = JSON.stringify(list);
            })["catch"](function (err) {
                $scope.loadErr = err;
            });
        };
        ctrl.initialData = function () {
            var r = DataService.initialData();
            $scope.initialDataResult = JSON.stringify(r);
        };
        ctrl.create = function () {
            var r = DataService.create();
            $scope.createResult = JSON.stringify(r);
        };
        ctrl.copy = function () {
            var original = { text: 'value' };
            var r = DataService.copy(original);
            $scope.copyResult = JSON.stringify(r);
        };
        // MasterService
        ctrl.getPhontList = function () {
            var list = MasterService.getPhontList();
            $scope.getPhontListResult = JSON.stringify(list);
        };
        // AquesService
        ctrl.encode = function () {
            var r = AquesService.encode($scope.source);
            $scope.encodeResult = r;
        };
        ctrl.waveVer1 = function () {
            var list = MasterService.getPhontList();
            var phont;
            for (var i = 0; i < list.length; i++) {
                if (list[i].version == 'talk1') {
                    phont = list[i];
                    break;
                }
            }
            var speed = 100;
            var options = {
                passPhrase: '',
                aq10UseKeyEncrypted: ''
            };
            AquesService.wave($scope.encoded, phont, speed, options).then(function (value) {
                $scope.waveResult = 'ok';
            })["catch"](function (err) {
                $scope.waveErr = err;
            });
        };
        ctrl.waveVer2 = function () {
            var list = MasterService.getPhontList();
            var phont;
            for (var i = 0; i < list.length; i++) {
                if (list[i].version == 'talk2') {
                    phont = list[i];
                    break;
                }
            }
            var speed = 100;
            var options = {
                passPhrase: '',
                aq10UseKeyEncrypted: ''
            };
            AquesService.wave($scope.encoded, phont, speed, options).then(function (value) {
                $scope.waveResult = 'ok';
            })["catch"](function (err) {
                $scope.waveErr = err;
            });
        };
        ctrl.waveVer10 = function () {
            var list = MasterService.getPhontList();
            var phont;
            for (var i = 0; i < list.length; i++) {
                if (list[i].version == 'talk10') {
                    phont = list[i];
                    break;
                }
            }
            var speed = 100;
            var options = { passPhrase: 'xxxxxxx', aq10UseKeyEncrypted: '' };
            AquesService.wave($scope.encoded, phont, speed, options).then(function (value) {
                $scope.waveResult = 'ok';
            })["catch"](function (err) {
                $scope.waveErr = err;
            });
        };
        // AudioService1
        ctrl.play1AqVer1 = function () {
            // phont
            var list = MasterService.getPhontList();
            var phont;
            for (var i = 0; i < list.length; i++) {
                if (list[i].version == 'talk1') {
                    phont = list[i];
                    break;
                }
            }
            var speed = 100;
            var woptions = {
                passPhrase: '',
                aq10UseKeyEncrypted: ''
            };
            var poptions = {
                volume: 1.0,
                playbackRate: 1.0,
                detune: 0,
                writeMarginMs: 150
            };
            // wave
            AquesService.wave($scope.play1Encoded, phont, speed, woptions).then(function (bufWav) {
                // play
                AudioService1.play(bufWav, poptions).then(function (value) {
                    $scope.playResult1 = 'ok';
                })["catch"](function (err) {
                    $scope.playResult1 = err.message;
                });
            })["catch"](function (err) {
                $scope.playResult1 = err.message;
            });
        };
        ctrl.play1AqVer2 = function () {
            // phont
            var list = MasterService.getPhontList();
            var phont;
            for (var i = 0; i < list.length; i++) {
                if (list[i].version == 'talk2') {
                    phont = list[i];
                    break;
                }
            }
            var speed = 100;
            var woptions = {
                passPhrase: '',
                aq10UseKeyEncrypted: ''
            };
            var poptions = {
                volume: 1.0,
                playbackRate: 1.0,
                detune: 0,
                writeMarginMs: 150
            };
            // wave
            AquesService.wave($scope.play1Encoded, phont, speed, woptions).then(function (bufWav) {
                // play
                AudioService1.play(bufWav, poptions).then(function (value) {
                    $scope.playResult1 = 'ok';
                })["catch"](function (err) {
                    $scope.playResult1 = err.message;
                });
            })["catch"](function (err) {
                $scope.playResult1 = err.message;
            });
        };
        ctrl.play1AqVer10 = function () {
            // phont
            var list = MasterService.getPhontList();
            var phont;
            for (var i = 0; i < list.length; i++) {
                if (list[i].version == 'talk10') {
                    phont = list[i];
                    break;
                }
            }
            var speed = 100;
            var woptions = {
                passPhrase: 'xxxxxxx',
                aq10UseKeyEncrypted: ''
            };
            var poptions = {
                volume: 1.0,
                playbackRate: 1.0,
                detune: 0,
                writeMarginMs: 150
            };
            // wave
            AquesService.wave($scope.play1Encoded, phont, speed, woptions).then(function (bufWav) {
                // play
                AudioService1.play(bufWav, poptions).then(function (value) {
                    $scope.playResult1 = 'ok';
                })["catch"](function (err) {
                    $scope.playResult1 = err.message;
                });
            })["catch"](function (err) {
                $scope.playResult1 = err.message;
            });
        };
        ctrl.record1AqVer1 = function () {
            // phont
            var list = MasterService.getPhontList();
            var phont;
            for (var i = 0; i < list.length; i++) {
                if (list[i].version == 'talk1') {
                    phont = list[i];
                    break;
                }
            }
            var speed = 100;
            var woptions = {
                passPhrase: 'xxxxxxx',
                aq10UseKeyEncrypted: ''
            };
            var poptions = {
                volume: 1.0,
                playbackRate: 1.0,
                detune: 0,
                writeMarginMs: 150
            };
            // wave
            AquesService.wave($scope.play1Encoded, phont, speed, woptions).then(function (bufWav) {
                // play
                AudioService1.record($scope.wavFilePath1, bufWav, poptions).then(function (value) {
                    $scope.recordResult1 = 'ok';
                })["catch"](function (err) {
                    $scope.recordResult1 = err.message;
                });
            })["catch"](function (err) {
                $scope.recordResult1 = err.message;
            });
        };
        ctrl.record1AqVer2 = function () {
            // phont
            var list = MasterService.getPhontList();
            var phont;
            for (var i = 0; i < list.length; i++) {
                if (list[i].version == 'talk2') {
                    phont = list[i];
                    break;
                }
            }
            var speed = 100;
            var woptions = {
                passPhrase: 'xxxxxxx',
                aq10UseKeyEncrypted: ''
            };
            var poptions = {
                volume: 1.0,
                playbackRate: 1.0,
                detune: 0,
                writeMarginMs: 150
            };
            // wave
            AquesService.wave($scope.play1Encoded, phont, speed, woptions).then(function (bufWav) {
                // play
                AudioService1.record($scope.wavFilePath1, bufWav, poptions).then(function (value) {
                    $scope.recordResult1 = 'ok';
                })["catch"](function (err) {
                    $scope.recordResult1 = err.message;
                });
            })["catch"](function (err) {
                $scope.recordResult1 = err.message;
            });
        };
        ctrl.record1AqVer10 = function () {
            // phont
            var list = MasterService.getPhontList();
            var phont;
            for (var i = 0; i < list.length; i++) {
                if (list[i].version == 'talk10') {
                    phont = list[i];
                    break;
                }
            }
            var speed = 100;
            var woptions = {
                passPhrase: 'xxxxxxx',
                aq10UseKeyEncrypted: ''
            };
            var poptions = {
                volume: 1.0,
                playbackRate: 1.0,
                detune: 0,
                writeMarginMs: 150
            };
            // wave
            AquesService.wave($scope.play1Encoded, phont, speed, woptions).then(function (bufWav) {
                // play
                AudioService1.record($scope.wavFilePath1, bufWav, poptions).then(function (value) {
                    $scope.recordResult1 = 'ok';
                })["catch"](function (err) {
                    $scope.recordResult1 = err.message;
                });
            })["catch"](function (err) {
                $scope.recordResult1 = err.message;
            });
        };
        // AudioService2
        ctrl.play2AqVer1 = function () {
            // phont
            var list = MasterService.getPhontList();
            var phont;
            for (var i = 0; i < list.length; i++) {
                if (list[i].version == 'talk1') {
                    phont = list[i];
                    break;
                }
            }
            var speed = 100;
            var woptions = {
                passPhrase: '',
                aq10UseKeyEncrypted: ''
            };
            var poptions = {
                volume: 1.0,
                playbackRate: 1.0,
                detune: 0,
                writeMarginMs: 150
            };
            // wave
            AquesService.wave($scope.play2Encoded, phont, speed, woptions).then(function (bufWav) {
                // play
                AudioService2.play(bufWav, poptions).then(function (value) {
                    $scope.playResult2 = 'ok';
                })["catch"](function (err) {
                    $scope.playResult2 = err.message;
                });
            })["catch"](function (err) {
                $scope.playResult2 = err.message;
            });
        };
        ctrl.play2AqVer2 = function () {
            // phont
            var list = MasterService.getPhontList();
            var phont;
            for (var i = 0; i < list.length; i++) {
                if (list[i].version == 'talk2') {
                    phont = list[i];
                    break;
                }
            }
            var speed = 100;
            var woptions = {
                passPhrase: '',
                aq10UseKeyEncrypted: ''
            };
            var poptions = {
                volume: 1.0,
                playbackRate: 1.0,
                detune: 0,
                writeMarginMs: 150
            };
            // wave
            AquesService.wave($scope.play2Encoded, phont, speed, woptions).then(function (bufWav) {
                // play
                AudioService2.play(bufWav, poptions).then(function (value) {
                    $scope.playResult2 = 'ok';
                })["catch"](function (err) {
                    $scope.playResult2 = err.message;
                });
            })["catch"](function (err) {
                $scope.playResult2 = err.message;
            });
        };
        ctrl.play2AqVer10 = function () {
            // phont
            var list = MasterService.getPhontList();
            var phont;
            for (var i = 0; i < list.length; i++) {
                if (list[i].version == 'talk10') {
                    phont = list[i];
                    break;
                }
            }
            var speed = 100;
            var woptions = {
                passPhrase: 'xxxxxxx',
                aq10UseKeyEncrypted: ''
            };
            var poptions = {
                volume: 1.0,
                playbackRate: 1.0,
                detune: 0,
                writeMarginMs: 150
            };
            // wave
            AquesService.wave($scope.play2Encoded, phont, speed, woptions).then(function (bufWav) {
                // play
                AudioService2.play(bufWav, poptions).then(function (value) {
                    $scope.playResult2 = 'ok';
                })["catch"](function (err) {
                    $scope.playResult2 = err.message;
                });
            })["catch"](function (err) {
                $scope.playResult2 = err.message;
            });
        };
        ctrl.record2AqVer1 = function () {
            // phont
            var list = MasterService.getPhontList();
            var phont;
            for (var i = 0; i < list.length; i++) {
                if (list[i].version == 'talk1') {
                    phont = list[i];
                    break;
                }
            }
            var speed = 100;
            var woptions = {
                passPhrase: '',
                aq10UseKeyEncrypted: ''
            };
            var poptions = {
                volume: 1.0,
                playbackRate: 1.0,
                detune: 0,
                writeMarginMs: 150
            };
            // wave
            AquesService.wave($scope.play2Encoded, phont, speed, woptions).then(function (bufWav) {
                // play
                AudioService2.record($scope.wavFilePath2, bufWav, poptions).then(function (value) {
                    $scope.recordResult2 = 'ok';
                })["catch"](function (err) {
                    $scope.recordResult2 = err.message;
                });
            })["catch"](function (err) {
                $scope.recordResult2 = err.message;
            });
        };
        ctrl.record2AqVer2 = function () {
            // phont
            var list = MasterService.getPhontList();
            var phont;
            for (var i = 0; i < list.length; i++) {
                if (list[i].version == 'talk2') {
                    phont = list[i];
                    break;
                }
            }
            var speed = 100;
            var woptions = {
                passPhrase: '',
                aq10UseKeyEncrypted: ''
            };
            var poptions = {
                volume: 1.0,
                playbackRate: 1.0,
                detune: 0,
                writeMarginMs: 150
            };
            // wave
            AquesService.wave($scope.play2Encoded, phont, speed, woptions).then(function (bufWav) {
                // play
                AudioService2.record($scope.wavFilePath2, bufWav, poptions).then(function (value) {
                    $scope.recordResult2 = 'ok';
                })["catch"](function (err) {
                    $scope.recordResult2 = err.message;
                });
            })["catch"](function (err) {
                $scope.recordResult2 = err.message;
            });
        };
        ctrl.record2AqVer10 = function () {
            // phont
            var list = MasterService.getPhontList();
            var phont;
            for (var i = 0; i < list.length; i++) {
                if (list[i].version == 'talk10') {
                    phont = list[i];
                    break;
                }
            }
            var speed = 100;
            var woptions = {
                passPhrase: 'xxxxxxx',
                aq10UseKeyEncrypted: ''
            };
            var poptions = {
                volume: 1.0,
                playbackRate: 1.0,
                detune: 0,
                writeMarginMs: 150
            };
            // wave
            AquesService.wave($scope.play2Encoded, phont, speed, woptions).then(function (bufWav) {
                // play
                AudioService2.record($scope.wavFilePath2, bufWav, poptions).then(function (value) {
                    $scope.recordResult2 = 'ok';
                })["catch"](function (err) {
                    $scope.recordResult2 = err.message;
                });
            })["catch"](function (err) {
                $scope.recordResult2 = err.message;
            });
        };
        // AudioSourceService
        ctrl.sourceFname = function () {
            var r = AudioSourceService.sourceFname($scope.wavFilePath);
            $scope.sourceFnameResult = r;
        };
        ctrl.save = function () {
            // TODO save test
            //AudioSourceService.save($scope.filePath, $scope.sourceText);
            $scope.saveResult = 'ok';
        };
        // SeqFNameService
        ctrl.nextFname = function () {
            var r = SeqFNameService.nextFname($scope.prefix, $scope.num);
            $scope.nextFnameResult = r;
        };
        // AppUtilService
        ctrl.disableRhythm = function () {
            var r = AppUtilService.disableRhythm($scope.rhythmText);
            $scope.disableRhythmResult = r;
        };
    }]);
