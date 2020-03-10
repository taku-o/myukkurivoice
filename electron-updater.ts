'use strict';
import {app, dialog, shell, autoUpdater} from 'electron';
var _log: any, log         = () => { _log = _log || require('electron-log'); return _log; };
var _Version: any, Version = () => { _Version = _Version || require('github-version-compare').Version; return _Version; };
var packagejson: any = require('./package.json');

var SIGNED = packagejson.build_status.signed == 'developer';

class FnUpdater implements yubo.FnUpdater {
  constructor() {}

  // checkForUpdates
  private updaterInitialized = false;
  checkForUpdates(): void {
    if (SIGNED) {
      if (! this.updaterInitialized) {
        this.updaterInitialized = true;

        // setup feed url
        const server = 'https://update.electronjs.org';
        const feed = `${server}/taku-o/myukkurivoice-updater/${process.platform}-${process.arch}/${app.getVersion()}`;
        autoUpdater.setFeedURL({
          url: feed,
          serverType: 'json',
        });
        // register event
        this.registerAppUpdaterEvents();
      }
      autoUpdater.checkForUpdates();

    } else {
      this.checkAppVersion(); 
    }
  }

  private registerAppUpdaterEvents(): void {
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
      this.showQuitAndInstallDialog(releaseName);
    });
     autoUpdater.on('update-available', () => {
      this.showNewVersionFoundDialog();
    });
    autoUpdater.on('update-not-available', () => {
      this.showIsLatestVersionDialog();
    });
    autoUpdater.on('error', (err: Error) => {
      this.showUpdaterErrorDialog('アプリのアップデートに失敗しました。', err);
    });
  }

  private checkAppVersion(): void {
    const repository = 'taku-o/myukkurivoice';
    const vobj: GithubVersionCompare.IVersion = new (Version())(repository, packagejson);
    vobj.pull().then((version: GithubVersionCompare.IVersion) => {
      this.showVersionCheckDialog(version);
    })
    .catch((err: Error) => {
      this.showUpdaterErrorDialog('バージョン情報の取得に失敗しました。', err);
    });
  }

  private showNewVersionFoundDialog(): void {
    const dialogOptions = {
      type: 'info',
      title: 'Application Version Check.',
      message: '新しいバージョンのアプリがあります。ダウンロードを開始します。',
      buttons: ['OK'],
      defaultId: 0,
      cancelId: 0,
    };
    dialog.showMessageBox(dialogOptions);
  }

  private showIsLatestVersionDialog(): void {
    const dialogOptions = {
      type: 'info',
      title: 'Application Version Check.',
      message: 'アプリのバージョンは最新です',
      buttons: ['OK'],
      defaultId: 0,
      cancelId: 0,
    };
    dialog.showMessageBox(dialogOptions);
  }

  private showQuitAndInstallDialog(releaseName: string): void {
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: releaseName,
      detail: '新しいアプリのダウンロードが完了しました。アプリを再起動して更新を適用します。',
    };
    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  }

  private showVersionCheckDialog(version: GithubVersionCompare.IVersion): void {
    const message = version.hasLatestVersion()? '新しいバージョンのアプリがあります。': 'アプリのバージョンは最新です。';
    const buttons = version.hasLatestVersion()? ['Close', 'Open Release Page']: ['OK'];
    const dialogOptions = {
      type: 'info',
      title: 'Application Version Check.',
      message: message,
      buttons: buttons,
      defaultId: 0,
      cancelId: 0,
    };
    dialog.showMessageBox(dialogOptions)
    .then((result) => {
      const btnId: number = result.response;
      if (btnId == 1) {
        shell.openExternal(version.latestReleaseUrl);
      }
    });
  }

  private showUpdaterErrorDialog(message: string, err: Error): void {
    log().error(err);
    const dialogOptions = {
      type: 'error',
      title: 'Application Version Check Error.',
      message: message,
      buttons: ['OK'],
      defaultId: 0,
      cancelId: 0,
    };
    dialog.showMessageBox(dialogOptions);
  }
}

export default FnUpdater;
