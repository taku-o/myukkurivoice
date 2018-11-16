'use strict';
import {app,dialog,ipcMain} from 'electron';
var _log, log   = () => { _log = _log || require('electron-log'); return _log; };
var _path, path = () => { _path = _path || require('path'); return _path; };

import * as Menu from './electron-menu';
import * as Pane from './electron-window';
import * as Launch from './electron-launch';
import * as AppConfig from './electron-appcfg';

// source-map-support
if (process.env.DEBUG != null) {
  require('source-map-support').install();
}

// MYukkuriVoice application
const MYukkuriVoice = function(): void {
  this.launchArgs = null;
  this.appCfg = null;
  this.config = null;

  // window reference
  this.mainWindow = null;
  this.helpWindow = null;
  this.systemWindow = null;
  this.dictWindow = null;
};
const myApp = new MYukkuriVoice() as yubo.IMYukkuriVoice;
MYukkuriVoice.prototype.showMainWindow = Pane.showMainWindow;
MYukkuriVoice.prototype.showHelpWindow = Pane.showHelpWindow;
MYukkuriVoice.prototype.showSystemWindow = Pane.showSystemWindow;
MYukkuriVoice.prototype.showDictWindow = Pane.showDictWindow;
MYukkuriVoice.prototype.showAboutWindow = Pane.showAboutWindow;
MYukkuriVoice.prototype.showVersionDialog = Pane.showVersionDialog;
MYukkuriVoice.prototype.showSpecWindow = Pane.showSpecWindow;
MYukkuriVoice.prototype.initAppMenu = Menu.initAppMenu;
MYukkuriVoice.prototype.initDockMenu = Menu.initDockMenu;
MYukkuriVoice.prototype.handleOpenFile = Launch.handleOpenFile;
MYukkuriVoice.prototype.handleOpenUrl = Launch.handleOpenUrl;
MYukkuriVoice.prototype.loadAppConfig = AppConfig.loadAppConfig;
MYukkuriVoice.prototype.updateAppConfig = AppConfig.updateAppConfig;
MYukkuriVoice.prototype.resetAppConfig = AppConfig.resetAppConfig;

// load application settings
if (process.env.NODE_ENV == 'test' && process.env.userData) {
  app.setPath('userData', process.env.userData);
}
myApp.loadAppConfig();

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
  app.on('open-file', (event, filePath: string) => {
    event.preventDefault();
    myApp.handleOpenFile(filePath);
  });
  // receive protocol call
  app.on('open-url', (event, url: string) => {
    event.preventDefault();
    myApp.handleOpenUrl(url);
  });
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
  // open main window.
  myApp.showMainWindow();

  // init menu
  myApp.initAppMenu({isDebug: myApp.appCfg.isDebug});
  myApp.initDockMenu();
});

// show window event
ipcMain.on('showHelpWindow', (event, message) => {
  myApp.showHelpWindow();
});
ipcMain.on('showSystemWindow', (event, message) => {
  myApp.showSystemWindow();
});
ipcMain.on('showDictWindow', (event, message) => {
  myApp.showDictWindow();
});
ipcMain.on('showSpecWindow', (event, message) => {
  myApp.showSpecWindow();
});

// showSaveDialog
ipcMain.on('showSaveDialog', (event, message) => {
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
ipcMain.on('showDirDialog', (event, defaultPath) => {
  const options = {
    title: 'select wav save directory',
    properties: ['openDirectory' as 'openDirectory', 'createDirectory' as 'createDirectory'],
    defaultPath: defaultPath,
  };
  const r = dialog.showOpenDialog(myApp.mainWindow, options);
  event.sender.send('showDirDialog', r);
});

// drag out wav file
ipcMain.on('ondragstartwav', (event, filePath) => {
  const imgPath = path().join(__dirname, '/img/ic_music_video_black_24dp_1x.png');
  event.sender.startDrag({
    file: filePath,
    icon: imgPath,
  });
});

// updateAppConfig
ipcMain.on('updateAppConfig', (event, options: yubo.AppCfg) => {
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
ipcMain.on('resetAppConfig', (event, message) => {
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

ipcMain.on('reloadMainWindow', (event, message) => {
  myApp.mainWindow.webContents.reload();
  event.sender.send('reloadMainWindow', message);
});

// resetWindowPosition
function resetWindowPosition(): void {
  myApp.mainWindow.center();
}
MYukkuriVoice.prototype.resetWindowPosition = resetWindowPosition;

// switchAlwaysOnTop
function switchAlwaysOnTop(): void {
  const newflg = !myApp.mainWindow.isAlwaysOnTop();
  myApp.mainWindow.setAlwaysOnTop(newflg);
  myApp.mainWindow.webContents.send('switchAlwaysOnTop', newflg);
}
ipcMain.on('switchAlwaysOnTop', (event, message) => {
  const newflg = !myApp.mainWindow.isAlwaysOnTop();
  myApp.mainWindow.setAlwaysOnTop(newflg);
  event.sender.send('switchAlwaysOnTop', newflg);
});
MYukkuriVoice.prototype.switchAlwaysOnTop = switchAlwaysOnTop;

