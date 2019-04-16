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
  appCfg: yubo.AppCfg = require('electron').remote.getGlobal('appCfg');
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
    private YPhontMasterList: yubo.YPhont[],
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
          const indexToN = this.store.yvoiceList.indexOf(this.store.curYvoice);
          if (this.store.yvoiceList.length > indexToN + 1) {
            this.store.curYvoice = this.store.yvoiceList[indexToN + 1];
          } else {
            this.store.curYvoice = this.store.yvoiceList[0];
          }
          this.store.display = 'main';
          this.$timeout(() => { $scope.$apply(); });
        }
        break;
      case 'swichPreviousConfig':
        {
          const indexToP = this.store.yvoiceList.indexOf(this.store.curYvoice);
          if (indexToP - 1 >= 0) {
            this.store.curYvoice = this.store.yvoiceList[indexToP - 1];
          } else {
            this.store.curYvoice = this.store.yvoiceList[this.store.yvoiceList.length - 1];
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
          const indexForM = this.store.yvoiceList.indexOf(this.store.curYvoice);
          this.minus($scope, indexForM);
          this.$timeout(() => { $scope.$apply(); });
        }
        break;
      case 'copy':
        {
          const indexForCP = this.store.yvoiceList.indexOf(this.store.curYvoice);
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
      if (this.store.yinput) {
        const win = require('electron').remote.getCurrentWindow();
        win.focus();
        this.store.yinput.source = data;
        this.$timeout(() => { $scope.$apply(); });
      }
    });
  }
  onRecentDocument($scope: yubo.IMainScope, filePath: string): void {
    this.MessageService.action('select from Recent Document List.');

    const f = (filePath: string) => {
      const r = this.HistoryService.get(filePath);
      if (r) {
        this.store.yinput.source = r.source;
        this.store.yinput.encoded = r.encoded;
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
      this.store.lastWavFile = wavFileInfo;
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
        this.store.duration = duration;
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
        this.store.yvoiceList = dataList;
        this.store.curYvoice = this.store.yvoiceList[0];
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
    this.store.sourceHighlight['#619FFF'] = this.selectedSource();
  }
  blurOnEncoded($scope: yubo.IMainScope): void {
    this.store.encodedHighlight['#619FFF'] = this.selectedEncoded();
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
    this.store.sourceHighlight['#619FFF'] = '';
    const textarea = document.getElementById('source') as HTMLInputElement;
    textarea.selectionStart = 0;
    textarea.selectionEnd = 0;
  }
  private clearEncodedSelection($scope: yubo.IMainScope): void {
    this.store.encodedHighlight['#619FFF'] = '';
    const textarea = document.getElementById('encoded') as HTMLInputElement;
    textarea.selectionStart = 0;
    textarea.selectionEnd = 0;
  }

  // list box selection changed
  onChangePhont($scope: yubo.IMainScope): void {
    let phont: yubo.YPhont = null;
    angular.forEach(this.YPhontMasterList, (value, key) => {
      if (value.id == this.store.curYvoice.phont) { phont = value; }
    });
    if (!phont) { return; }
    this.store.curYvoice.version = phont.version;
    if (phont.version == 'talk10') {
      this.store.curYvoice.bas = phont.struct.bas;
      this.store.curYvoice.pit = phont.struct.pit;
      this.store.curYvoice.acc = phont.struct.acc;
      this.store.curYvoice.lmd = phont.struct.lmd;
      this.store.curYvoice.fsc = phont.struct.fsc;
    } else {
      delete this.store.curYvoice.bas;
      delete this.store.curYvoice.pit;
      delete this.store.curYvoice.acc;
      delete this.store.curYvoice.lmd;
      delete this.store.curYvoice.fsc;
    }
  }

  // action
  play($scope: yubo.IMainScope): void {
    this.MessageService.action('start to play voice.');
    if (!this.store.yinput.source && !this.store.yinput.encoded) {
      this.MessageService.error('メッセージ、音記号列、どちらも入力されていません。');
      return;
    }

    // text converting
    let encoded = this.store.yinput.encoded;
    const _selectedEncoded = this.selectedEncoded();
    if (_selectedEncoded) {
      encoded = _selectedEncoded;
      this.clearSourceSelection($scope);
    }
    if (!encoded) {
      let source = this.store.yinput.source;
      const _selectedSource = this.selectedSource();
      if (_selectedSource) {
        source = _selectedSource;
      }
      // encoding, command
      if (this.CommandService.containsCommand(source, this.store.yvoiceList)) {
        const parsedListForEnc = this.CommandService.parseInput(source, this.store.yvoiceList, this.store.curYvoice);
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
    const parsedList = this.CommandService.parseInput(encoded, this.store.yvoiceList, this.store.curYvoice);
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
    const yvoice = this.CommandService.detectVoiceConfig(cinput, this.store.yvoiceList);

    // phont
    let phont: yubo.YPhont = null;
    angular.forEach(this.YPhontMasterList, (value, key) => {
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
    if (!this.store.yinput.source && !this.store.yinput.encoded) {
      this.MessageService.error('メッセージ、音記号列、どちらも入力されていません。');
      return;
    }

    let phont: yubo.YPhont = null;
    angular.forEach(this.YPhontMasterList, (value, key) => {
      if (value.id == this.store.curYvoice.phont) { phont = value; }
    });
    if (!phont) {
      this.MessageService.error('声の種類が未指定です。');
      return;
    }

    // text converting
    let encoded = this.store.yinput.encoded;
    let loggingSourceText = this.store.yinput.source;
    const _selectedEncoded = this.selectedEncoded();
    if (_selectedEncoded) {
      encoded = _selectedEncoded;
      this.clearSourceSelection($scope);
    }
    if (!encoded) {
      let source = this.store.yinput.source;
      const _selectedSource = this.selectedSource();
      if (_selectedSource) {
        source = _selectedSource;
        loggingSourceText = _selectedSource;
      }
      // encoding, command
      if (this.CommandService.containsCommand(source, this.store.yvoiceList)) {
        const parsedListForEnc = this.CommandService.parseInput(source, this.store.yvoiceList, this.store.curYvoice);
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
    if (this.store.curYvoice.seqWrite) {
      let dir = this.store.curYvoice.seqWriteOptions.dir;
      const prefix = this.store.curYvoice.seqWriteOptions.prefix;
      if (!dir) {
        dir = desktopDir;
      }

      // record
      const parsedList = this.CommandService.parseInput(encoded, this.store.yvoiceList, this.store.curYvoice);
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
              if (this.store.curYvoice.sourceWrite && !sourceFname) {
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
        const containsCommand = this.CommandService.containsCommand(encoded, this.store.yvoiceList);
        const parsedList = this.CommandService.parseInput(encoded, this.store.yvoiceList, this.store.curYvoice);
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
                  if (this.store.curYvoice.sourceWrite && !sourceFname) {
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
                  if (this.store.curYvoice.sourceWrite && !sourceFname) {
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
    const yvoice = this.CommandService.detectVoiceConfig(cinput, this.store.yvoiceList);

    // phont
    let phont: yubo.YPhont = null;
    angular.forEach(this.YPhontMasterList, (value, key) => {
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
    const yvoice = this.CommandService.detectVoiceConfig(cinput, this.store.yvoiceList);

    // phont
    let phont: yubo.YPhont = null;
    angular.forEach(this.YPhontMasterList, (value, key) => {
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
    this.store.curYvoice = this.store.yvoiceList[index];
    this.store.display = 'main';
  }
  plus($scope: yubo.IMainScope): void {
    this.MessageService.action('add new voice config.');
    const newYvoice = this.DataService.create();
    this.store.yvoiceList.push(newYvoice);
  }
  minus($scope: yubo.IMainScope, index: number): void {
    this.MessageService.action('delete voice config.');
    if (this.store.yvoiceList.length < 2) {
      this.MessageService.error('ボイス設定は1件以上必要です。');
      return;
    }
    this.store.yvoiceList.splice(index, 1);
    this.store.curYvoice = this.store.yvoiceList[0];
    this.store.display = 'main';
  }
  copy($scope: yubo.IMainScope, index: number): void {
    this.MessageService.action('copy and create new voice config.');
    const original = this.store.yvoiceList[index];
    const newYvoice = this.DataService.copy(original);
    this.store.yvoiceList.push(newYvoice);
  }
  save($scope: yubo.IMainScope): void {
    this.MessageService.action('save voice config.');
    this.DataService.save(this.store.yvoiceList);
  }
  reset($scope: yubo.IMainScope): void {
    this.MessageService.action('reset all voice config data.');
    // voice data clear
    this.DataService.clear();
    // set initial data
    this.store.yvoiceList = this.DataService.initialData();
    this.store.curYvoice = this.store.yvoiceList[0];
    this.store.yinput = angular.copy(this.YInputInitialData);
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
        this.store.yinput.source = r.source;
        this.store.yinput.encoded = r.encoded;
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
    let source = this.store.yinput.source;
    const _selectedSource = this.selectedSource();
    if (_selectedSource) {
      source = _selectedSource;
    }

    // command
    if (this.CommandService.containsCommand(source, this.store.yvoiceList)) {
      const parsedList = this.CommandService.parseInput(source, this.store.yvoiceList, this.store.curYvoice);
      angular.forEach(parsedList, (cinput) => {
        cinput.text = this.AquesService.encode(cinput.text);
      });
      this.store.yinput.encoded = this.CommandService.toString(parsedList);
      this.clearEncodedSelection($scope);
    // not command
    } else {
      const encoded = this.AquesService.encode(source);
      this.store.yinput.encoded = encoded;
      this.clearEncodedSelection($scope);
    }
  }
  clear($scope: yubo.IMainScope): void {
    this.MessageService.action('clear input text.');
    this.store.yinput.source = '';
    this.store.yinput.encoded = '';
    this.clearSourceSelection($scope);
    this.clearEncodedSelection($scope);
  }
  fromClipboard($scope: yubo.IMainScope): void {
    this.MessageService.action('paste clipboard text to source.');
    const text = clipboard().readText();
    if (text) {
      this.store.yinput.source = text;
      this.store.yinput.encoded = '';
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
      this.store.yinput[field.id] = `${this.store.curYvoice.name}${'＞'}${field.value}`;
      field.selectionStart = (`${this.store.curYvoice.name}${'＞'}`).length;
      field.selectionEnd = (`${this.store.curYvoice.name}${'＞'}`).length;
    // last
    } else if (pos == length) {
      if (field.value.substring(pos-1, pos) == '\n') {
        this.store.yinput[field.id] = `${field.value}${this.store.curYvoice.name}${'＞'}`;
        field.selectionStart = (field.value).length;
        field.selectionEnd = (field.value).length;
      } else {
        this.store.yinput[field.id] = `${field.value}\n${this.store.curYvoice.name}${'＞'}`;
        field.selectionStart = (field.value).length;
        field.selectionEnd = (field.value).length;
      }
    // in text
    } else {
      if (field.value.substring(pos-1, pos) == '\n') {
        this.store.yinput[field.id] = `${field.value.substring(0, pos)}${this.store.curYvoice.name}${'＞'}${field.value.substring(pos, length)}`;
        field.selectionStart = (`${field.value.substring(0, pos)}${this.store.curYvoice.name}${'＞'}`).length;
        field.selectionEnd = (`${field.value.substring(0, pos)}${this.store.curYvoice.name}${'＞'}`).length;
      } else {
        this.store.yinput[field.id] = `${field.value.substring(0, pos)}\n${this.store.curYvoice.name}${'＞'}${field.value.substring(pos, length)}`;
        field.selectionStart = (`${field.value.substring(0, pos)}\n${this.store.curYvoice.name}${'＞'}`).length;
        field.selectionEnd = (`${field.value.substring(0, pos)}\n${this.store.curYvoice.name}${'＞'}`).length;
      }
    }
    this.$timeout(() => { $scope.$apply(); });
  }
  directory($scope: yubo.IMainScope): void {
    this.MessageService.action('select directory.');
    if (!this.store.curYvoice.seqWrite) {
      this.MessageService.error('連番ファイル設定が無効です。');
      return;
    }

    ipcRenderer().once('showDirDialog', (event: Electron.Event, dirs: string[]) => {
      if (!dirs || dirs.length < 1) {
        return;
      }
      this.store.curYvoice.seqWriteOptions.dir = dirs[0];
      this.$timeout(() => { $scope.$apply(); });
    });
    let optDir = this.store.curYvoice.seqWriteOptions.dir;
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
    this.store.showTypeMessageList = !this.store.showTypeMessageList;
  }
  switchAlwaysOnTop(): void {
    this.MessageService.action('switch alwaysOnTop option.');
    ipcRenderer().send('switchAlwaysOnTop', 'mainWindow');
  }
  onSwitchAlwaysOnTop($scope: yubo.IMainScope, event: Electron.Event, newflg: boolean): void {
    this.store.alwaysOnTop = newflg;
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
    'YPhontMasterList',
    'YInputInitialData',
    MainReducer,
  ]);
