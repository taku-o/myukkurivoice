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

declare namespace yubo {
  // external
  // node.js
  export interface Global extends NodeJS.Global {
    appCfg: AppCfg;
  }

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
  }

  // electron.ts
  export interface IMYukkuriVoice extends FnAppCfg, FnLaunch, FnMenu, FnWindow {
    launchArgs:       {filePath: string}
    appCfg:           yubo.AppCfg;
    config:           ElectronStore.Config;
    mainWindow:       Electron.BrowserWindow;
    helpWindow:       Electron.BrowserWindow;
    helpSearchDialog: Electron.BrowserWindow;
    systemWindow:     Electron.BrowserWindow;
    dictWindow:       Electron.BrowserWindow;
    resetAppConfigOnMain(): void;
    switchAlwaysOnTop():    void;
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
    record(message: string, opts: {wavFilePath: string, srcTextPath: string, source: string, encoded: string}): void;
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
    play(bufWav: Buffer, options: yubo.PlayOptions): ng.IPromise<string>;
    stop(): void;
    record(wavFilePath: string, bufWav: Buffer, options: yubo.PlayOptions): ng.IPromise<string>;
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
  // service.util.ts
  export interface AudioSourceService {
    //private readonly waveExt: string;
    //private readonly sourceExt: string;
    sourceFname(wavFilePath: string): string;
    save(filePath: string, sourceText: string): ng.IPromise<string>;
  }
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
  export interface MainShortcutEvent extends ng.IDirective {}
  export interface MainMenuEvent extends ng.IDirective {}
  export interface MainDropTextFileEvent extends ng.IDirective {}
  export interface MainRecentDocumentEvent extends ng.IDirective {}
  export interface DictShortcutEvent extends ng.IDirective {}
  export interface DictMenuEvent extends ng.IDirective {}
  export interface HelpUrlEvent extends ng.IDirective {}
  export interface HelpShortcutEvent extends ng.IDirective {}
  export interface HelpSearchEvent extends ng.IDirective {}

  // store, scope
  export interface MainStore {
    yinput:              yubo.YInput;
    curYvoice:           yubo.YVoice;
    yvoiceList:          yubo.YVoice[];
    duration:            number;
    lastWavFile:         yubo.IRecordMessage;
    //encodedHighlight:    {[key: string]: string};
    //sourceHighlight:     {[key: string]: string};
    display:             string;
    alwaysOnTop:         boolean;
    showTypeMessageList: boolean;
    messageList:         (IMessage | IRecordMessage | ISourceMessage)[];
    generatedList:       IRecordMessage[];
  }
  export interface IMainScope extends ng.IScope {
    encodedHighlight:    {[key: string]: string};
    sourceHighlight:     {[key: string]: string};
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
  export interface IDictScope extends ng.IScope {
  }
  export interface HelpStore {
    display: string;
  }
  export interface HelpSearchStore {
    searchText: string;
  }

  // apps.main.ts
  export interface MainReducer {
    appCfg: yubo.AppCfg;
    //private AudioService: yubo.IAudioService;
    onShortcut($scope: yubo.IMainScope, action: string): void;
    onMenu($scope: yubo.IMainScope, action: string): void;
    onDropTextFile($scope: yubo.IMainScope, filePath: string): void;
    onRecentDocument($scope: yubo.IMainScope, filePath: string): void;
    init($scope: yubo.IMainScope): void;
    onLoad($scope: yubo.IMainScope): void;
    //private loadData($scope: yubo.IMainScope, nextTask: () => void): void;
    //private loadHistory($scope: yubo.IMainScope): void;
    //private selectedSource(): string;
    //private selectedEncoded(): string;
    blurOnSource($scope: yubo.IMainScope): void;
    blurOnEncoded($scope: yubo.IMainScope): void;
    focusOnSource($scope: yubo.IMainScope): void;
    focusOnEncoded($scope: yubo.IMainScope): void;
    //private clearSourceSelection($scope: yubo.IMainScope): void;
    //private clearEncodedSelection($scope: yubo.IMainScope): void;
    onChangePhont($scope: yubo.IMainScope): void;
    play($scope: yubo.IMainScope): void;
    //private playEach($scope: yubo.IMainScope, cinput: yubo.YCommandInput): ng.IPromise<string>;
    stop(): void;
    record($scope: yubo.IMainScope): void;
    //private recordSolo($scope: yubo.IMainScope, cinput: yubo.YCommandInput, filePath: string): ng.IPromise<string>;
    //private recordEach($scope: yubo.IMainScope, cinput: yubo.YCommandInput, dir: string, fnameprefix: string): ng.IPromise<string>;
    showSystemWindow(): void;
    showSpecWindow(): void;
    help(): void;
    dictionary(): void;
    tutorial($scope: yubo.IMainScope): void;
    shortcut($scope: yubo.IMainScope): void;
    select($scope: yubo.IMainScope, index: number): void;
    plus($scope: yubo.IMainScope): void;
    minus($scope: yubo.IMainScope, index: number): void;
    copy($scope: yubo.IMainScope, index: number): void;
    save($scope: yubo.IMainScope): void;
    reset($scope: yubo.IMainScope): void;
    quickLookMessage(message: yubo.IWriteMessage): void;
    recentDocument($scope: yubo.IMainScope, message: yubo.IRecordMessage): void;
    clearRecentDocuments($scope: yubo.IMainScope): void;
    encode($scope: yubo.IMainScope): void;
    clear($scope: yubo.IMainScope): void;
    fromClipboard($scope: yubo.IMainScope): void;
    putVoiceName($scope: yubo.IMainScope): void;
    directory($scope: yubo.IMainScope): void;
    switchSettingsView($scope: yubo.IMainScope): void;
    switchMainView($scope: yubo.IMainScope): void;
    switchMessageListType($scope: yubo.IMainScope): void;
    switchAlwaysOnTop(): void;
    onSwitchAlwaysOnTop($scope: yubo.IMainScope, event: Electron.Event, newflg: boolean): void;
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
  export interface CmdOptions {
    env:      {VOICE: number, SPEED: number};
    encoding: string;
  }

  // apps.dict.ts
  export interface DictController {
    // accessor
    isInEditing: boolean;
    message:     string;
    gridOptions: any;
    // state
    $onInit(): void;
    toIsInEditing(): void;
    clearInEditing(): void;
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
  export interface DictReducer {
    //private readonly htmlTitle: string;
    //private readonly rscDictDir: string;
    //private readonly mAppDictDir: string;
    //private gridApi: any/*IGridApi*/;
    onMenu(action: string): void;
    init(): void;
    onLoad($scope: yubo.IDictScope): void;
    //private setup(): ng.IPromise<string>;
    //private loadCsv(): ng.IPromise<yubo.DictRecord[]>;
    toIsInEditing(): void;
    clearInEditing(): void;
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
  export interface HelpController {
    // accessor
    display: string
    // action
    page(pageName: string): void;
    openSearchForm(): void;
    browser(url: string): void;
    showItemInFolder(path: string): void;
    showSystemWindow(): void;
  }
  export interface HelpReducer {
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
  export interface HelpSearchController {
    // accessor
    searchText: string;
    // action
    searchInPage(): void;
    clearSearchForm(): void;
    closeSearchForm(): void;
  }
  export interface HelpSearchReducer {
    searchInPage(): void;
    clearSearchForm(): void;
  }

  // apps.system.ts
  export interface SystemController {
    // accessor
    appCfg: AppCfg;
    aq10UseKey: string;
    // state
    $onInit(): void;
    // actions
    cancel(): void;
    save(): void;
    reset(): void;
  }
  export interface SystemReducer {
    onLoad(): void;
    cancel(): void;
    save(): void;
    reset(): void;
  }
}
