declare namespace yubo {

  export interface Global extends NodeJS.Global {
    appCfg: AppCfg;
  }
  export interface ElectronConfig {
	get(key: string): any;
	set(key: string, val: any): void;
	has(key: string): boolean
  }

  export interface IMainScope extends ng.IScope {
    yinput:           yubo.YInput;
    yvoice:           yubo.YVoice;
    yvoiceList:       yubo.YVoice[];
    phontList:        YPhont[];
    appCfg:           AppCfg;
    duration:         number;
    lastWavFile:      yubo.IRecordMessage;
    encodedHighlight: any;
    sourceHighlight:  any;
    aq10BasList:      { name: string, id: number}[];
    display:          string;
    alwaysOnTop:      boolean;
    isTest:           boolean;
    messageList:      (IMessage | IRecordMessage)[];
  }
  export interface ISystemScope extends ng.IScope {
    appCfg:     AppCfg;
    aq10UseKey: string;
  }
  export interface IHelpScope extends ng.IScope {
    display:   string;
    $location: ng.ILocaleService;
  }

  // electron-appcfg.ts
  export interface AppCfg {
    mainWindow:    { width: number, height: number, x: number, y: number };
    helpWindow?:   { width: number, height: number };
    systemWindow?: { width: number, height: number };
    audioServVer:        'html5audio' | 'webaudioapi';
    showMsgPane:         boolean;
    acceptFirstMouse:    boolean;
    passPhrase:          string;
    aq10UseKeyEncrypted: string;
    debug?:              boolean;
    isTest?:             boolean;
  }

  // electron.ts
  export interface IMYukkuriVoice {
    appCfg:       yubo.AppCfg;
    config:       yubo.ElectronConfig;
    mainWindow:   Electron.BrowserWindow;
    helpWindow:   Electron.BrowserWindow;
    systemWindow: Electron.BrowserWindow;
    showMainWindow(): void;
    showHelpWindow(): void;
    showSystemWindow(): void;
    showSpecWindow(): void;
    initAppMenu(options: {debug: boolean}): void;
    initDockMenu(): void;
    loadAppConfig(): void;
    updateAppConfig(options: yubo.AppCfg): void;
    resetAppConfig(): void;
  }

  // js/models.ts
  export interface YPhont {
    readonly id:       string;
    readonly name:     string;
    readonly version:  'talk1' | 'talk2' | 'talk10';
    readonly idVoice?: 0 | 1;
    readonly path?:    string;
    readonly struct?:  { bas: number, spd: number, vol: number, pit: number, acc: number, lmd: number, fsc: number };
  }
  export interface YVoice {
    id?:           string;
    name:          string;
    phont:         string;
    version:       'talk1' | 'talk2' | 'talk10';
    bas?:          number;
    spd?:          number;
    vol?:          number;
    pit?:          number;
    acc?:          number;
    lmd?:          number;
    fsc?:          number;
    speed:         number;
    playbackRate:  number;
    detune:        number;
    volume:        number;
    rhythmOn:      boolean,
    writeMarginMs: number;
    sourceWrite:   boolean;
    seqWrite:      boolean;
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

  // js/services.message.ts
  export interface IMessage {
    readonly created: Date;
    readonly body: string;
    readonly type: string;
  }
  export interface IRecordMessage {
    readonly created: Date;
    readonly body: string;
    readonly wavFilePath: string;
    readonly wavFileName: string;
    readonly type: string;
  }

  // js/apps.main.ts
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
    volume:        number;
    playbackRate:  number;
    detune:        number;
    writeMarginMs: number;
  }
  export interface CmdOptions {
    env:      { VOICE: number, SPEED: number };
    encoding: string;
  }

  export interface IntroService {
    mainTutorial(): void;
    settingsTutorial(): void;
    shortcut(): void;
  }
  export interface CommandService {
    containsCommand(input: string, yvoiceList: yubo.YVoice[]): boolean;
    parseInput(input: string, yvoiceList: yubo.YVoice[], currentYvoice: yubo.YVoice): yubo.YCommandInput[];
    detectVoiceConfig(commandInput: yubo.YCommandInput, yvoiceList: yubo.YVoice[]): yubo.YVoice | null;
    toString(commandInputList: yubo.YCommandInput[]): string;
  }
  export interface LicenseService {
    encrypt(passPhrase: string, plainKey: string): string;
    decrypt(passPhrase: string, encryptedKey: string): string;
    consumerKey(licenseType: string): ng.IPromise<string>;
  }
  export interface MessageService {
    action(message: string): void;
    record(message: string, wavFilePath: string): void;
    info(message: string): void;
    error(message: string, err?: Error): void;
    syserror(message: string, err?: Error): void;
  }

  export interface DataService {
    load(): ng.IPromise<yubo.YVoice[]>;
    initialData(): yubo.YVoice[];
    create(): yubo.YVoice;
    copy(original: yubo.YVoice): yubo.YVoice;
    save(dataList: yubo.YVoice[]): void;
    clear(): ng.IPromise<boolean>;
  }
  export interface MasterService {
    getPhontList(): yubo.YPhont[];
  }
  export interface AquesService {
    encode(source: string): string;
    wave(encoded: string, phont: yubo.YPhont, speed: number, options: yubo.WaveOptions): ng.IPromise<any>;
  }
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
}
