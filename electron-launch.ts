'use strict';
import {app} from 'electron';
var _url, url   = () => { _url = _url || require('url'); return _url; };
var _path, path = () => { _path = _path || require('path'); return _path; };

export default class FnLaunch implements yubo.FnLaunch {

  handleOpenFile(filePath: string): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    if (myApp.mainWindow) {
      const ext = path().extname(filePath);
      if (ext == '.wav') {
        myApp.mainWindow.webContents.send('recentDocument', filePath);
      } else {
        myApp.mainWindow.webContents.send('dropTextFile', filePath);
      }
    } else {
      myApp.launchArgs = {filePath: filePath};
    }
  }

  handleOpenUrl(scheme: string): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    const parsed = url().parse(scheme, true);
    switch (parsed.host) {
      case 'quit':
        app.quit();
        break;
      case 'reload':
        if (myApp.mainWindow) {
          myApp.mainWindow.webContents.reload();
        }
        break;
      case 'open':
      default:
        // open
        break;
    }
  }
}
