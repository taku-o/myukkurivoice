"use strict";
var _ipcRenderer, ipcRenderer = function () { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };
var _shell, shell = function () { _shell = _shell || require('electron').shell; return _shell; };
angular.module('helpReducers', [])
    .service('HelpReducer', ['$timeout', '$location', '$window', (function () {
        function HelpReducer($timeout, $location, $window) {
            this.$timeout = $timeout;
            this.$location = $location;
            this.$window = $window;
            this.menuList = [
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
                'dictionary',
                'history',
                'shortcut',
                'help',
                'expand',
            ];
        }
        HelpReducer.prototype.locationChangeSuccess = function ($scope) {
            if (this.$location.url().startsWith('/%23')) {
                this.$window.location.href = this.$location.absUrl().replace('%23', '#');
                return;
            }
            var hash = this.$location.hash();
            if (this.menuList.includes(hash)) {
                $scope.display = hash;
            }
            else {
                $scope.display = 'about';
            }
            this.$timeout(function () { $scope.$apply(); });
        };
        HelpReducer.prototype.onShortcut = function ($scope, action) {
            switch (action) {
                case 'moveToPreviousHelp':
                    this.moveToPreviousHelp($scope);
                    break;
                case 'moveToNextHelp':
                    this.moveToNextHelp($scope);
                    break;
            }
        };
        HelpReducer.prototype.moveToPreviousHelp = function ($scope) {
            var index = this.menuList.indexOf($scope.display);
            var moved = index - 1;
            if (index < 0) {
                this.$location.hash(this.menuList[0]);
            }
            else if (moved < 0) {
                this.$location.hash(this.menuList[this.menuList.length - 1]);
            }
            else {
                this.$location.hash(this.menuList[moved]);
            }
            this.$timeout(function () { $scope.$apply(); });
        };
        HelpReducer.prototype.moveToNextHelp = function ($scope) {
            var index = this.menuList.indexOf($scope.display);
            var moved = index + 1;
            if (index < 0) {
                this.$location.hash(this.menuList[0]);
            }
            else if (moved >= this.menuList.length) {
                this.$location.hash(this.menuList[0]);
            }
            else {
                this.$location.hash(this.menuList[moved]);
            }
            this.$timeout(function () { $scope.$apply(); });
        };
        HelpReducer.prototype.openSearchForm = function () {
            ipcRenderer().send('showHelpSearchDialog', 'show help search dialog');
        };
        HelpReducer.prototype.browser = function (url) {
            if ('process' in window) {
                shell().openExternal(url);
            }
            else {
                this.$window.open(url);
            }
        };
        HelpReducer.prototype.showItemInFolder = function (path) {
            if ('process' in window) {
                var app_1 = require('electron').remote.app;
                var homeDir = app_1.getPath('home');
                var expanded = path.replace('$HOME', homeDir);
                shell().showItemInFolder(expanded);
            }
        };
        HelpReducer.prototype.showSystemWindow = function () {
            if ('process' in window) {
                ipcRenderer().send('showSystemWindow', 'system');
            }
        };
        return HelpReducer;
    }()),]);
