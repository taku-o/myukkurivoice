"use strict";
class HelpController {
    constructor(store, reducer) {
        this.store = store;
        this.reducer = reducer;
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
}
angular.module('helpControllers', ['helpStores', 'helpReducers', 'IncludeDirectives'])
    .controller('HelpController', [
    'HelpStore',
    'HelpReducer',
    (store, reducer) => new HelpController(store, reducer),
]);
