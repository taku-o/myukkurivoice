// controllers
class SystemController implements yubo.SystemController {
  constructor(
    private $scope: ng.IScope,
    private $timeout: ng.ITimeoutService,
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

  // store observer
  update(objects: {[key: string]: any}): void {
    this.$timeout(() => { this.$scope.$apply(); });
  }
}

angular.module('systemControllers', ['systemStores', 'systemReducers'])
  .controller('SystemController', [
    '$scope',
    '$timeout',
    'SystemStore',
    'SystemReducer',
    (
      $scope: ng.IScope,
      $timeout: ng.ITimeoutService,
      store: yubo.SystemStore,
      reducer: yubo.SystemReducer
    ) => new SystemController($scope, $timeout, store, reducer),
  ]);
