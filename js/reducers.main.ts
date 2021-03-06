var app = require('electron').remote.app;
var _clipboard: any, clipboard     = () => { _clipboard = _clipboard || require('electron').clipboard; return _clipboard; };
var _customError: any, customError = () => { _customError = _customError || require('custom-error'); return _customError; };
var _fs: any, fs                   = () => { _fs = _fs || require('fs'); return _fs; };
var _ipcRenderer: any, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };
var _log: any, log                 = () => { _log = _log || require('electron-log'); return _log; };
var _monitor: any, monitor         = () => { _monitor = _monitor || require('electron-performance-monitor'); return _monitor; };
var _onIdle: any, onIdle           = () => { _onIdle = _onIdle || require('on-idle'); return _onIdle; };
var _path: any, path               = () => { _path = _path || require('path'); return _path; };
var _shell: any, shell             = () => { _shell = _shell || require('electron').shell; return _shell; };
var _waitUntil: any, waitUntil     = () => { _waitUntil = _waitUntil || require('wait-until'); return _waitUntil; };

var BreakChain = customError()('BreakChain');

// env
var MONITOR = process.env.MONITOR != null;

// application settings
var defaultSaveDir = process.mas? `${app.getPath('music')}/MYukkuriVoice`: app.getPath('desktop');

// action reducer
class MainReducer implements yubo.MainReducer {
  appCfg: yubo.AppCfg = require('electron').remote.getGlobal('appCfg');
  private AudioService: yubo.IAudioService = null;

  constructor(
    private $q: ng.IQService,
    private $document: ng.IDocumentService,
    private store: yubo.MainStore,
    private MessageService: yubo.MessageService,
    private DataService: yubo.DataService,
    private HistoryService: yubo.HistoryService,
    private AquesService: yubo.AquesService,
    html5AudioService: yubo.HTML5AudioService,
    webAPIAudioService: yubo.WebAPIAudioService,
    private TextSubtitleService: yubo.TextSubtitleService,
    private SeqFNameService: yubo.SeqFNameService,
    private AppUtilService: yubo.AppUtilService,
    private CommandService: yubo.CommandService,
    private IntroService: yubo.IntroService,
    private YPhontMasterList: yubo.YPhont[],
    private YInputInitialData: yubo.YInput
  ) {
    this.store.yvoiceList = window.dataJson;
    this.store.curYvoice = window.dataJson.length > 0? window.dataJson[0]: null;
    delete window['dataJson'];

    // audio service engine
    switch (this.appCfg.audioServVer) {
      case 'html5audio':
        this.AudioService = html5AudioService;
        break;
      case 'webaudioapi':
        this.AudioService = webAPIAudioService;
        break;
      case 'webaudioapi8':
      default:
        webAPIAudioService.sampleRate = 8000;
        this.AudioService = webAPIAudioService;
        break;
    }
  }

  // event
  onMessage(level: string, message: string): void {
    switch (level) {
      case 'info':
        this.MessageService.info(message);
    }
  }
  onShortcut(action: string, numKey: number): void {
    switch (action) {
      case 'putVoiceName':
        this.putVoiceName();
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
          this.notifyUpdates({curYvoice: this.store.curYvoice, display: this.store.display});
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
          this.notifyUpdates({curYvoice: this.store.curYvoice, display: this.store.display});
        }
        break;
      case 'swichNumberConfig':
        {
          if (numKey == undefined) {
            break;
          }
          if (this.store.yvoiceList.length > numKey) {
            this.store.curYvoice = this.store.yvoiceList[numKey];
          } else {
            break;
          }
          this.store.display = 'main';
          this.notifyUpdates({curYvoice: this.store.curYvoice, display: this.store.display});
        }
        break;
    }
  }
  onMenu(action: string): void {
    switch (action) {
      case 'minus':
        {
          const indexForM = this.store.yvoiceList.indexOf(this.store.curYvoice);
          this.minus(indexForM);
          this.notifyUpdates({});
        }
        break;
      case 'copy':
        {
          const indexForCP = this.store.yvoiceList.indexOf(this.store.curYvoice);
          this.copy(indexForCP);
          this.notifyUpdates({});
        }
        break;
      case 'reset':
        this.reset();
        break;
      case 'clearRecentDocuments':
        this.clearRecentDocuments();
        break;
      case 'switchAlwaysOnTop':
        this.switchAlwaysOnTop();
        this.notifyUpdates({});
        break;
    }
  }
  onDropTextFile(filePath: string): void {
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
        this.notifyUpdates({yinput: this.store.yinput});
      }
    });
  }
  onRecentDocument(filePath: string): void {
    this.MessageService.action('select from Recent Document List.');

    const f = (filePath: string) => {
      const r = this.HistoryService.get(filePath);
      if (r) {
        this.store.yinput.source = r.source;
        this.store.yinput.encoded = r.encoded;
        this.notifyUpdates({yinput: this.store.yinput});
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
  init(): void {
    this.loadData(null);
  }
  onLoad($scope: ng.IScope): void {
    // event listener
    $scope.$on('message', (event: ng.IAngularEvent, message: yubo.IMessage | yubo.IRecordMessage) => {
      this.store.messageList.unshift(message);
      while (this.store.messageList.length > 5) {
        this.store.messageList.pop();
      }
      this.notifyUpdates({messageList: this.store.messageList});
    });
    $scope.$on('wavGenerated', (event: ng.IAngularEvent, wavFileInfo: yubo.IRecordMessage) => {
      // lastWavFile
      this.store.lastWavFile = wavFileInfo;
      // generatedList
      this.store.generatedList.unshift(wavFileInfo);
      while (this.store.generatedList.length > 10) {
        this.store.generatedList.pop();
      }
      this.notifyUpdates({lastWavFile: this.store.lastWavFile, generatedList: this.store.generatedList});
      // recentDocumentList
      app.addRecentDocument(wavFileInfo.wavFilePath);
      this.HistoryService.add(wavFileInfo);
      this.HistoryService.save();
    });
    $scope.$on('duration', (event: ng.IAngularEvent, duration: number) => {
      this.store.duration = duration;
      this.notifyUpdates({duration: this.store.duration});
    });
  }
  afterRender(): void {
    this.loadHistory();
    this.AquesService.init(); // initialize AquesService
    this.validateLicenseLimit();
  }

  private loadData(nextTask: () => void): void {
    if (MONITOR) { log().warn(monitor().format('apps.main', 'loadData called')); }
    let dataList = this.store.yvoiceList;
    if (dataList.length < 1) {
      this.MessageService.info('初期データを読み込みます。');
      dataList = this.DataService.initialData();
      this.store.yvoiceList = dataList;
      this.store.curYvoice = this.store.yvoiceList[0];
      this.notifyUpdates({yvoiceList: this.store.yvoiceList, curYvoice: this.store.curYvoice});
    }
    if (MONITOR) { log().warn(monitor().format('apps.main', 'loadData done')); }
    if (nextTask) { nextTask(); }
  }
  private loadHistory(): void {
    const cancel = onIdle()(() => {
      return this.HistoryService.load()
      .then((cache) => {
        this.store.generatedList = this.HistoryService.getList();
        while (this.store.generatedList.length > 10) {
          this.store.generatedList.pop();
        }
        this.notifyUpdates({generatedList: this.store.generatedList});
      });
    });
  }
  private validateLicenseLimit(): void {
    if (!this.appCfg.licenseKeyLimit || !this.appCfg.showMsgPane) {
      return;
    }
    const cancel = onIdle()(() => {
      const licenseKeyLimit = this.appCfg.licenseKeyLimit;
      if (!licenseKeyLimit) {
        return;
      }
      const limit = new Date(licenseKeyLimit);
      limit.setDate(limit.getDate() + 1);
      if (limit.getTime() < Date.now()) {
        this.MessageService.warn('環境設定：ライセンスキータイマーの期日が過ぎています。');
      }
    });
  }

  private selectedSource(): string {
    const textarea = this.$document[0].getElementById('source') as HTMLInputElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    return selectedText;
  }
  private selectedEncoded(): string {
    const textarea = this.$document[0].getElementById('encoded') as HTMLInputElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    return selectedText;
  }

  // selected text highlight
  blurOnSource(): void {
    this.store.sourceHighlight['#619FFF'] = this.selectedSource();
  }
  blurOnEncoded(): void {
    this.store.encodedHighlight['#619FFF'] = this.selectedEncoded();
  }
  focusOnSource(): void {
    this.clearSourceSelection();
    this.clearEncodedSelection();
  }
  focusOnEncoded(): void {
    this.clearSourceSelection();
    this.clearEncodedSelection();
  }
  private clearSourceSelection(): void {
    this.store.sourceHighlight['#619FFF'] = '';
    const textarea = this.$document[0].getElementById('source') as HTMLInputElement;
    textarea.selectionStart = 0;
    textarea.selectionEnd = 0;
  }
  private clearEncodedSelection(): void {
    this.store.encodedHighlight['#619FFF'] = '';
    const textarea = this.$document[0].getElementById('encoded') as HTMLInputElement;
    textarea.selectionStart = 0;
    textarea.selectionEnd = 0;
  }

  // list box selection changed
  onChangePhont(): void {
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
  play(): void {
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
      this.clearSourceSelection();
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
    parsedList.reduce((p: any/*ng.IDeferred<{duration: number}> | ng.IPromise<{duration: number}>*/, cinput) => {
      if (p.then === undefined) {
        p.resolve();
        p = p.promise;
      }
      return (p as ng.IPromise<{duration: number}>)
      .then((audioParams: {duration: number}) => {
        return this.playEach(cinput);
      });
    }, this.$q.defer<{duration: number}>());
  }
  private playEach(cinput: yubo.YCommandInput): ng.IPromise<{duration: number}> {
    const d = this.$q.defer<{duration: number}>();
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
      volume: yvoice.volume,
      playbackRate: yvoice.playbackRate,
      detune: yvoice.detune,
    };

    this.AquesService.wave(encoded, phont, speed, waveOptions)
    .catch((err: Error) => {
      if (err instanceof BreakChain) { throw err; }
      this.MessageService.error('音声データを作成できませんでした。', err);
      d.reject(err); throw BreakChain();
    })
    .then((bufWav: Buffer) => {
      return this.AudioService.play(bufWav, playOptions);
    })
    .catch((err: Error) => {
      if (err instanceof BreakChain) { throw err; }
      this.MessageService.error('音声データを再生できませんでした。', err);
      d.reject(err); throw BreakChain();
    })
    .then((audioParams: {duration: number}) => {
      return d.resolve(audioParams);
    });
    return d.promise;
  }
  stop(): void {
    this.MessageService.action('stop playing voice.');
    this.AudioService.stop();
  }
  record(): void {
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
      this.clearSourceSelection();
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
      const bookmark = this.store.curYvoice.seqWriteOptions.bookmark;
      if (!dir) {
        dir = defaultSaveDir;
      }

      // file permission on sandbox
      const stopAccessingSecurityScopedResource = (!process.mas || !bookmark)?
        () => {}:
        app.startAccessingSecurityScopedResource(bookmark);

      // record
      const parsedList = this.CommandService.parseInput(encoded, this.store.yvoiceList, this.store.curYvoice);
      let sourceFname: string = null;
      // record wave files
      parsedList.reduce((p: any/*ng.IDeferred<{wavFilePath: string, duration: number}> | ng.IPromise<{wavFilePath: string, duration: number}>*/, cinput) => {
        if (p.then === undefined) {
          p.resolve();
          p = p.promise;
        }

        return (p as ng.IPromise<{wavFilePath: string, duration: number}>)
        .then((audioParams: {wavFilePath: string, duration: number}) => {
          return this.recordEach(cinput, dir, prefix);
        })
        .then((audioParams: {wavFilePath: string, duration: number}) => {
          if (this.store.curYvoice.sourceWrite && !sourceFname) {
            sourceFname = this.TextSubtitleService.sourceFname(audioParams.wavFilePath);
          }
          this.MessageService.record(`${'音声ファイルを保存しました。path: '}${audioParams.wavFilePath}`,
            {
              wavFilePath: audioParams.wavFilePath,
              srcTextPath: sourceFname,
              source: loggingSourceText,
              encoded: cinput.text,
              duration: audioParams.duration,
              bookmark: bookmark,
            }
          );
          return audioParams;
        });
      }, this.$q.defer<{wavFilePath: string, duration: number}>())
      // record source message
      .then((audioParams: {wavFilePath: string, duration: number}) => {
        if (!this.store.curYvoice.sourceWrite || !sourceFname) { return null; }
        return this.TextSubtitleService.save(sourceFname, loggingSourceText)
        .catch((err: Error) => {
          this.MessageService.error('メッセージファイルを作成できませんでした。', err);
          throw BreakChain();
        });
      })
      .then((): void => {
        if (!this.store.curYvoice.sourceWrite || !sourceFname) { return null; }
        this.MessageService.recordSource(`${'メッセージファイルを保存しました。path: '}${sourceFname}`,
          {
            srcTextPath: sourceFname,
            source: loggingSourceText,
            bookmark: bookmark,
          }
        );
      })
      .finally(() => {
        stopAccessingSecurityScopedResource();
      });

    // 通常保存
    } else {
      ipcRenderer().once('showSaveDialog', (event: Electron.Event, selector: {filePath: string, bookmark: string}) => {
        const filePath = selector.filePath;
        const bookmark = selector.bookmark;
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
        parsedList.reduce((p: any/*ng.IDeferred<{wavFilePath: string, duration: number}> | ng.IPromise<{wavFilePath: string, duration: number}>*/, cinput) => {
          if (p.then === undefined) {
            p.resolve();
            p = p.promise;
          }
          return (p as ng.IPromise<{wavFilePath: string, duration: number}>)
          .then((audioParams: {wavFilePath: string, duration: number}) => {
            if (containsCommand) {
              return this.recordEach(cinput, dir, prefix);
            } else {
              return this.recordSolo(cinput, filePath);
            }
          })
          .then((audioParams: {wavFilePath: string, duration: number}) => {
            if (this.store.curYvoice.sourceWrite && !sourceFname) {
              sourceFname = this.TextSubtitleService.sourceFname(audioParams.wavFilePath);
            }
            this.MessageService.record(`${'音声ファイルを保存しました。path: '}${audioParams.wavFilePath}`,
              {
                wavFilePath: audioParams.wavFilePath,
                srcTextPath: sourceFname,
                source: loggingSourceText,
                encoded: cinput.text,
                duration: audioParams.duration,
                bookmark: bookmark,
              }
            );
            return audioParams;
          });
        }, this.$q.defer<{wavFilePath: string, duration: number}>())
        // record source message
        .then((audioParams: {wavFilePath: string, duration: number}) => {
          if (!this.store.curYvoice.sourceWrite || !sourceFname) { return null; }
          return this.TextSubtitleService.save(sourceFname, loggingSourceText)
          .catch((err: Error) => {
            this.MessageService.error('メッセージファイルを作成できませんでした。', err);
            throw BreakChain();
          });
        })
        .then((): void => {
          if (!this.store.curYvoice.sourceWrite || !sourceFname) { return null; }
          this.MessageService.recordSource(`${'メッセージファイルを保存しました。path: '}${sourceFname}`,
            {
              srcTextPath: sourceFname,
              source: loggingSourceText,
              bookmark: bookmark,
            }
          );
        });
      });
      ipcRenderer().send('showSaveDialog', 'wav');
    }
  }
  private recordSolo(cinput: yubo.YCommandInput, filePath: string): ng.IPromise<{wavFilePath: string, duration: number}> {
    const d = this.$q.defer<{wavFilePath: string, duration: number}>();
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
    const recordOptions: yubo.RecordOptions = {
      volume: yvoice.volume,
      playbackRate: yvoice.playbackRate,
      detune: yvoice.detune,
      fcpxIxml: false,
      fcpxIxmlOptions: {audioRole: null},
    };
    // extensions.fcpx
    if (this.appCfg.extensions.fcpx && yvoice.fcpxIxml && yvoice.fcpxIxmlOptions.audioRole) {
      recordOptions.fcpxIxml = true;
      recordOptions.fcpxIxmlOptions = {audioRole: yvoice.fcpxIxmlOptions.audioRole};
    }

    this.AquesService.wave(encoded, phont, speed, waveOptions)
    .catch((err: Error) => {
      if (err instanceof BreakChain) { throw err; }
      this.MessageService.error('音声データを作成できませんでした。', err);
      d.reject(err); throw BreakChain();
    })
    .then((bufWav: Buffer) => {
      return this.AudioService.record(filePath, bufWav, recordOptions);
    })
    .catch((err: Error) => {
      if (err instanceof BreakChain) { throw err; }
      this.MessageService.error('音声データを記録できませんでした。', err);
      d.reject(err); throw BreakChain();
    })
    .then((audioParams: {duration: number}) => {
      return d.resolve({wavFilePath: filePath, duration: audioParams.duration});
    });
    return d.promise;
  }
  private recordEach(cinput: yubo.YCommandInput, dir: string, fnameprefix: string): ng.IPromise<{wavFilePath: string, duration: number}> {
    const d = this.$q.defer<{wavFilePath: string, duration: number}>();
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
    const recordOptions: yubo.RecordOptions = {
      volume: yvoice.volume,
      playbackRate: yvoice.playbackRate,
      detune: yvoice.detune,
      fcpxIxml: false,
      fcpxIxmlOptions: {audioRole: null},
    };
    // extensions.fcpx
    if (this.appCfg.extensions.fcpx && yvoice.fcpxIxml && yvoice.fcpxIxmlOptions.audioRole) {
      recordOptions.fcpxIxml = true;
      recordOptions.fcpxIxmlOptions = {audioRole: yvoice.fcpxIxmlOptions.audioRole};
    }

    let filePath: string;
    this.SeqFNameService.nextNumber(dir, fnameprefix)
    .then((nextNum) => {
      const nextFname = this.SeqFNameService.nextFname(fnameprefix, nextNum);
      filePath = path().join(dir, nextFname);
      return this.AquesService.wave(encoded, phont, speed, waveOptions);
    })
    .catch((err: Error) => {
      if (err instanceof BreakChain) { throw err; }
      this.MessageService.error('音声データを作成できませんでした。', err);
      d.reject(err); throw BreakChain();
    })
    .then((bufWav: Buffer): ng.IPromise<{duration: number}> => {
      return this.AudioService.record(filePath, bufWav, recordOptions);
    })
    .catch((err: Error) => {
      if (err instanceof BreakChain) { throw err; }
      this.MessageService.error('音声データを記録できませんでした。', err);
      d.reject(err); throw BreakChain();
    })
    .then((audioParams: {duration: number}) => {
      return d.resolve({wavFilePath: filePath, duration: audioParams.duration});
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
  tutorial(): void {
    if (this.store.display == 'main') {
      this.MessageService.action('run main tutorial.');
      this.IntroService.mainTutorial();
    } else {
      this.MessageService.action('run settings tutorial.');
      this.IntroService.settingsTutorial();
    }
  }
  shortcut(): void {
    this.MessageService.action('show shortcut key help.');
    if (this.store.display == 'main') {
      this.IntroService.shortcut();
    } else {
      this.store.display = 'main';
      this.MessageService.info('標準の画面に切り替えます。');
      this.IntroService.shortcut();
      this.notifyUpdates({});
    }
  }
  select(index: number): void {
    this.MessageService.action('switch voice config.');
    this.store.curYvoice = this.store.yvoiceList[index];
    this.store.display = 'main';
  }
  plus(): void {
    this.MessageService.action('add new voice config.');
    const newYvoice = this.DataService.create();
    this.store.yvoiceList.push(newYvoice);
  }
  minus(index: number): void {
    this.MessageService.action('delete voice config.');
    if (this.store.yvoiceList.length < 2) {
      this.MessageService.error('ボイス設定は1件以上必要です。');
      return;
    }
    this.store.yvoiceList.splice(index, 1);
    this.store.curYvoice = this.store.yvoiceList[0];
    this.store.display = 'main';
  }
  copy(index: number): void {
    this.MessageService.action('copy and create new voice config.');
    const original = this.store.yvoiceList[index];
    const newYvoice = this.DataService.copy(original);
    this.store.yvoiceList.push(newYvoice);
  }
  save(): void {
    this.MessageService.action('save voice config.');
    this.DataService.save(this.store.yvoiceList);
  }
  reset(): void {
    this.MessageService.action('reset all voice config data.');
    // voice data clear
    this.DataService.clear();
    // set initial data
    this.store.yvoiceList = this.DataService.initialData();
    this.store.curYvoice = this.store.yvoiceList[0];
    this.store.yinput = angular.copy(this.YInputInitialData);
    this.store.display = 'main';
    this.clearSourceSelection();
    this.clearEncodedSelection();
  }
  quickLookMessage(message: yubo.IWriteMessage): void {
    if (message.type != 'record' && message.type != 'source') { return; }
    const quickLookPath = message.quickLookPath;
    const bookmark = message.bookmark;
    fs().stat(quickLookPath, (err: Error, stats: fs.Stats) => {
      if (err) { return; }
      //this.MessageService.action(`open with Quick Look. file: ${wavFilePath}`);
      // quickLook. set file permission if on sandbox.
      const stopAccessingSecurityScopedResource = (!process.mas || !bookmark)?
        () => {}:
        app.startAccessingSecurityScopedResource(bookmark);
      try {
        const win = require('electron').remote.getCurrentWindow();
        const basename = path().basename(quickLookPath);
        win.previewFile(quickLookPath, basename);
      } finally {
        stopAccessingSecurityScopedResource();
      }
    });
  }
  recentDocument(message: yubo.IRecordMessage): void {
    const r = this.HistoryService.get(message.wavFilePath);
    if (r) {
      this.store.yinput.source = r.source;
      this.store.yinput.encoded = r.encoded;
      this.notifyUpdates({yinput: this.store.yinput});
    } else {
      this.MessageService.info('履歴データは見つかりませんでした。');
    }
  }
  clearRecentDocuments(): void {
    app.clearRecentDocuments();
    this.HistoryService.clear();
    this.store.generatedList = [];
    this.notifyUpdates({generatedList: this.store.generatedList});
  }

  encode(): void {
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
      this.clearEncodedSelection();
    // not command
    } else {
      const encoded = this.AquesService.encode(source);
      this.store.yinput.encoded = encoded;
      this.clearEncodedSelection();
    }
  }
  clear(): void {
    this.MessageService.action('clear input text.');
    this.store.yinput.source = '';
    this.store.yinput.encoded = '';
    this.clearSourceSelection();
    this.clearEncodedSelection();
  }
  fromClipboard(): void {
    this.MessageService.action('paste clipboard text to source.');
    const text = clipboard().readText();
    if (text) {
      this.store.yinput.source = text;
      this.store.yinput.encoded = '';
      this.clearSourceSelection();
      this.clearEncodedSelection();
    } else {
      this.MessageService.info('クリップボードにデータがありません。');
    }
  }
  putVoiceName(): void {
    const field = this.$document[0].activeElement as HTMLInputElement;
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
    this.notifyUpdates({yinput: this.store.yinput});
  }
  directory(): void {
    this.MessageService.action('select directory.');
    if (!this.store.curYvoice.seqWrite) {
      this.MessageService.error('連番ファイル設定が無効です。');
      return;
    }

    ipcRenderer().once('showDirDialog', (event: Electron.Event, selector: {filePaths: string[], bookmarks: string[]}) => {
      const dirs = selector.filePaths;
      const bookmarks = selector.bookmarks;
      if (!dirs || dirs.length < 1) {
        return;
      }

      this.store.curYvoice.seqWriteOptions.dir = dirs[0];
      if (bookmarks && bookmarks.length > 0 && bookmarks[0]) {
        this.store.curYvoice.seqWriteOptions.bookmark = bookmarks[0];
      }
      this.notifyUpdates({curYvoice: this.store.curYvoice});
    });
    let optDir = this.store.curYvoice.seqWriteOptions.dir;
    if (!optDir) { optDir = defaultSaveDir; }
    ipcRenderer().send('showDirDialog', optDir);
  }

  switchSettingsView(): void {
    this.MessageService.action('switch to settings view.');
    this.store.display = 'settings';
  }
  switchMainView(): void {
    this.MessageService.action('switch to main view.');
    this.store.display = 'main';
  }
  switchMessageListType(): void {
    this.MessageService.action('switch message list type.');
    this.store.showTypeMessageList = !this.store.showTypeMessageList;
  }
  switchAlwaysOnTop(): void {
    const curwindow = require('electron').remote.getCurrentWindow();
    const newflg = !curwindow.isAlwaysOnTop();
    this.MessageService.info(`switch alwaysOnTop option ${newflg?'ON':'OFF'}`);
    this.store.alwaysOnTop = newflg;
    curwindow.setAlwaysOnTop(newflg);
  }

  // store observer
  private observers: yubo.StoreObserver[] = [];
  addObserver(observer: yubo.StoreObserver): void {
    this.observers.push(observer);
  }
  private notifyUpdates(objects: {[key: string]: any}): void {
    for (let o of this.observers) {
      o.update(objects);
    }
  }
}

angular.module('mainReducers', ['mainStores', 'mainServices', 'mainModels'])
  .service('MainReducer', [
    '$q',
    '$document',
    'MainStore',
    'MessageService',
    'DataService',
    'HistoryService',
    'AquesService',
    'HTML5AudioService',
    'WebAPIAudioService',
    'TextSubtitleService',
    'SeqFNameService',
    'AppUtilService',
    'CommandService',
    'IntroService',
    'YPhontMasterList',
    'YInputInitialData',
    MainReducer,
  ]);
