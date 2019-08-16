// node.js fs
declare namespace fs {
  export interface Stats {
    isFile(): boolean;
    isDirectory(): boolean;
    isBlockDevice(): boolean;
    isCharacterDevice(): boolean;
    isSymbolicLink(): boolean;
    isFIFO(): boolean;
    isSocket(): boolean;
    dev: number;
    ino: number;
    mode: number;
    nlink: number;
    uid: number;
    gid: number;
    rdev: number;
    size: number;
    blksize: number;
    blocks: number;
    atimeMs: number;
    mtimeMs: number;
    ctimeMs: number;
    birthtimeMs: number;
    atime: Date;
    mtime: Date;
    ctime: Date;
    birthtime: Date;
  }
}

// electron-config
declare namespace ElectronStore {
  export interface Config {
    get(key: string): any;
    set(key: string, val: any): void;
    set(key: {[key: string]: any}): void;
    has(key: string): boolean;
  }
}

// wav-encoder
declare namespace WavEncoder {
  export interface AudioData {
    sampleRate: number;
    channelData: Float32Array[];
  }
}

// temp
declare namespace temp {
  export interface FileDescriptor {
    path: string;
    fd: number;
  }
}

// lru-cache
declare namespace LRUCache {
  export interface Cache {
    load(arr: any): void;
    get(key: string): any;
    set(key: string, value: any, maxAge: number): boolean;
    dump(): any;
    values(): any;
    reset(): void;
  }
}

// ref
declare namespace ref {
  export interface Type {
    size: number;
    indirection: number;
    get(buffer: Buffer, offset: number): any;
    set(buffer: Buffer, offset: number, value: any): void;
    name?: string;
    alignment?: number;
  }
}
// ref-struct
declare namespace refStruct {
  interface StructType {
    new (arg: Buffer, data?: {}): any;
    new (data?: {}): any;
    (arg: Buffer, data?: {}): any;
    (data?: {}): any;
    fields: {[key: string]: {type: ref.Type}};
    defineProperty(name: string, type: ref.Type): void;
    defineProperty(name: string, type: string): void;
    toString(): string;
  }
}

// github-version-compare
declare namespace GithubVersionCompare {
  interface IVersion {
    latestVersion:    string;
    publishedAt:      Date;
    readonly currentVersion:   string;
    readonly repository:       string;
    readonly latestReleaseUrl: string;
    isInitialized:      boolean;
    hasLatestVersion(): boolean;
    pull(): Promise<GithubVersionCompare.IVersion>;
  }
}

// extends external
// NodeJS
declare namespace NodeJS {
  export interface Global {
    appCfg: yubo.AppCfg;
  }
}

// global
interface Window {
  dataJson: yubo.YVoice[];
}

declare namespace yubo {
  // electron-appcfg.ts
  export interface AppCfg {
    mainWindow:          {width: number, height: number, x: number | null, y: number | null };
    helpWindow?:         {width: number, height: number};
    helpSearchDialog?:   {width: number, height: number};
    systemWindow?:       {width: number, height: number};
    dictWindow?:         {width: number, height: number};
    audioServVer:        'html5audio' | 'webaudioapi';
    showMsgPane:         boolean;
    passPhrase:          string | null;
    aq10UseKeyEncrypted: string;
    extensions:          {fcpx?: boolean};
  }

  // electron.ts
  export interface IMYukkuriVoice extends FnAppCfg, FnLaunch, FnMenu, FnWindow, FnEvent {
    launchArgs:       {filePath: string}
    appCfg:           yubo.AppCfg;
    config:           ElectronStore.Config;
    mainWindow:       Electron.BrowserWindow;
    helpWindow:       Electron.BrowserWindow;
    helpSearchDialog: Electron.BrowserWindow;
    systemWindow:     Electron.BrowserWindow;
    dictWindow:       Electron.BrowserWindow;
  }
  export interface FnAppCfg {
    loadAppConfig(nextTask: () => void): void;
    updateAppConfig(options: yubo.AppCfg): void;
    resetAppConfig(): void;
    resetWindowSize(): void;
    resetWindowPosition(): void;
  }
  export interface FnLaunch {
    handleOpenFile(filePath: string): void;
    handleOpenUrl(scheme: string): void;
  }
  export interface FnMenu {
    initAppMenu(): void;
    initDockMenu(): void;
    dictMenuItems(): string[];
    enableDictMenu(): void;
    disableDictMenu(): void;
    helpMenuItems(): string[];
    enableHelpMenu(): void;
    disableHelpMenu(): void;
  }
  export interface FnWindow {
    showMainWindow(): void;
    showHelpWindow(): void;
    showHelpSearchDialog(): void;
    showSystemWindow(): void;
    showDictWindow(): void;
    showAboutWindow(): void;
    showVersionDialog(): void;
    showSpecWindow(): void;
  }
  export interface FnEvent {
    acceptEvents(): void;
    //private registerWindowOpenEvents(): void;
    //private registerMainAppEvents(): void;
    //private registerSystemAppEvents(): void;
    resetAppConfigOnMain(): void;
  }

  // models.main.ts
  export interface YPhont {
    readonly id:       string;
    readonly name:     string;
    readonly version:  'talk1' | 'talk2' | 'talk10';
    readonly idVoice?: 0 | 1;
    readonly path?:    string;
    readonly struct?:  {bas: number, spd: number, vol: number, pit: number, acc: number, lmd: number, fsc: number};
  }
  export interface YVoice {
    id?:          string;
    name:         string;
    phont:        string;
    version:      'talk1' | 'talk2' | 'talk10';
    bas?:         number;
    spd?:         number;
    vol?:         number;
    pit?:         number;
    acc?:         number;
    lmd?:         number;
    fsc?:         number;
    speed:        number;
    playbackRate: number;
    detune:       number;
    volume:       number;
    rhythmOn:     boolean,
    sourceWrite:  boolean;
    seqWrite:     boolean;
    seqWriteOptions: {dir: string, prefix: string};
    fcpxIxml:     boolean;
    fcpxIxmlOptions: {audioRole?: string;};
  }
  export interface YInput {
    source:  string;
    encoded: string;
  }
  export interface YCommandInput {
    name: string;
    text: string;
  }
  // models.dict.ts
  export interface KindEntry {
    readonly id:   number;
    readonly kind: string;
  }
  export interface KindHash {
    [key: number]: string;
  }

  // service.intro.ts
  export interface IntroService {
    mainTutorial(): void;
    settingsTutorial(): void;
    shortcut(): void;
    dictTutorial(): void;
  }
  // service.command.ts
  export interface CommandService {
    containsCommand(input: string, yvoiceList: yubo.YVoice[]): boolean;
    parseInput(input: string, yvoiceList: yubo.YVoice[], currentYvoice: yubo.YVoice): yubo.YCommandInput[];
    detectVoiceConfig(commandInput: yubo.YCommandInput, yvoiceList: yubo.YVoice[]): yubo.YVoice | null;
    toString(commandInputList: yubo.YCommandInput[]): string;
  }
  // service.license.ts
  export interface LicenseService {
    //private readonly consumerKeyCache: {[index: string]: string;};
    encrypt(passPhrase: string, plainKey: string): string;
    decrypt(passPhrase: string, encryptedKey: string): string;
    consumerKey(licenseType: string): ng.IPromise<string>;
  }
  // service.message.ts
  export interface MessageService {
    action(message: string): void;
    record(message: string, opts: {wavFilePath: string, srcTextPath: string, source: string, encoded: string, duration: number}): void;
    recordSource(message: string, opts: {srcTextPath: string, source: string}): void;
    info(message: string): void;
    error(message: string, err?: Error): void;
    syserror(message: string, err?: Error): void;
  }
  export interface IMessage {
    readonly created: Date;
    readonly body: string;
    readonly type: string;
  }
  export interface IWriteMessage {
    readonly created: Date;
    readonly body: string;
    readonly quickLookPath: string;
    readonly type: string;
  }
  export interface IRecordMessage extends IWriteMessage {
    readonly wavFilePath: string;
    readonly wavFileName: string;
    readonly srcTextPath: string;
    readonly source: string;
    readonly encoded: string;
    readonly duration: number;
  }
  export interface ISourceMessage extends IWriteMessage {
    readonly srcTextPath: string;
    readonly source: string;
  }
  // service.data.ts
  export interface DataService {
    //private uniqId(): string;
    load(ok: (dataList: yubo.YVoice[]) => void, ng: (err: Error) => void): ng.IPromise<yubo.YVoice[]>;
    initialData(): yubo.YVoice[];
    create(): yubo.YVoice;
    copy(original: yubo.YVoice): yubo.YVoice;
    save(dataList: yubo.YVoice[]): ng.IPromise<boolean>;
    clear(): ng.IPromise<boolean>;
  }
  export interface HistoryService {
    //private readonly MS_MAX_AGE: number;
    //private _cache: LRUCache.Cache;
    //private cache(): LRUCache.Cache;
    //private _loaded: boolean;
    load(): ng.IPromise<LRUCache.Cache>;
    loaded(): boolean;
    save(): ng.IPromise<boolean>;
    clear(): ng.IPromise<boolean>;
    get(wavFilePath: string): yubo.IRecordMessage;
    add(record: yubo.IRecordMessage): void;
    getList(): yubo.IRecordMessage[];
  }
  // service.aques.ts
  export interface AqKanji2KoeLib {
    create(pathDic: string, pErr: Buffer): Buffer;
    release(hAqKanji2Koe: Buffer): void;
    convert(hAqKanji2Koe: Buffer, kanji: string, koe: Buffer, nBufKoe: number): number;
    setDevKey(key: string): number;
    errorTable(code: number): string;
  }
  export interface AquesTalk1Lib {
    //private release: string;
    readonly SUPPORTED_LAST_VERSION: string;
    isSupported(version?: string): boolean;
  }
  export interface AquesTalk2Lib {
    synthe(koe: string, iSpeed: number, size: Buffer, phontDat: Buffer): Buffer;
    freeWave(wav: Buffer): void;
    errorTable(code: number): string;
  }
  export interface AquesTalk10Lib {
    AQTK_VOICE: refStruct.StructType;
    synthe(pParam: Buffer, koe: string, size: Buffer): Buffer;
    freeWave(wav: Buffer): void;
    setDevKey(key: string): number;
    setUsrKey(key: string): number;
    errorTable(code: number): string;
  }
  export interface AquesService {
    //private aqDictPath: string;
    //private aqKanji2KoeDevKey: string;
    //private aquesTalk10DevKey: string;
    //private _isAqKanji2KoeDevkeySet: boolean;
    //private _isAquesTalk10LicensekeySet: boolean;
    init(): void;
    encode(source: string): string;
    wave(encoded: string, phont: yubo.YPhont, speed: number, options: yubo.WaveOptions): ng.IPromise<Buffer>;
  }
  // service.audio.ts
  export interface IAudioService {
    play(bufWav: Buffer, options: yubo.PlayOptions): ng.IPromise<{duration: number}>;
    stop(): void;
    record(wavFilePath: string, bufWav: Buffer, options: yubo.RecordOptions): ng.IPromise<{duration: number}>;
  }
  export interface AudioService1 extends IAudioService {
    //private audio: HTMLAudioElement;
  }
  export interface AudioService2 extends IAudioService {
    //private runningNode: AudioBufferSourceNode;
    //private toArrayBuffer(bufWav: Buffer): ArrayBuffer;
    //private correctFrameCount(audioBuffer: AudioBuffer): number;
    //private correctBufferLength(buffer: Float32Array): number;
    //private buildCorrectAudioBuffer(audioBuffer: AudioBuffer): AudioBuffer;
  }
  // service.audio-analyser.ts
  export interface AudioAnalyzerService {
    report(data: Uint8Array): void;
  }
  // service.subtitle.ts
  export interface TextSubtitleService {
    //private readonly waveExt: string;
    //private readonly sourceExt: string;
    sourceFname(wavFilePath: string): string;
    save(filePath: string, sourceText: string): ng.IPromise<string>;
  }
  // service.util.ts
  export interface SeqFNameService {
    //private readonly ext: string;
    //private readonly numPattern: string;
    //private readonly limit: string;
    splitFname(filePath: string): {dir: string, basename: string};
    nextFname(prefix: string, num: number): string;
    nextNumber(dir: string, prefix: string): ng.IPromise<number>;
  }
  export interface AppUtilService {
    disableRhythm(encoded: string): string;
    reportDuration(duration: number): void;
  }
  // service.aqusrdic.ts
  export interface AqUsrDicLib {
    importDic(pathUserDic: string, pathDicCsv: string): number;
    exportDic(pathUserDic: string, pathDicCsv: string): number;
    check(surface: string, yomi: string, posCode: number): number;
    getLastError(): string;
  }
  export interface AqUsrDicService {
    generateUserDict(inCsvPath: string, outUserDicPath: string): {success:boolean, message:string};
    generateCSV(inUserDicPath: string, outCsvPath: string): {success:boolean, message:string};
    validateInput(surface: string, yomi: string, posCode: number): {success:boolean, message:string};
    getLastError(): string;
  }

  // directive
  export interface WavDraggable extends ng.IDirective {}
  export interface TxtDroppable extends ng.IDirective {}
  export interface StaticInclude extends ng.IDirective {}
  export interface AfterRender extends ng.IDirective {}
  export interface ShortcutHintEvent extends ng.IDirective {}
  export interface MainShortcutEvent extends ng.IDirective {}
  export interface MainMenuEvent extends ng.IDirective {}
  export interface MainDropTextFileEvent extends ng.IDirective {}
  export interface MainRecentDocumentEvent extends ng.IDirective {}
  export interface DictShortcutEvent extends ng.IDirective {}
  export interface DictMenuEvent extends ng.IDirective {}
  export interface HelpUrlEvent extends ng.IDirective {}
  export interface HelpShortcutEvent extends ng.IDirective {}
  export interface HelpSearchEvent extends ng.IDirective {}

  // observer
  interface Reducer {
    //private observers: yubo.StoreObserver[];
    addObserver(observer: yubo.StoreObserver): void;
    //private notifyUpdates(objects: {[key: string]: any}): void;
  }
  interface StoreObserver {
    update(objects: {[key: string]: any}): void;
  }

  // store, scope
  export interface MainStore {
    yinput:              yubo.YInput;
    curYvoice:           yubo.YVoice;
    yvoiceList:          yubo.YVoice[];
    duration:            number;
    lastWavFile:         yubo.IRecordMessage;
    encodedHighlight:    {[key: string]: string};
    sourceHighlight:     {[key: string]: string};
    display:             string;
    alwaysOnTop:         boolean;
    showTypeMessageList: boolean;
    messageList:         (IMessage | IRecordMessage | ISourceMessage)[];
    generatedList:       IRecordMessage[];
  }
  export interface SystemStore {
    appCfg:     AppCfg;
    aq10UseKey: string;
  }
  export interface DictStore {
    isInEditing: boolean;
    message:     string;
    gridOptions: any;
  }
  export interface HelpStore {
    display: string;
    readonly onBrowser: boolean;
    readonly onElectron: boolean;
  }
  export interface HelpSearchStore {
    searchText: string;
  }

  // apps.main.ts
  export interface MainController extends yubo.StoreObserver {
    store: yubo.MainStore;
    appCfg: yubo.AppCfg;
    aq10BasList: {[key: string]: any}[];
    isTest: boolean;
    YPhontMasterList: yubo.YPhont[];
    // state
    $onInit(): void;
    // selected text highlight
    blurOnSource(): void;
    blurOnEncoded(): void;
    focusOnSource(): void;
    focusOnEncoded(): void;
    // list box selection changed
    onChangePhont(): void;
    // action
    play(): void;
    stop(): void;
    record(): void;
    showSystemWindow(): void;
    showSpecWindow(): void;
    help(): void;
    dictionary(): void;
    tutorial(): void;
    shortcut(): void;
    select(index: number): void;
    plus(): void;
    minus(index: number): void;
    copy(index: number): void;
    save(): void;
    reset(): void;
    quickLookMessage(message: yubo.IWriteMessage): void;
    recentDocument(message: yubo.IRecordMessage): void;
    clearRecentDocuments(): void;
    encode(): void;
    clear(): void;
    fromClipboard(): void;
    putVoiceName(): void;
    directory(): void;
    switchSettingsView(): void;
    switchMainView(): void;
    switchMessageListType(): void;
    switchAlwaysOnTop(): void;
  }
  export interface MainReducer extends yubo.Reducer {
    appCfg: yubo.AppCfg;
    //private AudioService: yubo.IAudioService;
    onShortcut(action: string, numKey?: number): void;
    onMenu(action: string): void;
    onDropTextFile(filePath: string): void;
    onRecentDocument(filePath: string): void;
    init(): void;
    onLoad($scope: ng.IScope): void;
    afterRender(): void;
    //private loadData(nextTask: () => void): void;
    //private loadHistory(): void;
    //private selectedSource(): string;
    //private selectedEncoded(): string;
    blurOnSource(): void;
    blurOnEncoded(): void;
    focusOnSource(): void;
    focusOnEncoded(): void;
    //private clearSourceSelection(): void;
    //private clearEncodedSelection(): void;
    onChangePhont(): void;
    play(): void;
    //private playEach(cinput: yubo.YCommandInput): ng.IPromise<{duration: number}>;
    stop(): void;
    record(): void;
    //private recordSolo(cinput: yubo.YCommandInput, filePath: string): ng.IPromise<{wavFilePath: string, duration: number}>;
    //private recordEach(cinput: yubo.YCommandInput, dir: string, fnameprefix: string): ng.IPromise<{wavFilePath: string, duration: number}>;
    showSystemWindow(): void;
    showSpecWindow(): void;
    help(): void;
    dictionary(): void;
    tutorial(): void;
    shortcut(): void;
    select(index: number): void;
    plus(): void;
    minus(index: number): void;
    copy(index: number): void;
    save(): void;
    reset(): void;
    quickLookMessage(message: yubo.IWriteMessage): void;
    recentDocument(message: yubo.IRecordMessage): void;
    clearRecentDocuments(): void;
    encode(): void;
    clear(): void;
    fromClipboard(): void;
    putVoiceName(): void;
    directory(): void;
    switchSettingsView(): void;
    switchMainView(): void;
    switchMessageListType(): void;
    switchAlwaysOnTop(): void;
  }
  export interface WaveOptions {
    passPhrase:          string;
    aq10UseKeyEncrypted: string;
    bas?:                number;
    pit?:                number;
    acc?:                number;
    lmd?:                number;
    fsc?:                number;
  }
  export interface PlayOptions {
    volume:       number;
    playbackRate: number;
    detune:       number;
  }
  export interface RecordOptions {
    volume:       number;
    playbackRate: number;
    detune:       number;
    fcpxIxml:     boolean;
    fcpxIxmlOptions: {audioRole?: string;};
  }
  export interface CmdOptions {
    env:      {VOICE: number, SPEED: number};
    encoding: string;
  }

  // apps.dict.ts
  export interface DictController extends yubo.StoreObserver {
    store: yubo.DictStore;
    // state
    $onInit(): void;
    // action
    add(): void;
    remove(): void;
    save(): void;
    cancel(): ng.IPromise<boolean>;
    dump(): void;
    reset(): ng.IPromise<boolean>;
    reload(): void;
    tutorial(): void;
  }
  export interface DictReducer extends yubo.Reducer {
    //private readonly htmlTitle: string;
    //private readonly rscDictDir: string;
    //private readonly mAppDictDir: string;
    //private gridApi: any/*IGridApi*/;
    init(): void;
    onLoad($scope: ng.IScope): void;
    //private setup(): ng.IPromise<string>;
    //private loadCsv(): ng.IPromise<yubo.DictRecord[]>;
    //private toIsInEditing(): void;
    //private clearInEditing(): void;
    add(): void;
    remove(): void;
    save(): void;
    cancel(): ng.IPromise<boolean>;
    dump(): void;
    reset(): ng.IPromise<boolean>;
    reload(): void;
    //private validateData(): ng.IPromise<boolean>;
    tutorial(): void;
  }
  export interface DictRecord {
    source:  string;
    encoded: string;
    kind:    number;
  }

  // apps.help.ts
  export interface HelpController extends yubo.StoreObserver {
    store: yubo.HelpStore;
    // action
    page(pageName: string): void;
    openSearchForm(): void;
    browser(url: string): void;
    showItemInFolder(path: string): void;
    showSystemWindow(): void;
  }
  export interface HelpReducer extends yubo.Reducer {
    //private readonly menuList: string[];
    locationChangeSuccess(): void;
    onShortcut(action: string): void;
    //private moveToPreviousHelp(): void;
    //private moveToNextHelp(): void;
    page(pageName: string): void;
    openSearchForm(): void;
    browser(url: string): void;
    showItemInFolder(path: string): void;
    showSystemWindow(): void;
  }

  // apps.helpsearch.ts
  export interface HelpSearchController extends yubo.StoreObserver {
    store: yubo.HelpSearchStore;
    // action
    searchInPage(): void;
    clearSearchForm(): void;
    closeSearchForm(): void;
  }
  export interface HelpSearchReducer extends yubo.Reducer {
    searchInPage(): void;
    clearSearchForm(): void;
  }

  // apps.system.ts
  export interface SystemController extends yubo.StoreObserver {
    store: yubo.SystemStore;
    // state
    $onInit(): void;
    // actions
    cancel(): void;
    save(): void;
    reset(): void;
  }
  export interface SystemReducer extends yubo.Reducer {
    onLoad(): void;
    cancel(): void;
    save(): void;
    reset(): void;
  }
}
