"use strict";
var _ipcRenderer, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };
var _shell, shell = () => { _shell = _shell || require('electron').shell; return _shell; };
class HelpReducer {
    constructor($timeout, $location, $window, store) {
        this.$timeout = $timeout;
        this.$location = $location;
        this.$window = $window;
        this.store = store;
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
    locationChangeSuccess() {
        if (this.$location.url().startsWith('/%23')) {
            this.$window.location.href = this.$location.absUrl().replace('%23', '#');
            return;
        }
        const hash = this.$location.hash();
        this.$timeout(() => {
            if (this.menuList.includes(hash)) {
                this.store.display = hash;
            }
            else {
                this.store.display = 'about';
            }
        });
    }
    onShortcut(action) {
        switch (action) {
            case 'moveToPreviousHelp':
                this.$timeout(() => {
                    this.moveToPreviousHelp();
                });
                break;
            case 'moveToNextHelp':
                this.$timeout(() => {
                    this.moveToNextHelp();
                });
                break;
        }
    }
    moveToPreviousHelp() {
        const index = this.menuList.indexOf(this.store.display);
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
    }
    moveToNextHelp() {
        const index = this.menuList.indexOf(this.store.display);
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
angular.module('helpReducers', ['helpStores'])
    .service('HelpReducer', [
    '$timeout',
    '$location',
    '$window',
    'HelpStore',
    HelpReducer,
]);
