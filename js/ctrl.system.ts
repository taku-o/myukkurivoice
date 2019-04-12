// controllers
class SystemController {
  constructor(
    private store: yubo.SystemStore,
    private reducer: yubo.SystemReducer
  ) {}

  // accessor
  get appCfg() {
    return this.store.appCfg;
  }
  get aq10UseKey() {
    return this.store.aq10UseKey;
  }
  set aq10UseKey(key: string) {
    this.store.aq10UseKey = key;
  }

  // $onInit
  $onInit(): void {
    this.reducer.onLoad();
  }

  // actions
  cancel(): void {
    this.reducer.cancel();
  }
  save(): void {
    this.reducer.save();
  }
  reset(): void {
    this.reducer.reset();
  }
}

angular.module('systemControllers', ['systemStores', 'systemReducers'])
  .controller('SystemController', [
    'SystemStore',
    'SystemReducer',
    (store: yubo.SystemStore, reducer: yubo.SystemReducer) => new SystemController(store, reducer),
  ]);
