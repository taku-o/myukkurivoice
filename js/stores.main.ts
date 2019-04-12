class MainStore implements yubo.MainStore {
  constructor(
  ) {}
}

angular.module('mainStores', [])
  .service('MainStore', [
    MainStore,
  ]);
