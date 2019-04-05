// controllers
angular.module('dictControllers',
  ['dictReducers',
   'ui.grid', 'ui.grid.edit', 'ui.grid.rowEdit', 'ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.cellNav',
  ])
  .controller('DictController', ['$scope', 'DictReducer',
    function($scope: yubo.IDictScope, reducer: yubo.DictReducer) {

    // menu event bridge
    $scope.$on('menu', (event: ng.IAngularEvent, action: string) => {
      reducer.onMenu($scope, action);
    });

    // init
    const ctrl = this;
    $scope.isInEditing = false;
    $scope.message = '';
    $scope.alwaysOnTop = false;

    // $onInit
    this.$onInit = (): void => {
      reducer.onLoad($scope);
    };

    // editing state
    ctrl.toIsInEditing = function(): void {
      reducer.toIsInEditing($scope);
    };
    ctrl.clearInEditing = function(): void {
      reducer.clearInEditing($scope);
    };

    // action
    ctrl.add = function(): void {
      reducer.add($scope);
    };
    ctrl.delete = function(): void {
      reducer.remove($scope);
    };
    ctrl.save = function(): void {
      reducer.save($scope);
    };
    ctrl.cancel = function(): ng.IPromise<boolean> {
      return reducer.cancel($scope);
    };
    ctrl.export = function(): void {
      reducer.dump($scope);
    };
    ctrl.reset = function(): ng.IPromise<boolean> {
      return reducer.reset($scope);
    };
    ctrl.reload = function(): void {
      reducer.reload($scope);
    };
    ctrl.tutorial = function(): void {
      reducer.tutorial();
    };

    // run init
    reducer.init($scope);
  }])
  .filter('mapKind', ['KindHash', (KindHash: yubo.KindHash) => {
    return (input: number) => {
      return KindHash[input]? KindHash[input]: '';
    };
  }]);
