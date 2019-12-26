"use strict";
class HelpController {
    constructor($timeout, store, reducer) {
        this.$timeout = $timeout;
        this.store = store;
        this.reducer = reducer;
        this.darwin = (typeof process !== 'undefined') ? !process.mas : true;
        this.mas = (typeof process !== 'undefined') ? process.mas : true;
        reducer.addObserver(this);
    }
    page(pageName) {
        this.reducer.page(pageName);
    }
    openSearchForm() {
        this.reducer.openSearchForm();
    }
    browser(url) {
        this.reducer.browser(url);
    }
    showItemInFolder(path) {
        this.reducer.showItemInFolder(path);
    }
    showSystemWindow() {
        this.reducer.showSystemWindow();
    }
    isOnline() {
        return window.navigator.onLine;
    }
    update(objects) {
        this.$timeout(() => { });
    }
}
angular.module('helpControllers', ['helpStores', 'helpReducers', 'IncludeDirectives'])
    .controller('HelpController', [
    '$timeout',
    'HelpStore',
    'HelpReducer',
    ($timeout, store, reducer) => new HelpController($timeout, store, reducer),
]);
