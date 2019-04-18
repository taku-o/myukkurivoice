'use strict';
import {dialog, ipcMain} from 'electron';
var _path, path = () => { _path = _path || require('path'); return _path; };

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
    ipcMain.on('showHelpWindow', (event: Electron.Event, message: string) => {
      myApp.showHelpWindow();
    });
    ipcMain.on('showHelpSearchDialog', (event: Electron.Event, message: string) => {
      myApp.showHelpSearchDialog();
    });
    ipcMain.on('showSystemWindow', (event: Electron.Event, message: string) => {
      myApp.showSystemWindow();
    });
    ipcMain.on('showDictWindow', (event: Electron.Event, message: string) => {
      myApp.showDictWindow();
    });
    ipcMain.on('showSpecWindow', (event: Electron.Event, message: string) => {
      myApp.showSpecWindow();
    });
  }

  private registerMainAppEvents(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    // showSaveDialog
    ipcMain.on('showSaveDialog', (event: Electron.Event, message: string) => {
      const options = {
        title: 'wav save dialog',
        filters: [
          {name: 'Wav File', extensions: ['wav']},
        ],
      };
      const r = dialog.showSaveDialog(myApp.mainWindow, options);
      event.sender.send('showSaveDialog', r);
    });
    
    // showDirDialog
    ipcMain.on('showDirDialog', (event: Electron.Event, defaultPath: string) => {
      const options = {
        title: 'select wav save directory',
        properties: ['openDirectory' as 'openDirectory', 'createDirectory' as 'createDirectory'],
        defaultPath: defaultPath,
      };
      const r = dialog.showOpenDialog(myApp.mainWindow, options);
      event.sender.send('showDirDialog', r);
    });
    
    // drag out wav file
    ipcMain.on('ondragstartwav', (event: Electron.Event, filePath: string) => {
      const imgPath = path().join(__dirname, '/images/ic_music_video_black_24dp_1x.png');
      event.sender.startDrag({
        file: filePath,
        icon: imgPath,
      });
    });

    ipcMain.on('reloadMainWindow', (event: Electron.Event, message: string) => {
      myApp.mainWindow.webContents.reload();
      event.sender.send('reloadMainWindow', message);
    });

    ipcMain.on('switchAlwaysOnTop', (event: Electron.Event, message: string) => {
      const newflg = !myApp.mainWindow.isAlwaysOnTop();
      myApp.mainWindow.setAlwaysOnTop(newflg);
      event.sender.send('switchAlwaysOnTop', newflg);
    });
  }

  private registerSystemAppEvents(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    // updateAppConfig
    ipcMain.on('updateAppConfig', (event: Electron.Event, options: yubo.AppCfg) => {
      myApp.updateAppConfig(options);
      const dialogOptions = {
        type: 'info',
        title: 'application config updated.',
        message: '環境設定を更新しました。アプリケーションを更新します。',
        buttons: ['OK'],
        defaultId: 0,
      };
      const r = dialog.showMessageBox(myApp.systemWindow, dialogOptions);
      event.sender.send('updateAppConfig', r);
      myApp.mainWindow.setSize(myApp.appCfg.mainWindow.width, myApp.appCfg.mainWindow.height);
      myApp.mainWindow.webContents.reload();
      if (myApp.systemWindow) { myApp.systemWindow.webContents.reload(); }
    });
    
    // resetAppConfig
    ipcMain.on('resetAppConfig', (event: Electron.Event, message: string) => {
      myApp.resetAppConfig();
      const dialogOptions = {
        type: 'info',
        title: 'application config initialized.',
        message: '環境設定を初期化しました。アプリケーションを更新します。',
        buttons: ['OK'],
        defaultId: 0,
      };
      const r = dialog.showMessageBox(myApp.systemWindow, dialogOptions);
      event.sender.send('resetAppConfig', r);
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
    const _void = dialog.showMessageBox(myApp.mainWindow, dialogOptions);
    myApp.mainWindow.setSize(myApp.appCfg.mainWindow.width, myApp.appCfg.mainWindow.height);
    myApp.mainWindow.webContents.reload();
    if (myApp.systemWindow) { myApp.systemWindow.webContents.reload(); }
  }
  switchAlwaysOnTop(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    const newflg = !myApp.mainWindow.isAlwaysOnTop();
    myApp.mainWindow.setAlwaysOnTop(newflg);
    myApp.mainWindow.webContents.send('switchAlwaysOnTop', newflg);
  }
}

export default FnEvent;
