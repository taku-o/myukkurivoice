'use strict';
const electron = require('electron');
const app = electron.app;
const dialog = electron.dialog;
const ipcMain = electron.ipcMain;
const log = require('electron-log');
const path = require('path');
const crypto = require('crypto');
const Config = require('electron-config');

const Menu = require('./electron-menu');
const Pane = require('./electron-window');

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
MYukkuriVoice.prototype.showHelpWindow = Pane.showHelpWindow;
MYukkuriVoice.prototype.showSystemWindow = Pane.showSystemWindow;
MYukkuriVoice.prototype.showAboutWindow = Pane.showAboutWindow;

// application settings
var appCfg = {
  mainWindow: { width: 800, height: 665, x:null, y:null },
  helpWindow: { width: 700, height: 500 },
  systemWindow: { width: 390, height: 530 },
  audioServVer: 'webaudioapi', // html5audio or webaudioapi
  showMsgPane: true,
  acceptFirstMouse: false,
  passPhrase: crypto.randomBytes(16).toString('hex'),
  aq10UseKeyEncrypted: '',
  debug: process.env.DEBUG,
  isTest: process.env.NODE_ENV == 'test'
};
var config = new Config();
['mainWindow', 'audioServVer', 'showMsgPane', 'acceptFirstMouse', 'passPhrase', 'aq10UseKeyEncrypted'].forEach(function(k){
  if (config.has(k)) { appCfg[k] = config.get(k); }
});
myApp.config = config;
myApp.appCfg = appCfg;
global.appCfg = appCfg;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // open main window.
  Pane.showMainWindow(myApp);

  // init menu
  Menu.initAppMenu(myApp);
  Menu.initDockMenu(myApp);
});

// show window event
ipcMain.on('showHelpWindow', function (event, message) {
  Pane.showHelpWindow(myApp);
});
ipcMain.on('showSystemWindow', function (event, message) {
  Pane.showSystemWindow(myApp);
});
ipcMain.on('showSpecWindow', function (event, message) {
  Pane.showSpecWindow(myApp);
});

// showSaveDialog
ipcMain.on('showSaveDialog', function (event, message) {
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
ipcMain.on('showDirDialog', function (event, defaultPath) {
  var options = {
    title: 'select wav save directory',
    properties: ['openDirectory', 'createDirectory'],
    defaultPath: defaultPath
  };
  var r = dialog.showOpenDialog(myApp.mainWindow, options);
  event.sender.send('showDirDialog', r);
});

// drag out wav file
ipcMain.on('ondragstartwav', function (event, filePath) {
  var imgPath = path.join(__dirname, '/img/ic_music_video_black_24dp_1x.png');
  event.sender.startDrag({
    file: filePath,
    icon: imgPath
  })
});

// updateAppConfig
function updateAppConfig(options) {
  var {x,y} = myApp.mainWindow.getBounds();
  options.mainWindow.x = x;
  options.mainWindow.y = y;
  config.set('mainWindow',          options.mainWindow);
  config.set('audioServVer',        options.audioServVer);
  config.set('showMsgPane',         options.showMsgPane);
  config.set('acceptFirstMouse',    options.acceptFirstMouse);
  config.set('passPhrase',          options.passPhrase);
  config.set('aq10UseKeyEncrypted', options.aq10UseKeyEncrypted);

  ['mainWindow', 'audioServVer', 'showMsgPane', 'acceptFirstMouse', 'passPhrase', 'aq10UseKeyEncrypted'].forEach(function(k){
    if (config.has(k)) { appCfg[k] = config.get(k); }
  });
  global.appCfg = appCfg;
}
ipcMain.on('updateAppConfig', function (event, options) {
  updateAppConfig(options);
  var dialogOptions = {
    type: 'info',
    title: 'application config updated.',
    message: '環境設定を更新しました。アプリケーションを更新します。',
    buttons: ['OK'],
  };
  var r = dialog.showMessageBox(myApp.systemWindow, dialogOptions);
  event.sender.send('updateAppConfig', r);
  myApp.mainWindow.setSize(appCfg.mainWindow.width, appCfg.mainWindow.height);
  myApp.mainWindow.webContents.reload();
  if (myApp.systemWindow) { myApp.systemWindow.webContents.reload(); }
});

// resetAppConfig
function resetAppConfig() {
  config.set('mainWindow',          { width: 800, height: 665, x:null, y:null });
  config.set('audioServVer',        'webaudioapi');
  config.set('showMsgPane',         true);
  config.set('acceptFirstMouse',    false);
  config.set('passPhrase',          crypto.randomBytes(16).toString('hex'));
  config.set('aq10UseKeyEncrypted', '');

  ['mainWindow', 'audioServVer', 'showMsgPane', 'acceptFirstMouse', 'passPhrase', 'aq10UseKeyEncrypted'].forEach(function(k){
    if (config.has(k)) { appCfg[k] = config.get(k); }
  });
  global.appCfg = appCfg;
}
ipcMain.on('resetAppConfig', function (event, message) {
  resetAppConfig();
  var dialogOptions = {
    type: 'info',
    title: 'application config initialized.',
    message: '環境設定を初期化しました。アプリケーションを更新します。',
    buttons: ['OK'],
  };
  var r = dialog.showMessageBox(myApp.systemWindow, dialogOptions);
  event.sender.send('resetAppConfig', r);
  myApp.mainWindow.setSize(appCfg.mainWindow.width, appCfg.mainWindow.height);
  myApp.mainWindow.webContents.reload();
  if (myApp.systemWindow) { myApp.systemWindow.webContents.reload(); }
});

// resetAppConfigOnMain
function resetAppConfigOnMain() {
  resetAppConfig();
  var dialogOptions = {
    type: 'info',
    title: 'application config initialized.',
    message: '環境設定を初期化しました。アプリケーションを更新します。',
    buttons: ['OK'],
  };
  var r = dialog.showMessageBox(myApp.mainWindow, dialogOptions);
  myApp.mainWindow.setSize(appCfg.mainWindow.width, appCfg.mainWindow.height);
  myApp.mainWindow.webContents.reload();
  if (myApp.systemWindow) { myApp.systemWindow.webContents.reload(); }
}
MYukkuriVoice.prototype.resetAppConfig = resetAppConfig;

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
ipcMain.on('switchAlwaysOnTop', function (event, message) {
  var newflg = !myApp.mainWindow.isAlwaysOnTop();
  myApp.mainWindow.setAlwaysOnTop(newflg);
  event.sender.send('switchAlwaysOnTop', newflg);
});
MYukkuriVoice.prototype.switchAlwaysOnTop = switchAlwaysOnTop;

