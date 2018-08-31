declare namespace yubo {

  export interface Global extends NodeJS.Global {
    appCfg: AppCfg;
  }
  export interface IScope extends ng.IScope {
    yinput: yubo.YInput;
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
    audioServVer:        'html5audio' | 'webaudioapi';
    showMsgPane:         boolean;
    acceptFirstMouse:    boolean;
    passPhrase:          string;
    aq10UseKeyEncrypted: string;
    debug?:              boolean;
    isTest?:             boolean;
  }

  // electron.ts
  export interface MYukkuriVoice {
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
}
