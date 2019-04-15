var app = require('electron').remote.app;
var _ipcRenderer, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };
var _clipboard, clipboard     = () => { _clipboard = _clipboard || require('electron').clipboard; return _clipboard; };
var _path, path               = () => { _path = _path || require('path'); return _path; };
var _fs, fs                   = () => { _fs = _fs || require('fs'); return _fs; };
var _log, log                 = () => { _log = _log || require('electron-log'); return _log; };
var _monitor, monitor         = () => { _monitor = _monitor || require('electron-performance-monitor'); return _monitor; };
var _waitUntil, waitUntil     = () => { _waitUntil = _waitUntil || require('wait-until'); return _waitUntil; };

// env
var MONITOR = process.env.MONITOR != null;

// application settings
var desktopDir = app.getPath('desktop');

// action reducer
class MainReducer implements yubo.MainReducer {
  private appCfg: yubo.AppCfg = require('electron').remote.getGlobal('appCfg');
  private AudioService: yubo.IAudioService = this.appCfg.audioServVer == 'html5audio'? this.audioServVer1: this.audioServVer2;

  constructor(
    private $timeout: ng.ITimeoutService,
    private $q: ng.IQService,
    private store: yubo.MainStore,
    private MessageService: yubo.MessageService,
    private DataService: yubo.DataService,
    private HistoryService: yubo.HistoryService,
    private AquesService: yubo.AquesService,
    private audioServVer1: yubo.AudioService1,
    private audioServVer2: yubo.AudioService2,
    private AudioSourceService: yubo.AudioSourceService,
    private SeqFNameService: yubo.SeqFNameService,
    private AppUtilService: yubo.AppUtilService,
    private CommandService: yubo.CommandService,
    private IntroService: yubo.IntroService,
    private YInputInitialData: yubo.YInput
  ) {}

  // event
  onShortcut($scope: yubo.IMainScope, action: string): void {
    switch (action) {
      case 'putVoiceName':
        this.putVoiceName($scope);
        break;
      case 'swichNextConfig':
        {
          const indexToN = $scope.yvoiceList.indexOf($scope.yvoice);
          if ($scope.yvoiceList.length > indexToN + 1) {
            $scope.yvoice = $scope.yvoiceList[indexToN + 1];
          } else {
            $scope.yvoice = $scope.yvoiceList[0];
          }
          this.store.display = 'main';
          this.$timeout(() => { $scope.$apply(); });
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
          this.store.display = 'main';
          this.$timeout(() => { $scope.$apply(); });
        }
        break;
    }
  }
  onMenu($scope: yubo.IMainScope, action: string): void {
    switch (action) {
      case 'minus':
        {
          const indexForM = $scope.yvoiceList.indexOf($scope.yvoice);
          this.minus($scope, indexForM);
          this.$timeout(() => { $scope.$apply(); });
        }
        break;
      case 'copy':
        {
          const indexForCP = $scope.yvoiceList.indexOf($scope.yvoice);
          this.copy($scope, indexForCP);
          this.$timeout(() => { $scope.$apply(); });
        }
        break;
      case 'reset':
        this.reset($scope);
        break;
      case 'clearRecentDocuments':
        this.clearRecentDocuments($scope);
        break;
    }
  }
  onDropTextFile($scope: yubo.IMainScope, filePath: string): void {
    this.MessageService.action('drop textfile to app icon.');
    fs().readFile(filePath, 'utf-8', (err: Error, data: string) => {
      if (err) {
        this.MessageService.error('テキストファイルを読み込めませんでした。', err);
        return;
      }
      if ($scope.yinput) {
        const win = require('electron').remote.getCurrentWindow();
        win.focus();
        $scope.yinput.source = data;
        this.$timeout(() => { $scope.$apply(); });
      }
    });
  }
  onRecentDocument($scope: yubo.IMainScope, filePath: string): void {
    this.MessageService.action('select from Recent Document List.');

    const f = (filePath: string) => {
      const r = this.HistoryService.get(filePath);
      if (r) {
        $scope.yinput.source = r.source;
        $scope.yinput.encoded = r.encoded;
        this.$timeout(() => { $scope.$apply(); });
      } else {
        this.MessageService.info('履歴データは見つかりませんでした。');
      }
    };

    if (this.HistoryService.loaded()) {
      f(filePath);
    } else {
      waitUntil()(300, 10, this.HistoryService.loaded, () => {
        f(filePath);
      });
    }
  }

  // $onInit
  init($scope: yubo.IMainScope): void {
    $scope.appCfg = this.appCfg;
    this.loadData($scope, null);
  }
  onLoad($scope: yubo.IMainScope): void {
    this.loadHistory($scope);
    this.AquesService.init(); // initialize AquesService

    // event listener
    $scope.$on('message', (event: ng.IAngularEvent, message: yubo.IMessage | yubo.IRecordMessage) => {
      this.store.messageList.unshift(message);
      while (this.store.messageList.length > 5) {
        this.store.messageList.pop();
      }
      this.$timeout(() => { $scope.$apply(); });
    });
    $scope.$on('wavGenerated', (event: ng.IAngularEvent, wavFileInfo: yubo.IRecordMessage) => {
      // lastWavFile
      $scope.lastWavFile = wavFileInfo;
      // generatedList
      this.store.generatedList.unshift(wavFileInfo);
      while (this.store.generatedList.length > 10) {
        this.store.generatedList.pop();
      }
      this.$timeout(() => { $scope.$apply(); });
      // recentDocumentList
      app.addRecentDocument(wavFileInfo.wavFilePath);
      this.HistoryService.add(wavFileInfo);
      this.HistoryService.save();
    });
    $scope.$on('duration', (event: ng.IAngularEvent, duration: number) => {
      this.$timeout(() => { // $scope.$apply
        $scope.duration = duration;
      });
    });
  }

  private loadData($scope: yubo.IMainScope, nextTask: () => void): void {
    if (MONITOR) { log().warn(monitor().format('apps.main', 'loadData called')); }
    let dataList = dataJson;
    if (dataList.length < 1) {
      this.MessageService.info('初期データを読み込みます。');
      dataList = this.DataService.initialData();
      this.$timeout(() => { // $scope.$apply
        $scope.yvoiceList = dataList;
        $scope.yvoice = $scope.yvoiceList[0];
      });
    }
    if (MONITOR) { log().warn(monitor().format('apps.main', 'loadData done')); }
    if (nextTask) { nextTask(); }
  }
  private loadHistory($scope: yubo.IMainScope): void {
    this.HistoryService.load().then((cache) => {
      this.$timeout(() => { // $scope.$apply
        this.store.generatedList = this.HistoryService.getList();
        while (this.store.generatedList.length > 10) {
          this.store.generatedList.pop();
        }
      });
    });
  }

  private selectedSource(): string {
    const textarea = document.getElementById('source') as HTMLInputElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    return selectedText;
  }
  private selectedEncoded(): string {
    const textarea = document.getElementById('encoded') as HTMLInputElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    return selectedText;
  }

  // selected text highlight
  blurOnSource($scope: yubo.IMainScope): void {
    $scope.sourceHighlight['#619FFF'] = this.selectedSource();
  }
  blurOnEncoded($scope: yubo.IMainScope): void {
    $scope.encodedHighlight['#619FFF'] = this.selectedEncoded();
  }
  focusOnSource($scope: yubo.IMainScope): void {
    this.clearSourceSelection($scope);
    this.clearEncodedSelection($scope);
  }
  focusOnEncoded($scope: yubo.IMainScope): void {
    this.clearSourceSelection($scope);
    this.clearEncodedSelection($scope);
  }
  private clearSourceSelection($scope: yubo.IMainScope): void {
    $scope.sourceHighlight['#619FFF'] = '';
    const textarea = document.getElementById('source') as HTMLInputElement;
    textarea.selectionStart = 0;
    textarea.selectionEnd = 0;
  }
  private clearEncodedSelection($scope: yubo.IMainScope): void {
    $scope.encodedHighlight['#619FFF'] = '';
    const textarea = document.getElementById('encoded') as HTMLInputElement;
    textarea.selectionStart = 0;
    textarea.selectionEnd = 0;
  }

  // list box selection changed
  onChangePhont($scope: yubo.IMainScope): void {
    let phont: yubo.YPhont = null;
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
  }

  // action
  play($scope: yubo.IMainScope): void {
    this.MessageService.action('start to play voice.');
    if (!$scope.yinput.source && !$scope.yinput.encoded) {
      this.MessageService.error('メッセージ、音記号列、どちらも入力されていません。');
      return;
    }

    // text converting
    let encoded = $scope.yinput.encoded;
    const _selectedEncoded = this.selectedEncoded();
    if (_selectedEncoded) {
      encoded = _selectedEncoded;
      this.clearSourceSelection($scope);
    }
    if (!encoded) {
      let source = $scope.yinput.source;
      const _selectedSource = this.selectedSource();
      if (_selectedSource) {
        source = _selectedSource;
      }
      // encoding, command
      if (this.CommandService.containsCommand(source, $scope.yvoiceList)) {
        const parsedListForEnc = this.CommandService.parseInput(source, $scope.yvoiceList, $scope.yvoice);
        angular.forEach(parsedListForEnc, (cinput) => {
          cinput.text = this.AquesService.encode(cinput.text);
        });
        for (let i=0; i < parsedListForEnc.length; i++) {
          if (!parsedListForEnc[i].text) {
            this.MessageService.error('一部テキストを音記号列に変換できませんでした。');
            return;
          }
        }
        encoded = this.CommandService.toString(parsedListForEnc);
      // encoding, not command
      } else {
        encoded = this.AquesService.encode(source);
        if (!encoded) {
          this.MessageService.error('音記号列に変換できませんでした。');
          return;
        }
      }
    }

    // play
    const parsedList = this.CommandService.parseInput(encoded, $scope.yvoiceList, $scope.yvoice);
    parsedList.reduce((p: any/*ng.IDeferred<string> | ng.IPromise<string>*/, cinput) => {
      if (p.then === undefined) {
        p.resolve();
        p = p.promise;
      }
      return (p as ng.IPromise<string>).then(() => {
        return this.playEach($scope, cinput);
      });
    }, this.$q.defer<string>());
  }
  private playEach($scope: yubo.IMainScope, cinput: yubo.YCommandInput): ng.IPromise<string> {
    const d = this.$q.defer<string>();
    let encoded = cinput.text;
    const yvoice = this.CommandService.detectVoiceConfig(cinput, $scope.yvoiceList);

    // phont
    let phont: yubo.YPhont = null;
    angular.forEach($scope.phontList, (value, key) => {
      if (value.id == yvoice.phont) { phont = value; }
    });
    if (!phont) {
      this.MessageService.error('声の種類が未指定です。');
      d.reject(new Error('声の種類が未指定です。')); return d.promise;
    }

    // disable rhythm if option is on
    if (! yvoice.rhythmOn) {
      encoded = this.AppUtilService.disableRhythm(encoded);
    }

    const speed = yvoice.speed;
    const waveOptions: yubo.WaveOptions = {
      passPhrase: this.appCfg.passPhrase,
      aq10UseKeyEncrypted: this.appCfg.aq10UseKeyEncrypted,
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
    };

    this.AquesService.wave(encoded, phont, speed, waveOptions).then((bufWav) => {
      return this.AudioService.play(bufWav, playOptions).then(() => {
        d.resolve('ok');
      })
      .catch((err: Error) => {
        this.MessageService.error('音声データを再生できませんでした。', err);
        d.reject(err);
      });
    })
    .catch((err: Error) => {
      this.MessageService.error('音声データを作成できませんでした。', err);
      d.reject(err);
    });
    return d.promise;
  }
  stop(): void {
    this.MessageService.action('stop playing voice.');
    this.AudioService.stop();
  }
  record($scope: yubo.IMainScope): void {
    this.MessageService.action('record voice.');
    if (!$scope.yinput.source && !$scope.yinput.encoded) {
      this.MessageService.error('メッセージ、音記号列、どちらも入力されていません。');
      return;
    }

    let phont: yubo.YPhont = null;
    angular.forEach($scope.phontList, (value, key) => {
      if (value.id == $scope.yvoice.phont) { phont = value; }
    });
    if (!phont) {
      this.MessageService.error('声の種類が未指定です。');
      return;
    }

    // text converting
    let encoded = $scope.yinput.encoded;
    let loggingSourceText = $scope.yinput.source;
    const _selectedEncoded = this.selectedEncoded();
    if (_selectedEncoded) {
      encoded = _selectedEncoded;
      this.clearSourceSelection($scope);
    }
    if (!encoded) {
      let source = $scope.yinput.source;
      const _selectedSource = this.selectedSource();
      if (_selectedSource) {
        source = _selectedSource;
        loggingSourceText = _selectedSource;
      }
      // encoding, command
      if (this.CommandService.containsCommand(source, $scope.yvoiceList)) {
        const parsedListForEnc = this.CommandService.parseInput(source, $scope.yvoiceList, $scope.yvoice);
        angular.forEach(parsedListForEnc, (cinput) => {
          cinput.text = this.AquesService.encode(cinput.text);
        });
        for (let i=0; i < parsedListForEnc.length; i++) {
          if (!parsedListForEnc[i].text) {
            this.MessageService.error('一部テキストを音記号列に変換できませんでした。');
            return;
          }
        }
        encoded = this.CommandService.toString(parsedListForEnc);
      // encoding, not command
      } else {
        encoded = this.AquesService.encode(source);
        if (!encoded) {
          this.MessageService.error('音記号列に変換できませんでした。');
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
      const parsedList = this.CommandService.parseInput(encoded, $scope.yvoiceList, $scope.yvoice);
      let sourceFname: string = null;
      // record wave files
      parsedList.reduce((p: any/*ng.IDeferred<string> | ng.IPromise<string>*/, cinput) => {
        if (p.then === undefined) {
          p.resolve();
          p = p.promise;
        }
        return (p as ng.IPromise<string>).then((fp: string) => {
          return this.recordEach($scope, cinput, dir, prefix)
            .then((fp) => {
              if ($scope.yvoice.sourceWrite && !sourceFname) {
                sourceFname = this.AudioSourceService.sourceFname(fp);
              }
              this.MessageService.record(`${'音声ファイルを保存しました。path: '}${fp}`,
                {
                  wavFilePath: fp,
                  srcTextPath: sourceFname,
                  source: loggingSourceText,
                  encoded: cinput.text,
                }
              );
              return fp;
            });
        });
      }, this.$q.defer<string>())
      // record source message
      .then((fp: string) => {
        if (!sourceFname) { return; }
        this.AudioSourceService.save(sourceFname, loggingSourceText).then(() => {
          this.MessageService.recordSource(`${'メッセージファイルを保存しました。path: '}${sourceFname}`,
            {
              srcTextPath: sourceFname,
              source: loggingSourceText,
            }
          );
        })
        .catch((err: Error) => {
          this.MessageService.error('メッセージファイルを作成できませんでした。', err);
        });
      });

    // 通常保存
    } else {
      ipcRenderer().once('showSaveDialog', (event: Electron.Event, filePath: string) => {
        if (!filePath) {
          this.MessageService.error('保存先が指定されませんでした。');
          return;
        }
        const splitted = this.SeqFNameService.splitFname(filePath);
        const dir = splitted.dir;
        const prefix = splitted.basename;

        // record
        const containsCommand = this.CommandService.containsCommand(encoded, $scope.yvoiceList);
        const parsedList = this.CommandService.parseInput(encoded, $scope.yvoiceList, $scope.yvoice);
        let sourceFname: string = null;
        // record wave files
        parsedList.reduce((p: any/*ng.IDeferred<string> | ng.IPromise<string>*/, cinput) => {
          if (p.then === undefined) {
            p.resolve();
            p = p.promise;
          }
          return (p as ng.IPromise<string>).then((fp: string) => {
            if (containsCommand) {
              return this.recordEach($scope, cinput, dir, prefix)
                .then((fp) => {
                  if ($scope.yvoice.sourceWrite && !sourceFname) {
                    sourceFname = this.AudioSourceService.sourceFname(fp);
                  }
                  this.MessageService.record(`${'音声ファイルを保存しました。path: '}${fp}`,
                    {
                      wavFilePath: fp,
                      srcTextPath: sourceFname,
                      source: loggingSourceText,
                      encoded: cinput.text,
                    }
                  );
                  return fp;
                });
            } else {
              return this.recordSolo($scope, cinput, filePath)
                .then((fp) => {
                  if ($scope.yvoice.sourceWrite && !sourceFname) {
                    sourceFname = this.AudioSourceService.sourceFname(fp);
                  }
                  this.MessageService.record(`${'音声ファイルを保存しました。path: '}${fp}`,
                    {
                      wavFilePath: fp,
                      srcTextPath: sourceFname,
                      source: loggingSourceText,
                      encoded: cinput.text,
                    }
                  );
                  return fp;
                });
            }
          });
        }, this.$q.defer<string>())
        // record source message
        .then((fp: string) => {
          if (!sourceFname) { return; }
          this.AudioSourceService.save(sourceFname, loggingSourceText).then(() => {
            this.MessageService.recordSource(`${'メッセージファイルを保存しました。path: '}${sourceFname}`,
              {
                srcTextPath: sourceFname,
                source: loggingSourceText,
              }
            );
          })
          .catch((err: Error) => {
            this.MessageService.error('メッセージファイルを作成できませんでした。', err);
          });
        });
      });
      ipcRenderer().send('showSaveDialog', 'wav');
    }
  }
  private recordSolo($scope: yubo.IMainScope, cinput: yubo.YCommandInput, filePath: string): ng.IPromise<string> {
    const d = this.$q.defer<string>();
    let encoded = cinput.text;
    const yvoice = this.CommandService.detectVoiceConfig(cinput, $scope.yvoiceList);

    // phont
    let phont: yubo.YPhont = null;
    angular.forEach($scope.phontList, (value, key) => {
      if (value.id == yvoice.phont) { phont = value; }
    });
    if (!phont) {
      this.MessageService.error('声の種類が未指定です。');
      d.reject(new Error('声の種類が未指定です。')); return d.promise;
    }

    // disable rhythm if option is on
    if (! yvoice.rhythmOn) {
      encoded = this.AppUtilService.disableRhythm(encoded);
    }

    const speed = yvoice.speed;
    const waveOptions: yubo.WaveOptions = {
      passPhrase: this.appCfg.passPhrase,
      aq10UseKeyEncrypted: this.appCfg.aq10UseKeyEncrypted,
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
    };

    this.AquesService.wave(encoded, phont, speed, waveOptions).then((bufWav) => {
      return this.AudioService.record(filePath, bufWav, playOptions).then(() => {
        d.resolve(filePath);
      })
      .catch((err: Error) => {
        this.MessageService.error('音声データを記録できませんでした。', err);
        d.reject(err);
      });
    })
    .catch((err: Error) => {
      this.MessageService.error('音声データを作成できませんでした。', err);
      d.reject(err);
    });
    return d.promise;
  }
  private recordEach($scope: yubo.IMainScope, cinput: yubo.YCommandInput, dir: string, fnameprefix: string): ng.IPromise<string> {
    const d = this.$q.defer<string>();
    let encoded = cinput.text;
    const yvoice = this.CommandService.detectVoiceConfig(cinput, $scope.yvoiceList);

    // phont
    let phont: yubo.YPhont = null;
    angular.forEach($scope.phontList, (value, key) => {
      if (value.id == yvoice.phont) { phont = value; }
    });
    if (!phont) {
      this.MessageService.error('声の種類が未指定です。');
      d.reject(new Error('声の種類が未指定です。')); return d.promise;
    }

    // disable rhythm if option is on
    if (! yvoice.rhythmOn) {
      encoded = this.AppUtilService.disableRhythm(encoded);
    }

    const speed = yvoice.speed;
    const waveOptions: yubo.WaveOptions = {
      passPhrase: this.appCfg.passPhrase,
      aq10UseKeyEncrypted: this.appCfg.aq10UseKeyEncrypted,
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
    };

    this.SeqFNameService.nextNumber(dir, fnameprefix).then((nextNum) => {
      const nextFname = this.SeqFNameService.nextFname(fnameprefix, nextNum);
      const filePath = path().join(dir, nextFname);

      this.AquesService.wave(encoded, phont, speed, waveOptions).then((bufWav) => {
        return this.AudioService.record(filePath, bufWav, playOptions).then(() => {
          d.resolve(filePath);
        })
        .catch((err: Error) => {
          this.MessageService.error('音声データを記録できませんでした。', err);
          d.reject(err);
        });
      })
      .catch((err: Error) => {
        this.MessageService.error('音声データを作成できませんでした。', err);
        d.reject(err);
      });
    });
    return d.promise;
  }
  showSystemWindow(): void {
    ipcRenderer().send('showSystemWindow', 'system');
  }
  showSpecWindow(): void {
    ipcRenderer().send('showSpecWindow', 'spec');
  }
  help(): void {
    this.MessageService.action('open help window.');
    ipcRenderer().send('showHelpWindow', 'help');
  }
  dictionary(): void {
    this.MessageService.action('open dictionary window.');
    ipcRenderer().send('showDictWindow', 'help');
  }
  tutorial($scope: yubo.IMainScope): void {
    if (this.store.display == 'main') {
      this.MessageService.action('run main tutorial.');
      this.IntroService.mainTutorial();
    } else {
      this.MessageService.action('run settings tutorial.');
      this.IntroService.settingsTutorial();
    }
  }
  shortcut($scope: yubo.IMainScope): void {
    this.MessageService.action('show shortcut key help.');
    if (this.store.display == 'main') {
      this.IntroService.shortcut();
    } else {
      this.store.display = 'main';
      this.MessageService.info('標準の画面に切り替えます。');
      this.$timeout(() => {
        $scope.$apply();
        this.IntroService.shortcut();
      });
    }
  }
  select($scope: yubo.IMainScope, index: number): void {
    this.MessageService.action('switch voice config.');
    $scope.yvoice = $scope.yvoiceList[index];
    this.store.display = 'main';
  }
  plus($scope: yubo.IMainScope): void {
    this.MessageService.action('add new voice config.');
    const newYvoice = this.DataService.create();
    $scope.yvoiceList.push(newYvoice);
  }
  minus($scope: yubo.IMainScope, index: number): void {
    this.MessageService.action('delete voice config.');
    if ($scope.yvoiceList.length < 2) {
      this.MessageService.error('ボイス設定は1件以上必要です。');
      return;
    }
    $scope.yvoiceList.splice(index, 1);
    $scope.yvoice = $scope.yvoiceList[0];
    this.store.display = 'main';
  }
  copy($scope: yubo.IMainScope, index: number): void {
    this.MessageService.action('copy and create new voice config.');
    const original = $scope.yvoiceList[index];
    const newYvoice = this.DataService.copy(original);
    $scope.yvoiceList.push(newYvoice);
  }
  save($scope: yubo.IMainScope): void {
    this.MessageService.action('save voice config.');
    this.DataService.save($scope.yvoiceList);
  }
  reset($scope: yubo.IMainScope): void {
    this.MessageService.action('reset all voice config data.');
    // voice data clear
    this.DataService.clear();
    // set initial data
    $scope.yvoiceList = this.DataService.initialData();
    $scope.yvoice = $scope.yvoiceList[0];
    $scope.yinput = angular.copy(this.YInputInitialData);
    this.store.display = 'main';
    this.clearSourceSelection($scope);
    this.clearEncodedSelection($scope);
  }
  quickLookMessage(message: yubo.IWriteMessage): void {
    if (message.type != 'record' && message.type != 'source') { return; }
    const quickLookPath = message.quickLookPath;
    fs().stat(quickLookPath, (err: Error, stats: fs.Stats) => {
      if (err) { return; }
      //this.MessageService.action(`open with Quick Look. file: ${wavFilePath}`);
      const win = require('electron').remote.getCurrentWindow();
      win.previewFile(quickLookPath);
    });
  }
  recentDocument($scope: yubo.IMainScope, message: yubo.IRecordMessage): void {
    const r = this.HistoryService.get(message.wavFilePath);
    if (r) {
      this.$timeout(() => { // $scope.$apply
        $scope.yinput.source = r.source;
        $scope.yinput.encoded = r.encoded;
      });
    } else {
      this.MessageService.info('履歴データは見つかりませんでした。');
    }
  }
  clearRecentDocuments($scope: yubo.IMainScope): void {
    app.clearRecentDocuments();
    this.HistoryService.clear();
    this.$timeout(() => { // $scope.$apply
      this.store.generatedList = [];
    });
  }

  encode($scope: yubo.IMainScope): void {
    this.MessageService.action('encode source text.');
    let source = $scope.yinput.source;
    const _selectedSource = this.selectedSource();
    if (_selectedSource) {
      source = _selectedSource;
    }

    // command
    if (this.CommandService.containsCommand(source, $scope.yvoiceList)) {
      const parsedList = this.CommandService.parseInput(source, $scope.yvoiceList, $scope.yvoice);
      angular.forEach(parsedList, (cinput) => {
        cinput.text = this.AquesService.encode(cinput.text);
      });
      $scope.yinput.encoded = this.CommandService.toString(parsedList);
      this.clearEncodedSelection($scope);
    // not command
    } else {
      const encoded = this.AquesService.encode(source);
      $scope.yinput.encoded = encoded;
      this.clearEncodedSelection($scope);
    }
  }
  clear($scope: yubo.IMainScope): void {
    this.MessageService.action('clear input text.');
    $scope.yinput.source = '';
    $scope.yinput.encoded = '';
    this.clearSourceSelection($scope);
    this.clearEncodedSelection($scope);
  }
  fromClipboard($scope: yubo.IMainScope): void {
    this.MessageService.action('paste clipboard text to source.');
    const text = clipboard().readText();
    if (text) {
      $scope.yinput.source = text;
      $scope.yinput.encoded = '';
      this.clearSourceSelection($scope);
      this.clearEncodedSelection($scope);
    } else {
      this.MessageService.info('クリップボードにデータがありません。');
    }
  }
  putVoiceName($scope: yubo.IMainScope): void {
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
    this.$timeout(() => { $scope.$apply(); });
  }
  directory($scope: yubo.IMainScope): void {
    this.MessageService.action('select directory.');
    if (!$scope.yvoice.seqWrite) {
      this.MessageService.error('連番ファイル設定が無効です。');
      return;
    }

    ipcRenderer().once('showDirDialog', (event: Electron.Event, dirs: string[]) => {
      if (!dirs || dirs.length < 1) {
        return;
      }
      $scope.yvoice.seqWriteOptions.dir = dirs[0];
      this.$timeout(() => { $scope.$apply(); });
    });
    let optDir = $scope.yvoice.seqWriteOptions.dir;
    if (!optDir) { optDir = desktopDir; }
    ipcRenderer().send('showDirDialog', optDir);
  }

  switchSettingsView($scope: yubo.IMainScope): void {
    this.MessageService.action('switch to settings view.');
    this.store.display = 'settings';
  }
  switchMainView($scope: yubo.IMainScope): void {
    this.MessageService.action('switch to main view.');
    this.store.display = 'main';
  }
  switchMessageListType($scope: yubo.IMainScope): void {
    this.MessageService.action('switch message list type.');
    $scope.showTypeMessageList = !$scope.showTypeMessageList;
  }
  switchAlwaysOnTop(): void {
    this.MessageService.action('switch alwaysOnTop option.');
    ipcRenderer().send('switchAlwaysOnTop', 'mainWindow');
  }
  onSwitchAlwaysOnTop($scope: yubo.IMainScope, event: Electron.Event, newflg: boolean): void {
    $scope.alwaysOnTop = newflg;
    this.MessageService.info(`update alwaysOnTop option ${newflg?'ON':'OFF'}`);
    this.$timeout(() => { $scope.$apply(); });
  }
}

angular.module('mainReducers', ['mainStores', 'mainServices', 'mainModels'])
  .service('MainReducer', [
    '$timeout',
    '$q',
    'MainStore',
    'MessageService',
    'DataService',
    'HistoryService',
    'AquesService',
    'AudioService1',
    'AudioService2',
    'AudioSourceService',
    'SeqFNameService',
    'AppUtilService',
    'CommandService',
    'IntroService',
    'YInputInitialData',
    MainReducer,
  ]);
