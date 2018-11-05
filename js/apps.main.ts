var app = require('electron').remote.app;
var _ipcRenderer, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };
var _clipboard, clipboard     = () => { _clipboard = _clipboard || require('electron').clipboard; return _clipboard; };
var _path, path               = () => { _path = _path || require('path'); return _path; };
var _fs, fs                   = () => { _fs = _fs || require('fs'); return _fs; };
var _log, log                 = () => { _log = _log || require('electron-log'); return _log; };

// application settings
var desktopDir = app.getPath('desktop');

// handle uncaughtException
process.on('uncaughtException', (err: Error) => {
  log().error('main:event:uncaughtException');
  log().error(err);
  log().error(err.stack);
});

// angular app
angular.module('yvoiceApp', ['input-highlight', 'yvoiceDirective', 'yvoiceService', 'yvoiceCommandService', 'yvoiceIntroService', 'yvoiceModel'])
  .config(['$qProvider', ($qProvider) => {
    $qProvider.errorOnUnhandledRejections(false);
  }])
  // controller
  .controller('MainController',
    ['$scope', '$timeout', '$q', 'MessageService', 'DataService', 'MasterService', 'AquesService',
     'AudioService1', 'AudioService2', 'AudioSourceService', 'SeqFNameService', 'AppUtilService', 'CommandService', 'IntroService',
     'YInput', 'YInputInitialData',
    function(
      $scope: yubo.IMainScope, $timeout, $q,
      MessageService: yubo.MessageService, DataService: yubo.DataService, MasterService: yubo.MasterService,
      AquesService: yubo.AquesService,
      audioServVer1: yubo.AudioService1, audioServVer2: yubo.AudioService2, AudioSourceService: yubo.AudioSourceService,
      SeqFNameService: yubo.SeqFNameService, AppUtilService: yubo.AppUtilService, CommandService: yubo.CommandService,
      IntroService: yubo.IntroService,
      YInput: yubo.YInput, YInputInitialData: yubo.YInput) {

    // event listener
    $scope.$on('message', (event, message: yubo.IMessage | yubo.IRecordMessage) => {
      $scope.messageList.unshift(message);
      while ($scope.messageList.length > 5) {
        $scope.messageList.pop();
      }
      $timeout(() => { $scope.$apply(); });
    });
    $scope.$on('wavGenerated', (event, wavFileInfo: yubo.IRecordMessage) => {
      $scope.lastWavFile = wavFileInfo;
      $timeout(() => { $scope.$apply(); });
    });
    $scope.$on('duration', (event, duration: number) => {
      $scope.duration = duration;
      $timeout(() => { $scope.$apply(); });
    });

    // shortcut
    ipcRenderer().on('shortcut', (event, action: string) => {
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
            const indexToN = $scope.yvoiceList.indexOf($scope.yvoice);
            if ($scope.yvoiceList.length > indexToN + 1) {
              $scope.yvoice = $scope.yvoiceList[indexToN + 1];
            } else {
              $scope.yvoice = $scope.yvoiceList[0];
            }
            $scope.display = 'main';
            $timeout(() => { $scope.$apply(); });
          }
          break;
        case 'swichPreviousConfig':
          {
            const indexToP = $scope.yvoiceList.indexOf($scope.yvoice);
            if (indexToP - 1 >= 0) {
              $scope.yvoice = $scope.yvoiceList[indexToP - 1];
            } else {
              $scope.yvoice = $scope.yvoiceList[$scope.yvoiceList.length - 1];
            }
            $scope.display = 'main';
            $timeout(() => { $scope.$apply(); });
          }
          break;
        case 'encode':
          document.getElementById('encode').click();
          break;
      }
    });

    // menu
    ipcRenderer().on('menu', (event, action: string) => {
      switch (action) {
        case 'clear':
          document.getElementById('clear').click();
          $timeout(() => { $scope.$apply(); });
          break;
        case 'plus':
          document.getElementById('plus').click();
          $timeout(() => { $scope.$apply(); });
          break;
        case 'minus':
          {
            const indexForM = $scope.yvoiceList.indexOf($scope.yvoice);
            ctrl.minus(indexForM);
            $timeout(() => { $scope.$apply(); });
          }
          break;
        case 'copy':
          {
            const indexForCP = $scope.yvoiceList.indexOf($scope.yvoice);
            ctrl.copy(indexForCP);
            $timeout(() => { $scope.$apply(); });
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
    ipcRenderer().on('dropTextFile', (event, filePath: string) => {
      fs().readFile(filePath, 'utf-8', (err: Error, data: string) => {
        if (err) {
          MessageService.error('テキストファイルを読み込めませんでした。', err);
          return;
        }
        if ($scope.yinput) {
          const win = require('electron').remote.getCurrentWindow();
          win.focus();
          $scope.yinput.source = data;
          $timeout(() => { $scope.$apply(); });
        }
      });
    });

    // application settings
    let appCfg = require('electron').remote.getGlobal('appCfg');
    let AudioService = appCfg.audioServVer == 'html5audio'? audioServVer1: audioServVer2;
    $scope.appCfg = appCfg;

    // init
    const ctrl = this;
    $scope.display = 'main';
    $scope.phontList = MasterService.getPhontList();
    $scope.aq10BasList = [{name:'F1E', id:0}, {name:'F2E', id:1}, {name:'M1E', id:2}];
    $scope.yinput = angular.copy(YInput);
    $scope.messageList = [];
    $scope.lastWavFile = null;
    $scope.alwaysOnTop = false;
    $scope.isTest = appCfg.isTest;
    loadData();

    // util
    function loadData(): void {
      DataService.load().then((dataList) => {
        if (dataList.length < 1) {
          MessageService.info('初期データを読み込みます。');
          dataList = DataService.initialData();
        }
        $scope.yvoiceList = dataList;
        $scope.yvoice = $scope.yvoiceList[0];
        $timeout(() => { $scope.$apply(); });
      });
    }
    function selectedSource(): string {
      const textarea = document.getElementById('source') as HTMLInputElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      return selectedText;
    }
    function selectedEncoded(): string {
      const textarea = document.getElementById('encoded') as HTMLInputElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      return selectedText;
    }

    // selected text highlight
    $scope.sourceHighlight = {
      '#619FFF' : '{{ sourceHighlight["#619FFF"] }}',
    };
    $scope.encodedHighlight = {
      '#619FFF' : '{{ encodedHighlight["#619FFF"] }}',
    };
    ctrl.blurOnSource = function(): void {
      $scope.sourceHighlight['#619FFF'] = selectedSource();
    };
    ctrl.blurOnEncoded = function(): void {
      $scope.encodedHighlight['#619FFF'] = selectedEncoded();
    };
    ctrl.focusOnSource = function(): void {
      clearSourceSelection();
      clearEncodedSelection();
    };
    ctrl.focusOnEncoded = function(): void {
      clearSourceSelection();
      clearEncodedSelection();
    };
    function clearSourceSelection(): void {
      $scope.sourceHighlight['#619FFF'] = '';
      const textarea = document.getElementById('source') as HTMLInputElement;
      textarea.selectionStart = 0;
      textarea.selectionEnd = 0;
    }
    function clearEncodedSelection(): void {
      $scope.encodedHighlight['#619FFF'] = '';
      const textarea = document.getElementById('encoded') as HTMLInputElement;
      textarea.selectionStart = 0;
      textarea.selectionEnd = 0;
    }

    // list box selection changed
    ctrl.onChangePhont = function(): void {
      let phont = null;
      angular.forEach($scope.phontList, (value, key) => {
        if (value.id == $scope.yvoice.phont) { phont = value; }
      });
      if (!phont) { return; }
      $scope.yvoice.version = phont.version;
      if (phont.version == 'talk10') {
        $scope.yvoice.bas = phont.struct.bas;
        $scope.yvoice.pit = phont.struct.pit;
        $scope.yvoice.acc = phont.struct.acc;
        $scope.yvoice.lmd = phont.struct.lmd;
        $scope.yvoice.fsc = phont.struct.fsc;
      } else {
        delete $scope.yvoice.bas;
        delete $scope.yvoice.pit;
        delete $scope.yvoice.acc;
        delete $scope.yvoice.lmd;
        delete $scope.yvoice.fsc;
      }
    };

    // action
    ctrl.play = function(): void {
      MessageService.action('start to play voice.');
      if (!$scope.yinput.source && !$scope.yinput.encoded) {
        MessageService.error('メッセージ、音記号列、どちらも入力されていません。');
        return;
      }

      // text converting
      let encoded = $scope.yinput.encoded;
      const _selectedEncoded = selectedEncoded();
      if (_selectedEncoded) {
        encoded = _selectedEncoded;
        clearSourceSelection();
      }
      if (!encoded) {
        let source = $scope.yinput.source;
        const _selectedSource = selectedSource();
        if (_selectedSource) {
          source = _selectedSource;
        }
        // encoding, command
        if (CommandService.containsCommand(source, $scope.yvoiceList)) {
          const parsedListForEnc = CommandService.parseInput(source, $scope.yvoiceList, $scope.yvoice);
          angular.forEach(parsedListForEnc, (cinput) => {
            cinput.text = AquesService.encode(cinput.text);
          });
          for (let i=0; i < parsedListForEnc.length; i++) {
            if (!parsedListForEnc[i].text) {
              MessageService.error('一部テキストを音記号列に変換できませんでした。');
              return;
            }
          }
          encoded = CommandService.toString(parsedListForEnc);
        // encoding, not command
        } else {
          encoded = AquesService.encode(source);
          if (!encoded) {
            MessageService.error('音記号列に変換できませんでした。');
            return;
          }
        }
      }

      // play
      const parsedList = CommandService.parseInput(encoded, $scope.yvoiceList, $scope.yvoice);
      parsedList.reduce((p, cinput) => {
        if(p.then === undefined) {
          p.resolve();
          p = p.promise;
        }
        return p.then(() => {
          return playEach(cinput);
        });
      }, $q.defer());
    };
    function playEach(cinput): ng.IPromise<string> {
      const d = $q.defer();
      let encoded = cinput.text;
      const yvoice = CommandService.detectVoiceConfig(cinput, $scope.yvoiceList);

      // phont
      let phont = null;
      angular.forEach($scope.phontList, (value, key) => {
        if (value.id == yvoice.phont) { phont = value; }
      });
      if (!phont) {
        MessageService.error('声の種類が未指定です。');
        d.reject(null); return d.promise;
      }

      // disable rhythm if option is on
      if (! yvoice.rhythmOn) {
        encoded = AppUtilService.disableRhythm(encoded);
      }

      const speed = yvoice.speed;
      if (! (Number(yvoice.writeMarginMs)===parseInt(`${yvoice.writeMarginMs}`))) {
        yvoice.writeMarginMs = 150;
      }
      const waveOptions: yubo.WaveOptions = {
        passPhrase:appCfg.passPhrase,
        aq10UseKeyEncrypted:appCfg.aq10UseKeyEncrypted,
      };
      if (phont.version == 'talk10') {
        waveOptions.bas = yvoice.bas;
        waveOptions.pit = yvoice.pit;
        waveOptions.acc = yvoice.acc;
        waveOptions.lmd = yvoice.lmd;
        waveOptions.fsc = yvoice.fsc;
      }
      const playOptions: yubo.PlayOptions = {
        volume:yvoice.volume,
        playbackRate:yvoice.playbackRate,
        detune:yvoice.detune,
        writeMarginMs:yvoice.writeMarginMs,
      };

      AquesService.wave(encoded, phont, speed, waveOptions).then((bufWav) => {
        return AudioService.play(bufWav, playOptions).then(() => {
          d.resolve('ok');
        })
        .catch((err: Error) => {
          MessageService.error('音声データを再生できませんでした。', err);
          d.reject(err);
        });
      })
      .catch((err: Error) => {
        MessageService.error('音声データを作成できませんでした。', err);
        d.reject(err);
      });
      return d.promise;
    }
    ctrl.stop = function(): void {
      MessageService.action('stop playing voice.');
      AudioService.stop();
    };
    ctrl.record = function(): void {
      MessageService.action('record voice.');
      if (!$scope.yinput.source && !$scope.yinput.encoded) {
        MessageService.error('メッセージ、音記号列、どちらも入力されていません。');
        return;
      }

      let phont = null;
      angular.forEach($scope.phontList, (value, key) => {
        if (value.id == $scope.yvoice.phont) { phont = value; }
      });
      if (!phont) {
        MessageService.error('声の種類が未指定です。');
        return;
      }

      // text converting
      let encoded = $scope.yinput.encoded;
      const _selectedEncoded = selectedEncoded();
      if (_selectedEncoded) {
        encoded = _selectedEncoded;
        clearSourceSelection();
      }
      if (!encoded) {
        let source = $scope.yinput.source;
        const _selectedSource = selectedSource();
        if (_selectedSource) {
          source = _selectedSource;
        }
        // encoding, command
        if (CommandService.containsCommand(source, $scope.yvoiceList)) {
          const parsedListForEnc = CommandService.parseInput(source, $scope.yvoiceList, $scope.yvoice);
          angular.forEach(parsedListForEnc, (cinput) => {
            cinput.text = AquesService.encode(cinput.text);
          });
          for (let i=0; i < parsedListForEnc.length; i++) {
            if (!parsedListForEnc[i].text) {
              MessageService.error('一部テキストを音記号列に変換できませんでした。');
              return;
            }
          }
          encoded = CommandService.toString(parsedListForEnc);
        // encoding, not command
        } else {
          encoded = AquesService.encode(source);
          if (!encoded) {
            MessageService.error('音記号列に変換できませんでした。');
            return;
          }
        }
      }

      // 連番保存
      if ($scope.yvoice.seqWrite) {
        let dir = $scope.yvoice.seqWriteOptions.dir;
        const prefix = $scope.yvoice.seqWriteOptions.prefix;
        if (!dir) {
          dir = desktopDir;
        }

        // record
        const parsedList = CommandService.parseInput(encoded, $scope.yvoiceList, $scope.yvoice);
        let sourceFname = null;
        // record wave files
        parsedList.reduce((p, cinput) => {
          if(p.then === undefined) {
            p.resolve();
            p = p.promise;
          }
          return p.then((fp) => {
            return recordEach(cinput, dir, prefix)
              .then((fp) => {
                if ($scope.yvoice.sourceWrite && !sourceFname) {
                  sourceFname = AudioSourceService.sourceFname(fp);
                }
                MessageService.record(`${'音声ファイルを保存しました。path: '}${fp}`, fp, sourceFname);
                return fp;
              });
          });
        }, $q.defer())
        // record source message
        .then((fp) => {
          if (!sourceFname) { return; }
          AudioSourceService.save(sourceFname, $scope.yinput.source).then(() => {
            MessageService.recordSource(`${'メッセージファイルを保存しました。path: '}${sourceFname}`, sourceFname);
          })
          .catch((err: Error) => {
            MessageService.error('メッセージファイルを作成できませんでした。', err);
          });
        });

      // 通常保存
      } else {
        ipcRenderer().once('showSaveDialog', (event, filePath) => {
          if (!filePath) {
            MessageService.error('保存先が指定されませんでした。');
            return;
          }
          const splitted = SeqFNameService.splitFname(filePath);
          const dir = splitted.dir;
          const prefix = splitted.basename;

          // record
          const containsCommand = CommandService.containsCommand(encoded, $scope.yvoiceList);
          const parsedList = CommandService.parseInput(encoded, $scope.yvoiceList, $scope.yvoice);
          let sourceFname = null;
          // record wave files
          parsedList.reduce((p, cinput) => {
            if(p.then === undefined) {
              p.resolve();
              p = p.promise;
            }
            return p.then((fp) => {
              if (containsCommand) {
                return recordEach(cinput, dir, prefix)
                  .then((fp) => {
                    if ($scope.yvoice.sourceWrite && !sourceFname) {
                      sourceFname = AudioSourceService.sourceFname(fp);
                    }
                    MessageService.record(`${'音声ファイルを保存しました。path: '}${fp}`, fp, sourceFname);
                    return fp;
                  });
              } else {
                return recordSolo(cinput, filePath)
                  .then((fp) => {
                    if ($scope.yvoice.sourceWrite && !sourceFname) {
                      sourceFname = AudioSourceService.sourceFname(fp);
                    }
                    MessageService.record(`${'音声ファイルを保存しました。path: '}${fp}`, fp, sourceFname);
                    return fp;
                  });
              }
            });
          }, $q.defer())
          // record source message
          .then((fp) => {
            if (!sourceFname) { return; }
            AudioSourceService.save(sourceFname, $scope.yinput.source).then(() => {
              MessageService.recordSource(`${'メッセージファイルを保存しました。path: '}${sourceFname}`, sourceFname);
            })
            .catch((err: Error) => {
              MessageService.error('メッセージファイルを作成できませんでした。', err);
            });
          });
        });
        ipcRenderer().send('showSaveDialog', 'wav');
      }
    };
    function recordSolo(cinput, filePath): ng.IPromise<string> {
      const d = $q.defer();
      let encoded = cinput.text;
      const yvoice = CommandService.detectVoiceConfig(cinput, $scope.yvoiceList);

      // phont
      let phont = null;
      angular.forEach($scope.phontList, (value, key) => {
        if (value.id == yvoice.phont) { phont = value; }
      });
      if (!phont) {
        MessageService.error('声の種類が未指定です。');
        d.reject(null); return d.promise;
      }

      // disable rhythm if option is on
      if (! yvoice.rhythmOn) {
        encoded = AppUtilService.disableRhythm(encoded);
      }

      const speed = yvoice.speed;
      if (! (Number(yvoice.writeMarginMs)===parseInt(`${yvoice.writeMarginMs}`))) {
        yvoice.writeMarginMs = 150;
      }
      const waveOptions: yubo.WaveOptions = {
        passPhrase:appCfg.passPhrase,
        aq10UseKeyEncrypted:appCfg.aq10UseKeyEncrypted,
      };
      if (phont.version == 'talk10') {
        waveOptions.bas = yvoice.bas;
        waveOptions.pit = yvoice.pit;
        waveOptions.acc = yvoice.acc;
        waveOptions.lmd = yvoice.lmd;
        waveOptions.fsc = yvoice.fsc;
      }
      const playOptions: yubo.PlayOptions = {
        volume:yvoice.volume,
        playbackRate:yvoice.playbackRate,
        detune:yvoice.detune,
        writeMarginMs:yvoice.writeMarginMs,
      };

      AquesService.wave(encoded, phont, speed, waveOptions).then((bufWav) => {
        return AudioService.record(filePath, bufWav, playOptions).then(() => {
          d.resolve(filePath);
        })
        .catch((err: Error) => {
          MessageService.error('音声データを記録できませんでした。', err);
          d.reject(err);
        });
      })
      .catch((err: Error) => {
        MessageService.error('音声データを作成できませんでした。', err);
        d.reject(err);
      });
      return d.promise;
    }
    function recordEach(cinput, dir, fnameprefix): ng.IPromise<string> {
      const d = $q.defer();
      let encoded = cinput.text;
      const yvoice = CommandService.detectVoiceConfig(cinput, $scope.yvoiceList);

      // phont
      let phont = null;
      angular.forEach($scope.phontList, (value, key) => {
        if (value.id == yvoice.phont) { phont = value; }
      });
      if (!phont) {
        MessageService.error('声の種類が未指定です。');
        d.reject(null); return d.promise;
      }

      // disable rhythm if option is on
      if (! yvoice.rhythmOn) {
        encoded = AppUtilService.disableRhythm(encoded);
      }

      const speed = yvoice.speed;
      if (! (Number(yvoice.writeMarginMs)===parseInt(`${yvoice.writeMarginMs}`))) {
        yvoice.writeMarginMs = 150;
      }
      const waveOptions: yubo.WaveOptions = {
        passPhrase:appCfg.passPhrase,
        aq10UseKeyEncrypted:appCfg.aq10UseKeyEncrypted,
      };
      if (phont.version == 'talk10') {
        waveOptions.bas = yvoice.bas;
        waveOptions.pit = yvoice.pit;
        waveOptions.acc = yvoice.acc;
        waveOptions.lmd = yvoice.lmd;
        waveOptions.fsc = yvoice.fsc;
      }
      const playOptions: yubo.PlayOptions = {
        volume:yvoice.volume,
        playbackRate:yvoice.playbackRate,
        detune:yvoice.detune,
        writeMarginMs:yvoice.writeMarginMs,
      };

      SeqFNameService.nextNumber(dir, fnameprefix).then((nextNum) => {
        const nextFname = SeqFNameService.nextFname(fnameprefix, nextNum);
        const filePath = path().join(dir, nextFname);

        AquesService.wave(encoded, phont, speed, waveOptions).then((bufWav) => {
          return AudioService.record(filePath, bufWav, playOptions).then(() => {
            d.resolve(filePath);
          })
          .catch((err: Error) => {
            MessageService.error('音声データを記録できませんでした。', err);
            d.reject(err);
          });
        })
        .catch((err: Error) => {
          MessageService.error('音声データを作成できませんでした。', err);
          d.reject(err);
        });
      });
      return d.promise;
    }
    ctrl.showSystemWindow = function(): void {
      if (!appCfg.isTest) { return; }
      ipcRenderer().send('showSystemWindow', 'system');
    };
    ctrl.showSpecWindow = function(): void {
      if (!appCfg.isTest) { return; }
      ipcRenderer().send('showSpecWindow', 'spec');
    };
    ctrl.help = function(): void {
      MessageService.action('open help window.');
      ipcRenderer().send('showHelpWindow', 'help');
    };
    ctrl.tutorial = function(): void {
      if ($scope.display == 'main') {
        MessageService.action('run main tutorial.');
        IntroService.mainTutorial();
      } else {
        MessageService.action('run settings tutorial.');
        IntroService.settingsTutorial();
      }
    };
    ctrl.shortcut = function(): void {
      MessageService.action('show shortcut key help.');
      if ($scope.display == 'main') {
        IntroService.shortcut();
      } else {
        $scope.display = 'main';
        MessageService.info('標準の画面に切り替えます。');
        $timeout(function(){
          $scope.$apply();
          IntroService.shortcut();
        });
      }
    };
    ctrl.select = function(index): void {
      MessageService.action('switch voice config.');
      $scope.yvoice = $scope.yvoiceList[index];
      $scope.display = 'main';
    };
    ctrl.plus = function(): void {
      MessageService.action('add new voice config.');
      const newYvoice = DataService.create();
      $scope.yvoiceList.push(newYvoice);
    };
    ctrl.minus = function(index): void {
      MessageService.action('delete voice config.');
      if ($scope.yvoiceList.length < 2) {
        MessageService.error('ボイス設定は1件以上必要です。');
        return;
      }
      $scope.yvoiceList.splice(index, 1);
      $scope.yvoice = $scope.yvoiceList[0];
      $scope.display = 'main';
    };
    ctrl.copy = function(index): void {
      MessageService.action('copy and create new voice config.');
      const original = $scope.yvoiceList[index];
      const newYvoice = DataService.copy(original);
      $scope.yvoiceList.push(newYvoice);
    };
    ctrl.save = function(): void {
      MessageService.action('save voice config.');
      DataService.save($scope.yvoiceList);
    };
    ctrl.reset = function(): void {
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
    ctrl.quickLookMessage = function(message: yubo.IWriteMessage): void {
      if (message.type != 'record' && message.type != 'source') { return; }
      const quickLookPath = message.quickLookPath;
      fs().stat(quickLookPath, (err: Error, stats) => {
        if (err) { return; }
        //MessageService.action(`open with Quick Look. file: ${wavFilePath}`);
        const win = require('electron').remote.getCurrentWindow();
        win.previewFile(quickLookPath);
      });
    };

    ctrl.encode = function(): void {
      MessageService.action('encode source text.');
      let source = $scope.yinput.source;
      const _selectedSource = selectedSource();
      if (_selectedSource) {
        source = _selectedSource;
      }

      // command
      if (CommandService.containsCommand(source, $scope.yvoiceList)) {
        const parsedList = CommandService.parseInput(source, $scope.yvoiceList, $scope.yvoice);
        angular.forEach(parsedList, function(cinput) {
          cinput.text = AquesService.encode(cinput.text);
        });
        $scope.yinput.encoded = CommandService.toString(parsedList);
        clearEncodedSelection();
      // not command
      } else {
        const encoded = AquesService.encode(source);
        $scope.yinput.encoded = encoded;
        clearEncodedSelection();
      }
    };
    ctrl.clear = function(): void {
      MessageService.action('clear input text.');
      $scope.yinput.source = '';
      $scope.yinput.encoded = '';
      clearSourceSelection();
      clearEncodedSelection();
    };
    ctrl.fromClipboard = function(): void {
      MessageService.action('paste clipboard text to source.');
      const text = clipboard().readText();
      if (text) {
        $scope.yinput.source = text;
        $scope.yinput.encoded = '';
        clearSourceSelection();
        clearEncodedSelection();
      } else {
        MessageService.info('クリップボードにデータがありません。');
      }
    };
    ctrl.putVoiceName = function(): void {
      const field = document.activeElement as HTMLInputElement;
      if (field.id != 'source' && field.id != 'encoded') { return; }

      const pos = field.selectionStart;
      const length = field.value.length;

      // top
      if (pos == 0) {
        $scope.yinput[field.id] = `${$scope.yvoice.name}${'＞'}${field.value}`;
        field.selectionStart = (`${$scope.yvoice.name}${'＞'}`).length;
        field.selectionEnd = (`${$scope.yvoice.name}${'＞'}`).length;
      // last
      } else if (pos == length) {
        if (field.value.substring(pos-1, pos) == '\n') {
          $scope.yinput[field.id] = `${field.value}${$scope.yvoice.name}${'＞'}`;
          field.selectionStart = (field.value).length;
          field.selectionEnd = (field.value).length;
        } else {
          $scope.yinput[field.id] = `${field.value}\n${$scope.yvoice.name}${'＞'}`;
          field.selectionStart = (field.value).length;
          field.selectionEnd = (field.value).length;
        }
      // in text
      } else {
        if (field.value.substring(pos-1, pos) == '\n') {
          $scope.yinput[field.id] = `${field.value.substring(0, pos)}${$scope.yvoice.name}${'＞'}${field.value.substring(pos, length)}`;
          field.selectionStart = (`${field.value.substring(0, pos)}${$scope.yvoice.name}${'＞'}`).length;
          field.selectionEnd = (`${field.value.substring(0, pos)}${$scope.yvoice.name}${'＞'}`).length;
        } else {
          $scope.yinput[field.id] = `${field.value.substring(0, pos)}\n${$scope.yvoice.name}${'＞'}${field.value.substring(pos, length)}`;
          field.selectionStart = (`${field.value.substring(0, pos)}\n${$scope.yvoice.name}${'＞'}`).length;
          field.selectionEnd = (`${field.value.substring(0, pos)}\n${$scope.yvoice.name}${'＞'}`).length;
        }
      }
      $timeout(() => { $scope.$apply(); });
    };
    ctrl.directory = function(): void {
      MessageService.action('select directory.');
      if (!$scope.yvoice.seqWrite) {
        MessageService.error('連番ファイル設定が無効です。');
        return;
      }

      ipcRenderer().once('showDirDialog', (event, dirs) => {
        if (!dirs || dirs.length < 1) {
          return;
        }
        $scope.yvoice.seqWriteOptions.dir = dirs[0];
        $timeout(() => { $scope.$apply(); });
      });
      let optDir = $scope.yvoice.seqWriteOptions.dir;
      if (!optDir) { optDir = desktopDir; }
      ipcRenderer().send('showDirDialog', optDir);
    };

    ctrl.switchSettingsView = function(): void {
      MessageService.action('switch to settings view.');
      $scope.display = 'settings';
    };
    ctrl.switchMainView = function(): void {
      MessageService.action('switch to main view.');
      $scope.display = 'main';
    };

    ctrl.switchAlwaysOnTop = function(): void {
      MessageService.action('switch alwaysOnTop option.');
      ipcRenderer().send('switchAlwaysOnTop', 'mainWindow');
    };
    ipcRenderer().on('switchAlwaysOnTop', (event, newflg) => {
      $scope.alwaysOnTop = newflg;
      MessageService.info(`update alwaysOnTop option ${newflg?'ON':'OFF'}`);
      $timeout(() => { $scope.$apply(); });
    });
  }]);
