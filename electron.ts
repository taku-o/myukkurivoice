'use strict';
import {app, dialog, ipcMain} from 'electron';
var _log, log         = () => { _log = _log || require('electron-log'); return _log; };
var _path, path       = () => { _path = _path || require('path'); return _path; };
var _monitor, monitor = () => { _monitor = _monitor || require('electron-performance-monitor'); return _monitor; };

import * as Menu from './electron-menu';
import * as Pane from './electron-window';
import * as Launch from './electron-launch';
import * as AppConfig from './electron-appcfg';

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
// MYukkuriVoice.prototype.fnc = fnc
[Pane, Menu, Launch, AppConfig].forEach((baseCtor) => {
  Object.getOwnPropertyNames(baseCtor).forEach((name) => {
    if (name != '__esModule') { MYukkuriVoice.prototype[name] = baseCtor[name]; }
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
    if (MONITOR) { log().warn(monitor().format('electron', 'ready done')); }
  });
});

// show window event
ipcMain.on('showHelpWindow', (event: Electron.Event, message: string) => {
  myApp.showHelpWindow();
});
ipcMain.on('showHelpSearchDialog', (event: Electron.Event, message: string) => {
  myApp.showHelpSearchDialog();
});
ipcMain.on('showSystemWindow', (event: Electron.Event, message: string) => {
  myApp.showSystemWindow();
});
ipcMain.on('showDictWindow', (event: Electron.Event, message: string) => {
  myApp.showDictWindow();
});
ipcMain.on('showSpecWindow', (event: Electron.Event, message: string) => {
  myApp.showSpecWindow();
});

// showSaveDialog
ipcMain.on('showSaveDialog', (event: Electron.Event, message: string) => {
  const options = {
    title: 'wav save dialog',
    filters: [
      {name: 'Wav File', extensions: ['wav']},
    ],
  };
  const r = dialog.showSaveDialog(myApp.mainWindow, options);
  event.sender.send('showSaveDialog', r);
});

// showDirDialog
ipcMain.on('showDirDialog', (event: Electron.Event, defaultPath: string) => {
  const options = {
    title: 'select wav save directory',
    properties: ['openDirectory' as 'openDirectory', 'createDirectory' as 'createDirectory'],
    defaultPath: defaultPath,
  };
  const r = dialog.showOpenDialog(myApp.mainWindow, options);
  event.sender.send('showDirDialog', r);
});

// drag out wav file
ipcMain.on('ondragstartwav', (event: Electron.Event, filePath: string) => {
  const imgPath = path().join(__dirname, '/images/ic_music_video_black_24dp_1x.png');
  event.sender.startDrag({
    file: filePath,
    icon: imgPath,
  });
});

// updateAppConfig
ipcMain.on('updateAppConfig', (event: Electron.Event, options: yubo.AppCfg) => {
  myApp.updateAppConfig(options);
  const dialogOptions = {
    type: 'info',
    title: 'application config updated.',
    message: '環境設定を更新しました。アプリケーションを更新します。',
    buttons: ['OK'],
    defaultId: 0,
  };
  const r = dialog.showMessageBox(myApp.systemWindow, dialogOptions);
  event.sender.send('updateAppConfig', r);
  myApp.mainWindow.setSize(myApp.appCfg.mainWindow.width, myApp.appCfg.mainWindow.height);
  myApp.mainWindow.webContents.reload();
  if (myApp.systemWindow) { myApp.systemWindow.webContents.reload(); }
});

// resetAppConfig
ipcMain.on('resetAppConfig', (event: Electron.Event, message: string) => {
  myApp.resetAppConfig();
  const dialogOptions = {
    type: 'info',
    title: 'application config initialized.',
    message: '環境設定を初期化しました。アプリケーションを更新します。',
    buttons: ['OK'],
    defaultId: 0,
  };
  const r = dialog.showMessageBox(myApp.systemWindow, dialogOptions);
  event.sender.send('resetAppConfig', r);
  myApp.mainWindow.setSize(myApp.appCfg.mainWindow.width, myApp.appCfg.mainWindow.height);
  myApp.mainWindow.webContents.reload();
  if (myApp.systemWindow) { myApp.systemWindow.webContents.reload(); }
});

// resetAppConfigOnMain
function resetAppConfigOnMain(): void {
  myApp.resetAppConfig();
  const dialogOptions = {
    type: 'info',
    title: 'application config initialized.',
    message: '環境設定を初期化しました。アプリケーションを更新します。',
    buttons: ['OK'],
    defaultId: 0,
  };
  const r = dialog.showMessageBox(myApp.mainWindow, dialogOptions);
  myApp.mainWindow.setSize(myApp.appCfg.mainWindow.width, myApp.appCfg.mainWindow.height);
  myApp.mainWindow.webContents.reload();
  if (myApp.systemWindow) { myApp.systemWindow.webContents.reload(); }
}
MYukkuriVoice.prototype.resetAppConfigOnMain = resetAppConfigOnMain;

ipcMain.on('reloadMainWindow', (event: Electron.Event, message: string) => {
  myApp.mainWindow.webContents.reload();
  event.sender.send('reloadMainWindow', message);
});

// switchAlwaysOnTop
function switchAlwaysOnTop(): void {
  const newflg = !myApp.mainWindow.isAlwaysOnTop();
  myApp.mainWindow.setAlwaysOnTop(newflg);
  myApp.mainWindow.webContents.send('switchAlwaysOnTop', newflg);
}
ipcMain.on('switchAlwaysOnTop', (event: Electron.Event, message: string) => {
  const newflg = !myApp.mainWindow.isAlwaysOnTop();
  myApp.mainWindow.setAlwaysOnTop(newflg);
  event.sender.send('switchAlwaysOnTop', newflg);
});
MYukkuriVoice.prototype.switchAlwaysOnTop = switchAlwaysOnTop;
