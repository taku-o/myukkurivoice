'use strict';
import * as crypto from 'crypto';
import * as Config from 'electron-config';

// load
function loadAppConfig(): void {
  var appCfg: yubo.AppCfg = {
    mainWindow: {width: 800, height: 665, x: null, y: null},
    helpWindow: {width: 700, height: 550},
    systemWindow: {width: 390, height: 530},
    audioServVer: 'webaudioapi', // html5audio or webaudioapi
    showMsgPane: true,
    acceptFirstMouse: false,
    passPhrase: crypto.randomBytes(16).toString('hex'),
    aq10UseKeyEncrypted: '',
    debug: process.env.DEBUG,
    isTest: process.env.NODE_ENV == 'test',
  };

  var config = new Config();
  ['mainWindow', 'audioServVer', 'showMsgPane', 'acceptFirstMouse', 'passPhrase', 'aq10UseKeyEncrypted'].forEach((k: string) => {
    if (config.has(k)) { appCfg[k] = config.get(k); }
  });
  this.config = config;
  this.appCfg = appCfg;
  global.appCfg = appCfg;
}

// update
function updateAppConfig(options): void {
  var myApp = this;
  var {x, y} = this.mainWindow.getBounds();
  options.mainWindow.x = x;
  options.mainWindow.y = y;
  this.config.set('mainWindow',          options.mainWindow);
  this.config.set('audioServVer',        options.audioServVer);
  this.config.set('showMsgPane',         options.showMsgPane);
  this.config.set('acceptFirstMouse',    options.acceptFirstMouse);
  this.config.set('passPhrase',          options.passPhrase);
  this.config.set('aq10UseKeyEncrypted', options.aq10UseKeyEncrypted);

  ['mainWindow', 'audioServVer', 'showMsgPane', 'acceptFirstMouse', 'passPhrase', 'aq10UseKeyEncrypted'].forEach((k: string) => {
    if (myApp.config.has(k)) { myApp.appCfg[k] = myApp.config.get(k); }
  });
  global.appCfg = this.appCfg;
}

// reset
function resetAppConfig(): void {
  var myApp = this;
  this.config.set('mainWindow',          { width: 800, height: 665, x:null, y:null });
  this.config.set('audioServVer',        'webaudioapi');
  this.config.set('showMsgPane',         true);
  this.config.set('acceptFirstMouse',    false);
  this.config.set('passPhrase',          crypto.randomBytes(16).toString('hex'));
  this.config.set('aq10UseKeyEncrypted', '');

  ['mainWindow', 'audioServVer', 'showMsgPane', 'acceptFirstMouse', 'passPhrase', 'aq10UseKeyEncrypted'].forEach((k: string) => {
    if (myApp.config.has(k)) { myApp.appCfg[k] = myApp.config.get(k); }
  });
  global.appCfg = this.appCfg;
}

// exports
export {
  loadAppConfig,
  updateAppConfig,
  resetAppConfig,
};

declare var global: yubo.Global;

/* eslint-disable */
namespace yubo {
  export interface Global extends NodeJS.Global {
    appCfg: AppCfg;
  }
  export interface AppCfg {
    mainWindow:   { width: number, height: number, x: number, y: number };
    helpWindow:   { width: number, height: number };
    systemWindow: { width: number, height: number };
    audioServVer:        string; //'html5audio' | 'webaudioapi'
    showMsgPane:         boolean;
    acceptFirstMouse:    boolean;
    passPhrase:          string;
    aq10UseKeyEncrypted: string;
    debug:               string;
    isTest:              boolean;
  }
}
