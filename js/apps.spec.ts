// application spec app
angular.module('yvoiceSpec',
  ['yvoiceModel', 'yvoiceService', 'yvoiceLicenseService', 'yvoiceIntroService', 'yvoiceMessageService', 'yvoiceCommandService'])
  .config(['$qProvider', ($qProvider) => {
    $qProvider.errorOnUnhandledRejections(false);
  }])
  .controller('SpecController', ['$scope', '$timeout',
      'YPhontList', 'YVoice', 'YVoiceInitialData', 'YInput', 'YInputInitialData', 'YCommandInput',
      'LicenseService', 'IntroService', 'MessageService',
      'DataService', 'MasterService',
      'AquesService', 'AudioService1', 'AudioService2', 'AudioSourceService',
      'AppUtilService', 'SeqFNameService',
    function($scope: any, $timeout,
      YPhontList: yubo.YPhont[], YVoice: yubo.YVoice, YVoiceInitialData: yubo.YVoice[],
      YInput: yubo.YInput, YInputInitialData: yubo.YInput, YCommandInput: yubo.YCommandInput,
      LicenseService: yubo.LicenseService, IntroService: yubo.IntroService, MessageService: yubo.MessageService,
      DataService: yubo.DataService, MasterService: yubo.MasterService,
      AquesService: yubo.AquesService, AudioService1: yubo.AudioService1, AudioService2: yubo.AudioService2,
      AudioSourceService: yubo.AudioSourceService,
      AppUtilService: yubo.AppUtilService, SeqFNameService: yubo.SeqFNameService) {

    // init
    const ctrl = this;

    // YPhontList
    ctrl.getYPhontList = function(): void {
      const r = YPhontList;
      $scope.getYPhontListResult = JSON.stringify(r);
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
        $scope.consumerKeyResult = value;
        $scope.consumerKeyDone = 'ok';
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

    // MessageService
    ctrl.action = function(): void {
      const msg = 'action message';
      MessageService.action(msg);
    };
    ctrl.record = function(): void {
      const msg = 'record message';
      const wavFilePath = '/tmp/hoge.txt';
      MessageService.record(msg, wavFilePath);
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
    $scope.$on('message', (event, message: yubo.IMessage | yubo.IRecordMessage) => {
      $scope.messageServicePost = JSON.stringify(message);
      $timeout(() => { $scope.$apply(); });
    });
    $scope.$on('wavGenerated', (event, wavFileInfo) => {
      $scope.lastWavFile = JSON.stringify(wavFileInfo);
      $timeout(() => { $scope.$apply(); });
    });

    // DataService
    ctrl.load = function(): void {
      DataService.load().then((list) => {
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

    // MasterService
    ctrl.getPhontList = function(): void {
      const list = MasterService.getPhontList();
      $scope.getPhontListResult = JSON.stringify(list);
    };

    // AquesService
    ctrl.encode = function(): void {
      const r = AquesService.encode($scope.source);
      $scope.encodeResult = r;
    };
    ctrl.waveVer1 = function(): void {
      const list = MasterService.getPhontList();
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
      const list = MasterService.getPhontList();
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
      const list = MasterService.getPhontList();
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
      const list = MasterService.getPhontList();
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
        volume: 1.0,
        playbackRate: 1.0,
        detune: 0,
        writeMarginMs: 150,
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
      const list = MasterService.getPhontList();
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
        volume: 1.0,
        playbackRate: 1.0,
        detune: 0,
        writeMarginMs: 150,
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
      const list = MasterService.getPhontList();
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
        volume: 1.0,
        playbackRate: 1.0,
        detune: 0,
        writeMarginMs: 150,
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
      const list = MasterService.getPhontList();
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
        volume: 1.0,
        playbackRate: 1.0,
        detune: 0,
        writeMarginMs: 150,
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
      const list = MasterService.getPhontList();
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
        volume: 1.0,
        playbackRate: 1.0,
        detune: 0,
        writeMarginMs: 150,
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
      const list = MasterService.getPhontList();
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
        volume: 1.0,
        playbackRate: 1.0,
        detune: 0,
        writeMarginMs: 150,
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
      const list = MasterService.getPhontList();
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
        volume: 1.0,
        playbackRate: 1.0,
        detune: 0,
        writeMarginMs: 150,
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
      const list = MasterService.getPhontList();
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
        volume: 1.0,
        playbackRate: 1.0,
        detune: 0,
        writeMarginMs: 150,
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
      const list = MasterService.getPhontList();
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
        volume: 1.0,
        playbackRate: 1.0,
        detune: 0,
        writeMarginMs: 150,
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
      const list = MasterService.getPhontList();
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
        volume: 1.0,
        playbackRate: 1.0,
        detune: 0,
        writeMarginMs: 150,
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
      const list = MasterService.getPhontList();
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
        volume: 1.0,
        playbackRate: 1.0,
        detune: 0,
        writeMarginMs: 150,
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
      const list = MasterService.getPhontList();
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
        volume: 1.0,
        playbackRate: 1.0,
        detune: 0,
        writeMarginMs: 150,
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

    // AudioSourceService
    ctrl.sourceFname = function(): void {
      const r = AudioSourceService.sourceFname($scope.wavFilePath);
      $scope.sourceFnameResult = r;
    };
    ctrl.save = function(): void {
      AudioSourceService.save($scope.filePath, $scope.sourceText)
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

    // AppUtilService
    ctrl.disableRhythm = function(): void {
      const r = AppUtilService.disableRhythm($scope.rhythmText);
      $scope.disableRhythmResult = r;
    };
    ctrl.reportDuration = function(): void {
      AppUtilService.reportDuration($scope.duration);
    };
    $scope.$on('duration', (event, duration: number) => {
      $scope.reportDurationResult = duration;
      $timeout(() => { $scope.$apply(); });
    });
  }]);

