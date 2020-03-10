'use strict';
import {dialog, autoUpdater} from 'electron';
var _log: any, log = () => { _log = _log || require('electron-log'); return _log; };
var packagejson: any = require('./package.json');

var SIGNED = packagejson.build_status.signed == 'developer';

class FnUpdater implements yubo.FnUpdater {
  constructor() {
    if (SIGNED) {
      this.registerUpdaterEvents();
    }
  }

  checkForUpdates(): void {
    if (SIGNED) {
      const server = 'https://update.electronjs.org';
      const feed = `${server}/taku-o/myukkurivoice/${process.platform}-${process.arch}/${app.getVersion()}`;
      autoUpdater.setFeedURL({
        url: feed,
      });
      autoUpdater.checkForUpdates();
    } else {
      const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
      myApp.showVersionDialog(); 
    }
  }

  private registerUpdaterEvents(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
      const dialogOpts = {
        type: 'info',
        buttons: ['Restart', 'Later'],
        title: 'Application Update',
        message: releaseName,
        detail: 'A new version has been downloaded. アプリケーションを再起動して更新を適用します。',
      };
    
      dialog.showMessageBox(myApp.mainWindow, dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
    });
    
    autoUpdater.on('error', (err: Error) => {
      const title = 'There was a problem updating the application';
      log().error(title);
      log().error(err);
      dialog.showErrorBox(title, err.message);
    });

    autoUpdater.on('update-available', () => {
      dialog.showErrorBox('update-available', 'update-available');
    });
    autoUpdater.on('update-not-available', () => {
      dialog.showErrorBox('update-not-available', 'update-not-available');
    });
  }
}

export default FnUpdater;