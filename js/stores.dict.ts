class DictStore implements yubo.DictStore {
  constructor() {}
  isInEditing: boolean = false;
  message: string = '';
  gridOptions: any;
}

angular.module('dictStores', [])
  .service('DictStore', [
    DictStore,
  ]);
