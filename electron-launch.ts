'use strict';
import {app} from 'electron';
var _url, url = () => { _url = _url || require('url'); return _url; };

function handleOpenFile(filePath: string): void {
  const myApp = this;
  if (myApp.mainWindow) {
    myApp.mainWindow.webContents.send('dropTextFile', filePath);
  } else {
    myApp.launchArgs = {filePath: filePath};
  }
}

function handleOpenUrl(scheme: string): void {
  const myApp = this;
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

// exports
export {
  handleOpenFile,
  handleOpenUrl,
};
