'use strict';
import {BrowserWindow, dialog, shell} from 'electron';
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

export default class FnWindow implements yubo.FnWindow {
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
        devTools: DEBUG,
      },
    });
    myApp.mainWindow.loadFile('./contents-main.html');

    // shortcut
    localShortcut().register(myApp.mainWindow, 'Command+P', () => {
      myApp.mainWindow.webContents.send('shortcut', 'play');
    });
    localShortcut().register(myApp.mainWindow, 'Command+W', () => {
      myApp.mainWindow.webContents.send('shortcut', 'stop');
    });
    localShortcut().register(myApp.mainWindow, 'Command+S', () => {
      myApp.mainWindow.webContents.send('shortcut', 'record');
    });
    localShortcut().register(myApp.mainWindow, 'Command+Up', () => {
      myApp.mainWindow.webContents.send('shortcut', 'moveToSource');
    });
    localShortcut().register(myApp.mainWindow, 'Command+Down', () => {
      myApp.mainWindow.webContents.send('shortcut', 'moveToEncoded');
    });
    localShortcut().register(myApp.mainWindow, 'Command+Right', () => {
      myApp.mainWindow.webContents.send('shortcut', 'encode');
    });
    localShortcut().register(myApp.mainWindow, 'Command+D', () => {
      myApp.mainWindow.webContents.send('shortcut', 'fromClipboard');
    });
    localShortcut().register(myApp.mainWindow, 'Command+N', () => {
      myApp.mainWindow.webContents.send('shortcut', 'putVoiceName');
    });
    localShortcut().register(myApp.mainWindow, 'Command+Left', () => {
      myApp.mainWindow.webContents.send('shortcut', 'swichNextConfig');
    });
    localShortcut().register(myApp.mainWindow, 'Command+Shift+Left', () => {
      myApp.mainWindow.webContents.send('shortcut', 'swichPreviousConfig');
    });

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
    myApp.mainWindow.on('unresponsive', () => {
      log().warn('main:event:unresponsive');
    });
    myApp.mainWindow.webContents.on('crashed', () => {
      log().error('main:event:crashed');
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
        devTools: DEBUG,
      },
    });
    myApp.helpWindow.loadFile('./contents-help.html');

    // shortcut
    localShortcut().register(myApp.helpWindow, 'Command+W', () => {
      if (myApp.helpWindow) { myApp.helpWindow.close(); }
    });
    localShortcut().register(myApp.helpWindow, 'Up', () => {
      myApp.helpWindow.webContents.send('shortcut', 'moveToPreviousHelp');
    });
    localShortcut().register(myApp.helpWindow, 'Down', () => {
      myApp.helpWindow.webContents.send('shortcut', 'moveToNextHelp');
    });
    localShortcut().register(myApp.helpWindow, 'Command+Left', () => {
      myApp.helpWindow.webContents.goBack();
    });
    localShortcut().register(myApp.helpWindow, 'Command+Right', () => {
      myApp.helpWindow.webContents.goForward();
    });
    localShortcut().register(myApp.helpWindow, 'Command+F', () => {
      myApp.helpWindow.webContents.send('shortcut', 'openSearchForm');
    });

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
    myApp.helpWindow.on('unresponsive', () => {
      log().warn('help:event:unresponsive');
    });
    myApp.helpWindow.webContents.on('crashed', () => {
      log().error('help:event:crashed');
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
        devTools: DEBUG,
      },
    });
    myApp.helpSearchDialog.loadFile('./contents-helpsearch.html');

    // shortcut
    localShortcut().register(myApp.helpSearchDialog, 'Command+W', () => {
      if (myApp.helpSearchDialog) { myApp.helpSearchDialog.hide(); }
    });

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
    myApp.helpSearchDialog.on('unresponsive', () => {
      log().warn('helpsearch:event:unresponsive');
    });
    myApp.helpSearchDialog.webContents.on('crashed', () => {
      log().error('helpsearch:event:crashed');
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
        devTools: DEBUG,
      },
    });
    myApp.systemWindow.loadFile('./contents-system.html');

    // shortcut
    localShortcut().register(myApp.systemWindow, 'Command+W', () => {
      if (myApp.systemWindow) { myApp.systemWindow.close(); }
    });

    // event
    myApp.systemWindow.webContents.on('did-finish-load', () => {
      myApp.systemWindow.show(); myApp.systemWindow.focus();
    });
    myApp.systemWindow.on('closed', () => {
      myApp.systemWindow = null;
    });
    myApp.systemWindow.on('unresponsive', () => {
      log().warn('system:event:unresponsive');
    });
    myApp.systemWindow.webContents.on('crashed', () => {
      log().error('system:event:crashed');
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
        devTools: DEBUG,
      },
    });
    myApp.dictWindow.loadFile('./contents-dict.html');

    // shortcut
    localShortcut().register(myApp.dictWindow, 'Command+W', () => {
      if (myApp.dictWindow) { myApp.dictWindow.close(); }
    });
    localShortcut().register(myApp.dictWindow, 'Command+S', () => {
      myApp.dictWindow.webContents.send('shortcut', 'save');
    });
    localShortcut().register(myApp.dictWindow, 'Command+N', () => {
      myApp.dictWindow.webContents.send('shortcut', 'add');
    });

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
    myApp.dictWindow.on('unresponsive', () => {
      log().warn('main:event:unresponsive');
    });
    myApp.dictWindow.webContents.on('crashed', () => {
      log().error('main:event:crashed');
    });
  }

  // about application window
  showAboutWindow(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    const w = openAboutWindow()({
      icon_path: path().join(__dirname, 'images/icon_128x128.png'),
      css_path: path().join(__dirname, 'css/about.css'),
      package_json_dir: __dirname,
      open_devtools: false,
    });
    if (myApp.mainWindow) { w.setParentWindow(myApp.mainWindow); }
    localShortcut().register(w, 'Command+W', () => {
      if (w) { w.close(); }
    });
  }

  // showVersionDialog
  showVersionDialog() {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    const repository = 'taku-o/myukkurivoice';
    const packagejson = require('./package.json');

    const vobj: GithubVersionCompare.IVersion = new (Version())(repository, packagejson);
    vobj.pull().then((version: GithubVersionCompare.IVersion) => {
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
      const btnId: number = dialog.showMessageBox(myApp.systemWindow, dialogOptions);
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
      const r = dialog.showMessageBox(myApp.systemWindow, dialogOptions);
    });
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
        devTools: DEBUG,
      },
    });
    specWindow.loadFile('./contents-spec.html');
  }
}
