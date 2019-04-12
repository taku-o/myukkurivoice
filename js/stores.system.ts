class SystemStore implements yubo.SystemStore {
  constructor(
  ) {}
}

angular.module('systemStores', [])
  .service('SystemStore', [
    SystemStore,
  ]);
