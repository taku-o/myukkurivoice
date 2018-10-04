'use strict';
exports.__esModule = true;
var _crypto, crypto = function () { _crypto = _crypto || require('crypto'); return _crypto; };
var _Config, Config = function () { _Config = _Config || require('electron-config'); return _Config; };
// load
function loadAppConfig() {
    var appCfg = {
        mainWindow: { width: 800, height: 665, x: null, y: null },
        helpWindow: { width: 700, height: 550 },
        systemWindow: { width: 390, height: 530 },
        audioServVer: 'webaudioapi',
        showMsgPane: true,
        acceptFirstMouse: false,
        passPhrase: crypto().randomBytes(16).toString('hex'),
        aq10UseKeyEncrypted: '',
        debug: process.env.DEBUG != null,
        isTest: process.env.NODE_ENV == 'test'
    };
    var config = new (Config())();
    ['mainWindow', 'audioServVer', 'showMsgPane', 'acceptFirstMouse', 'passPhrase', 'aq10UseKeyEncrypted'].forEach(function (k) {
        if (config.has(k)) {
            appCfg[k] = config.get(k);
        }
    });
    this.config = config;
    this.appCfg = appCfg;
    global.appCfg = appCfg;
}
exports.loadAppConfig = loadAppConfig;
// update
function updateAppConfig(options) {
    var myApp = this;
    var _a = this.mainWindow.getBounds(), x = _a.x, y = _a.y;
    options.mainWindow.x = x;
    options.mainWindow.y = y;
    this.config.set('mainWindow', options.mainWindow);
    this.config.set('audioServVer', options.audioServVer);
    this.config.set('showMsgPane', options.showMsgPane);
    this.config.set('acceptFirstMouse', options.acceptFirstMouse);
    this.config.set('passPhrase', options.passPhrase);
    this.config.set('aq10UseKeyEncrypted', options.aq10UseKeyEncrypted);
    ['mainWindow', 'audioServVer', 'showMsgPane', 'acceptFirstMouse', 'passPhrase', 'aq10UseKeyEncrypted'].forEach(function (k) {
        if (myApp.config.has(k)) {
            myApp.appCfg[k] = myApp.config.get(k);
        }
    });
    global.appCfg = this.appCfg;
}
exports.updateAppConfig = updateAppConfig;
// reset
function resetAppConfig() {
    var myApp = this;
    this.config.set('mainWindow', { width: 800, height: 665, x: null, y: null });
    this.config.set('audioServVer', 'webaudioapi');
    this.config.set('showMsgPane', true);
    this.config.set('acceptFirstMouse', false);
    this.config.set('passPhrase', crypto().randomBytes(16).toString('hex'));
    this.config.set('aq10UseKeyEncrypted', '');
    ['mainWindow', 'audioServVer', 'showMsgPane', 'acceptFirstMouse', 'passPhrase', 'aq10UseKeyEncrypted'].forEach(function (k) {
        if (myApp.config.has(k)) {
            myApp.appCfg[k] = myApp.config.get(k);
        }
    });
    global.appCfg = this.appCfg;
}
exports.resetAppConfig = resetAppConfig;
