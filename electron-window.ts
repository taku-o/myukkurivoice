'use strict';
import {app,BrowserWindow} from 'electron';
import * as localShortcut from 'electron-localshortcut';
import * as log from 'electron-log';
import * as path from 'path';
const openAboutWindow: any = require('about-window').default;

// main window
function showMainWindow(): void {
  var myApp = this;
  if (this.mainWindow && !this.mainWindow.isDestroyed()) {
    this.mainWindow.show(); this.mainWindow.focus();
    return;
  }

  var {width, height, x, y} = this.appCfg.mainWindow;
  var acceptFirstMouse = this.appCfg.acceptFirstMouse;
  this.mainWindow = new BrowserWindow({
    width: width,
    height: height,
    x: x,
    y: y,
    acceptFirstMouse: acceptFirstMouse,
    show: false, // show at did-finish-load event
    webPreferences: {
      devTools: this.appCfg.debug,
    },
  });
  this.mainWindow.loadURL(`file://${__dirname}/contents-main.html`);

  // shortcut
  localShortcut.register(this.mainWindow, 'Command+Q', () => {
    app.quit();
  });
  localShortcut.register(this.mainWindow, 'Command+P', () => {
    myApp.mainWindow.webContents.send('shortcut', 'play');
  });
  localShortcut.register(this.mainWindow, 'Command+W', () => {
    myApp.mainWindow.webContents.send('shortcut', 'stop');
  });
  localShortcut.register(this.mainWindow, 'Command+S', () => {
    myApp.mainWindow.webContents.send('shortcut', 'record');
  });
  localShortcut.register(this.mainWindow, 'Command+Up', () => {
    myApp.mainWindow.webContents.send('shortcut', 'moveToSource');
  });
  localShortcut.register(this.mainWindow, 'Command+Down', () => {
    myApp.mainWindow.webContents.send('shortcut', 'moveToEncoded');
  });
  localShortcut.register(this.mainWindow, 'Command+Right', () => {
    myApp.mainWindow.webContents.send('shortcut', 'encode');
  });
  localShortcut.register(this.mainWindow, 'Command+D', () => {
    myApp.mainWindow.webContents.send('shortcut', 'fromClipboard');
  });
  localShortcut.register(this.mainWindow, 'Command+N', () => {
    myApp.mainWindow.webContents.send('shortcut', 'putVoiceName');
  });
  localShortcut.register(this.mainWindow, 'Command+Left', () => {
    myApp.mainWindow.webContents.send('shortcut', 'swichNextConfig');
  });
  localShortcut.register(this.mainWindow, 'Command+Shift+Left', () => {
    myApp.mainWindow.webContents.send('shortcut', 'swichPreviousConfig');
  });

  // main window event
  this.mainWindow.webContents.on('did-finish-load', () => {
    myApp.mainWindow.show(); myApp.mainWindow.focus();
  });
  this.mainWindow.on('close', () => {
    var bounds = myApp.mainWindow.getBounds();
    myApp.config.set('mainWindow', bounds);
  });
  this.mainWindow.on('closed', () => {
    myApp.mainWindow = null;
  });
  this.mainWindow.on('unresponsive', () => {
    log.warn('main:event:unresponsive');
  });
  this.mainWindow.webContents.on('crashed', () => {
    log.error('main:event:crashed');
  });
}

// help window
function showHelpWindow(): void {
  var myApp = this;
  if (this.helpWindow && !this.helpWindow.isDestroyed()) {
    this.helpWindow.show(); this.helpWindow.focus();
    return;
  }

  var {width, height} = this.appCfg.helpWindow;
  var acceptFirstMouse = this.appCfg.acceptFirstMouse;
  this.helpWindow = new BrowserWindow({
    parent: this.mainWindow,
    modal: false,
    width: width,
    height: height,
    acceptFirstMouse: acceptFirstMouse,
    show: false, // show at did-finish-load event
    webPreferences: {
      devTools: this.appCfg.debug,
    },
  });
  this.helpWindow.loadURL(`file://${__dirname}/contents-help.html`);

  // shortcut
  localShortcut.register(this.helpWindow, 'Command+Q', () => {
    app.quit();
  });
  localShortcut.register(this.helpWindow, 'Command+W', () => {
    if (myApp.helpWindow) { myApp.helpWindow.close(); }
  });
  localShortcut.register(this.helpWindow, 'Up', () => {
    if (myApp.helpWindow) { myApp.helpWindow.webContents.send('shortcut', 'moveToPreviousHelp'); }
  });
  localShortcut.register(this.helpWindow, 'Down', () => {
    if (myApp.helpWindow) { myApp.helpWindow.webContents.send('shortcut', 'moveToNextHelp'); }
  });

  // event
  this.helpWindow.webContents.on('did-finish-load', () => {
    myApp.helpWindow.show(); myApp.helpWindow.focus();
  });
  this.helpWindow.on('closed', () => {
    myApp.helpWindow = null;
  });
  this.helpWindow.on('unresponsive', () => {
    log.warn('help:event:unresponsive');
  });
  this.helpWindow.webContents.on('crashed', () => {
    log.error('help:event:crashed');
  });
}

// application config window
function showSystemWindow(): void {
  var myApp = this;
  if (this.systemWindow && !this.systemWindow.isDestroyed()) {
    this.systemWindow.show(); this.systemWindow.focus();
    return;
  }

  var {width, height} = this.appCfg.systemWindow;
  var acceptFirstMouse = this.appCfg.acceptFirstMouse;
  this.systemWindow = new BrowserWindow({
    parent: this.mainWindow,
    modal: false,
    width: width,
    height: height,
    acceptFirstMouse: acceptFirstMouse,
    show: false, // show at did-finish-load event
    webPreferences: {
      devTools: this.appCfg.debug,
    },
  });
  this.systemWindow.loadURL(`file://${__dirname}/contents-system.html`);

  // shortcut
  localShortcut.register(this.systemWindow, 'Command+Q', () => {
    app.quit();
  });
  localShortcut.register(this.systemWindow, 'Command+W', () => {
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
    log.warn('system:event:unresponsive');
  });
  this.systemWindow.webContents.on('crashed', () => {
    log.error('system:event:crashed');
  });
}

// about application window
function showAboutWindow(): void {
  var w = openAboutWindow({
    icon_path: path.join(__dirname, 'img/icon_128x128.png'),
    css_path: path.join(__dirname, 'css/about.css'),
    package_json_dir: __dirname,
    open_devtools: false,
  });
  if (this.mainWindow) { w.setParentWindow(this.mainWindow); }
  localShortcut.register(w, 'Command+Q', () => { app.quit(); });
  localShortcut.register(w, 'Command+W', () => { w.close(); });
}

// application spec window
function showSpecWindow(): void {
  var specWindow = new BrowserWindow({
    parent: this.mainWindow,
    modal: false,
    width: 800,
    height: 800,
    show: true,
    webPreferences: {
      devTools: this.appCfg.debug,
    },
  });
  specWindow.loadURL(`file://${__dirname}/contents-spec.html`);
}

// exports
export {
  showMainWindow,
  showHelpWindow,
  showSystemWindow,
  showAboutWindow,
  showSpecWindow,
};
