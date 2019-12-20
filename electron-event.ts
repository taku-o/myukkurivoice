'use strict';
import {dialog, ipcMain} from 'electron';
var _path: any, path = () => { _path = _path || require('path'); return _path; };

class FnEvent implements yubo.FnEvent {
  constructor() {}

  // event register
  acceptEvents(): void {
    this.registerWindowOpenEvents();
    this.registerMainAppEvents();
    this.registerSystemAppEvents();
  }

  // show window event
  private registerWindowOpenEvents(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    ipcMain.on('showHelpWindow', (event: Electron.IpcMainEvent, message: string) => {
      myApp.showHelpWindow();
    });
    ipcMain.on('showHelpSearchDialog', (event: Electron.IpcMainEvent, message: string) => {
      myApp.showHelpSearchDialog();
    });
    ipcMain.on('showSystemWindow', (event: Electron.IpcMainEvent, message: string) => {
      myApp.showSystemWindow();
    });
    ipcMain.on('showDictWindow', (event: Electron.IpcMainEvent, message: string) => {
      myApp.showDictWindow();
    });
    ipcMain.on('showSpecWindow', (event: Electron.IpcMainEvent, message: string) => {
      myApp.showSpecWindow();
    });
  }

  private registerMainAppEvents(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    // showSaveDialog
    ipcMain.on('showSaveDialog', (event: Electron.IpcMainEvent, message: string) => {
      const options = {
        title: 'wav save dialog',
        filters: [
          {name: 'Wav File', extensions: ['wav']},
        ],
        securityScopedBookmarks: process.mas,
      };
      dialog.showSaveDialog(myApp.mainWindow, options)
      .then((result) => {
        if (! result.canceled) {
          const filePath = result.filePath;
          event.sender.send('showSaveDialog', filePath);
        }
      });
    });
    
    // showDirDialog
    ipcMain.on('showDirDialog', (event: Electron.IpcMainEvent, defaultPath: string) => {
      const options = {
        title: 'select wav save directory',
        properties: ['openDirectory' as 'openDirectory', 'createDirectory' as 'createDirectory'],
        defaultPath: defaultPath,
        securityScopedBookmarks: process.mas,
      };
      dialog.showOpenDialog(myApp.mainWindow, options)
      .then((result) => {
        if (! result.canceled) {
          const filePaths = result.filePaths;
          event.sender.send('showDirDialog', filePaths);
        }
      });
    });
    
    // drag out wav file
    ipcMain.on('ondragstartwav', (event: Electron.IpcMainEvent, filePath: string) => {
      const imgPath = path().join(__dirname, '/images/ic_music_video_black_24dp_1x.png');
      event.sender.startDrag({
        file: filePath,
        icon: imgPath,
      });
    });

    ipcMain.on('reloadMainWindow', (event: Electron.IpcMainEvent, message: string) => {
      myApp.mainWindow.webContents.reload();
      event.sender.send('reloadMainWindow', message);
    });
  }

  private registerSystemAppEvents(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    // updateAppConfig
    ipcMain.on('updateAppConfig', (event: Electron.IpcMainEvent, options: yubo.AppCfg) => {
      myApp.updateAppConfig(options);
      const dialogOptions = {
        type: 'info',
        title: 'application config updated.',
        message: '環境設定を更新しました。アプリケーションを更新します。',
        buttons: ['OK'],
        defaultId: 0,
      };
      dialog.showMessageBox(myApp.systemWindow, dialogOptions)
      .then((result) => {
        const r = result.response;
        event.sender.send('updateAppConfig', r);
      });
      myApp.mainWindow.setSize(myApp.appCfg.mainWindow.width, myApp.appCfg.mainWindow.height);
      myApp.mainWindow.webContents.reload();
      if (myApp.systemWindow) { myApp.systemWindow.webContents.reload(); }
    });
    
    // resetAppConfig
    ipcMain.on('resetAppConfig', (event: Electron.IpcMainEvent, message: string) => {
      myApp.resetAppConfig();
      const dialogOptions = {
        type: 'info',
        title: 'application config initialized.',
        message: '環境設定を初期化しました。アプリケーションを更新します。',
        buttons: ['OK'],
        defaultId: 0,
      };
      dialog.showMessageBox(myApp.systemWindow, dialogOptions)
      .then((result) => {
        const r = result.response;
        event.sender.send('resetAppConfig', r);
      });
      myApp.mainWindow.setSize(myApp.appCfg.mainWindow.width, myApp.appCfg.mainWindow.height);
      myApp.mainWindow.webContents.reload();
      if (myApp.systemWindow) { myApp.systemWindow.webContents.reload(); }
    });
  }

  // call from menu
  resetAppConfigOnMain(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    myApp.resetAppConfig();
    const dialogOptions = {
      type: 'info',
      title: 'application config initialized.',
      message: '環境設定を初期化しました。アプリケーションを更新します。',
      buttons: ['OK'],
      defaultId: 0,
    };
    dialog.showMessageBox(myApp.mainWindow, dialogOptions)
    .then((result) => {
      // do nothing
    });
    myApp.mainWindow.setSize(myApp.appCfg.mainWindow.width, myApp.appCfg.mainWindow.height);
    myApp.mainWindow.webContents.reload();
    if (myApp.systemWindow) { myApp.systemWindow.webContents.reload(); }
  }
}

export default FnEvent;
