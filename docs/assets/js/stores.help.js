"use strict";
class HelpStore {
    constructor() {
        this.display = 'about';
    }
}
angular.module('helpStores', [])
    .service('HelpStore', [
    HelpStore,
]);
