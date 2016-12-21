'use strict';
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const dialog = electron.dialog;
const ipcMain = electron.ipcMain;
const globalShortcut = electron.globalShortcut;

// global reference
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
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
    // quit
    app.quit();
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
