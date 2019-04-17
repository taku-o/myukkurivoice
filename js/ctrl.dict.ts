// controllers
class DictController implements yubo.DictController {
  constructor(
    private $scope: ng.IScope,
    private $timeout: ng.ITimeoutService,
    private store: yubo.DictStore,
    private reducer: yubo.DictReducer
  ) {
    reducer.addObserver(this);
    // run init
    reducer.init();
  }

  // accessor
  get isInEditing() {
    return this.store.isInEditing;
  }
  get message() {
    return this.store.message;
  }
  get gridOptions() {
    return this.store.gridOptions;
  }

  // $onInit
  $onInit(): void {
    this.reducer.onLoad(this.$scope);
  }

  // editing state
  toIsInEditing(): void {
    this.reducer.toIsInEditing();
  }
  clearInEditing(): void {
    this.reducer.clearInEditing();
  }

  // action
  add(): void {
    this.reducer.add();
  }
  remove(): void {
    this.reducer.remove();
  }
  save(): void {
    this.reducer.save();
  }
  cancel(): ng.IPromise<boolean> {
    return this.reducer.cancel();
  }
  dump(): void {
    this.reducer.dump();
  }
  reset(): ng.IPromise<boolean> {
    return this.reducer.reset();
  }
  reload(): void {
    this.reducer.reload();
  }
  tutorial(): void {
    this.reducer.tutorial();
  }

  // store observer
  update(objects: {[key: string]: any}): void {
    this.$timeout(() => { this.$scope.$apply(); });
  }
}

angular.module('dictControllers',
  ['dictStores', 'dictReducers',
   'ui.grid', 'ui.grid.edit', 'ui.grid.rowEdit', 'ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.cellNav',
  ])
  .controller('DictController', [
    '$scope',
    '$timeout',
    'DictStore',
    'DictReducer',
    (
      $scope: ng.IScope,
      $timeout: ng.ITimeoutService,
      store: yubo.DictStore,
      reducer: yubo.DictReducer
    ) => new DictController($scope, $timeout, store, reducer),
  ])
  .filter('mapKind', ['KindHash', (KindHash: yubo.KindHash) => {
    return (input: number) => {
      return KindHash[input]? KindHash[input]: '';
    };
  }]);
