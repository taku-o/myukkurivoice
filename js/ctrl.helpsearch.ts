// controllers
angular.module('helpSearchControllers', ['helpSearchReducers'])
  .controller('HelpSearchController', ['$scope', 'HelpSearchReducer',
  function($scope: yubo.IHelpSearchScope, reducer: yubo.HelpSearchReducer) {

    // init
    const ctrl = this;
    $scope.searchText = '';

    // action
    ctrl.searchInPage = function(): void {
      reducer.searchInPage($scope);
    };
    ctrl.clearSearchForm = function(): void {
      reducer.clearSearchForm($scope);
    };
    ctrl.closeSearchForm = function(): void {
      const window = require('electron').remote.getCurrentWindow();
      window.hide();
    };
  }]);

