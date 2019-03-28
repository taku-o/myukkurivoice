// action reducer
angular.module('helpSearchReducers', [])
  .service('HelpSearchReducer', [
    class HelpSearchReducer {
      constructor() {}

      searchInPage($scope): void {
        const win = require('electron').remote.getCurrentWindow();
        if ($scope.searchText) {
          win.getParentWindow().webContents.findInPage($scope.searchText);
        } else {
          win.getParentWindow().webContents.stopFindInPage('clearSelection');
        }
      }
      clearSearchForm($scope): void {
        $scope.searchText = '';
        const win = require('electron').remote.getCurrentWindow();
        win.getParentWindow().webContents.stopFindInPage('clearSelection');
      }
    }
  ]);

