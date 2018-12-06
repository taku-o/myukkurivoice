declare namespace yubo {

  // external
  export interface Global extends NodeJS.Global {
    appCfg: AppCfg;
  }
  export interface ElectronConfig {
	get(key: string): any;
	set(key: string, val: any): void;
	has(key: string): boolean
  }

  // electron-appcfg.ts
  export interface AppCfg {
    mainWindow:    { width: number, height: number, x: number, y: number };
    helpWindow?:   { width: number, height: number };
    systemWindow?: { width: number, height: number };
    dictWindow?:   { width: number, height: number };
    audioServVer:        'html5audio' | 'webaudioapi';
    showMsgPane:         boolean;
    passPhrase:          string;
    aq10UseKeyEncrypted: string;
  }

  // electron.ts
  export interface IMYukkuriVoice {
    launchArgs:   {filePath: string}
    appCfg:       yubo.AppCfg;
    config:       yubo.ElectronConfig;
    mainWindow:   Electron.BrowserWindow;
    helpWindow:   Electron.BrowserWindow;
    systemWindow: Electron.BrowserWindow;
    dictWindow:   Electron.BrowserWindow;
    showMainWindow(): void;
    showHelpWindow(): void;
    showSystemWindow(): void;
    showDictWindow(): void;
    showAboutWindow(): void;
    showVersionDialog(): void;
    showSpecWindow(): void;
    initAppMenu(): void;
    initDockMenu(): void;
    enableDictMenu(): void;
    disableDictMenu(): void;
    handleOpenFile(filePath: string): void;
    handleOpenUrl(scheme: string): void;
    readyConfig(): boolean;
    loadAppConfig(): void;
    updateAppConfig(options: yubo.AppCfg): void;
    resetAppConfig(): void;
  }

  // models.main.ts
  export interface YPhont {
    readonly id:       string;
    readonly name:     string;
    readonly version:  'talk1' | 'talk2' | 'talk10';
    readonly idVoice?: 0 | 1;
    readonly path?:    string;
    readonly struct?:  { bas: number, spd: number, vol: number, pit: number, acc: number, lmd: number, fsc: number };
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
    seqWriteOptions: { dir: string, prefix: string };
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
    load(ok: (dataList: yubo.YVoice[]) => void, ng: (err: Error) => void): ng.IPromise<yubo.YVoice[]>;
    initialData(): yubo.YVoice[];
    create(): yubo.YVoice;
    copy(original: yubo.YVoice): yubo.YVoice;
    save(dataList: yubo.YVoice[]): ng.IPromise<boolean>;
    clear(): ng.IPromise<boolean>;
  }
  export interface MasterService {
    getPhontList(): yubo.YPhont[];
  }
  export interface HistoryService {
    load(): ng.IPromise<any>;
    save(): ng.IPromise<boolean>;
    clear(): ng.IPromise<boolean>;
    get(wavFilePath: string): yubo.IRecordMessage;
    add(record: yubo.IRecordMessage): void;
    getList(): yubo.IRecordMessage[];
  }
  // service.aques.ts
  export interface AquesService {
    init(): void;
    encode(source: string): string;
    wave(encoded: string, phont: yubo.YPhont, speed: number, options: yubo.WaveOptions): ng.IPromise<any>;
  }
  // service.audio.ts
  export interface AudioService1 {
    play(bufWav: any, options: yubo.PlayOptions, parallel?: boolean): ng.IPromise<string>;
    stop(): void;
    record(wavFilePath: string, bufWav: any, options: yubo.PlayOptions): ng.IPromise<string>;
  }
  export interface AudioService2 {
    play(bufWav: any, options: yubo.PlayOptions, parallel?: boolean): ng.IPromise<string>;
    stop(): void;
    record(wavFilePath: string, bufWav: any, options: yubo.PlayOptions): ng.IPromise<string>;
  }
  // service.util.ts
  export interface AudioSourceService {
    sourceFname(wavFilePath: string): string;
    save(filePath: string, sourceText: string): ng.IPromise<string>;
  }
  export interface SeqFNameService {
    splitFname(filePath: string): {dir: string, basename: string};
    nextFname(prefix: string, num: number): string;
    nextNumber(dir: string, prefix: string): ng.IPromise<number>;
  }
  export interface AppUtilService {
    disableRhythm(encoded: string): string;
    reportDuration(duration: number): void;
  }
  // service.aqusrdic.ts
  export interface AqUsrDicService {
    generateUserDict(inCsvPath: string, outUserDicPath: string): {success:boolean, message:string};
    generateCSV(inUserDicPath: string, outCsvPath: string): {success:boolean, message:string};
    validateInput(surface: string, yomi: string, posCode: number): {success:boolean, message:string};
    getLastError(): string;
  }

  // scope
  export interface IMainScope extends ng.IScope {
    yinput:              yubo.YInput;
    yvoice:              yubo.YVoice;
    yvoiceList:          yubo.YVoice[];
    appCfg:              AppCfg;
    duration:            number;
    lastWavFile:         yubo.IRecordMessage;
    encodedHighlight:    any;
    sourceHighlight:     any;
    aq10BasList:         { name: string, id: number}[];
    display:             string;
    alwaysOnTop:         boolean;
    showTypeMessageList: boolean;
    messageList:         (IMessage | IRecordMessage | ISourceMessage)[];
    generatedList:       IRecordMessage[];
  }
  export interface ISystemScope extends ng.IScope {
    appCfg:     AppCfg;
    aq10UseKey: string;
  }
  export interface IHelpScope extends ng.IScope {
    display:   string;
    $location: ng.ILocaleService;
  }

  // apps.main.ts
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
    env:      { VOICE: number, SPEED: number };
    encoding: string;
  }
}
