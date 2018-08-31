// application spec app
angular.module('yvoiceSpec', ['yvoiceService', 'yvoiceLicenseService'])
  .config(['$qProvider', ($qProvider) => {
    $qProvider.errorOnUnhandledRejections(false);
  }])
  .controller('SpecController', ['$scope',
      'YPhontList', 'YVoice', 'YVoiceInitialData', 'YInput', 'YInputInitialData', 'YCommandInput',
      'LicenseService',
      'DataService', 'MasterService',
      'AquesService', 'AudioService1', 'AudioService2', 'AudioSourceService',
      'AppUtilService', 'SeqFNameService',
    function($scope: any,
      YPhontList: yubo.YPhont[], YVoice: yubo.YVoice, YVoiceInitialData: yubo.YVoice[],
      YInput: yubo.YInput, YInputInitialData: yubo.YInput, YCommandInput: yubo.YCommandInput,
      LicenseService: yubo.LicenseService,
      DataService: yubo.DataService, MasterService: yubo.MasterService,
      AquesService: yubo.AquesService, AudioService1: yubo.AudioService1, AudioService2: yubo.AudioService2,
      AudioSourceService: yubo.AudioSourceService,
      AppUtilService: yubo.AppUtilService, SeqFNameService: yubo.SeqFNameService) {

    // init
    var ctrl = this;

    // YPhontList
    ctrl.getYPhontList = function(): void {
      var r = YPhontList;
      $scope.getYPhontListResult = JSON.stringify(r);
    };
    // YVoice
    ctrl.getYVoice = function(): void {
      var r = YVoice;
      $scope.getYVoiceResult = JSON.stringify(r);
    };
    // YVoiceInitialData
    ctrl.getYVoiceInitialData = function(): void {
      var r = YVoiceInitialData;
      $scope.getYVoiceInitialDataResult = JSON.stringify(r);
    };
    // YInput
    ctrl.getYInput = function(): void {
      var r = YInput;
      $scope.getYInputResult = JSON.stringify(r);
    };
    // YInputInitialData
    ctrl.getYInputInitialData = function(): void {
      var r = YInputInitialData;
      $scope.getYInputInitialDataResult = JSON.stringify(r);
    };
    // YCommandInput
    ctrl.getYCommandInput = function(): void {
      var r = YCommandInput;
      $scope.getYCommandInputResult = JSON.stringify(r);
    };

    // LicenseService
    ctrl.encrypt = function(): void {
      var r = LicenseService.encrypt($scope.passPhrase, $scope.plainKey);
      $scope.encryptedKey = r;
    };
    ctrl.decrypt = function(): void {
      var r = LicenseService.decrypt($scope.passPhrase, $scope.encryptedKey);
      $scope.plainKey = r;
    };
    ctrl.consumerKey = function(): void {
      LicenseService.consumerKey($scope.licenseType).then((value) => {
        $scope.consumerKeyResult = value;
        $scope.consumerKeyDone = 'ok';
      })
      .catch((err) => {
        $scope.consumerKeyErr = err;
      });
    };

    // DataService
    ctrl.load = function(): void {
      DataService.load().then((list) => {
        $scope.loadResult = JSON.stringify(list);
      })
      .catch((err) => {
        $scope.loadErr = err;
      });
    };
    ctrl.initialData = function(): void {
      var r = DataService.initialData();
      $scope.initialDataResult = JSON.stringify(r);
    };
    ctrl.create = function(): void {
      var r = DataService.create();
      $scope.createResult = JSON.stringify(r);
    };
    ctrl.copy = function(): void {
      var original = { text: 'value' };
      var r = DataService.copy(original);
      $scope.copyResult = JSON.stringify(r);
    };

    // MasterService
    ctrl.getPhontList = function(): void {
      var list = MasterService.getPhontList();
      $scope.getPhontListResult = JSON.stringify(list);
    };

    // AquesService
    ctrl.encode = function(): void {
      var r = AquesService.encode($scope.source);
      $scope.encodeResult = r;
    };
    ctrl.waveVer1 = function(): void {
      var list = MasterService.getPhontList();
      var phont;
      for (var i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk1') {
          phont = list[i]; break;
        }
      }
      var speed = 100;
      var options: yubo.WaveOptions = {
        passPhrase: '',
        aq10UseKeyEncrypted: '',
      };
      AquesService.wave($scope.encoded, phont, speed, options).then((value) => {
        $scope.waveResult = 'ok';
      })
      .catch((err) => {
        $scope.waveErr = err;
      });
    };
    ctrl.waveVer2 = function(): void {
      var list = MasterService.getPhontList();
      var phont;
      for (var i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk2') {
          phont = list[i]; break;
        }
      }
      var speed = 100;
      var options: yubo.WaveOptions = {
        passPhrase: '',
        aq10UseKeyEncrypted: '',
      };
      AquesService.wave($scope.encoded, phont, speed, options).then((value) => {
        $scope.waveResult = 'ok';
      })
      .catch((err) => {
        $scope.waveErr = err;
      });
    };
    ctrl.waveVer10 = function(): void {
      var list = MasterService.getPhontList();
      var phont;
      for (var i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk10') {
          phont = list[i]; break;
        }
      }
      var speed = 100;
      var options = { passPhrase:'xxxxxxx', aq10UseKeyEncrypted:'' };
      AquesService.wave($scope.encoded, phont, speed, options).then((value) => {
        $scope.waveResult = 'ok';
      })
      .catch((err) => {
        $scope.waveErr = err;
      });
    };

    // AudioService1
    ctrl.play1AqVer1 = function(): void {
      // phont
      var list = MasterService.getPhontList();
      var phont;
      for (var i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk1') {
          phont = list[i]; break;
        }
      }
      var speed = 100;
      var woptions: yubo.WaveOptions = {
        passPhrase: '',
        aq10UseKeyEncrypted: '',
      };
      var poptions: yubo.PlayOptions = {
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
        .catch((err) => {
          $scope.playResult1 = err.message;
        });
      })
      .catch((err) => {
        $scope.playResult1 = err.message;
      });
    };
    ctrl.play1AqVer2 = function(): void {
      // phont
      var list = MasterService.getPhontList();
      var phont;
      for (var i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk2') {
          phont = list[i]; break;
        }
      }
      var speed = 100;
      var woptions: yubo.WaveOptions = {
        passPhrase: '',
        aq10UseKeyEncrypted: '',
      };
      var poptions: yubo.PlayOptions = {
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
        .catch((err) => {
          $scope.playResult1 = err.message;
        });
      })
      .catch((err) => {
        $scope.playResult1 = err.message;
      });
    };
    ctrl.play1AqVer10 = function(): void {
      // phont
      var list = MasterService.getPhontList();
      var phont;
      for (var i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk10') {
          phont = list[i]; break;
        }
      }
      var speed = 100;
      var woptions: yubo.WaveOptions = {
        passPhrase: 'xxxxxxx',
        aq10UseKeyEncrypted: '',
      };
      var poptions: yubo.PlayOptions = {
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
        .catch((err) => {
          $scope.playResult1 = err.message;
        });
      })
      .catch((err) => {
        $scope.playResult1 = err.message;
      });
    };

    ctrl.record1AqVer1 = function(): void {
      // phont
      var list = MasterService.getPhontList();
      var phont;
      for (var i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk1') {
          phont = list[i]; break;
        }
      }
      var speed = 100;
      var woptions: yubo.WaveOptions = {
        passPhrase: 'xxxxxxx',
        aq10UseKeyEncrypted: '',
      };
      var poptions: yubo.PlayOptions = {
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
        .catch((err) => {
          $scope.recordResult1 = err.message;
        });
      })
      .catch((err) => {
        $scope.recordResult1 = err.message;
      });
    };
    ctrl.record1AqVer2 = function(): void {
      // phont
      var list = MasterService.getPhontList();
      var phont;
      for (var i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk2') {
          phont = list[i]; break;
        }
      }
      var speed = 100;
      var woptions: yubo.WaveOptions = {
        passPhrase: 'xxxxxxx',
        aq10UseKeyEncrypted: '',
      };
      var poptions: yubo.PlayOptions = {
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
        .catch((err) => {
          $scope.recordResult1 = err.message;
        });
      })
      .catch((err) => {
        $scope.recordResult1 = err.message;
      });
    };
    ctrl.record1AqVer10 = function(): void {
      // phont
      var list = MasterService.getPhontList();
      var phont;
      for (var i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk10') {
          phont = list[i]; break;
        }
      }
      var speed = 100;
      var woptions: yubo.WaveOptions = {
        passPhrase: 'xxxxxxx',
        aq10UseKeyEncrypted: '',
      };
      var poptions: yubo.PlayOptions = {
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
        .catch((err) => {
          $scope.recordResult1 = err.message;
        });
      })
      .catch((err) => {
        $scope.recordResult1 = err.message;
      });
    };

    // AudioService2
    ctrl.play2AqVer1 = function(): void {
      // phont
      var list = MasterService.getPhontList();
      var phont;
      for (var i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk1') {
          phont = list[i]; break;
        }
      }
      var speed = 100;
      var woptions: yubo.WaveOptions = {
        passPhrase: '',
        aq10UseKeyEncrypted: '',
      };
      var poptions: yubo.PlayOptions = {
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
        .catch((err) => {
          $scope.playResult2 = err.message;
        });
      })
      .catch((err) => {
        $scope.playResult2 = err.message;
      });
    };
    ctrl.play2AqVer2 = function(): void {
      // phont
      var list = MasterService.getPhontList();
      var phont;
      for (var i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk2') {
          phont = list[i]; break;
        }
      }
      var speed = 100;
      var woptions: yubo.WaveOptions = {
        passPhrase: '',
        aq10UseKeyEncrypted: '',
      };
      var poptions: yubo.PlayOptions = {
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
        .catch((err) => {
          $scope.playResult2 = err.message;
        });
      })
      .catch((err) => {
        $scope.playResult2 = err.message;
      });
    };
    ctrl.play2AqVer10 = function(): void {
      // phont
      var list = MasterService.getPhontList();
      var phont;
      for (var i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk10') {
          phont = list[i]; break;
        }
      }
      var speed = 100;
      var woptions: yubo.WaveOptions = {
        passPhrase: 'xxxxxxx',
        aq10UseKeyEncrypted: '',
      };
      var poptions: yubo.PlayOptions = {
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
        .catch((err) => {
          $scope.playResult2 = err.message;
        });
      })
      .catch((err) => {
        $scope.playResult2 = err.message;
      });
    };

    ctrl.record2AqVer1 = function(): void {
      // phont
      var list = MasterService.getPhontList();
      var phont;
      for (var i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk1') {
          phont = list[i]; break;
        }
      }
      var speed = 100;
      var woptions: yubo.WaveOptions = {
        passPhrase: '',
        aq10UseKeyEncrypted: '',
      };
      var poptions: yubo.PlayOptions = {
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
        .catch((err) => {
          $scope.recordResult2 = err.message;
        });
      })
      .catch((err) => {
        $scope.recordResult2 = err.message;
      });
    };
    ctrl.record2AqVer2 = function(): void {
      // phont
      var list = MasterService.getPhontList();
      var phont;
      for (var i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk2') {
          phont = list[i]; break;
        }
      }
      var speed = 100;
      var woptions: yubo.WaveOptions = {
        passPhrase: '',
        aq10UseKeyEncrypted: '',
      };
      var poptions: yubo.PlayOptions = {
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
        .catch((err) => {
          $scope.recordResult2 = err.message;
        });
      })
      .catch((err) => {
        $scope.recordResult2 = err.message;
      });
    };
    ctrl.record2AqVer10 = function(): void {
      // phont
      var list = MasterService.getPhontList();
      var phont;
      for (var i = 0; i < list.length; i ++) {
        if (list[i].version == 'talk10') {
          phont = list[i]; break;
        }
      }
      var speed = 100;
      var woptions: yubo.WaveOptions = {
        passPhrase: 'xxxxxxx',
        aq10UseKeyEncrypted: '',
      };
      var poptions: yubo.PlayOptions = {
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
        .catch((err) => {
          $scope.recordResult2 = err.message;
        });
      })
      .catch((err) => {
        $scope.recordResult2 = err.message;
      });
    };

    // AudioSourceService
    ctrl.sourceFname = function(): void {
      var r = AudioSourceService.sourceFname($scope.wavFilePath);
      $scope.sourceFnameResult = r;
    };
    ctrl.save = function(): void {
      // TODO save test
      //AudioSourceService.save($scope.filePath, $scope.sourceText);
      $scope.saveResult = 'ok';
    };

    // SeqFNameService
    ctrl.nextFname = function(): void {
      var r = SeqFNameService.nextFname($scope.prefix, $scope.num);
      $scope.nextFnameResult = r;
    };

    // AppUtilService
    ctrl.disableRhythm = function(): void {
      var r = AppUtilService.disableRhythm($scope.rhythmText);
      $scope.disableRhythmResult = r;
    };
  }]);

