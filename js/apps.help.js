"use strict";
var _this = this;
exports.__esModule = true;
var electron_1 = require("electron");
var log = require("electron-log");
var angular = require("angular");
var app = electron_1.remote.app;
var homeDir = app.getPath('home');
// handle uncaughtException
process.on('uncaughtException', function (err) {
    log.error('help:event:uncaughtException');
    log.error(err);
    log.error(err.stack);
});
// help app
angular.module('yvoiceAppHelp', [])
    .config(['$qProvider', function ($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
    }])
    .controller('HelpController', ['$scope', '$timeout', '$location', function ($scope, $timeout, $location) {
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
            'help'
        ];
        // init
        var ctrl = _this;
        $scope.$location = $location;
        // event url hash changed
        $scope.$on('$locationChangeSuccess', function (event) {
            var hash = $location.hash();
            // @ts-ignore
            if (menuList.includes(hash)) {
                $scope.display = hash;
            }
            else {
                $scope.display = 'about';
            }
            $timeout(function () { $scope.$apply(); });
        });
        // shortcut
        electron_1.ipcRenderer.on('shortcut', function (event, action) {
            switch (action) {
                case 'moveToPreviousHelp':
                    moveToPreviousHelp();
                    $timeout(function () { $scope.$apply(); });
                    break;
                case 'moveToNextHelp':
                    moveToNextHelp();
                    $timeout(function () { $scope.$apply(); });
                    break;
            }
        });
        function moveToPreviousHelp() {
            var index = menuList.indexOf($scope.display);
            var moved = index - 1;
            if (index < 0) {
                $location.hash(menuList[0]);
            }
            else if (moved < 0) {
                $location.hash(menuList[menuList.length - 1]);
            }
            else {
                $location.hash(menuList[moved]);
            }
        }
        function moveToNextHelp() {
            var index = menuList.indexOf($scope.display);
            var moved = index + 1;
            if (index < 0) {
                $location.hash(menuList[0]);
            }
            else if (moved >= menuList.length) {
                $location.hash(menuList[0]);
            }
            else {
                $location.hash(menuList[moved]);
            }
        }
        // action
        ctrl.browser = function (url) {
            electron_1.shell.openExternal(url);
        };
        ctrl.showItemInFolder = function (path) {
            var expanded = path.replace('$HOME', homeDir);
            electron_1.shell.showItemInFolder(expanded);
        };
        ctrl.showSystemWindow = function () {
            electron_1.ipcRenderer.send('showSystemWindow', 'system');
        };
    }]);
