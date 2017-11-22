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
const Config = require('electron-config');

// application settings
var app_cfg = {
  mainWindow: { width: 800, height: 665 },
  helpWindow: { width: 700, height: 500 },
  systemWindow: { width: 390, height: 350 },
  audio_serv_ver: 'webaudioapi', // html5audio or webaudioapi
  show_msg_pane: true,
  debug: process.env.DEBUG
};
var config = new Config();
['mainWindow', 'audio_serv_ver', 'show_msg_pane'].forEach(function(k){
  if (config.has(k)) { app_cfg[k] = config.get(k); }
});
global.app_cfg = app_cfg;

// debug option
const debug = app_cfg.debug;

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
    if (mainWindow) { mainWindow.webContents.send('shortcut', 'move_to_source'); }
  });
  var r = localShortcut.register(mainWindow, 'Command+Down', function() {
    if (mainWindow) { mainWindow.webContents.send('shortcut', 'move_to_encoded'); }
  });
  var r = localShortcut.register(mainWindow, 'Command+Right', function() {
    if (mainWindow) { mainWindow.webContents.send('shortcut', 'encode'); }
  });
  var r = localShortcut.register(mainWindow, 'Command+D', function() {
    if (mainWindow) { mainWindow.webContents.send('shortcut', 'from_clipboard'); }
  });
  var r = localShortcut.register(mainWindow, 'Command+Left', function() {
    if (mainWindow) { mainWindow.webContents.send('shortcut', 'swich_next_config'); }
  });
  var r = localShortcut.register(mainWindow, 'Command+Shift+Left', function() {
    if (mainWindow) { mainWindow.webContents.send('shortcut', 'swich_previous_config'); }
  });

  // menu
  var menu_list = [
    {
      label: 'MYukkuriVoice',
      submenu: [
        { role: 'about' },
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
            if (mainWindow) { mainWindow.webContents.send('shortcut', 'move_to_source'); }
          }
        },
        {
          label:'音記号列入力欄に移動',
          accelerator: 'Command+Down',
          click () {
            if (mainWindow) { mainWindow.webContents.send('shortcut', 'move_to_encoded'); }
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
            if (mainWindow) { mainWindow.webContents.send('shortcut', 'from_clipboard'); }
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
      label: '設定',
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
            if (mainWindow) { mainWindow.webContents.send('shortcut', 'swich_next_config'); }
          }
        },
        {
          label: '前の設定に切り替え',
          accelerator: 'Command+Shift+Left',
          click () {
            if (mainWindow) { mainWindow.webContents.send('shortcut', 'swich_previous_config'); }
          }
        },
        { type: 'separator' },
        {
          label: '設定オールリセット',
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
        }
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
    menu_list[4].submenu.splice(1, 0,
      { role: 'toggledevtools' }
    );
  }
  var menu_template = Menu.buildFromTemplate(menu_list);
  Menu.setApplicationMenu(menu_template);
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
  config.set('mainWindow',     options.mainWindow);
  config.set('audio_serv_ver', options.audio_serv_ver);
  config.set('show_msg_pane',  options.show_msg_pane);
  config.set('debug',          options.debug);
}
ipcMain.on('updateAppConfig', function (event, options) {
  updateAppConfig(options);
  var dialog_options = {
    type: 'info',
    title: 'application config updated.',
    message: '環境設定を更新しました。アプリケーションを再起動すると変更が反映されます。',
    buttons: ['OK'],
  };
  var r = dialog.showMessageBox(systemWindow, dialog_options);
  event.sender.send('updateAppConfig', r);
});

// resetAppConfig
function resetAppConfig() {
  config.set('mainWindow',     { width: 800, height: 665 });
  config.set('audio_serv_ver', 'webaudioapi');
  config.set('show_msg_pane',  true);
  config.set('debug',          false);
}
ipcMain.on('resetAppConfig', function (event, message) {
  resetAppConfig();
  var dialog_options = {
    type: 'info',
    title: 'application config initialized.',
    message: '環境設定を初期化しました。アプリケーションを再起動すると変更が反映されます。',
    buttons: ['OK'],
  };
  var r = dialog.showMessageBox(systemWindow, dialog_options);
  event.sender.send('resetAppConfig', r);
});

// resetAppConfigOnMain
function resetAppConfigOnMain() {
  resetAppConfig();
  var dialog_options = {
    type: 'info',
    title: 'application config initialized.',
    message: '環境設定を初期化しました。アプリケーションを再起動すると変更が反映されます。',
    buttons: ['OK'],
  };
  var r = dialog.showMessageBox(mainWindow, dialog_options);
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

// showHelpWindow
ipcMain.on('showHelpWindow', function (event, message) {
  showHelpWindow();
});

// main window
function showMainWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show();
    return;
  }

  var {width, height} = app_cfg.mainWindow;
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      devTools: debug
    }
  });
  mainWindow.loadURL('file://' + __dirname + '/main.html');

  // main window event
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
    helpWindow.show();
    return;
  }

  var {width, height} = app_cfg.helpWindow;
  helpWindow = new BrowserWindow({
    parent: mainWindow,
    modal: false,
    show: false,
    width: width,
    height: height,
    webPreferences: {
      devTools: debug
    }
  });
  helpWindow.loadURL('file://' + __dirname + '/help.html');
  helpWindow.show();

  var r = localShortcut.register(helpWindow, 'Command+Q', function() {
    app.quit();
  });
  var r = localShortcut.register(helpWindow, 'Command+W', function() {
    if (helpWindow) { helpWindow.close(); }
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

// application config window
function showSystemWindow() {
  if (systemWindow && !systemWindow.isDestroyed()) {
    systemWindow.show();
    return;
  }

  var {width, height} = app_cfg.systemWindow;
  systemWindow = new BrowserWindow({
    parent: mainWindow,
    modal: false,
    show: false,
    width: width,
    height: height,
    webPreferences: {
      devTools: debug
    }
  });
  systemWindow.loadURL('file://' + __dirname + '/system.html');
  systemWindow.show();

  var r = localShortcut.register(systemWindow, 'Command+Q', function() {
    app.quit();
  });
  var r = localShortcut.register(systemWindow, 'Command+W', function() {
    if (systemWindow) { systemWindow.close(); }
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
