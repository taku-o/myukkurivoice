'use strict';
import {app,dialog,ipcMain} from 'electron';
import log from 'electron-log';
import * as path from 'path';

import * as Menu from './electron-menu';
import * as Pane from './electron-window';
import * as AppConfig from './electron-appcfg';

// MYukkuriVoice application
var MYukkuriVoice = function() {
  this.appCfg = null;
  this.config = null;

  // window reference
  this.mainWindow = null;
  this.helpWindow = null;
  this.systemWindow = null;
};
var myApp = new MYukkuriVoice();
MYukkuriVoice.prototype.showMainWindow = Pane.showMainWindow;
MYukkuriVoice.prototype.showHelpWindow = Pane.showHelpWindow;
MYukkuriVoice.prototype.showSystemWindow = Pane.showSystemWindow;
MYukkuriVoice.prototype.showAboutWindow = Pane.showAboutWindow;
MYukkuriVoice.prototype.showSpecWindow = Pane.showSpecWindow;
MYukkuriVoice.prototype.initAppMenu = Menu.initAppMenu;
MYukkuriVoice.prototype.initDockMenu = Menu.initDockMenu;
MYukkuriVoice.prototype.loadAppConfig = AppConfig.loadAppConfig;
MYukkuriVoice.prototype.updateAppConfig = AppConfig.updateAppConfig;
MYukkuriVoice.prototype.resetAppConfig = AppConfig.resetAppConfig;

// load application settings
if (process.env.NODE_ENV == 'test' && process.env.userData) {
  app.setPath('userData', process.env.userData);
}
myApp.loadAppConfig();

// handle uncaughtException
process.on('uncaughtException', function(err) {
  log.error('electron:event:uncaughtException');
  log.error(err);
  log.error(err.stack);
  app.quit();
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  app.quit();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // open main window.
  myApp.showMainWindow();

  // init menu
  myApp.initAppMenu({debug: myApp.appCfg.debug});
  myApp.initDockMenu();
});

// show window event
ipcMain.on('showHelpWindow', function(event, message) {
  myApp.showHelpWindow();
});
ipcMain.on('showSystemWindow', function(event, message) {
  myApp.showSystemWindow();
});
ipcMain.on('showSpecWindow', function(event, message) {
  myApp.showSpecWindow();
});

// showSaveDialog
ipcMain.on('showSaveDialog', function(event, message) {
  var options = {
    title: 'wav save dialog',
    filters: [
      { name: 'Wav File', extensions: ['wav']}
    ]
  };
  var r = dialog.showSaveDialog(myApp.mainWindow, options);
  event.sender.send('showSaveDialog', r);
});

// showDirDialog
ipcMain.on('showDirDialog', function(event, defaultPath) {
  var options = {
    title: 'select wav save directory',
    properties: ['openDirectory', 'createDirectory'],
    defaultPath: defaultPath,
  };
  // @ts-ignore
  var r = dialog.showOpenDialog(myApp.mainWindow, options, function(filePaths: string[]){});
  event.sender.send('showDirDialog', r);
});

// drag out wav file
ipcMain.on('ondragstartwav', function(event, filePath) {
  var imgPath = path.join(__dirname, '/img/ic_music_video_black_24dp_1x.png');
  event.sender.startDrag({
    file: filePath,
    icon: imgPath,
  });
});

// updateAppConfig
ipcMain.on('updateAppConfig', function(event, options) {
  myApp.updateAppConfig(options);
  var dialogOptions = {
    type: 'info',
    title: 'application config updated.',
    message: '環境設定を更新しました。アプリケーションを更新します。',
    buttons: ['OK'],
  };
  var r = dialog.showMessageBox(myApp.systemWindow, dialogOptions);
  event.sender.send('updateAppConfig', r);
  myApp.mainWindow.setSize(myApp.appCfg.mainWindow.width, myApp.appCfg.mainWindow.height);
  myApp.mainWindow.webContents.reload();
  if (myApp.systemWindow) { myApp.systemWindow.webContents.reload(); }
});

// resetAppConfig
ipcMain.on('resetAppConfig', function(event, message) {
  myApp.resetAppConfig();
  var dialogOptions = {
    type: 'info',
    title: 'application config initialized.',
    message: '環境設定を初期化しました。アプリケーションを更新します。',
    buttons: ['OK'],
  };
  var r = dialog.showMessageBox(myApp.systemWindow, dialogOptions);
  event.sender.send('resetAppConfig', r);
  myApp.mainWindow.setSize(myApp.appCfg.mainWindow.width, myApp.appCfg.mainWindow.height);
  myApp.mainWindow.webContents.reload();
  if (myApp.systemWindow) { myApp.systemWindow.webContents.reload(); }
});

// resetAppConfigOnMain
function resetAppConfigOnMain() {
  myApp.resetAppConfig();
  var dialogOptions = {
    type: 'info',
    title: 'application config initialized.',
    message: '環境設定を初期化しました。アプリケーションを更新します。',
    buttons: ['OK'],
  };
  var r = dialog.showMessageBox(myApp.mainWindow, dialogOptions);
  myApp.mainWindow.setSize(myApp.appCfg.mainWindow.width, myApp.appCfg.mainWindow.height);
  myApp.mainWindow.webContents.reload();
  if (myApp.systemWindow) { myApp.systemWindow.webContents.reload(); }
}
MYukkuriVoice.prototype.resetAppConfigOnMain = resetAppConfigOnMain;

// resetWindowPosition
function resetWindowPosition() {
  myApp.mainWindow.center();
}
MYukkuriVoice.prototype.resetWindowPosition = resetWindowPosition;

// switchAlwaysOnTop
function switchAlwaysOnTop() {
  var newflg = !myApp.mainWindow.isAlwaysOnTop();
  myApp.mainWindow.setAlwaysOnTop(newflg);
  myApp.mainWindow.webContents.send('switchAlwaysOnTop', newflg);
}
ipcMain.on('switchAlwaysOnTop', function(event, message) {
  var newflg = !myApp.mainWindow.isAlwaysOnTop();
  myApp.mainWindow.setAlwaysOnTop(newflg);
  event.sender.send('switchAlwaysOnTop', newflg);
});
MYukkuriVoice.prototype.switchAlwaysOnTop = switchAlwaysOnTop;

