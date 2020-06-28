'use strict';
import {app, dialog, shell, autoUpdater} from 'electron';
var _log: any, log         = () => { _log = _log || require('electron-log'); return _log; };
var _Version: any, Version = () => { _Version = _Version || require('github-version-compare').Version; return _Version; };
var packagejson: any = require('./package.json');

var SIGNED = packagejson.build_status.signed == 'developer';

// progress
// 1. checking version.
// 2. found new latest version.
// 3. downloading new app.
// 4. new app downloaded.
// 5. update application.

class FnUpdater implements yubo.FnUpdater {
  constructor() {}

  checkForUpdates(): void {
    this.checkAppVersion();
  }

  private checkAppVersion(): void {
    const repository = 'taku-o/myukkurivoice';
    const vobj: GithubVersionCompare.IVersion = new (Version())(repository, packagejson);
    vobj.pull().then((version: GithubVersionCompare.IVersion) => {
      if (version.hasLatestVersion()) {
        this.showUpdateConfirmDialog(version);
      } else {
        this.showIsLatestAppDialog();
      }
    })
    .catch((err: Error) => {
      this.showProgressMessage(-1, 'バージョン情報の取得に失敗しました。');
      this.showUpdaterErrorDialog('バージョン情報の取得に失敗しました。', err);
    });
    this.showProgressMessage(0.2, '最新バージョンがあるか確認しています (1/5)');
  }

  private showIsLatestAppDialog(): void {
    const dialogOptions = {
      type: 'info',
      title: 'Application Version Check.',
      message: 'アプリのバージョンは最新です。',
      buttons: ['OK'],
      defaultId: 0,
      cancelId: 0,
    };
    dialog.showMessageBox(dialogOptions);
    this.showProgressMessage(-1, 'アプリのバージョンは最新です。');
  }

  private showUpdateConfirmDialog(version: GithubVersionCompare.IVersion): void {
    const buttons = SIGNED?
      ['Close', 'Show Download Page', 'Download And Install']:
      ['Close', 'Show Download Page'];
    const dialogOptions = {
      type: 'info',
      title: 'Application Version Check.',
      message: '新しいバージョンのアプリが見つかりました。',
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
      if (btnId == 2) {
        this.startAutoUpdaterEvents();
      }
    });
    if (SIGNED) {
      this.showProgressMessage(0.4, '新しいバージョンのアプリが見つかりました。(2/5)');
    } else {
      this.showProgressMessage(-1, '新しいバージョンのアプリが見つかりました。');
    }
  }

  private startAutoUpdaterEvents(): void {
    // register events
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
      this.showQuitAndInstallDialog(releaseName);
    });
    autoUpdater.on('update-not-available', () => {
      this.showUpdaterErrorDialog('最新版のアプリの取得に失敗しました。', null);
      this.showProgressMessage(-1, '最新版のアプリの取得に失敗しました。');
    });
    autoUpdater.on('error', (err: Error) => {
      this.showUpdaterErrorDialog('アプリのアップデート中にエラーが発生しました。', err);
      this.showProgressMessage(-1, 'アプリのアップデート中にエラーが発生しました。');
    });

    // setup feed url
    const server = 'https://update.electronjs.org';
    const feed = `${server}/taku-o/myukkurivoice/${process.platform}-${process.arch}/${app.getVersion()}`;
    autoUpdater.setFeedURL({
      url: feed,
      serverType: 'json',
    });

    // update
    autoUpdater.checkForUpdates();
    this.showProgressMessage(0.6, '最新版のアプリをダウンロードします。(3/5)');
  }

  private showQuitAndInstallDialog(releaseName: string): void {
    const dialogOptions = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Updated.',
      message: releaseName,
      detail: '新しいアプリのダウンロードが完了しました。アプリを再起動して更新を適用します。',
    };
    dialog.showMessageBox(dialogOptions)
    .then((result) => {
      const btnId: number = result.response;
      if (btnId === 0) {
        autoUpdater.quitAndInstall();
        this.showProgressMessage(1.0, 'アプリを再起動して更新を適用します。(5/5)');
      }
    });
    this.showProgressMessage(0.8, '新しいアプリのダウンロードが完了しました。(4/5)');
  }

  private showProgressMessage(progress: number, message: string): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    if (myApp.mainWindow) {
      myApp.mainWindow.webContents.send('info', message);
      myApp.mainWindow.setProgressBar(progress);
    }
  }

  private showUpdaterErrorDialog(message: string, err: Error): void {
    if (err) {
      log().error(err);
    }
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
