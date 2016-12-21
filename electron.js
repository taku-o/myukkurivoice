'use strict';
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const app = electron.app;
const dialog = electron.dialog;
const globalShortcut = electron.globalShortcut;
const ipcMain = electron.ipcMain;
const Menu = electron.Menu;

// global reference
var mainWindow = null;

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
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 700,
    height: 600,
    minWidth: 500,
    minHeight: 400,
    webPreferences: {
      devTools: true
    }
  });
  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/main.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // dereference global reference
    mainWindow = null;
  });

  // shortcut
  var r = globalShortcut.register('Command+Q', function() {
    app.quit();
  });
  var r = globalShortcut.register('Command+P', function() {
    if (mainWindow) { mainWindow.webContents.send('shortcut', 'play'); }
  });
  var r = globalShortcut.register('Command+S', function() {
    if (mainWindow) { mainWindow.webContents.send('shortcut', 'record'); }
  });
  var r = globalShortcut.register('Command+Up', function() {
    if (mainWindow) { mainWindow.webContents.send('shortcut', 'move_to_source'); }
  });
  var r = globalShortcut.register('Command+Down', function() {
    if (mainWindow) { mainWindow.webContents.send('shortcut', 'move_to_encoded'); }
  });
  var r = globalShortcut.register('Command+Right', function() {
    if (mainWindow) { mainWindow.webContents.send('shortcut', 'encode'); }
  });

  // menu
  var menu_list = [
    {
      label: 'MYukkuriVoice',
      submenu: [
        { role: 'about' },
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
      label: 'ボイス',
      submenu: [
        {
          label:'音記号列に変換',
          accelerator: 'Command+Right'
        },
        { type: 'separator' },
        {
          label:'再生',
          accelerator: 'Command+P'
        },
        {
          label:'記録',
          accelerator: 'Command+S'
        }
      ]
    },
    {
      label: '表示',
      submenu: [
        { role: 'reload' },
        { role: 'toggledevtools' },
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
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: 'Zoom',
          role: 'zoom'
        },
        {
          type: 'separator'
        },
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
          label: 'Learn More',
          click () { require('electron').shell.openExternal('https://github.com/taku-o/myukkurivoice') }
        }
      ]
    }
  ];
  var menu_template = Menu.buildFromTemplate(menu_list);
  Menu.setApplicationMenu(menu_template);

  // Open the DevTools.
  // mainWindow.openDevTools();
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
})

