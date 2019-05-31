class SystemStore implements yubo.SystemStore {
  constructor() {}
  appCfg: yubo.AppCfg = null;
  aq10UseKey: string = null;
}

angular.module('systemStores', [])
  .service('SystemStore', [
    SystemStore,
  ]);
