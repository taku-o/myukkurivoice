'use strict';

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
  // open
}

// exports
export {
  handleOpenFile,
  handleOpenUrl,
};
