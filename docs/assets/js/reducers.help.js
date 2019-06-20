"use strict";
var _ipcRenderer, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };
var _shell, shell = () => { _shell = _shell || require('electron').shell; return _shell; };
class HelpReducer {
    constructor($location, $window, store) {
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
            'fcpx-ixml',
            'expand',
        ];
        this.observers = [];
    }
    locationChangeSuccess() {
        if (this.$location.url().startsWith('/%23')) {
            this.$window.location.href = this.$location.absUrl().replace('%23', '#');
            return;
        }
        const hash = this.$location.hash();
        if (this.menuList.includes(hash)) {
            this.store.display = hash;
        }
        else {
            this.store.display = 'about';
        }
        this.notifyUpdates({ display: this.store.display });
    }
    onShortcut(action) {
        switch (action) {
            case 'moveToPreviousHelp':
                this.moveToPreviousHelp();
                this.notifyUpdates({});
                break;
            case 'moveToNextHelp':
                this.moveToNextHelp();
                this.notifyUpdates({});
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
        if (this.store.onElectron) {
            shell().openExternal(url);
        }
        else {
            this.$window.open(url);
        }
    }
    showItemInFolder(path) {
        if (this.store.onElectron) {
            const app = require('electron').remote.app;
            const homeDir = app.getPath('home');
            const expanded = path.replace('$HOME', homeDir);
            shell().showItemInFolder(expanded);
        }
    }
    showSystemWindow() {
        if (this.store.onElectron) {
            ipcRenderer().send('showSystemWindow', 'system');
        }
    }
    addObserver(observer) {
        this.observers.push(observer);
    }
    notifyUpdates(objects) {
        for (let o of this.observers) {
            o.update(objects);
        }
    }
}
angular.module('helpReducers', ['helpStores'])
    .service('HelpReducer', [
    '$location',
    '$window',
    'HelpStore',
    HelpReducer,
]);
