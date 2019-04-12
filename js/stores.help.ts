class HelpStore implements yubo.HelpStore {
  constructor() {}
  display: string = 'about';
}

angular.module('helpStores', [])
  .service('HelpStore', [
    HelpStore,
  ]);
