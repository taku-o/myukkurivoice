var _log: any, log = () => { _log = _log || require('electron-log'); return _log; };

// env
var DEBUG = process.env.DEBUG != null;
var CONSOLELOG = process.env.CONSOLELOG != null;
var TEST_VOLUME = 0.1;

// source-map-support
if (DEBUG) {
  try {
    require('source-map-support').install();
  } catch(e) {
    log().error('source-map-support or devtron is not installed.');
  }
}
// replace renderer console log, and disable file log
if (CONSOLELOG) {
  const remoteConsole = require('electron').remote.require('console');
  /* eslint-disable-next-line no-global-assign */
  console = remoteConsole;
  delete log().transports['file'];
}

// angular app
angular.module('specApp', ['mainModels', 'dictModels', 'mainServices', 'dictServices'])
  // config
  .config(['$qProvider', '$compileProvider', ($qProvider: ng.IQProvider, $compileProvider: ng.ICompileProvider) => {
    $qProvider.errorOnUnhandledRejections(false);
    $compileProvider.debugInfoEnabled(DEBUG);
  }])
  .factory('$exceptionHandler', () => {
    return (exception: Error, cause: string) => {
      log().warn('spec:catch angularjs exception: %s, cause:%s', exception, cause);
    };
  })
  .controller('SpecController', ['$scope', '$timeout',
      'YPhontMasterList', 'YVoice', 'YVoiceInitialData', 'YInput', 'YInputInitialData', 'YCommandInput',
      'KindList', 'KindHash',
      'LicenseService', 'IntroService', 'MessageService', 'CommandService',
      'DataService', 'HistoryService',
      'AqKanji2KoeLib', 'AquesTalk1Lib', 'AquesTalk2Lib', 'AquesTalk10Lib',
      'AquesService', 'AudioService1', 'AudioService2',
      'TextSubtitleService',
      'AppUtilService', 'SeqFNameService',
      'AqUsrDicService',
    function($scope: any, $timeout: ng.ITimeoutService,
      YPhontMasterList: yubo.YPhont[], YVoice: yubo.YVoice, YVoiceInitialData: yubo.YVoice[],
      YInput: yubo.YInput, YInputInitialData: yubo.YInput, YCommandInput: yubo.YCommandInput,
      KindList, KindHash,
      LicenseService: yubo.LicenseService, IntroService: yubo.IntroService, MessageService: yubo.MessageService,
      CommandService: yubo.CommandService,
      DataService: yubo.DataService, HistoryService: yubo.HistoryService,
      AqKanji2KoeLib: yubo.AqKanji2KoeLib, AquesTalk1Lib: yubo.AquesTalk1Lib, AquesTalk2Lib: yubo.AquesTalk2Lib, AquesTalk10Lib: yubo.AquesTalk10Lib,
      AquesService: yubo.AquesService, AudioService1: yubo.AudioService1, AudioService2: yubo.AudioService2,
      TextSubtitleService: yubo.TextSubtitleService,
      AppUtilService: yubo.AppUtilService, SeqFNameService: yubo.SeqFNameService,
      AqUsrDicService: yubo.AqUsrDicService
    ) {

    // init
    const ctrl = this;

    // $onInit
    this.$onInit = (): void => {
      AquesService.init();
    };

    // YPhontMasterList
    ctrl.getYPhontMasterList = function(): void {
      const r = YPhontMasterList;
      $scope.getYPhontMasterListResult = JSON.stringify(r);
    };
    // YVoice
    ctrl.getYVoice = function(): void {
      const r = YVoice;
      $scope.getYVoiceResult = JSON.stringify(r);
    };
    // YVoiceInitialData
    ctrl.getYVoiceInitialData = function(): void {
      const r = YVoiceInitialData;
      $scope.getYVoiceInitialDataResult = JSON.stringify(r);
    };
    // YInput
    ctrl.getYInput = function(): void {
      const r = YInput;
      $scope.getYInputResult = JSON.stringify(r);
    };
    // YInputInitialData
    ctrl.getYInputInitialData = function(): void {
      const r = YInputInitialData;
      $scope.getYInputInitialDataResult = JSON.stringify(r);
    };
    // YCommandInput
    ctrl.getYCommandInput = function(): void {
      const r = YCommandInput;
      $scope.getYCommandInputResult = JSON.stringify(r);
    };
    // models-dict KindList
    ctrl.getKindList = function(): void {
      const r = KindList;
      $scope.getKindListResult = JSON.stringify(r);
    };
    // models-dict KindHash
    ctrl.getKindHash = function(): void {
      const r = KindHash;
      $scope.getKindHashResult = JSON.stringify(r);
    };

    // LicenseService
    ctrl.encrypt = function(): void {
      const r = LicenseService.encrypt($scope.passPhrase, $scope.plainKey);
      $scope.encryptedKey = r;
    };
    ctrl.decrypt = function(): void {
      const r = LicenseService.decrypt($scope.passPhrase, $scope.encryptedKey);
      $scope.plainKey = r;
    };
    ctrl.consumerKey = function(): void {
      LicenseService.consumerKey($scope.licenseType).then((value) => {
        $timeout(() => {
          $scope.consumerKeyResult = value;
          $scope.consumerKeyDone = 'ok';
        });
      })
      .catch((err: Error) => {
        $scope.consumerKeyErr = err.message;
      });
    };

    // IntroService
    ctrl.mainTutorial = function(): void {
      IntroService.mainTutorial();
    };
    ctrl.settingsTutorial = function(): void {
      IntroService.settingsTutorial();
    };
    ctrl.shortcut = function(): void {
      IntroService.shortcut();
    };
    ctrl.dictTutorial = function(): void {
      IntroService.dictTutorial();
    };

    // MessageService
    ctrl.action = function(): void {
      const msg = 'action message';
      MessageService.action(msg);
    };
    ctrl.record = function(): void {
      const msg = 'record message';
      const wavFilePath = '/tmp/hoge.wav';
      const srcTextPath = '/tmp/hoge.txt';
      MessageService.record(msg,
        {
          wavFilePath: wavFilePath,
          srcTextPath: srcTextPath,
          source: msg,
          encoded: msg,
          duration: 1.44,
        }
      );
    };
    ctrl.recordSource = function(): void {
      const msg = 'record source';
      const srcTextPath = '/tmp/hoge.txt';
      MessageService.recordSource(msg,
        {
          srcTextPath: srcTextPath,
          source: msg,
        }
      );
    };
    ctrl.info = function(): void {
      const msg = 'info message';
      MessageService.info(msg);
    };
    ctrl.error = function(): void {
      const msg = 'error message';
      const err = new Error('err');
      MessageService.error(msg, err);
    };
    ctrl.errorNull = function(): void {
      const msg = 'error message';
      MessageService.error(msg);
    };
    ctrl.syserror = function(): void {
      const msg = 'syserror message';
      const err = new Error('err');
      MessageService.syserror(msg, err);
    };
    ctrl.syserrorNull = function(): void {
      const msg = 'syserror message';
      MessageService.syserror(msg);
    };
    $scope.$on('message', (event: ng.IAngularEvent, message: yubo.IMessage | yubo.IRecordMessage) => {
      $scope.messageServicePost = JSON.stringify(message);
      $timeout(() => { $scope.$apply(); });
    });
    $scope.$on('wavGenerated', (event: ng.IAngularEvent, wavFileInfo: yubo.IRecordMessage) => {
      $scope.lastWavFile = JSON.stringify(wavFileInfo);
      $timeout(() => { $scope.$apply(); });
    });

    // CommandService
    ctrl.containsCommand = function(): void {
      const yvoiceList = YVoiceInitialData;
      const r = CommandService.containsCommand($scope.containsCommandInput, yvoiceList);
      $scope.containsCommandResult = r;
    };
    ctrl.parseInput = function(): void {
      const yvoiceList = YVoiceInitialData;
      const currentYvoice = yvoiceList[0];
      const r = CommandService.parseInput($scope.parseInputInput, yvoiceList, currentYvoice);
      $scope.parseInputResult = JSON.stringify(r);
    };
    ctrl.detectVoiceConfig = function(): void {
      const commandInput = JSON.parse($scope.commandInputSource);
      const yvoiceList = YVoiceInitialData;
      const r = CommandService.detectVoiceConfig(commandInput, yvoiceList);
      $scope.detectVoiceConfigResult = JSON.stringify(r);
    };
    ctrl.toString = function(): void {
      const commandInputList = JSON.parse($scope.commandInputList);
      const r = CommandService.toString(commandInputList);
      $scope.toStringResult = r;
    };

    // DataService
    ctrl.load = function(): void {
      DataService.load(null, null).then((list) => {
        $scope.loadResult = JSON.stringify(list);
      })
      .catch((err: Error) => {
        $scope.loadErr = err.message;
      });
    };
    ctrl.initialData = function(): void {
      const r = DataService.initialData();
      $scope.initialDataResult = JSON.stringify(r);
    };
    ctrl.create = function(): void {
      const r = DataService.create();
      $scope.createResult = JSON.stringify(r);
    };
    ctrl.copy = function(): void {
      const original = YVoice;
      const r = DataService.copy(original);
      $scope.copyResult = JSON.stringify(r);
    };
    ctrl.saveData = function(): void {
      const r = DataService.initialData();
      DataService.save(r).then((success) => {
        $scope.saveDataResult = 'ok';
      });
    };
    ctrl.clear = function(): void {
      DataService.clear().then((success) => {
        $scope.clearResult = 'ok';
      });
    };

    // HistoryService
    ctrl.historyLoad = function(): void {
      HistoryService.load().then((cache) => {
        $scope.historyResult = 'ok';
      });
    };
    ctrl.historySave = function(): void {
      HistoryService.save().then((ok: boolean) => {
        $scope.historyResult = 'ok';
      });
    };
    ctrl.historyClear = function(): void {
      HistoryService.clear().then((ok: boolean) => {
        $scope.historyResult = 'ok';
      });
    };
    ctrl.historyGet = function(): void {
      const r = HistoryService.get($scope.historyKey);
      $scope.historyResult = JSON.stringify(r);
    };
    ctrl.historyAdd = function(): void {
      const entry = JSON.parse($scope.historyEntry);
      HistoryService.add(entry);
      $scope.historyResult = 'ok';
    };
    ctrl.historyGetList = function(): void {
      const r = HistoryService.getList();
      $scope.historyResult = JSON.stringify(r);
    };

    // AquesService.AqKanji2Koe
    // AquesService.AquesTalk2
    // AquesService.AquesTalk10
    ctrl.errorTableAqkanji2koe = function(): void {
      $scope.errorTableResult = AqKanji2KoeLib.errorTable($scope.errorTableCode);
    };
    ctrl.errorTableAquestalk2 = function(): void {
      $scope.errorTableResult = AquesTalk2Lib.errorTable($scope.errorTableCode);
    };
    ctrl.errorTableAquestalk10 = function(): void {
      $scope.errorTableResult = AquesTalk10Lib.errorTable($scope.errorTableCode);
    };
    // AquesService.AquesTalk1
    ctrl.isSupported = function(): void {
      $scope.isSupportedResult = AquesTalk1Lib.isSupported($scope.osVersion);
    };
    // AquesService
    ctrl.encode = function(): void {
      const r = AquesService.encode($scope.source);
      $scope.encodeResult = r;
    };
    ctrl.waveVer1 = function(): void {
      const list = YPhontMasterList;
      let phont;
      for (let i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk1') {
          phont = list[i]; break;
        }
      }
      const speed = 100;
      const options: yubo.WaveOptions = {
        passPhrase: '',
        aq10UseKeyEncrypted: '',
      };
      AquesService.wave($scope.encoded, phont, speed, options).then((value) => {
        $scope.waveResult = 'ok';
      })
      .catch((err: Error) => {
        $scope.waveErr = err.message;
      });
    };
    ctrl.waveVer2 = function(): void {
      const list = YPhontMasterList;
      let phont;
      for (let i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk2') {
          phont = list[i]; break;
        }
      }
      const speed = 100;
      const options: yubo.WaveOptions = {
        passPhrase: '',
        aq10UseKeyEncrypted: '',
      };
      AquesService.wave($scope.encoded, phont, speed, options).then((value) => {
        $scope.waveResult = 'ok';
      })
      .catch((err: Error) => {
        $scope.waveErr = err.message;
      });
    };
    ctrl.waveVer10 = function(): void {
      const list = YPhontMasterList;
      let phont;
      for (let i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk10') {
          phont = list[i]; break;
        }
      }
      const speed = 100;
      const options = {passPhrase:'xxxxxxx', aq10UseKeyEncrypted:''};
      AquesService.wave($scope.encoded, phont, speed, options).then((value) => {
        $scope.waveResult = 'ok';
      })
      .catch((err: Error) => {
        $scope.waveErr = err.message;
      });
    };

    // AudioService1
    ctrl.play1AqVer1 = function(): void {
      // phont
      const list = YPhontMasterList;
      let phont;
      for (let i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk1') {
          phont = list[i]; break;
        }
      }
      const speed = 100;
      const woptions: yubo.WaveOptions = {
        passPhrase: '',
        aq10UseKeyEncrypted: '',
      };
      const poptions: yubo.PlayOptions = {
        volume: TEST_VOLUME,
        playbackRate: 1.0,
        detune: 0,
      };
      // wave
      AquesService.wave($scope.play1Encoded, phont, speed, woptions).then((bufWav) => {
        // play
        AudioService1.play(bufWav, poptions).then((value) => {
          $scope.playResult1 = 'ok';
        })
        .catch((err: Error) => {
          $scope.playResult1 = err.message;
        });
      })
      .catch((err: Error) => {
        $scope.playResult1 = err.message;
      });
    };
    ctrl.play1AqVer2 = function(): void {
      // phont
      const list = YPhontMasterList;
      let phont;
      for (let i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk2') {
          phont = list[i]; break;
        }
      }
      const speed = 100;
      const woptions: yubo.WaveOptions = {
        passPhrase: '',
        aq10UseKeyEncrypted: '',
      };
      const poptions: yubo.PlayOptions = {
        volume: TEST_VOLUME,
        playbackRate: 1.0,
        detune: 0,
      };
      // wave
      AquesService.wave($scope.play1Encoded, phont, speed, woptions).then((bufWav) => {
        // play
        AudioService1.play(bufWav, poptions).then((value) => {
          $scope.playResult1 = 'ok';
        })
        .catch((err: Error) => {
          $scope.playResult1 = err.message;
        });
      })
      .catch((err: Error) => {
        $scope.playResult1 = err.message;
      });
    };
    ctrl.play1AqVer10 = function(): void {
      // phont
      const list = YPhontMasterList;
      let phont;
      for (let i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk10') {
          phont = list[i]; break;
        }
      }
      const speed = 100;
      const woptions: yubo.WaveOptions = {
        passPhrase: 'xxxxxxx',
        aq10UseKeyEncrypted: '',
      };
      const poptions: yubo.PlayOptions = {
        volume: TEST_VOLUME,
        playbackRate: 1.0,
        detune: 0,
      };
      // wave
      AquesService.wave($scope.play1Encoded, phont, speed, woptions).then((bufWav) => {
        // play
        AudioService1.play(bufWav, poptions).then((value) => {
          $scope.playResult1 = 'ok';
        })
        .catch((err: Error) => {
          $scope.playResult1 = err.message;
        });
      })
      .catch((err: Error) => {
        $scope.playResult1 = err.message;
      });
    };

    ctrl.record1AqVer1 = function(): void {
      // phont
      const list = YPhontMasterList;
      let phont;
      for (let i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk1') {
          phont = list[i]; break;
        }
      }
      const speed = 100;
      const woptions: yubo.WaveOptions = {
        passPhrase: 'xxxxxxx',
        aq10UseKeyEncrypted: '',
      };
      const poptions: yubo.PlayOptions = {
        volume: TEST_VOLUME,
        playbackRate: 1.0,
        detune: 0,
      };
      // wave
      AquesService.wave($scope.play1Encoded, phont, speed, woptions).then((bufWav) => {
        // play
        AudioService1.record($scope.wavFilePath1, bufWav, poptions).then((value) => {
          $scope.recordResult1 = 'ok';
        })
        .catch((err: Error) => {
          $scope.recordResult1 = err.message;
        });
      })
      .catch((err: Error) => {
        $scope.recordResult1 = err.message;
      });
    };
    ctrl.record1AqVer2 = function(): void {
      // phont
      const list = YPhontMasterList;
      let phont;
      for (let i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk2') {
          phont = list[i]; break;
        }
      }
      const speed = 100;
      const woptions: yubo.WaveOptions = {
        passPhrase: 'xxxxxxx',
        aq10UseKeyEncrypted: '',
      };
      const poptions: yubo.PlayOptions = {
        volume: TEST_VOLUME,
        playbackRate: 1.0,
        detune: 0,
      };
      // wave
      AquesService.wave($scope.play1Encoded, phont, speed, woptions).then((bufWav) => {
        // play
        AudioService1.record($scope.wavFilePath1, bufWav, poptions).then((value) => {
          $scope.recordResult1 = 'ok';
        })
        .catch((err: Error) => {
          $scope.recordResult1 = err.message;
        });
      })
      .catch((err: Error) => {
        $scope.recordResult1 = err.message;
      });
    };
    ctrl.record1AqVer10 = function(): void {
      // phont
      const list = YPhontMasterList;
      let phont;
      for (let i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk10') {
          phont = list[i]; break;
        }
      }
      const speed = 100;
      const woptions: yubo.WaveOptions = {
        passPhrase: 'xxxxxxx',
        aq10UseKeyEncrypted: '',
      };
      const poptions: yubo.PlayOptions = {
        volume: TEST_VOLUME,
        playbackRate: 1.0,
        detune: 0,
      };
      // wave
      AquesService.wave($scope.play1Encoded, phont, speed, woptions).then((bufWav) => {
        // play
        AudioService1.record($scope.wavFilePath1, bufWav, poptions).then((value) => {
          $scope.recordResult1 = 'ok';
        })
        .catch((err: Error) => {
          $scope.recordResult1 = err.message;
        });
      })
      .catch((err: Error) => {
        $scope.recordResult1 = err.message;
      });
    };

    // AudioService2
    ctrl.play2AqVer1 = function(): void {
      // phont
      const list = YPhontMasterList;
      let phont;
      for (let i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk1') {
          phont = list[i]; break;
        }
      }
      const speed = 100;
      const woptions: yubo.WaveOptions = {
        passPhrase: '',
        aq10UseKeyEncrypted: '',
      };
      const poptions: yubo.PlayOptions = {
        volume: TEST_VOLUME,
        playbackRate: 1.0,
        detune: 0,
      };
      // wave
      AquesService.wave($scope.play2Encoded, phont, speed, woptions).then((bufWav) => {
        // play
        AudioService2.play(bufWav, poptions).then((value) => {
          $scope.playResult2 = 'ok';
        })
        .catch((err: Error) => {
          $scope.playResult2 = err.message;
        });
      })
      .catch((err: Error) => {
        $scope.playResult2 = err.message;
      });
    };
    ctrl.play2AqVer2 = function(): void {
      // phont
      const list = YPhontMasterList;
      let phont;
      for (let i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk2') {
          phont = list[i]; break;
        }
      }
      const speed = 100;
      const woptions: yubo.WaveOptions = {
        passPhrase: '',
        aq10UseKeyEncrypted: '',
      };
      const poptions: yubo.PlayOptions = {
        volume: TEST_VOLUME,
        playbackRate: 1.0,
        detune: 0,
      };
      // wave
      AquesService.wave($scope.play2Encoded, phont, speed, woptions).then((bufWav) => {
        // play
        AudioService2.play(bufWav, poptions).then((value) => {
          $scope.playResult2 = 'ok';
        })
        .catch((err: Error) => {
          $scope.playResult2 = err.message;
        });
      })
      .catch((err: Error) => {
        $scope.playResult2 = err.message;
      });
    };
    ctrl.play2AqVer10 = function(): void {
      // phont
      const list = YPhontMasterList;
      let phont;
      for (let i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk10') {
          phont = list[i]; break;
        }
      }
      const speed = 100;
      const woptions: yubo.WaveOptions = {
        passPhrase: 'xxxxxxx',
        aq10UseKeyEncrypted: '',
      };
      const poptions: yubo.PlayOptions = {
        volume: TEST_VOLUME,
        playbackRate: 1.0,
        detune: 0,
      };
      // wave
      AquesService.wave($scope.play2Encoded, phont, speed, woptions).then((bufWav) => {
        // play
        AudioService2.play(bufWav, poptions).then((value) => {
          $scope.playResult2 = 'ok';
        })
        .catch((err: Error) => {
          $scope.playResult2 = err.message;
        });
      })
      .catch((err: Error) => {
        $scope.playResult2 = err.message;
      });
    };

    ctrl.record2AqVer1 = function(): void {
      // phont
      const list = YPhontMasterList;
      let phont;
      for (let i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk1') {
          phont = list[i]; break;
        }
      }
      const speed = 100;
      const woptions: yubo.WaveOptions = {
        passPhrase: '',
        aq10UseKeyEncrypted: '',
      };
      const poptions: yubo.PlayOptions = {
        volume: TEST_VOLUME,
        playbackRate: 1.0,
        detune: 0,
      };
      // wave
      AquesService.wave($scope.play2Encoded, phont, speed, woptions).then((bufWav) => {
        // play
        AudioService2.record($scope.wavFilePath2, bufWav, poptions).then((value) => {
          $scope.recordResult2 = 'ok';
        })
        .catch((err: Error) => {
          $scope.recordResult2 = err.message;
        });
      })
      .catch((err: Error) => {
        $scope.recordResult2 = err.message;
      });
    };
    ctrl.record2AqVer2 = function(): void {
      // phont
      const list = YPhontMasterList;
      let phont;
      for (let i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk2') {
          phont = list[i]; break;
        }
      }
      const speed = 100;
      const woptions: yubo.WaveOptions = {
        passPhrase: '',
        aq10UseKeyEncrypted: '',
      };
      const poptions: yubo.PlayOptions = {
        volume: TEST_VOLUME,
        playbackRate: 1.0,
        detune: 0,
      };
      // wave
      AquesService.wave($scope.play2Encoded, phont, speed, woptions).then((bufWav) => {
        // play
        AudioService2.record($scope.wavFilePath2, bufWav, poptions).then((value) => {
          $scope.recordResult2 = 'ok';
        })
        .catch((err: Error) => {
          $scope.recordResult2 = err.message;
        });
      })
      .catch((err: Error) => {
        $scope.recordResult2 = err.message;
      });
    };
    ctrl.record2AqVer10 = function(): void {
      // phont
      const list = YPhontMasterList;
      let phont;
      for (let i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk10') {
          phont = list[i]; break;
        }
      }
      const speed = 100;
      const woptions: yubo.WaveOptions = {
        passPhrase: 'xxxxxxx',
        aq10UseKeyEncrypted: '',
      };
      const poptions: yubo.PlayOptions = {
        volume: TEST_VOLUME,
        playbackRate: 1.0,
        detune: 0,
      };
      // wave
      AquesService.wave($scope.play2Encoded, phont, speed, woptions).then((bufWav) => {
        // play
        AudioService2.record($scope.wavFilePath2, bufWav, poptions).then((value) => {
          $scope.recordResult2 = 'ok';
        })
        .catch((err: Error) => {
          $scope.recordResult2 = err.message;
        });
      })
      .catch((err: Error) => {
        $scope.recordResult2 = err.message;
      });
    };

    // AqUsrDicService
    ctrl.generateUserDict = function(): void {
      const r = AqUsrDicService.generateUserDict($scope.csvPath, $scope.userDicPath);
      if (r.success) {
        $scope.generateUserDictResult = 'ok';
      } else {
        $scope.generateUserDictResult = r.message;
      }
    };
    ctrl.generateCSV = function(): void {
      const r = AqUsrDicService.generateCSV($scope.userDicPath, $scope.csvPath);
      if (r.success) {
        $scope.generateCsvResult = 'ok';
      } else {
        $scope.generateCsvResult = r.message;
      }
    };
    ctrl.validateInput = function(): void {
      const r = AqUsrDicService.validateInput($scope.surface, $scope.yomi, $scope.posCode);
      if (r.success) {
        $scope.validateInputResult = 'ok';
      } else {
        $scope.validateInputResult = r.message;
      }
    };
    ctrl.getLastError = function(): void {
      const r = AqUsrDicService.getLastError();
      $scope.getLastErrorResult = r;
    };

    // TextSubtitleService
    ctrl.sourceFname = function(): void {
      const r = TextSubtitleService.sourceFname($scope.wavFilePath);
      $scope.sourceFnameResult = r;
    };
    ctrl.save = function(): void {
      TextSubtitleService.save($scope.filePath, $scope.sourceText)
      .then(() => {
        $scope.saveResult = 'ok';
      })
      .catch((err: Error) => {
        $scope.saveError = err.message;
      });
    };

    // SeqFNameService
    ctrl.nextFname = function(): void {
      const r = SeqFNameService.nextFname($scope.prefix, $scope.num);
      $scope.nextFnameResult = r;
    };
    ctrl.splitFname = function(): void {
      const r = SeqFNameService.splitFname($scope.splitFnameFilepath);
      $scope.splitFnameResult = JSON.stringify(r);
    };
    ctrl.nextNumber = function(): void {
      SeqFNameService.nextNumber($scope.nextNumberDir, $scope.nextNumberPrefix)
      .then((n: number) => {
        $scope.nextNumberResult = n;
      });
    };

    // AppUtilService
    ctrl.disableRhythm = function(): void {
      const r = AppUtilService.disableRhythm($scope.rhythmText);
      $scope.disableRhythmResult = r;
    };
    ctrl.reportDuration = function(): void {
      AppUtilService.reportDuration($scope.duration);
    };
    $scope.$on('duration', (event: ng.IAngularEvent, duration: number) => {
      $scope.reportDurationResult = duration;
      $timeout(() => { $scope.$apply(); });
    });
  }]);

