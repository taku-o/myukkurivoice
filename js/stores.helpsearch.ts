class HelpSearchStore implements yubo.HelpSearchStore {
  constructor(
  ) {}
}

angular.module('helpSearchStores', [])
  .service('HelpSearchStore', [
    HelpSearchStore,
  ]);
