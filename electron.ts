'use strict';
import {app} from 'electron';
var _log: any, log         = () => { _log = _log || require('electron-log'); return _log; };
var _monitor: any, monitor = () => { _monitor = _monitor || require('electron-performance-monitor'); return _monitor; };

import Menu from './electron-menu';
import TouchBar from './electron-touchbar';
import Pane from './electron-window';
import Shortcut from './electron-shortcut';
import Launch from './electron-launch';
import AppConfig from './electron-appcfg';
import EventHandler from './electron-event';
import AppUpdater from './electron-updater';

// env
const DEBUG = process.env.DEBUG != null;
const TEST = process.env.NODE_ENV == 'test';
const CONSOLELOG = process.env.CONSOLELOG != null;
const MONITOR = process.env.MONITOR != null;

// source-map-support
if (DEBUG) {
  try {
    require('source-map-support').install();
  } catch(e) {
    log().error('source-map-support or devtron is not installed.');
  }
}
// global.gc support
if (DEBUG) {
  app.commandLine.appendSwitch('js-flags', '--expose-gc');
}
// change userData for test
if (TEST && process.env.userData) {
  app.setPath('userData', process.env.userData);
}
// disable file log
if (CONSOLELOG) {
  delete log().transports['file'];
}
// perfomance monitoring
if (MONITOR) { log().warn(monitor().format('electron', '----------------')); }

// MYukkuriVoice application
const MYukkuriVoice = function(): void {
  this.launchArgs = null;
  this.appCfg = null;
  this.config = null;

  // window reference
  this.mainWindow = null;
  this.helpWindow = null;
  this.helpSearchDialog = null;
  this.systemWindow = null;
  this.dictWindow = null;
};
const myApp = new MYukkuriVoice() as yubo.IMYukkuriVoice;
// set prototype
// MYukkuriVoice.prototype.fnc = (Pane, Menu, TouchBar, Shortcut, Launch, AppConfig, EventHandler, AppUpdater).prototype.fnc
[Pane, Menu, TouchBar, Shortcut, Launch, AppConfig, EventHandler, AppUpdater].forEach(baseCtor => {
  Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
    if (name != 'constructor') {
      Object.defineProperty(MYukkuriVoice.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
    }
  });
});

// handle uncaughtException
process.on('uncaughtException', (err: Error) => {
  log().error('electron:event:uncaughtException');
  log().error(err);
  log().error(err.stack);
  app.quit();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
});

app.on('will-finish-launching', () => {
  // receive drop file to app icon event
  app.on('open-file', (event: Electron.Event, filePath: string) => {
    event.preventDefault();
    myApp.handleOpenFile(filePath);
  });
  // receive protocol call
  app.on('open-url', (event: Electron.Event, url: string) => {
    event.preventDefault();
    myApp.handleOpenUrl(url);
  });
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
  if (MONITOR) { log().warn(monitor().format('electron', 'ready called')); }
  myApp.loadAppConfig(() => {
    // open main window.
    // init menu
    myApp.showMainWindow();
    myApp.initAppMenu();
    myApp.initDockMenu();
    // register event handler
    myApp.acceptEvents();
    if (MONITOR) { log().warn(monitor().format('electron', 'ready done')); }
  });
});

