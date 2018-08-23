'use strict';
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const app = electron.app;
const localShortcut = require('electron-localshortcut');
const log = require('electron-log');
const path = require('path');
const openAboutWindow = require('about-window').default;

// main window
function showMainWindow() {
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
      devTools: this.appCfg.debug
    }
  });
  this.mainWindow.loadURL('file://' + __dirname + '/contents-main.html');

  // shortcut
  localShortcut.register(this.mainWindow, 'Command+Q', function() {
    app.quit();
  });
  localShortcut.register(this.mainWindow, 'Command+P', function() {
    myApp.mainWindow.webContents.send('shortcut', 'play');
  });
  localShortcut.register(this.mainWindow, 'Command+W', function() {
    myApp.mainWindow.webContents.send('shortcut', 'stop');
  });
  localShortcut.register(this.mainWindow, 'Command+S', function() {
    myApp.mainWindow.webContents.send('shortcut', 'record');
  });
  localShortcut.register(this.mainWindow, 'Command+Up', function() {
    myApp.mainWindow.webContents.send('shortcut', 'moveToSource');
  });
  localShortcut.register(this.mainWindow, 'Command+Down', function() {
    myApp.mainWindow.webContents.send('shortcut', 'moveToEncoded');
  });
  localShortcut.register(this.mainWindow, 'Command+Right', function() {
    myApp.mainWindow.webContents.send('shortcut', 'encode');
  });
  localShortcut.register(this.mainWindow, 'Command+D', function() {
    myApp.mainWindow.webContents.send('shortcut', 'fromClipboard');
  });
  localShortcut.register(this.mainWindow, 'Command+N', function() {
    myApp.mainWindow.webContents.send('shortcut', 'putVoiceName');
  });
  localShortcut.register(this.mainWindow, 'Command+Left', function() {
    myApp.mainWindow.webContents.send('shortcut', 'swichNextConfig');
  });
  localShortcut.register(this.mainWindow, 'Command+Shift+Left', function() {
    myApp.mainWindow.webContents.send('shortcut', 'swichPreviousConfig');
  });

  // main window event
  this.mainWindow.webContents.on('did-finish-load', function() {
    myApp.mainWindow.show(); myApp.mainWindow.focus();
  });
  this.mainWindow.on('close', function() {
    var bounds = myApp.mainWindow.getBounds();
    myApp.config.set('mainWindow', bounds);
  });
  this.mainWindow.on('closed', function() {
    myApp.mainWindow = null;
  });
  this.mainWindow.on('unresponsive', function() {
    log.warn('main:event:unresponsive');
  });
  this.mainWindow.webContents.on('crashed', function() {
    log.error('main:event:crashed');
  });
}

// help window
function showHelpWindow() {
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
      devTools: this.appCfg.debug
    }
  });
  this.helpWindow.loadURL('file://' + __dirname + '/contents-help.html');

  // shortcut
  localShortcut.register(this.helpWindow, 'Command+Q', function() {
    app.quit();
  });
  localShortcut.register(this.helpWindow, 'Command+W', function() {
    if (myApp.helpWindow) { myApp.helpWindow.close(); }
  });
  localShortcut.register(this.helpWindow, 'Up', function() {
    if (myApp.helpWindow) { myApp.helpWindow.webContents.send('shortcut', 'moveToPreviousHelp'); }
  });
  localShortcut.register(this.helpWindow, 'Down', function() {
    if (myApp.helpWindow) { myApp.helpWindow.webContents.send('shortcut', 'moveToNextHelp'); }
  });

  // event
  this.helpWindow.webContents.on('did-finish-load', function() {
    myApp.helpWindow.show(); myApp.helpWindow.focus();
  });
  this.helpWindow.on('closed', function() {
    myApp.helpWindow = null;
  });
  this.helpWindow.on('unresponsive', function() {
    log.warn('help:event:unresponsive');
  });
  this.helpWindow.webContents.on('crashed', function() {
    log.error('help:event:crashed');
  });
}

// application config window
function showSystemWindow() {
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
      devTools: this.appCfg.debug
    }
  });
  this.systemWindow.loadURL('file://' + __dirname + '/contents-system.html');

  // shortcut
  localShortcut.register(this.systemWindow, 'Command+Q', function() {
    app.quit();
  });
  localShortcut.register(this.systemWindow, 'Command+W', function() {
    if (myApp.systemWindow) { myApp.systemWindow.close(); }
  });

  // event
  this.systemWindow.webContents.on('did-finish-load', function() {
    myApp.systemWindow.show(); myApp.systemWindow.focus();
  });
  this.systemWindow.on('closed', function() {
    myApp.systemWindow = null;
  });
  this.systemWindow.on('unresponsive', function() {
    log.warn('system:event:unresponsive');
  });
  this.systemWindow.webContents.on('crashed', function() {
    log.error('system:event:crashed');
  });
}

// about application window
function showAboutWindow() {
  var w = openAboutWindow({
    icon_path: path.join(__dirname, 'img/icon_128x128.png'),
    css_path: path.join(__dirname, 'css/about.css'),
    package_json_dir: __dirname,
    open_devtools: false,
  });
  if (this.mainWindow) { w.setParentWindow(this.mainWindow); }
  localShortcut.register(w, 'Command+Q', function() { app.quit(); });
  localShortcut.register(w, 'Command+W', function() { w.close(); });
}

// application spec window
function showSpecWindow() {
  var specWindow = new BrowserWindow({
    parent: this.mainWindow,
    modal: false,
    width: 800,
    height: 800,
    show: true,
    webPreferences: {
      devTools: this.appCfg.debug
    }
  });
  specWindow.loadURL('file://' + __dirname + '/contents-spec.html');
}

// exports
module.exports = {
  showMainWindow,
  showHelpWindow,
  showSystemWindow,
  showAboutWindow,
  showSpecWindow
};
