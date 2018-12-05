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

// application config app
angular.module('systemApp', ['LicenseServices'])
  .config(['$qProvider', ($qProvider) => {
    $qProvider.errorOnUnhandledRejections(false);
  }])
  .factory('$exceptionHandler', () => {
    return (exception, cause) => {
      log().warn('system:catch angularjs exception: %s, cause:%s', exception, cause);
    };
  })
  .controller('SystemController', ['$scope', 'LicenseService',
  function($scope: yubo.ISystemScope, LicenseService: yubo.LicenseService) {

    // init
    const ctrl = this;
    let appCfg = require('electron').remote.getGlobal('appCfg');
    $scope.appCfg = appCfg;
    $scope.aq10UseKey = appCfg.aq10UseKeyEncrypted?
      LicenseService.decrypt(appCfg.passPhrase, appCfg.aq10UseKeyEncrypted):
      '';

    // actions
    ctrl.cancel = function(): void {
      $scope.appCfg = angular.copy(require('electron').remote.getGlobal('appCfg'));
      const window = require('electron').remote.getCurrentWindow();
      window.close();
    };
    ctrl.save = function(): void {
      const aq10UseKeyEncrypted = $scope.aq10UseKey?
        LicenseService.encrypt($scope.appCfg.passPhrase, $scope.aq10UseKey):
        '';
      const options = {
        'mainWindow':$scope.appCfg.mainWindow,
        'audioServVer':$scope.appCfg.audioServVer,
        'showMsgPane':$scope.appCfg.showMsgPane,
        'passPhrase':$scope.appCfg.passPhrase,
        'aq10UseKeyEncrypted':aq10UseKeyEncrypted,
      };
      ipcRenderer().send('updateAppConfig', options);
    };
    ctrl.reset = function(): void {
      ipcRenderer().send('resetAppConfig', '');
    };
  }]);
