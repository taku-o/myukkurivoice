'use strict';
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const app = electron.app;
const dialog = electron.dialog;
const ipcMain = electron.ipcMain;
const Menu = electron.Menu;
const localShortcut = require('electron-localshortcut');
const log = require('electron-log');
const path = require('path');
const crypto = require('crypto');
const openAboutWindow = require('about-window').default;
const Config = require('electron-config');

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
  debug: process.env.DEBUG
};
var config = new Config();
['mainWindow', 'audioServVer', 'showMsgPane', 'acceptFirstMouse', 'passPhrase', 'aq10UseKeyEncrypted'].forEach(function(k){
  if (config.has(k)) { appCfg[k] = config.get(k); }
});
global.appCfg = appCfg;

// debug option
const debug = appCfg.debug;

// global reference
var mainWindow = null;
var helpWindow = null;
var systemWindow = null;

// handle uncaughtException
process.on('uncaughtException', function(err) {
  log.error('electron:event:uncaughtException');
  log.error(err);
  log.error(err.stack);
  app.quit();
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  //if (process.platform != 'darwin') {
    app.quit();
  //}
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // open main window.
  showMainWindow();

  // shortcut
  var r = localShortcut.register(mainWindow, 'Command+Q', function() {
    app.quit();
  });
  var r = localShortcut.register(mainWindow, 'Command+P', function() {
    if (mainWindow) { mainWindow.webContents.send('shortcut', 'play'); }
  });
  var r = localShortcut.register(mainWindow, 'Command+W', function() {
    if (mainWindow) { mainWindow.webContents.send('shortcut', 'stop'); }
  });
  var r = localShortcut.register(mainWindow, 'Command+S', function() {
    if (mainWindow) { mainWindow.webContents.send('shortcut', 'record'); }
  });
  var r = localShortcut.register(mainWindow, 'Command+Up', function() {
    if (mainWindow) { mainWindow.webContents.send('shortcut', 'moveToSource'); }
  });
  var r = localShortcut.register(mainWindow, 'Command+Down', function() {
    if (mainWindow) { mainWindow.webContents.send('shortcut', 'moveToEncoded'); }
  });
  var r = localShortcut.register(mainWindow, 'Command+Right', function() {
    if (mainWindow) { mainWindow.webContents.send('shortcut', 'encode'); }
  });
  var r = localShortcut.register(mainWindow, 'Command+D', function() {
    if (mainWindow) { mainWindow.webContents.send('shortcut', 'fromClipboard'); }
  });
  var r = localShortcut.register(mainWindow, 'Command+Left', function() {
    if (mainWindow) { mainWindow.webContents.send('shortcut', 'swichNextConfig'); }
  });
  var r = localShortcut.register(mainWindow, 'Command+Shift+Left', function() {
    if (mainWindow) { mainWindow.webContents.send('shortcut', 'swichPreviousConfig'); }
  });

  // menu
  var menuList = [
    {
      label: 'MYukkuriVoice',
      submenu: [
        {
          label: 'About MYukkuriVoice',
          click () {
            var w = openAboutWindow({
              icon_path: path.join(__dirname, 'img/icon_128x128.png'),
              css_path: path.join(__dirname, 'css/about.css'),
              package_json_dir: __dirname,
              open_devtools: false,
            });
            if (mainWindow) { w.setParentWindow(mainWindow); }
            var r = localShortcut.register(w, 'Command+Q', function() { app.quit(); });
            var r = localShortcut.register(w, 'Command+W', function() { w.close(); });
          }
        },
        { type: 'separator' },
        {
          label: '環境設定',
          click () { showSystemWindow(); }
        },
        { type: 'separator' },
        {
          label: '環境設定初期化',
          click () { resetAppConfigOnMain(); }
        },
        { type: 'separator' },
        {
          role: 'services',
          submenu: []
        },
        { type: 'separator' },
        {
          role:'quit',
          accelerator: 'Command+Q'
        }
      ]
    },
    {
      label: '編集',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' },
        { type: 'separator' },
        { label: 'Speech',
          submenu: [
            { role: 'startspeaking' },
            { role: 'stopspeaking' }
          ]
        }
      ]
    },
    {
      label: '音声',
      submenu: [
        {
          label:'メッセージ入力欄に移動',
          accelerator: 'Command+Up',
          click () {
            if (mainWindow) { mainWindow.webContents.send('shortcut', 'moveToSource'); }
          }
        },
        {
          label:'音記号列入力欄に移動',
          accelerator: 'Command+Down',
          click () {
            if (mainWindow) { mainWindow.webContents.send('shortcut', 'moveToEncoded'); }
          }
        },
        { type: 'separator' },
        {
          label:'音記号列に変換',
          accelerator: 'Command+Right',
          click () {
            if (mainWindow) { mainWindow.webContents.send('shortcut', 'encode'); }
          }
        },
        {
          label:'入力をクリア',
          click () {
            if (mainWindow) { mainWindow.webContents.send('menu', 'clear'); }
          }
        },
        {
          label:'クリップボードからコピー',
          accelerator: 'Command+D',
          click () {
            if (mainWindow) { mainWindow.webContents.send('shortcut', 'fromClipboard'); }
          }
        },
        { type: 'separator' },
        {
          label:'音声の再生',
          accelerator: 'Command+P',
          click () {
            if (mainWindow) { mainWindow.webContents.send('shortcut', 'play'); }
          }
        },
        {
          label:'再生停止',
          accelerator: 'Command+W',
          click () {
            if (mainWindow) { mainWindow.webContents.send('shortcut', 'stop'); }
          }
        },
        {
          label:'音声の保存',
          accelerator: 'Command+S',
          click () {
            if (mainWindow) { mainWindow.webContents.send('shortcut', 'record'); }
          }
        }
      ]
    },
    {
      label: 'ボイス設定',
      submenu: [
        {
          label: '新規作成',
          click () {
            if (mainWindow) { mainWindow.webContents.send('menu', 'plus'); }
          }
        },
        {
          label: '複製',
          click () {
            if (mainWindow) { mainWindow.webContents.send('menu', 'copy'); }
          }
        },
        {
          label: '削除',
          click () {
            if (mainWindow) { mainWindow.webContents.send('menu', 'minus'); }
          }
        },
        { type: 'separator' },
        {
          label: '保存',
          click () {
            if (mainWindow) { mainWindow.webContents.send('menu', 'save'); }
          }
        },
        { type: 'separator' },
        {
          label: '次の設定に切り替え',
          accelerator: 'Command+Left',
          click () {
            if (mainWindow) { mainWindow.webContents.send('shortcut', 'swichNextConfig'); }
          }
        },
        {
          label: '前の設定に切り替え',
          accelerator: 'Command+Shift+Left',
          click () {
            if (mainWindow) { mainWindow.webContents.send('shortcut', 'swichPreviousConfig'); }
          }
        },
        { type: 'separator' },
        {
          label: 'ボイス設定オールリセット',
          click () {
            if (mainWindow) { mainWindow.webContents.send('menu', 'reset'); }
          }
        }
      ]
    },
    {
      label: '表示',
      submenu: [
        { role: 'reload' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'ウインドウ',
      submenu: [
        {
          label: '前面表示固定切替',
          click () { switchAlwaysOnTop(); }
        },
        { type: 'separator' },
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: 'Zoom',
          role: 'zoom'
        },
        { type: 'separator' },
        {
          label: 'Bring All to Front',
          role: 'front'
        },
        { type: 'separator' },
        {
          label: 'ウインドウ位置リセット',
          click () { resetWindowPosition(); }
        },
      ]
    },
    {
      label: 'ヘルプ',
      submenu: [
        {
          label: 'ヘルプ',
          click () { showHelpWindow(); }
        },
        { type: 'separator' },
        {
          label: 'ショートカットキー',
          click () {
            if (mainWindow) { mainWindow.webContents.send('menu', 'shortcut'); }
          }
        },
        {
          label: 'チュートリアル',
          click () {
            if (mainWindow) { mainWindow.webContents.send('menu', 'tutorial'); }
          }
        },
        { type: 'separator' },
        {
          label: 'Learn More',
          click () { require('electron').shell.openExternal('https://github.com/taku-o/myukkurivoice') }
        }
      ]
    }
  ];
  // 表示メニューにToggle Developer Toolsメニューを追加
  if (debug) {
    menuList[4].submenu.splice(1, 0,
      { role: 'toggledevtools' }
    );
  }
  var menuTemplate = Menu.buildFromTemplate(menuList);
  Menu.setApplicationMenu(menuTemplate);
});

// showSaveDialog
ipcMain.on('showSaveDialog', function (event, message) {
  var options = {
    title: 'wav save dialog',
    filters: [
      { name: 'Wav File', extensions: ['wav']}
    ]
  };
  var r = dialog.showSaveDialog(mainWindow, options);
  event.sender.send('showSaveDialog', r);
});

// showDirDialog
ipcMain.on('showDirDialog', function (event, defaultPath) {
  var options = {
    title: 'select wav save directory',
    properties: ['openDirectory', 'createDirectory'],
    defaultPath: defaultPath
  };
  var r = dialog.showOpenDialog(mainWindow, options);
  event.sender.send('showDirDialog', r);
});

// updateAppConfig
function updateAppConfig(options) {
  var {x,y} = mainWindow.getBounds();
  options.mainWindow.x = x;
  options.mainWindow.y = y;
  config.set('mainWindow',          options.mainWindow);
  config.set('audioServVer',        options.audioServVer);
  config.set('showMsgPane',         options.showMsgPane);
  config.set('acceptFirstMouse',    options.acceptFirstMouse);
  config.set('passPhrase',          options.passPhrase);
  config.set('aq10UseKeyEncrypted', options.aq10UseKeyEncrypted);
  config.set('debug',               options.debug);

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
  var r = dialog.showMessageBox(systemWindow, dialogOptions);
  event.sender.send('updateAppConfig', r);
  mainWindow.setSize(appCfg.mainWindow.width, appCfg.mainWindow.height);
  mainWindow.webContents.reload();
  if (systemWindow) { systemWindow.webContents.reload(); }
});

// resetAppConfig
function resetAppConfig() {
  config.set('mainWindow',          { width: 800, height: 665, x:null, y:null });
  config.set('audioServVer',        'webaudioapi');
  config.set('showMsgPane',         true);
  config.set('acceptFirstMouse',    false);
  config.set('passPhrase',          crypto.randomBytes(16).toString('hex'));
  config.set('aq10UseKeyEncrypted', '');
  config.set('debug',               false);

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
  var r = dialog.showMessageBox(systemWindow, dialogOptions);
  event.sender.send('resetAppConfig', r);
  mainWindow.setSize(appCfg.mainWindow.width, appCfg.mainWindow.height);
  mainWindow.webContents.reload();
  if (systemWindow) { systemWindow.webContents.reload(); }
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
  var r = dialog.showMessageBox(mainWindow, dialogOptions);
  mainWindow.setSize(appCfg.mainWindow.width, appCfg.mainWindow.height);
  mainWindow.webContents.reload();
  if (systemWindow) { systemWindow.webContents.reload(); }
}

// resetWindowPosition
function resetWindowPosition() {
  mainWindow.center();
}

// switchAlwaysOnTop
function switchAlwaysOnTop() {
  var newflg = !mainWindow.isAlwaysOnTop();
  mainWindow.setAlwaysOnTop(newflg);
  mainWindow.webContents.send('switchAlwaysOnTop', newflg);
}
ipcMain.on('switchAlwaysOnTop', function (event, message) {
  var newflg = !mainWindow.isAlwaysOnTop();
  mainWindow.setAlwaysOnTop(newflg);
  event.sender.send('switchAlwaysOnTop', newflg);
});

// main window
function showMainWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show(); mainWindow.focus();
    return;
  }

  var {width, height, x, y} = appCfg.mainWindow;
  var acceptFirstMouse = appCfg.acceptFirstMouse;
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    x: x,
    y: y,
    acceptFirstMouse: acceptFirstMouse,
    show: false, // show at did-finish-load event
    webPreferences: {
      devTools: debug
    }
  });
  mainWindow.loadURL('file://' + __dirname + '/main.html');

  // main window event
  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.show(); mainWindow.focus();
  });
  mainWindow.on('close', function() {
    var bounds = mainWindow.getBounds();
    config.set('mainWindow', bounds);
  });
  mainWindow.on('closed', function() {
    // dereference global reference
    mainWindow = null;
  });
  mainWindow.on('unresponsive', function() {
    log.warn('main:event:unresponsive');
  });
  mainWindow.webContents.on('crashed', function() {
    log.error('main:event:crashed');
  });
}

// help window
function showHelpWindow() {
  if (helpWindow && !helpWindow.isDestroyed()) {
    helpWindow.show(); helpWindow.focus();
    return;
  }

  var {width, height} = appCfg.helpWindow;
  var acceptFirstMouse = appCfg.acceptFirstMouse;
  helpWindow = new BrowserWindow({
    parent: mainWindow,
    modal: false,
    width: width,
    height: height,
    acceptFirstMouse: acceptFirstMouse,
    show: false, // show at did-finish-load event
    webPreferences: {
      devTools: debug
    }
  });
  helpWindow.loadURL('file://' + __dirname + '/help.html');

  var r = localShortcut.register(helpWindow, 'Command+Q', function() {
    app.quit();
  });
  var r = localShortcut.register(helpWindow, 'Command+W', function() {
    if (helpWindow) { helpWindow.close(); }
  });

  helpWindow.webContents.on('did-finish-load', function() {
    helpWindow.show(); helpWindow.focus();
  });
  helpWindow.on('closed', function() {
    helpWindow = null;
  });
  helpWindow.on('unresponsive', function() {
    log.warn('help:event:unresponsive');
  });
  helpWindow.webContents.on('crashed', function() {
    log.error('help:event:crashed');
  });
}
// showHelpWindow
ipcMain.on('showHelpWindow', function (event, message) {
  showHelpWindow();
});

// application config window
function showSystemWindow() {
  if (systemWindow && !systemWindow.isDestroyed()) {
    systemWindow.show(); systemWindow.focus();
    return;
  }

  var {width, height} = appCfg.systemWindow;
  var acceptFirstMouse = appCfg.acceptFirstMouse;
  systemWindow = new BrowserWindow({
    parent: mainWindow,
    modal: false,
    width: width,
    height: height,
    acceptFirstMouse: acceptFirstMouse,
    show: false, // show at did-finish-load event
    webPreferences: {
      devTools: debug
    }
  });
  systemWindow.loadURL('file://' + __dirname + '/system.html');

  var r = localShortcut.register(systemWindow, 'Command+Q', function() {
    app.quit();
  });
  var r = localShortcut.register(systemWindow, 'Command+W', function() {
    if (systemWindow) { systemWindow.close(); }
  });

  systemWindow.webContents.on('did-finish-load', function() {
    systemWindow.show(); systemWindow.focus();
  });
  systemWindow.on('closed', function() {
    systemWindow = null;
  });
  systemWindow.on('unresponsive', function() {
    log.warn('system:event:unresponsive');
  });
  systemWindow.webContents.on('crashed', function() {
    log.error('system:event:crashed');
  });
}

// drag out wav file
ipcMain.on('ondragstartwav', function (event, filePath) {
  var imgPath = path.join(__dirname, '/img/ic_music_video_black_24dp_1x.png');
  event.sender.startDrag({
    file: filePath,
    icon: imgPath
  })
});
