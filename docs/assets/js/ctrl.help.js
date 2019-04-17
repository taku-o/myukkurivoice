"use strict";
class HelpController {
    constructor($timeout, store, reducer) {
        this.$timeout = $timeout;
        this.store = store;
        this.reducer = reducer;
        reducer.addObserver(this);
    }
    get display() {
        return this.store.display;
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
