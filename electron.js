'use strict';
exports.__esModule = true;
var electron_1 = require("electron");
var _log, log = function () { _log = _log || require('electron-log'); return _log; };
var _path, path = function () { _path = _path || require('path'); return _path; };
var Menu = require("./electron-menu");
var Pane = require("./electron-window");
var Launch = require("./electron-launch");
var AppConfig = require("./electron-appcfg");
// MYukkuriVoice application
var MYukkuriVoice = function () {
    this.launchArgs = null;
    this.appCfg = null;
    this.config = null;
    // window reference
    this.mainWindow = null;
    this.helpWindow = null;
    this.systemWindow = null;
    this.dictWindow = null;
};
var myApp = new MYukkuriVoice();
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
    electron_1.app.setPath('userData', process.env.userData);
}
myApp.loadAppConfig();
// handle uncaughtException
process.on('uncaughtException', function (err) {
    log().error('electron:event:uncaughtException');
    log().error(err);
    log().error(err.stack);
    electron_1.app.quit();
});
// Quit when all windows are closed.
electron_1.app.on('window-all-closed', function () {
    electron_1.app.quit();
});
electron_1.app.on('will-finish-launching', function () {
    // receive drop file to app icon event
    electron_1.app.on('open-file', function (event, filePath) {
        event.preventDefault();
        myApp.handleOpenFile(filePath);
    });
    // receive protocol call
    electron_1.app.on('open-url', function (event, url) {
        event.preventDefault();
        myApp.handleOpenUrl(url);
    });
});
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
electron_1.app.on('ready', function () {
    // open main window.
    myApp.showMainWindow();
    // init menu
    myApp.initAppMenu({ isDebug: myApp.appCfg.isDebug });
    myApp.initDockMenu();
});
// show window event
electron_1.ipcMain.on('showHelpWindow', function (event, message) {
    myApp.showHelpWindow();
});
electron_1.ipcMain.on('showSystemWindow', function (event, message) {
    myApp.showSystemWindow();
});
electron_1.ipcMain.on('showDictWindow', function (event, message) {
    myApp.showDictWindow();
});
electron_1.ipcMain.on('showSpecWindow', function (event, message) {
    myApp.showSpecWindow();
});
// showSaveDialog
electron_1.ipcMain.on('showSaveDialog', function (event, message) {
    var options = {
        title: 'wav save dialog',
        filters: [
            { name: 'Wav File', extensions: ['wav'] },
        ]
    };
    var r = electron_1.dialog.showSaveDialog(myApp.mainWindow, options);
    event.sender.send('showSaveDialog', r);
});
// showDirDialog
electron_1.ipcMain.on('showDirDialog', function (event, defaultPath) {
    var options = {
        title: 'select wav save directory',
        properties: ['openDirectory', 'createDirectory'],
        defaultPath: defaultPath
    };
    var r = electron_1.dialog.showOpenDialog(myApp.mainWindow, options);
    event.sender.send('showDirDialog', r);
});
// drag out wav file
electron_1.ipcMain.on('ondragstartwav', function (event, filePath) {
    var imgPath = path().join(__dirname, '/img/ic_music_video_black_24dp_1x.png');
    event.sender.startDrag({
        file: filePath,
        icon: imgPath
    });
});
// updateAppConfig
electron_1.ipcMain.on('updateAppConfig', function (event, options) {
    myApp.updateAppConfig(options);
    var dialogOptions = {
        type: 'info',
        title: 'application config updated.',
        message: '環境設定を更新しました。アプリケーションを更新します。',
        buttons: ['OK'],
        defaultId: 0
    };
    var r = electron_1.dialog.showMessageBox(myApp.systemWindow, dialogOptions);
    event.sender.send('updateAppConfig', r);
    myApp.mainWindow.setSize(myApp.appCfg.mainWindow.width, myApp.appCfg.mainWindow.height);
    myApp.mainWindow.webContents.reload();
    if (myApp.systemWindow) {
        myApp.systemWindow.webContents.reload();
    }
});
// resetAppConfig
electron_1.ipcMain.on('resetAppConfig', function (event, message) {
    myApp.resetAppConfig();
    var dialogOptions = {
        type: 'info',
        title: 'application config initialized.',
        message: '環境設定を初期化しました。アプリケーションを更新します。',
        buttons: ['OK'],
        defaultId: 0
    };
    var r = electron_1.dialog.showMessageBox(myApp.systemWindow, dialogOptions);
    event.sender.send('resetAppConfig', r);
    myApp.mainWindow.setSize(myApp.appCfg.mainWindow.width, myApp.appCfg.mainWindow.height);
    myApp.mainWindow.webContents.reload();
    if (myApp.systemWindow) {
        myApp.systemWindow.webContents.reload();
    }
});
// resetAppConfigOnMain
function resetAppConfigOnMain() {
    myApp.resetAppConfig();
    var dialogOptions = {
        type: 'info',
        title: 'application config initialized.',
        message: '環境設定を初期化しました。アプリケーションを更新します。',
        buttons: ['OK'],
        defaultId: 0
    };
    var r = electron_1.dialog.showMessageBox(myApp.mainWindow, dialogOptions);
    myApp.mainWindow.setSize(myApp.appCfg.mainWindow.width, myApp.appCfg.mainWindow.height);
    myApp.mainWindow.webContents.reload();
    if (myApp.systemWindow) {
        myApp.systemWindow.webContents.reload();
    }
}
MYukkuriVoice.prototype.resetAppConfigOnMain = resetAppConfigOnMain;
electron_1.ipcMain.on('reloadMainWindow', function (event, message) {
    myApp.mainWindow.webContents.reload();
    event.sender.send('reloadMainWindow', message);
});
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
electron_1.ipcMain.on('switchAlwaysOnTop', function (event, message) {
    var newflg = !myApp.mainWindow.isAlwaysOnTop();
    myApp.mainWindow.setAlwaysOnTop(newflg);
    event.sender.send('switchAlwaysOnTop', newflg);
});
MYukkuriVoice.prototype.switchAlwaysOnTop = switchAlwaysOnTop;
