"use strict";
//var app = require('electron').remote.app;
//var _ipcRenderer, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };
//var _shell, shell             = () => { _shell = _shell || require('electron').shell; return _shell; };
//var _log, log                 = () => { _log = _log || require('electron-log'); return _log; };
//
//var homeDir = app.getPath('home');
//
//// handle uncaughtException
//process.on('uncaughtException', (err: Error) => {
//  log().error('help:event:uncaughtException');
//  log().error(err);
//  log().error(err.stack);
//});
// help app
angular.module('yvoiceAppHelp', [])
    .config(['$qProvider', function ($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
    }])
    .controller('HelpController', ['$scope', '$timeout', '$location',
    function ($scope, $timeout, $location) {
        var menuList = [
            'about',
            'voicecode',
            'trouble',
            'update',
            'uninstall',
            'backup',
            'license',
            'contact',
            'funclist',
            'play',
            'tuna',
            'writing',
            'dataconfig',
            'dragout',
            'multivoice',
            'shortcut',
            'help',
        ];
        // init
        var ctrl = this;
        $scope.$location = $location;
        // event url hash changed
        $scope.$on('$locationChangeSuccess', function (event) {
            var hash = $location.hash();
            if (menuList.includes(hash)) {
                $scope.display = hash;
            }
            else {
                $scope.display = 'about';
            }
            $timeout(function () { $scope.$apply(); });
        });
        //// shortcut
        //ipcRenderer().on('shortcut', (event, action) => {
        //  switch (action) {
        //    case 'moveToPreviousHelp':
        //      moveToPreviousHelp();
        //      $timeout(() => { $scope.$apply(); });
        //      break;
        //    case 'moveToNextHelp':
        //      moveToNextHelp();
        //      $timeout(() => { $scope.$apply(); });
        //      break;
        //  }
        //});
        //function moveToPreviousHelp(): void {
        //  const index = menuList.indexOf($scope.display);
        //  const moved = index - 1;
        //  if (index < 0) {
        //    $location.hash(menuList[0]);
        //  } else if (moved < 0) {
        //    $location.hash(menuList[menuList.length - 1]);
        //  } else {
        //    $location.hash(menuList[moved]);
        //  }
        //}
        //function moveToNextHelp(): void {
        //  const index = menuList.indexOf($scope.display);
        //  const moved = index + 1;
        //  if (index < 0) {
        //    $location.hash(menuList[0]);
        //  } else if (moved >= menuList.length) {
        //    $location.hash(menuList[0]);
        //  } else {
        //    $location.hash(menuList[moved]);
        //  }
        //}
        // action
        ctrl.browser = function (url) {
            //shell().openExternal(url);
            window.location.href = url;
        };
        ctrl.showItemInFolder = function (path) {
            //const expanded = path.replace('$HOME', homeDir);
            //shell().showItemInFolder(expanded);
        };
        ctrl.showSystemWindow = function () {
            //ipcRenderer().send('showSystemWindow', 'system');
        };
    }]);
