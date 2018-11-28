var _ipcRenderer, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };
var _log, log                 = () => { _log = _log || require('electron-log'); return _log; };

// handle uncaughtException
process.on('uncaughtException', (err: Error) => {
  log().error('system:event:uncaughtException');
  log().error(err);
  log().error(err.stack);
});

// application config app
angular.module('yvoiceSystem', ['yvoiceLicenseService'])
  .config(['$qProvider', ($qProvider) => {
    $qProvider.errorOnUnhandledRejections(false);
  }])
  .controller('SystemController', ['$scope', '$timeout', 'LicenseService',
  function($scope: yubo.ISystemScope, $timeout, LicenseService: yubo.LicenseService) {

    // init
    const ctrl = this;
    $timeout(() => { $scope.$apply(); });
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
