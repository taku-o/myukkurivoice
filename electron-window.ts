'use strict';
import {BrowserWindow} from 'electron';
var _log: any, log                         = () => { _log = _log || require('electron-log'); return _log; };
var _path: any, path                       = () => { _path = _path || require('path'); return _path; };
var _openAboutWindow: any, openAboutWindow = () => { _openAboutWindow = _openAboutWindow || require('myukkurivoice-about-window').default; return _openAboutWindow; };

// env
const DEBUG = process.env.DEBUG != null;
const TEST = process.env.NODE_ENV == 'test';

// window option
const transparent: boolean = TEST? true: false;
const opacity: number = TEST? 0.0: 1.0;

class FnWindow implements yubo.FnWindow {
  constructor() {}

  // main window
  showMainWindow(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    if (myApp.mainWindow && !myApp.mainWindow.isDestroyed()) {
      myApp.mainWindow.show(); myApp.mainWindow.focus();
      return;
    }

    const {width, height, x, y} = myApp.appCfg.mainWindow;
    myApp.mainWindow = new BrowserWindow({
      width: width,
      height: height,
      x: x,
      y: y,
      acceptFirstMouse: true,
      show: false, // show at did-finish-load event
      transparent: transparent,
      opacity: opacity,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        devTools: DEBUG,
      },
    });
    myApp.mainWindow.loadFile('./contents-main.html');

    // shortcut key, touch bar
    myApp.registerMainShortcut(myApp.mainWindow);
    myApp.mainWindow.setTouchBar(myApp.getMainTouchBar(myApp.mainWindow));

    // main window event
    myApp.mainWindow.webContents.on('did-finish-load', () => {
      // receive drop file to app icon event
      if (myApp.launchArgs && myApp.launchArgs.filePath) {
        const filePath = myApp.launchArgs.filePath; myApp.launchArgs = null; // for window reload
        const ext = path().extname(filePath);
        if (ext == '.wav') {
          myApp.mainWindow.webContents.send('recentDocument', filePath);
        } else {
          myApp.mainWindow.webContents.send('dropTextFile', filePath);
        }
      }
      // show
      myApp.mainWindow.show(); myApp.mainWindow.focus();
    });
    myApp.mainWindow.on('close', () => {
      // save bounds
      const bounds = myApp.mainWindow.getBounds();
      myApp.config.set('mainWindow', bounds);
    });
    myApp.mainWindow.on('closed', () => {
      myApp.mainWindow = null;
    });
    myApp.mainWindow.on('unresponsive', (event: Event) => {
      log().warn('main:event:unresponsive');
      log().warn(event);
    });
    myApp.mainWindow.webContents.on('crashed', (event: Event) => {
      log().error('main:event:crashed');
      log().error(event);
    });
  }

  // help window
  showHelpWindow(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    if (myApp.helpWindow && !myApp.helpWindow.isDestroyed()) {
      myApp.helpWindow.show(); myApp.helpWindow.focus();
      myApp.enableHelpMenu();
      return;
    }

    const {width, height} = myApp.appCfg.helpWindow;
    myApp.helpWindow = new BrowserWindow({
      parent: myApp.mainWindow,
      modal: false,
      width: width,
      height: height,
      acceptFirstMouse: true,
      show: false, // show at did-finish-load event
      transparent: transparent,
      opacity: opacity,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        devTools: DEBUG,
      },
    });
    myApp.helpWindow.loadFile('./contents-help.html');

    // shortcut key, touch bar
    myApp.registerHelpShortcut(myApp.helpWindow);
    myApp.helpWindow.setTouchBar(myApp.getHelpTouchBar(myApp.helpWindow));

    // event
    myApp.helpWindow.webContents.on('did-finish-load', () => {
      myApp.helpWindow.show(); myApp.helpWindow.focus();
      myApp.enableHelpMenu();
    });
    myApp.helpWindow.on('close', () => {
      myApp.disableHelpMenu();
    });
    myApp.helpWindow.on('closed', () => {
      myApp.helpWindow = null;
    });
    myApp.helpWindow.on('unresponsive', (event: Event) => {
      log().warn('help:event:unresponsive');
      log().warn(event);
    });
    myApp.helpWindow.webContents.on('crashed', (event: Event) => {
      log().error('help:event:crashed');
      log().error(event);
    });
  }

  // help search dialog
  showHelpSearchDialog(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    if (myApp.helpSearchDialog && !myApp.helpSearchDialog.isDestroyed()) {
      myApp.helpSearchDialog.show(); myApp.helpSearchDialog.focus();
      return;
    }

    const {width, height} = myApp.appCfg.helpSearchDialog;
    const bounds = myApp.helpWindow.getBounds();
    const x = bounds.x + bounds.width / 2 - width / 2;
    const y = bounds.y + bounds.height / 2 - height / 2;
    myApp.helpSearchDialog = new BrowserWindow({
      parent: myApp.helpWindow,
      modal: false,
      width: width,
      height: height,
      x: x,
      y: y,
      acceptFirstMouse: true,
      show: false, // show at did-finish-load event
      minimizable: false,
      maximizable: false,
      fullscreenable: false,
      transparent: transparent,
      opacity: opacity,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        devTools: DEBUG,
      },
    });
    myApp.helpSearchDialog.loadFile('./contents-helpsearch.html');

    // shortcut key, touch bar
    myApp.registerHelpSearchShortcut(myApp.helpSearchDialog);
    myApp.helpSearchDialog.setTouchBar(myApp.getMinimalHideExitTouchBar(myApp.helpSearchDialog));

    // event
    myApp.helpSearchDialog.webContents.on('did-finish-load', () => {
      myApp.helpSearchDialog.show(); myApp.helpSearchDialog.focus();
    });
    myApp.helpSearchDialog.on('close', (event: Electron.Event) => {
      event.preventDefault();
      myApp.helpSearchDialog.hide();
    });
    myApp.helpSearchDialog.on('closed', () => {
      myApp.helpSearchDialog = null;
    });
    myApp.helpSearchDialog.on('unresponsive', (event: Event) => {
      log().warn('helpsearch:event:unresponsive');
      log().warn(event);
    });
    myApp.helpSearchDialog.webContents.on('crashed', (event: Event) => {
      log().error('helpsearch:event:crashed');
      log().error(event);
    });
  }

  // application config window
  showSystemWindow(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    if (myApp.systemWindow && !myApp.systemWindow.isDestroyed()) {
      myApp.systemWindow.show(); myApp.systemWindow.focus();
      return;
    }

    const {width, height} = myApp.appCfg.systemWindow;
    myApp.systemWindow = new BrowserWindow({
      parent: myApp.mainWindow,
      modal: false,
      width: width,
      height: height,
      acceptFirstMouse: true,
      show: false, // show at did-finish-load event
      transparent: transparent,
      opacity: opacity,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        devTools: DEBUG,
      },
    });
    myApp.systemWindow.loadFile('./contents-system.html');

    // shortcut key, touch bar
    myApp.registerSystemShortcut(myApp.systemWindow);
    myApp.systemWindow.setTouchBar(myApp.getMinimalCloseExitTouchBar(myApp.systemWindow));

    // event
    myApp.systemWindow.webContents.on('did-finish-load', () => {
      myApp.systemWindow.show(); myApp.systemWindow.focus();
    });
    myApp.systemWindow.on('closed', () => {
      myApp.systemWindow = null;
    });
    myApp.systemWindow.on('unresponsive', (event: Event) => {
      log().warn('system:event:unresponsive');
      log().warn(event);
    });
    myApp.systemWindow.webContents.on('crashed', (event: Event) => {
      log().error('system:event:crashed');
      log().error(event);
    });
  }

  // dict window
  showDictWindow(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    if (myApp.dictWindow && !myApp.dictWindow.isDestroyed()) {
      myApp.dictWindow.show(); myApp.dictWindow.focus();
      myApp.enableDictMenu();
      return;
    }

    const {width, height} = myApp.appCfg.dictWindow;
    myApp.dictWindow = new BrowserWindow({
      parent: myApp.mainWindow,
      width: width,
      height: height,
      acceptFirstMouse: true,
      show: false, // show at did-finish-load event
      transparent: transparent,
      opacity: opacity,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        devTools: DEBUG,
      },
    });
    myApp.dictWindow.loadFile('./contents-dict.html');

    // shortcut key, touch bar
    myApp.registerDictShortcut(myApp.dictWindow);
    myApp.dictWindow.setTouchBar(myApp.getDictTouchBar(myApp.dictWindow));

    // window event
    myApp.dictWindow.webContents.on('did-finish-load', () => {
      myApp.dictWindow.show(); myApp.dictWindow.focus();
      myApp.enableDictMenu();
    });
    myApp.dictWindow.on('close', () => {
      myApp.disableDictMenu();
    });
    myApp.dictWindow.on('closed', () => {
      myApp.dictWindow = null;
    });
    myApp.dictWindow.on('unresponsive', (event: Event) => {
      log().warn('dict:event:unresponsive');
      log().warn(event);
    });
    myApp.dictWindow.webContents.on('crashed', (event: Event) => {
      log().error('dict:event:crashed');
      log().error(event);
    });
  }

  // about application window
  showAboutWindow(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    const w = openAboutWindow()({
      icon_path: path().join(__dirname, 'images/icon_128x128.webp'),
      css_path: path().join(__dirname, 'css/about.css'),
      package_json_dir: __dirname,
      open_devtools: false,
    });
    if (myApp.mainWindow) { w.setParentWindow(myApp.mainWindow); }

    // shortcut key, touch bar
    myApp.registerAboutShortcut(w);
    w.setTouchBar(myApp.getMinimalCloseExitTouchBar(w));
  }

  // application spec window
  showSpecWindow(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    const specWindow = new BrowserWindow({
      parent: myApp.mainWindow,
      modal: false,
      width: 800,
      height: 800,
      show: true,
      transparent: transparent,
      opacity: opacity,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        devTools: DEBUG,
      },
    });
    specWindow.loadFile('./contents-spec.html');
  }
}

export default FnWindow;
