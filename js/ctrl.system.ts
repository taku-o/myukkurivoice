// controllers
angular.module('systemControllers', ['systemReducers'])
  .controller('SystemController', ['$scope', 'SystemReducer',
  function($scope: yubo.ISystemScope, reducer: yubo.SystemReducer) {
    // init
    const ctrl = this;

    // $onInit
    this.$onInit = (): void => {
      reducer.onLoad($scope);
    };

    // actions
    ctrl.cancel = function(): void {
      reducer.cancel($scope);
    };
    ctrl.save = function(): void {
      reducer.save($scope);
    };
    ctrl.reset = function(): void {
      reducer.reset();
    };
  }]);
