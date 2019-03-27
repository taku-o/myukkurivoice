
// controllers
angular.module('helpSearchControllers', [])
  .controller('HelpSearchController', ['$scope', '$window', function($scope: yubo.IHelpSearchScope, $window: ng.IWindowService) {

    // init
    const ctrl = this;
    $scope.searchText = '';

    // event
    $window.onfocus = function(){
      document.getElementById('search-text').focus();
    };

    // action
    ctrl.searchInPage = function(): void {
      const win = require('electron').remote.getCurrentWindow();
      if ($scope.searchText) {
        win.getParentWindow().webContents.findInPage($scope.searchText);
      } else {
        win.getParentWindow().webContents.stopFindInPage('clearSelection');
      }
    };
    ctrl.clearSearchForm = function(): void {
      $scope.searchText = '';
      const win = require('electron').remote.getCurrentWindow();
      win.getParentWindow().webContents.stopFindInPage('clearSelection');
    };
    ctrl.closeSearchForm = function(): void {
      const window = require('electron').remote.getCurrentWindow();
      window.hide();
    };
  }]);

