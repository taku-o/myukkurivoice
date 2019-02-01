var _log, log = () => { _log = _log || require('electron-log'); return _log; };

// env
var DEBUG = process.env.DEBUG != null;

// source-map-support
if (DEBUG) {
  try {
    require('source-map-support').install();
  } catch(e) {
    log().error('source-map-support or devtron is not installed.');
  }
}
// help search app
angular.module('helpSearchApp', [])
  .config(['$qProvider', ($qProvider) => {
    $qProvider.errorOnUnhandledRejections(false);
  }])
  .factory('$exceptionHandler', () => {
    return (exception, cause) => {
      log().warn('helpsearch:catch angularjs exception: %s, cause:%s', exception, cause);
    };
  })
  .controller('HelpSearchController', ['$scope', '$window', function($scope, $window) {

    // init
    const ctrl = this;
    $scope.searchText = '';

    // event
    $window.onfocus = function(){
      document.getElementById('search-text').focus();
    }

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

