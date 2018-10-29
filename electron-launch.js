'use strict';
exports.__esModule = true;
function handleOpenFile(filePath) {
    var myApp = this;
    if (myApp.mainWindow) {
        myApp.mainWindow.webContents.send('dropTextFile', filePath);
    }
    else {
        myApp.launchArgs = { filePath: filePath };
    }
}
exports.handleOpenFile = handleOpenFile;
function handleOpenUrl(scheme) {
    var myApp = this;
    // open
}
exports.handleOpenUrl = handleOpenUrl;
