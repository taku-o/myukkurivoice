'use strict';
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const app = electron.app;
const localShortcut = require('electron-localshortcut');
const log = require('electron-log');
const path = require('path');
const openAboutWindow = require('about-window').default;

// main window
function showMainWindow(myApp) {
  if (myApp.mainWindow && !myApp.mainWindow.isDestroyed()) {
    myApp.mainWindow.show(); myApp.mainWindow.focus();
    return;
  }

  var {width, height, x, y} = myApp.appCfg.mainWindow;
  var acceptFirstMouse = myApp.appCfg.acceptFirstMouse;
  myApp.mainWindow = new BrowserWindow({
    width: width,
    height: height,
    x: x,
    y: y,
    acceptFirstMouse: acceptFirstMouse,
    show: false, // show at did-finish-load event
    webPreferences: {
      devTools: myApp.appCfg.debug
    }
  });
  myApp.mainWindow.loadURL('file://' + __dirname + '/main.html');

  // shortcut
  var r = localShortcut.register(myApp.mainWindow, 'Command+Q', function() {
    app.quit();
  });
  var r = localShortcut.register(myApp.mainWindow, 'Command+P', function() {
    myApp.mainWindow.webContents.send('shortcut', 'play');
  });
  var r = localShortcut.register(myApp.mainWindow, 'Command+W', function() {
    myApp.mainWindow.webContents.send('shortcut', 'stop');
  });
  var r = localShortcut.register(myApp.mainWindow, 'Command+S', function() {
    myApp.mainWindow.webContents.send('shortcut', 'record');
  });
  var r = localShortcut.register(myApp.mainWindow, 'Command+Up', function() {
    myApp.mainWindow.webContents.send('shortcut', 'moveToSource');
  });
  var r = localShortcut.register(myApp.mainWindow, 'Command+Down', function() {
    myApp.mainWindow.webContents.send('shortcut', 'moveToEncoded');
  });
  var r = localShortcut.register(myApp.mainWindow, 'Command+Right', function() {
    myApp.mainWindow.webContents.send('shortcut', 'encode');
  });
  var r = localShortcut.register(myApp.mainWindow, 'Command+D', function() {
    myApp.mainWindow.webContents.send('shortcut', 'fromClipboard');
  });
  var r = localShortcut.register(myApp.mainWindow, 'Command+Left', function() {
    myApp.mainWindow.webContents.send('shortcut', 'swichNextConfig');
  });
  var r = localShortcut.register(myApp.mainWindow, 'Command+Shift+Left', function() {
    myApp.mainWindow.webContents.send('shortcut', 'swichPreviousConfig');
  });

  // main window event
  myApp.mainWindow.webContents.on('did-finish-load', function() {
    myApp.mainWindow.show(); myApp.mainWindow.focus();
  });
  myApp.mainWindow.on('close', function() {
    var bounds = myApp.mainWindow.getBounds();
    myApp.config.set('mainWindow', bounds);
  });
  myApp.mainWindow.on('closed', function() {
    myApp.mainWindow = null;
  });
  myApp.mainWindow.on('unresponsive', function() {
    log.warn('main:event:unresponsive');
  });
  myApp.mainWindow.webContents.on('crashed', function() {
    log.error('main:event:crashed');
  });
}

// help window
function showHelpWindow(myApp) {
  if (myApp.helpWindow && !myApp.helpWindow.isDestroyed()) {
    myApp.helpWindow.show(); myApp.helpWindow.focus();
    return;
  }

  var {width, height} = myApp.appCfg.helpWindow;
  var acceptFirstMouse = myApp.appCfg.acceptFirstMouse;
  myApp.helpWindow = new BrowserWindow({
    parent: myApp.mainWindow,
    modal: false,
    width: width,
    height: height,
    acceptFirstMouse: acceptFirstMouse,
    show: false, // show at did-finish-load event
    webPreferences: {
      devTools: myApp.appCfg.debug
    }
  });
  myApp.helpWindow.loadURL('file://' + __dirname + '/help.html');

  // shortcut
  var r = localShortcut.register(myApp.helpWindow, 'Command+Q', function() {
    app.quit();
  });
  var r = localShortcut.register(myApp.helpWindow, 'Command+W', function() {
    if (myApp.helpWindow) { myApp.helpWindow.close(); }
  });
  var r = localShortcut.register(myApp.helpWindow, 'Up', function() {
    if (myApp.helpWindow) { myApp.helpWindow.webContents.send('shortcut', 'moveToPreviousHelp'); }
  });
  var r = localShortcut.register(myApp.helpWindow, 'Down', function() {
    if (myApp.helpWindow) { myApp.helpWindow.webContents.send('shortcut', 'moveToNextHelp'); }
  });

  // event
  myApp.helpWindow.webContents.on('did-finish-load', function() {
    myApp.helpWindow.show(); myApp.helpWindow.focus();
  });
  myApp.helpWindow.on('closed', function() {
    myApp.helpWindow = null;
  });
  myApp.helpWindow.on('unresponsive', function() {
    log.warn('help:event:unresponsive');
  });
  myApp.helpWindow.webContents.on('crashed', function() {
    log.error('help:event:crashed');
  });
}

// application config window
function showSystemWindow(myApp) {
  if (myApp.systemWindow && !myApp.systemWindow.isDestroyed()) {
    myApp.systemWindow.show(); myApp.systemWindow.focus();
    return;
  }

  var {width, height} = myApp.appCfg.systemWindow;
  var acceptFirstMouse = myApp.appCfg.acceptFirstMouse;
  myApp.systemWindow = new BrowserWindow({
    parent: myApp.mainWindow,
    modal: false,
    width: width,
    height: height,
    acceptFirstMouse: acceptFirstMouse,
    show: false, // show at did-finish-load event
    webPreferences: {
      devTools: myApp.appCfg.debug
    }
  });
  myApp.systemWindow.loadURL('file://' + __dirname + '/system.html');

  // shortcut
  var r = localShortcut.register(myApp.systemWindow, 'Command+Q', function() {
    app.quit();
  });
  var r = localShortcut.register(myApp.systemWindow, 'Command+W', function() {
    if (myApp.systemWindow) { myApp.systemWindow.close(); }
  });

  // event
  myApp.systemWindow.webContents.on('did-finish-load', function() {
    myApp.systemWindow.show(); myApp.systemWindow.focus();
  });
  myApp.systemWindow.on('closed', function() {
    myApp.systemWindow = null;
  });
  myApp.systemWindow.on('unresponsive', function() {
    log.warn('system:event:unresponsive');
  });
  myApp.systemWindow.webContents.on('crashed', function() {
    log.error('system:event:crashed');
  });
}

// about application window
function showAboutWindow(myApp) {
  var w = openAboutWindow({
    icon_path: path.join(__dirname, 'img/icon_128x128.png'),
    css_path: path.join(__dirname, 'css/about.css'),
    package_json_dir: __dirname,
    open_devtools: false,
  });
  if (myApp.mainWindow) { w.setParentWindow(myApp.mainWindow); }
  var r = localShortcut.register(w, 'Command+Q', function() { app.quit(); });
  var r = localShortcut.register(w, 'Command+W', function() { w.close(); });
};

// application spec window
function showSpecWindow(myApp) {
  var specWindow = new BrowserWindow({
    parent: myApp.mainWindow,
    modal: false,
    width: 800,
    height: 800,
    show: true,
    webPreferences: {
      devTools: myApp.appCfg.debug
    }
  });
  specWindow.loadURL('file://' + __dirname + '/spec.html');
}

// exports
module.exports = {
  showMainWindow: showMainWindow,
  showHelpWindow: showHelpWindow,
  showSystemWindow: showSystemWindow,
  showAboutWindow: showAboutWindow,
  showSpecWindow: showSpecWindow
};
