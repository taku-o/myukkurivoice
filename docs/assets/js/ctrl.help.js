"use strict";
class HelpController {
    constructor($scope, $timeout, store, reducer) {
        this.$scope = $scope;
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
        this.$timeout(() => { this.$scope.$apply(); });
    }
}
angular.module('helpControllers', ['helpStores', 'helpReducers', 'IncludeDirectives'])
    .controller('HelpController', [
    '$scope',
    '$timeout',
    'HelpStore',
    'HelpReducer',
    ($scope, $timeout, store, reducer) => new HelpController($scope, $timeout, store, reducer),
]);
