"use strict";
class HelpStore {
    constructor() {
        this.display = 'about';
        this.onBrowser = !('process' in window);
        this.onElectron = ('process' in window);
    }
}
angular.module('helpStores', [])
    .service('HelpStore', [
    HelpStore,
]);
