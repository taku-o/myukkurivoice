'use strict';
exports.__esModule = true;
var electron_1 = require("electron");
var _url, url = function () { _url = _url || require('url'); return _url; };
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
    var parsed = url().parse(scheme, true);
    switch (parsed.host) {
        case 'quit':
            electron_1.app.quit();
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
exports.handleOpenUrl = handleOpenUrl;
