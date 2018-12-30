'use strict';
var _crypto, crypto = () => { _crypto = _crypto || require('crypto'); return _crypto; };
var _Config, Config = () => { _Config = _Config || require('electron-store'); return _Config; };

// readyConfig
function readyConfig(): boolean {
  return this.config != null && this.appCfg != null;
}

// load
function loadAppConfig(): void {
  const appCfg: yubo.AppCfg = {
    mainWindow:   {width: 800, height: 665, x: null, y: null},
    helpWindow:   {width: 700, height: 700},
    systemWindow: {width: 390, height: 480},
    dictWindow:   {width: 800, height: 600},
    audioServVer: 'webaudioapi', // html5audio or webaudioapi
    showMsgPane: true,
    passPhrase: null,
    aq10UseKeyEncrypted: '',
  };

  const config = new (Config())() as yubo.ElectronConfig;
  ['mainWindow', 'audioServVer', 'showMsgPane', 'passPhrase', 'aq10UseKeyEncrypted'].forEach((k: string) => {
    if (config.has(k)) { appCfg[k] = config.get(k); }
  });
  // if passPhrase not exists, record passPhrase.
  if (! appCfg.passPhrase) {
    appCfg.passPhrase = crypto().randomBytes(16).toString('hex');
    config.set('passPhrase', appCfg.passPhrase);
  }
  this.config = config;
  this.appCfg = appCfg;
  global.appCfg = appCfg;
}

// update
function updateAppConfig(options: yubo.AppCfg): void {
  const myApp = this;
  const {x, y} = this.mainWindow.getBounds();
  options.mainWindow.x = x;
  options.mainWindow.y = y;
  this.config.set({
    mainWindow:          options.mainWindow,
    audioServVer:        options.audioServVer,
    showMsgPane:         options.showMsgPane,
    passPhrase:          options.passPhrase,
    aq10UseKeyEncrypted: options.aq10UseKeyEncrypted,
  });
  ['mainWindow', 'audioServVer', 'showMsgPane', 'passPhrase', 'aq10UseKeyEncrypted'].forEach((k: string) => {
    if (myApp.config.has(k)) { myApp.appCfg[k] = myApp.config.get(k); }
  });
  global.appCfg = this.appCfg;
}

// reset
function resetAppConfig(): void {
  const myApp = this;
  this.config.set({
    mainWindow:          {width: 800, height: 665, x:null, y:null},
    audioServVer:        'webaudioapi',
    showMsgPane:         true,
    passPhrase:          crypto().randomBytes(16).toString('hex'),
    aq10UseKeyEncrypted: '',
  });
  ['mainWindow', 'audioServVer', 'showMsgPane', 'passPhrase', 'aq10UseKeyEncrypted'].forEach((k: string) => {
    if (myApp.config.has(k)) { myApp.appCfg[k] = myApp.config.get(k); }
  });
  global.appCfg = this.appCfg;
}

// exports
export {
  readyConfig,
  loadAppConfig,
  updateAppConfig,
  resetAppConfig,
};

declare var global: yubo.Global;
