class HelpStore implements yubo.HelpStore {
  constructor() {}
  display: string = 'about';
  readonly onBrowser: boolean = !('process' in window);
  readonly onElectron: boolean = ('process' in window);
}

angular.module('helpStores', [])
  .service('HelpStore', [
    HelpStore,
  ]);
