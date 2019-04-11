"use strict";
var _ipcRenderer, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };
var _shell, shell = () => { _shell = _shell || require('electron').shell; return _shell; };
class HelpReducer {
    constructor($timeout, $location, $window) {
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
    locationChangeSuccess($scope) {
        if (this.$location.url().startsWith('/%23')) {
            this.$window.location.href = this.$location.absUrl().replace('%23', '#');
            return;
        }
        const hash = this.$location.hash();
        if (this.menuList.includes(hash)) {
            $scope.display = hash;
        }
        else {
            $scope.display = 'about';
        }
        this.$timeout(() => { $scope.$apply(); });
    }
    onShortcut($scope, action) {
        switch (action) {
            case 'moveToPreviousHelp':
                this.moveToPreviousHelp($scope);
                break;
            case 'moveToNextHelp':
                this.moveToNextHelp($scope);
                break;
        }
    }
    moveToPreviousHelp($scope) {
        const index = this.menuList.indexOf($scope.display);
        const moved = index - 1;
        if (index < 0) {
            this.page(this.menuList[0]);
        }
        else if (moved < 0) {
            this.page(this.menuList[this.menuList.length - 1]);
        }
        else {
            this.page(this.menuList[moved]);
        }
        this.$timeout(() => { $scope.$apply(); });
    }
    moveToNextHelp($scope) {
        const index = this.menuList.indexOf($scope.display);
        const moved = index + 1;
        if (index < 0) {
            this.page(this.menuList[0]);
        }
        else if (moved >= this.menuList.length) {
            this.page(this.menuList[0]);
        }
        else {
            this.page(this.menuList[moved]);
        }
        this.$timeout(() => { $scope.$apply(); });
    }
    page(pageName) {
        this.$location.hash(pageName);
    }
    openSearchForm() {
        ipcRenderer().send('showHelpSearchDialog', 'show help search dialog');
    }
    browser(url) {
        if ('process' in window) {
            shell().openExternal(url);
        }
        else {
            this.$window.open(url);
        }
    }
    showItemInFolder(path) {
        if ('process' in window) {
            const app = require('electron').remote.app;
            const homeDir = app.getPath('home');
            const expanded = path.replace('$HOME', homeDir);
            shell().showItemInFolder(expanded);
        }
    }
    showSystemWindow() {
        if ('process' in window) {
            ipcRenderer().send('showSystemWindow', 'system');
        }
    }
}
angular.module('helpReducers', [])
    .service('HelpReducer', [
    '$timeout',
    '$location',
    '$window',
    HelpReducer,
]);
