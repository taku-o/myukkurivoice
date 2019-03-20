var _log, log = () => { _log = _log || require('electron-log'); return _log; };

// env
var DEBUG = process.env.DEBUG != null;
var CONSOLELOG = process.env.CONSOLELOG != null;

// source-map-support
if (DEBUG) {
  try {
    require('source-map-support').install();
  } catch(e) {
    log().error('source-map-support or devtron is not installed.');
  }
}
// replace renderer console log
if (CONSOLELOG) {
  const remoteConsole = require('electron').remote.require('console');
  console = remoteConsole;
}

// help search app
angular.module('helpSearchApp', [])
  .config(['$qProvider', '$compileProvider', ($qProvider: ng.IQProvider, $compileProvider: ng.ICompileProvider) => {
    $qProvider.errorOnUnhandledRejections(false);
    $compileProvider.debugInfoEnabled(DEBUG);
  }])
  .factory('$exceptionHandler', () => {
    return (exception: Error, cause: string) => {
      log().warn('helpsearch:catch angularjs exception: %s, cause:%s', exception, cause);
    };
  })
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

