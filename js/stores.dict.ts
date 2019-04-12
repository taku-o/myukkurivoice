class DictStore implements yubo.DictStore {
  constructor(
  ) {}
}

angular.module('dictStores', [])
  .service('DictStore', [
    DictStore,
  ]);
