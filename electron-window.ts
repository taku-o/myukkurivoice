'use strict';
import {app,BrowserWindow,dialog,shell} from 'electron';
var _localShortcut, localShortcut     = () => { _localShortcut = _localShortcut || require('electron-localshortcut'); return _localShortcut; };
var _log, log                         = () => { _log = _log || require('electron-log'); return _log; };
var _path, path                       = () => { _path = _path || require('path'); return _path; };
var _openAboutWindow, openAboutWindow = () => { _openAboutWindow = _openAboutWindow || require('about-window').default; return _openAboutWindow; };
var _Version, Version                 = () => { _Version = _Version || require('github-version-compare').Version; return _Version; };

// env
const DEBUG = process.env.DEBUG != null;
const TEST = process.env.NODE_ENV == 'test';

// window option
const transparent: boolean = TEST? true: false;
const opacity: number = TEST? 0.0: 1.0;

// main window
function showMainWindow(): void {
  const myApp = this;
  if (this.mainWindow && !this.mainWindow.isDestroyed()) {
    this.mainWindow.show(); this.mainWindow.focus();
    return;
  }

  const {width, height, x, y} = this.appCfg.mainWindow;
  this.mainWindow = new BrowserWindow({
    width: width,
    height: height,
    x: x,
    y: y,
    acceptFirstMouse: true,
    show: false, // show at did-finish-load event
    transparent: transparent,
    opacity: opacity,
    webPreferences: {
      devTools: DEBUG,
    },
  });
  this.mainWindow.loadURL(`file://${__dirname}/contents-main.html`);

  // shortcut
  localShortcut().register(this.mainWindow, 'Command+Q', () => {
    app.quit();
  });
  localShortcut().register(this.mainWindow, 'Command+P', () => {
    myApp.mainWindow.webContents.send('shortcut', 'play');
  });
  localShortcut().register(this.mainWindow, 'Command+W', () => {
    myApp.mainWindow.webContents.send('shortcut', 'stop');
  });
  localShortcut().register(this.mainWindow, 'Command+S', () => {
    myApp.mainWindow.webContents.send('shortcut', 'record');
  });
  localShortcut().register(this.mainWindow, 'Command+Up', () => {
    myApp.mainWindow.webContents.send('shortcut', 'moveToSource');
  });
  localShortcut().register(this.mainWindow, 'Command+Down', () => {
    myApp.mainWindow.webContents.send('shortcut', 'moveToEncoded');
  });
  localShortcut().register(this.mainWindow, 'Command+Right', () => {
    myApp.mainWindow.webContents.send('shortcut', 'encode');
  });
  localShortcut().register(this.mainWindow, 'Command+D', () => {
    myApp.mainWindow.webContents.send('shortcut', 'fromClipboard');
  });
  localShortcut().register(this.mainWindow, 'Command+N', () => {
    myApp.mainWindow.webContents.send('shortcut', 'putVoiceName');
  });
  localShortcut().register(this.mainWindow, 'Command+Left', () => {
    myApp.mainWindow.webContents.send('shortcut', 'swichNextConfig');
  });
  localShortcut().register(this.mainWindow, 'Command+Shift+Left', () => {
    myApp.mainWindow.webContents.send('shortcut', 'swichPreviousConfig');
  });

  // main window event
  this.mainWindow.webContents.on('did-finish-load', () => {
    // receive drop file to app icon event
    if (myApp.launchArgs && myApp.launchArgs.filePath) {
      const filePath = myApp.launchArgs.filePath; myApp.launchArgs = null; // for window reload
      const ext = path().extname(filePath);
      if (ext == '.wav') {
        // not supported.
      } else {
        myApp.mainWindow.webContents.send('dropTextFile', filePath);
      }
    }
    // show
    myApp.mainWindow.show(); myApp.mainWindow.focus();
  });
  this.mainWindow.on('close', () => {
    // save bounds
    const bounds = myApp.mainWindow.getBounds();
    myApp.config.set('mainWindow', bounds);
  });
  this.mainWindow.on('closed', () => {
    myApp.mainWindow = null;
  });
  this.mainWindow.on('unresponsive', () => {
    log().warn('main:event:unresponsive');
  });
  this.mainWindow.webContents.on('crashed', () => {
    log().error('main:event:crashed');
  });
}

// help window
function showHelpWindow(): void {
  const myApp = this;
  if (this.helpWindow && !this.helpWindow.isDestroyed()) {
    this.helpWindow.show(); this.helpWindow.focus();
    return;
  }

  const {width, height} = this.appCfg.helpWindow;
  this.helpWindow = new BrowserWindow({
    parent: this.mainWindow,
    modal: false,
    width: width,
    height: height,
    acceptFirstMouse: true,
    show: false, // show at did-finish-load event
    transparent: transparent,
    opacity: opacity,
    webPreferences: {
      devTools: DEBUG,
    },
  });
  this.helpWindow.loadURL(`file://${__dirname}/contents-help.html`);

  // shortcut
  localShortcut().register(this.helpWindow, 'Command+Q', () => {
    app.quit();
  });
  localShortcut().register(this.helpWindow, 'Command+W', () => {
    if (myApp.helpWindow) { myApp.helpWindow.close(); }
  });
  localShortcut().register(this.helpWindow, 'Up', () => {
    myApp.helpWindow.webContents.send('shortcut', 'moveToPreviousHelp');
  });
  localShortcut().register(this.helpWindow, 'Down', () => {
    myApp.helpWindow.webContents.send('shortcut', 'moveToNextHelp');
  });

  // event
  this.helpWindow.webContents.on('did-finish-load', () => {
    myApp.helpWindow.show(); myApp.helpWindow.focus();
  });
  this.helpWindow.on('closed', () => {
    myApp.helpWindow = null;
  });
  this.helpWindow.on('unresponsive', () => {
    log().warn('help:event:unresponsive');
  });
  this.helpWindow.webContents.on('crashed', () => {
    log().error('help:event:crashed');
  });
}

// application config window
function showSystemWindow(): void {
  const myApp = this;
  if (this.systemWindow && !this.systemWindow.isDestroyed()) {
    this.systemWindow.show(); this.systemWindow.focus();
    return;
  }

  const {width, height} = this.appCfg.systemWindow;
  this.systemWindow = new BrowserWindow({
    parent: this.mainWindow,
    modal: false,
    width: width,
    height: height,
    acceptFirstMouse: true,
    show: false, // show at did-finish-load event
    transparent: transparent,
    opacity: opacity,
    webPreferences: {
      devTools: DEBUG,
    },
  });
  this.systemWindow.loadURL(`file://${__dirname}/contents-system.html`);

  // shortcut
  localShortcut().register(this.systemWindow, 'Command+Q', () => {
    app.quit();
  });
  localShortcut().register(this.systemWindow, 'Command+W', () => {
    if (myApp.systemWindow) { myApp.systemWindow.close(); }
  });

  // event
  this.systemWindow.webContents.on('did-finish-load', () => {
    myApp.systemWindow.show(); myApp.systemWindow.focus();
  });
  this.systemWindow.on('closed', () => {
    myApp.systemWindow = null;
  });
  this.systemWindow.on('unresponsive', () => {
    log().warn('system:event:unresponsive');
  });
  this.systemWindow.webContents.on('crashed', () => {
    log().error('system:event:crashed');
  });
}

// dict window
function showDictWindow(): void {
  const myApp = this;
  if (this.dictWindow && !this.dictWindow.isDestroyed()) {
    this.dictWindow.show(); this.dictWindow.focus();
    myApp.enableDictMenu();
    return;
  }

  const {width, height} = this.appCfg.dictWindow;
  this.dictWindow = new BrowserWindow({
    parent: this.mainWindow,
    width: width,
    height: height,
    acceptFirstMouse: true,
    show: false, // show at did-finish-load event
    transparent: transparent,
    opacity: opacity,
    webPreferences: {
      devTools: DEBUG,
    },
  });
  this.dictWindow.loadURL(`file://${__dirname}/contents-dict.html`);

  // shortcut
  localShortcut().register(this.dictWindow, 'Command+Q', () => {
    app.quit();
  });
  localShortcut().register(this.dictWindow, 'Command+W', () => {
    if (myApp.dictWindow) { myApp.dictWindow.close(); }
  });
  localShortcut().register(this.dictWindow, 'Command+S', () => {
    myApp.dictWindow.webContents.send('shortcut', 'save');
  });
  localShortcut().register(this.dictWindow, 'Command+N', () => {
    myApp.dictWindow.webContents.send('shortcut', 'add');
  });

  // window event
  this.dictWindow.webContents.on('did-finish-load', () => {
    myApp.dictWindow.show(); myApp.dictWindow.focus();
    myApp.enableDictMenu();
  });
  this.dictWindow.on('close', () => {
    myApp.disableDictMenu();
  });
  this.dictWindow.on('closed', () => {
    myApp.dictWindow = null;
  });
  this.dictWindow.on('unresponsive', () => {
    log().warn('main:event:unresponsive');
  });
  this.dictWindow.webContents.on('crashed', () => {
    log().error('main:event:crashed');
  });
}

// about application window
function showAboutWindow(): void {
  const w = openAboutWindow()({
    icon_path: path().join(__dirname, 'images/icon_128x128.png'),
    css_path: path().join(__dirname, 'css/about.css'),
    package_json_dir: __dirname,
    open_devtools: false,
  });
  if (this.mainWindow) { w.setParentWindow(this.mainWindow); }
  localShortcut().register(w, 'Command+Q', () => {
    app.quit();
  });
  localShortcut().register(w, 'Command+W', () => {
    if (w) { w.close(); }
  });
}

// showVersionDialog
function showVersionDialog() {
  const repository = 'taku-o/myukkurivoice';
  const packagejson = require('./package.json');

  const version = new (Version())(repository, packagejson);
  version.pull().then((version) => {
    const message = version.hasLatestVersion()? '新しいバージョンのアプリがあります': 'バージョンは最新です';
    const buttons = version.hasLatestVersion()? ['CLOSE', 'Open Release Page']: ['OK'];

    const dialogOptions = {
      type: 'info',
      title: 'application version check.',
      message: message,
      buttons: buttons,
      defaultId: 0,
      cancelId: 0,
    };
    const btnId: number = dialog.showMessageBox(this.systemWindow, dialogOptions);
    if (btnId == 1) {
      shell.openExternal(version.latestReleaseUrl);
    }
  })
  .catch((err: Error) => {
    log().error(err);
    const dialogOptions = {
      type: 'error',
      title: 'application version check error.',
      message: 'バージョン情報の取得に失敗しました。',
      buttons: ['OK'],
      defaultId: 0,
      cancelId: 0,
    };
    const r = dialog.showMessageBox(this.systemWindow, dialogOptions);
  });
}

// application spec window
function showSpecWindow(): void {
  const specWindow = new BrowserWindow({
    parent: this.mainWindow,
    modal: false,
    width: 800,
    height: 800,
    show: true,
    transparent: transparent,
    opacity: opacity,
    webPreferences: {
      devTools: DEBUG,
    },
  });
  specWindow.loadURL(`file://${__dirname}/contents-spec.html`);
}

// exports
export {
  showMainWindow,
  showHelpWindow,
  showSystemWindow,
  showDictWindow,
  showAboutWindow,
  showVersionDialog,
  showSpecWindow,
};
