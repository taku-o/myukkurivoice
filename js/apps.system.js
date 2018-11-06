"use strict";
var app = require('electron').remote.app;
var _ipcRenderer, ipcRenderer = function () { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };
var _shell, shell = function () { _shell = _shell || require('electron').shell; return _shell; };
var _log, log = function () { _log = _log || require('electron-log'); return _log; };
var homeDir = app.getPath('home');
// handle uncaughtException
process.on('uncaughtException', function (err) {
    log().error('system:event:uncaughtException');
    log().error(err);
    log().error(err.stack);
});
// application config app
angular.module('yvoiceSystem', ['yvoiceLicenseService'])
    .config(['$qProvider', function ($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
    }])
    .controller('SystemController', ['$scope', '$timeout', 'LicenseService',
    function ($scope, $timeout, LicenseService) {
        // init
        var ctrl = this;
        $timeout(function () { $scope.$apply(); });
        var appCfg = require('electron').remote.getGlobal('appCfg');
        $scope.appCfg = appCfg;
        $scope.aq10UseKey = appCfg.aq10UseKeyEncrypted ?
            LicenseService.decrypt(appCfg.passPhrase, appCfg.aq10UseKeyEncrypted) :
            '';
        // actions
        ctrl.cancel = function () {
            $scope.appCfg = angular.copy(require('electron').remote.getGlobal('appCfg'));
            var window = require('electron').remote.getCurrentWindow();
            window.close();
        };
        ctrl.save = function () {
            var aq10UseKeyEncrypted = $scope.aq10UseKey ?
                LicenseService.encrypt($scope.appCfg.passPhrase, $scope.aq10UseKey) :
                '';
            $scope.appCfg.customDictPath = $scope.appCfg.useCustomDict ?
                app.getPath('userData') + "/userdict" :
                null;
            var options = {
                'mainWindow': $scope.appCfg.mainWindow,
                'audioServVer': $scope.appCfg.audioServVer,
                'showMsgPane': $scope.appCfg.showMsgPane,
                'acceptFirstMouse': $scope.appCfg.acceptFirstMouse,
                'passPhrase': $scope.appCfg.passPhrase,
                'aq10UseKeyEncrypted': aq10UseKeyEncrypted,
                'useCustomDict': $scope.appCfg.useCustomDict,
                'customDictPath': $scope.appCfg.customDictPath
            };
            ipcRenderer().send('updateAppConfig', options);
        };
        ctrl.reset = function () {
            ipcRenderer().send('resetAppConfig', '');
        };
        ctrl.showItemInFolder = function (path) {
            var expanded = path.replace('$HOME', homeDir);
            shell().showItemInFolder(expanded);
        };
    }]);
