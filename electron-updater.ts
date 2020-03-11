'use strict';
import {app, dialog, shell, autoUpdater} from 'electron';
var _log: any, log         = () => { _log = _log || require('electron-log'); return _log; };
var _Version: any, Version = () => { _Version = _Version || require('github-version-compare').Version; return _Version; };
var packagejson: any = require('./package.json');

var SIGNED = packagejson.build_status.signed == 'developer';

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
      this.showUpdaterErrorDialog('バージョン情報の取得に失敗しました。', err);
    });
  }

  private showIsLatestAppDialog(): void {
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

  private showUpdateConfirmDialog(version: GithubVersionCompare.IVersion): void {
    const buttons = SIGNED?
      ['Close', 'Open Release Page', 'Download And Install']:
      ['Close', 'Open Release Page'];
    const dialogOptions = {
      type: 'info',
      title: 'Application Version Check.',
      message: '新しいバージョンのアプリがあります。',
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
  }

  private startAutoUpdaterEvents(): void {
    // register events
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
      this.showQuitAndInstallDialog(releaseName);
    });
    autoUpdater.on('update-not-available', () => {
      this.showUpdaterErrorDialog('最新版のアプリの取得に失敗しました。', null);
    });
    autoUpdater.on('error', (err: Error) => {
      this.showUpdaterErrorDialog('アプリのアップデート中にエラーが発生しました。', err);
    });

    // setup feed url
    const server = 'https://update.electronjs.org';
    const feed = `${server}/taku-o/myukkurivoice-updater/${process.platform}-${process.arch}/${app.getVersion()}`;
    autoUpdater.setFeedURL({
      url: feed,
      serverType: 'json',
    });

    // update
    autoUpdater.checkForUpdates();
  }

  private showQuitAndInstallDialog(releaseName: string): void {
    const dialogOptions = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: releaseName,
      detail: '新しいアプリのダウンロードが完了しました。アプリを再起動して更新を適用します。',
    };
    dialog.showMessageBox(dialogOptions)
    .then((result) => {
      const btnId: number = result.response;
      if (btnId === 0) {
        autoUpdater.quitAndInstall();
      }
    });
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
