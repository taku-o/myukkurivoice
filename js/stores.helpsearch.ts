class HelpSearchStore implements yubo.HelpSearchStore {
  constructor() {}
  searchText: string = '';
}

angular.module('helpSearchStores', [])
  .service('HelpSearchStore', [
    HelpSearchStore,
  ]);
