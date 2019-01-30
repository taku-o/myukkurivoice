var _ipcRenderer, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };
var _log, log                 = () => { _log = _log || require('electron-log'); return _log; };

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
  .controller('HelpSearchController', ['$scope', function($scope) {

    // init
    const ctrl = this;
    $scope.searchText = '';

    // action
    ctrl.searchInPage = function(): void {
      if ($scope.searchText) {
        ipcRenderer().send('searchInPage', $scope.searchText);
      } else {
        ipcRenderer().send('clearSearch', 'stop');
      }
    };
    ctrl.searchInHelp = function(): void {
      if ($scope.searchText) {
        ipcRenderer().send('searchInHelp', $scope.searchText);
      } else {
        ipcRenderer().send('clearSearch', 'stop');
      }
    };
    ctrl.closeSearchForm = function(): void {
      const window = require('electron').remote.getCurrentWindow();
      window.hide();
    };
  }]);

