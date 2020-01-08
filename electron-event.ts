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
      };
      dialog.showSaveDialog(myApp.mainWindow, options)
      .then((result) => {
        if (! result.canceled) {
          const filePath: string = result.filePath;
          const bookmark: string = result.bookmark;
          event.sender.send('showSaveDialog', {filePath: filePath, bookmark: bookmark});
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
          const filePaths: string[] = result.filePaths;
          const bookmarks: string[] = result.bookmarks;
          event.sender.send('showDirDialog', {filePaths: filePaths, bookmarks: bookmarks});
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

        myApp.mainWindow.setSize(myApp.appCfg.mainWindow.width, myApp.appCfg.mainWindow.height);
        myApp.mainWindow.webContents.reload();
        if (myApp.systemWindow) { myApp.systemWindow.webContents.reload(); }
      });
    });
    
    // resetAppConfig
    ipcMain.on('resetAppConfig', (event: Electron.IpcMainEvent, message: string) => {
      // confirm
      const confirmOptions = {
        type: 'warning',
        title: 'application config initialization.',
        message: '環境設定を初期化します。よろしいですか？',
        buttons: ['キャンセル', '初期化'],
        defaultId: 0,
      };
      dialog.showMessageBox(myApp.systemWindow, confirmOptions)
      .then((result) => {
        const pushed = result.response;
        if (pushed == 0) {
          throw new Error('cancel resetAppConfig');
        }
      })
      // reset
      .then(() => {
        myApp.resetAppConfig();
        const dialogOptions = {
          type: 'info',
          title: 'application config initialized.',
          message: '環境設定を初期化しました。アプリケーションを更新します。',
          buttons: ['OK'],
          defaultId: 0,
        };
        return dialog.showMessageBox(myApp.systemWindow, dialogOptions);
      })
      .then((result) => {
        const r = result.response;
        event.sender.send('resetAppConfig', r);

        myApp.mainWindow.setSize(myApp.appCfg.mainWindow.width, myApp.appCfg.mainWindow.height);
        myApp.mainWindow.webContents.reload();
        if (myApp.systemWindow) { myApp.systemWindow.webContents.reload(); }
      })
      .catch((err: Error) => {
        // cancel resetAppConfig()
        // do nothing
      });
    });
  }

  // call from menu
  resetAppConfigOnMain(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);

    // confirm
    const confirmOptions = {
      type: 'warning',
      title: 'application config initialization.',
      message: '環境設定を初期化します。よろしいですか？',
      buttons: ['キャンセル', '初期化'],
      defaultId: 0,
    };
    dialog.showMessageBox(myApp.mainWindow, confirmOptions)
    .then((result) => {
      const pushed = result.response;
      if (pushed == 0) {
        throw new Error('cancel resetAppConfigOnMain');
      }
    })
    // reset
    .then(() => {
      myApp.resetAppConfig();
      const dialogOptions = {
        type: 'info',
        title: 'application config initialized.',
        message: '環境設定を初期化しました。アプリケーションを更新します。',
        buttons: ['OK'],
        defaultId: 0,
      };
      return dialog.showMessageBox(myApp.mainWindow, dialogOptions);
    })
    .then((result) => {
      myApp.mainWindow.setSize(myApp.appCfg.mainWindow.width, myApp.appCfg.mainWindow.height);
      myApp.mainWindow.webContents.reload();
      if (myApp.systemWindow) { myApp.systemWindow.webContents.reload(); }
    })
    .catch((err: Error) => {
      // cancel resetAppConfigOnMain()
      // do nothing
    });
  }

  // call from menu
  resetVoiceDataOnMain(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);

    // confirm
    const confirmOptions = {
      type: 'warning',
      title: 'voice config data initialization.',
      message: 'ボイス設定を初期化します。よろしいですか？',
      buttons: ['キャンセル', '初期化'],
      defaultId: 0,
    };
    dialog.showMessageBox(myApp.mainWindow, confirmOptions)
    .then((result) => {
      const pushed = result.response;
      if (pushed == 0) {
        throw new Error('cancel resetVoiceDataOnMain');
      }
    })
    // reset
    .then(() => {
      myApp.mainWindow.webContents.send('menu', 'reset');
      const dialogOptions = {
        type: 'info',
        title: 'voice config data initialized.',
        message: 'ボイス設定を初期化しました。',
        buttons: ['OK'],
        defaultId: 0,
      };
      return dialog.showMessageBox(myApp.mainWindow, dialogOptions);
    })
    .then((result) => {
      // do nothing
    })
    .catch((err: Error) => {
      // cancel resetVoiceDataOnMain()
      // do nothing
    });
  }

  // call from menu
  resetDictionaryData(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    if (!myApp.dictWindow) { return; }

    // confirm
    const confirmOptions = {
      type: 'warning',
      title: 'reset dictionary data ?',
      message: '辞書データを初期化します。よろしいですか？',
      buttons: ['キャンセル', '初期化'],
      defaultId: 0,
    };
    dialog.showMessageBox(myApp.dictWindow, confirmOptions)
    .then((result) => {
      const pushed = result.response;
      if (pushed == 0) {
        throw new Error('cancel resetDictionaryData');
      }
    })
    // reset
    .then(() => {
      if (!myApp.dictWindow) { throw new Error('cancel resetDictionaryData in illegal state'); }
      myApp.dictWindow.webContents.send('menu', 'reset'); 
      const dialogOptions = {
        type: 'info',
        title: 'reset dictionary data.',
        message: '辞書データを初期化しました。',
        buttons: ['OK'],
        defaultId: 0,
      };
      return dialog.showMessageBox(myApp.dictWindow, dialogOptions);
    })
    .then((result) => {
      // do nothing
    })
    .catch((err: Error) => {
      // cancel resetDictionaryData
      // cancel resetDictionaryData in illegal state'
      // do nothing
    });
  }
}

export default FnEvent;
