'use strict';
import {app} from 'electron';
var _crypto: any, crypto   = () => { _crypto = _crypto || require('crypto'); return _crypto; };
var _Config: any, Config   = () => { _Config = _Config || require('electron-store'); return _Config; };
var _log: any, log         = () => { _log = _log || require('electron-log'); return _log; };
var _monitor: any, monitor = () => { _monitor = _monitor || require('electron-performance-monitor'); return _monitor; };

// env
const MONITOR = process.env.MONITOR != null;

class FnAppCfg implements FnAppCfg {
  constructor() {}

  // load
  loadAppConfig(nextTask: () => void): void {
    if (MONITOR) { log().warn(monitor().format('appcfg', 'loadConfig start')); }
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    const appCfg: yubo.AppCfg = {
      mainWindow:       {width: 800, height: 665, x: null, y: null},
      helpWindow:       {width: 655, height: 572},
      helpSearchDialog: {width: 430, height: 120},
      systemWindow:     {width: 390, height: 605},
      dictWindow:       {width: 800, height: 600},
      audioServVer:     'webaudioapi8', // html5audio or webaudioapi or webaudioapi8
      showMsgPane:      true,
      passPhrase:       null,
      aq10UseKeyEncrypted: '',
      licenseKeyLimit:  null,
      extensions:       {fcpx: false},
    };

    setTimeout(() => {
      const configPath = `${app.getPath('userData')}/config.json`;
      let stored = null;
      try {
        stored = require(configPath);
      } catch(e) {
        stored = {};
      }
      delete require.cache[configPath];

      const config = new (Config())({defaults: stored}) as ElectronStore.Config;
      ['mainWindow', 'audioServVer', 'showMsgPane', 'passPhrase', 'aq10UseKeyEncrypted', 'licenseKeyLimit', 'extensions']
      .forEach((k: string) => {
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
    }, 0);
  }

  // update
  updateAppConfig(options: yubo.AppCfg): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    const {x, y} = myApp.mainWindow.getBounds();
    options.mainWindow.x = x;
    options.mainWindow.y = y;
    myApp.config.set({
      mainWindow:          options.mainWindow,
      audioServVer:        options.audioServVer,
      showMsgPane:         options.showMsgPane,
      passPhrase:          options.passPhrase,
      aq10UseKeyEncrypted: options.aq10UseKeyEncrypted,
      licenseKeyLimit:     options.licenseKeyLimit,
      extensions:          options.extensions,
    });
    ['mainWindow', 'audioServVer', 'showMsgPane', 'passPhrase', 'aq10UseKeyEncrypted', 'licenseKeyLimit', 'extensions']
    .forEach((k: string) => {
      if (myApp.config.has(k)) { myApp.appCfg[k] = myApp.config.get(k); }
    });
    global.appCfg = myApp.appCfg;
  }

  // reset
  resetAppConfig(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    myApp.config.set({
      mainWindow:          {width: 800, height: 665, x:null, y:null},
      audioServVer:        'webaudioapi8',
      showMsgPane:         true,
      passPhrase:          crypto().randomBytes(16).toString('hex'),
      aq10UseKeyEncrypted: '',
      licenseKeyLimit:     null,
      extensions:          {fcpx: false},
    });
    ['mainWindow', 'audioServVer', 'showMsgPane', 'passPhrase', 'aq10UseKeyEncrypted', 'licenseKeyLimit', 'extensions'].forEach((k: string) => {
      if (myApp.config.has(k)) { myApp.appCfg[k] = myApp.config.get(k); }
    });
    global.appCfg = myApp.appCfg;
  }

  resetWindowSize(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    const {width, height} = {width: 800, height: 665};
    myApp.mainWindow.setSize(width, height);
  }

  resetWindowPosition(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    myApp.mainWindow.center();
  }
}

export default FnAppCfg;
