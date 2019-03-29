// action reducer
class HelpSearchReducer implements yubo.HelpSearchReducer {
  constructor() {}

  searchInPage($scope: yubo.IHelpSearchScope): void {
    const win = require('electron').remote.getCurrentWindow();
    if ($scope.searchText) {
      win.getParentWindow().webContents.findInPage($scope.searchText);
    } else {
      win.getParentWindow().webContents.stopFindInPage('clearSelection');
    }
  }
  clearSearchForm($scope: yubo.IHelpSearchScope): void {
    $scope.searchText = '';
    const win = require('electron').remote.getCurrentWindow();
    win.getParentWindow().webContents.stopFindInPage('clearSelection');
  }
}

angular.module('helpSearchReducers', [])
  .service('HelpSearchReducer', [
    HelpSearchReducer
  ]);
