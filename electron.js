'use strict';
var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var dialog = electron.dialog;
var ipcMain = electron.ipcMain;

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
    'min-width': 500,
    'min-height': 400,
    'accept-first-mouse': true,
    'title-bar-style': 'hidden'
  });
  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/main.html');

  // Open the DevTools.
  // mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // dereference global reference
    mainWindow = null;
  });
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
