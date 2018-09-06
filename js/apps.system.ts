var ipcRenderer = require('electron').ipcRenderer;
var remote = require('electron').remote;
var log = require('electron-log');

// application settings
var appCfg = angular.copy(remote.getGlobal('appCfg'));

// handle uncaughtException
process.on('uncaughtException', (err: Error) => {
  log.error('system:event:uncaughtException');
  log.error(err);
  log.error(err.stack);
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
    $scope.appCfg = appCfg;
    $scope.aq10UseKey = appCfg.aq10UseKeyEncrypted?
      LicenseService.decrypt(appCfg.passPhrase, appCfg.aq10UseKeyEncrypted):
      '';

    // actions
    ctrl.cancel = function(): void {
      $scope.appCfg = angular.copy(remote.getGlobal('appCfg'));
      const window = remote.getCurrentWindow();
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
        'acceptFirstMouse':$scope.appCfg.acceptFirstMouse,
        'passPhrase':$scope.appCfg.passPhrase,
        'aq10UseKeyEncrypted':aq10UseKeyEncrypted,
      };
      ipcRenderer.send('updateAppConfig', options);
    };
    ctrl.reset = function(): void {
      ipcRenderer.send('resetAppConfig', '');
    };
  }]);

