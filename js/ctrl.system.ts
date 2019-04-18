// controllers
class SystemController implements yubo.SystemController {
  constructor(
    private $timeout: ng.ITimeoutService,
    private store: yubo.SystemStore,
    private reducer: yubo.SystemReducer
  ) {
    reducer.addObserver(this);
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
    this.$timeout(() => {});
  }
}

angular.module('systemControllers', ['systemStores', 'systemReducers'])
  .controller('SystemController', [
    '$timeout',
    'SystemStore',
    'SystemReducer',
    (
      $timeout: ng.ITimeoutService,
      store: yubo.SystemStore,
      reducer: yubo.SystemReducer
    ) => new SystemController($timeout, store, reducer),
  ]);
