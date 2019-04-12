// controllers
class DictController implements yubo.DictController {
  constructor(
    private $scope: yubo.IDictScope,
    private store: yubo.DictStore,
    private reducer: yubo.DictReducer
  ) {
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
}

angular.module('dictControllers',
  ['dictStores', 'dictReducers',
   'ui.grid', 'ui.grid.edit', 'ui.grid.rowEdit', 'ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.cellNav',
  ])
  .controller('DictController', [
    '$scope',
    'DictStore',
    'DictReducer',
    ($scope: yubo.IDictScope, store: yubo.DictStore, reducer: yubo.DictReducer) => new DictController($scope, store, reducer),
  ])
  .filter('mapKind', ['KindHash', (KindHash: yubo.KindHash) => {
    return (input: number) => {
      return KindHash[input]? KindHash[input]: '';
    };
  }]);
