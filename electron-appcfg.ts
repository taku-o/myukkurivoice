'use strict';
var _crypto, crypto   = () => { _crypto = _crypto || require('crypto'); return _crypto; };
var _Config, Config   = () => { _Config = _Config || require('electron-store'); return _Config; };
var _storage, storage = () => { _storage = _storage || require('electron-json-storage'); return _storage; };
var _log, log         = () => { _log = _log || require('electron-log'); return _log; };
var _monitor, monitor = () => { _monitor = _monitor || require('electron-performance-monitor'); return _monitor; };

// env
const MONITOR = process.env.MONITOR != null;

// load
function loadAppConfig(nextTask: () => void): void {
  if (MONITOR) { log().warn(monitor().format('appcfg', 'loadConfig start')); }
  const myApp = this;
  const appCfg: yubo.AppCfg = {
    mainWindow:       {width: 800, height: 665, x: null, y: null},
    helpWindow:       {width: 700, height: 700},
    helpSearchDialog: {width: 430, height: 120},
    systemWindow:     {width: 390, height: 480},
    dictWindow:       {width: 800, height: 600},
    audioServVer:     'webaudioapi', // html5audio or webaudioapi
    showMsgPane: true,
    passPhrase: null,
    aq10UseKeyEncrypted: '',
  };

  // get from storage
  storage().get('config', function(error: Error, data: yubo.ElectronConfig) {
    let stored = null;
    if (error) {
      stored = {};
    } else {
      stored = data;
    }

    const config = new (Config())({defaults: stored}) as yubo.ElectronConfig;
    ['mainWindow', 'audioServVer', 'showMsgPane', 'passPhrase', 'aq10UseKeyEncrypted'].forEach((k: string) => {
      if (config.has(k)) { appCfg[k] = config.get(k); }
    });
    // if passPhrase not exists, record passPhrase.
    if (! appCfg.passPhrase) {
      appCfg.passPhrase = crypto().randomBytes(16).toString('hex');
      config.set('passPhrase', appCfg.passPhrase);
    }

    if (MONITOR) { log().warn(monitor().format('appcfg', 'loadConfig done')); }
    myApp.config = config;
    myApp.appCfg = appCfg;
    global.appCfg = appCfg;

    // finish, call next task.
    nextTask();
  });
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
function resetWindowSize(): void {
  const myApp = this;
  const {width, height} = {width: 800, height: 665};
  myApp.mainWindow.setSize(width, height);
}
function resetWindowPosition(): void {
  const myApp = this;
  myApp.mainWindow.center();
}

// exports
export {
  loadAppConfig,
  updateAppConfig,
  resetAppConfig,
  resetWindowSize,
  resetWindowPosition,
};

declare var global: yubo.Global;
