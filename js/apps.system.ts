var ipcRenderer = require('electron').ipcRenderer;
var log = require('electron-log');

// application settings
var appCfg = angular.copy(require('electron').remote.getGlobal('appCfg'));

// handle uncaughtException
process.on('uncaughtException', (err) => {
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
                           function($scope, $timeout, LicenseService) {

    // init
    var ctrl = this;
    $timeout(() => { $scope.$apply(); });
    $scope.appCfg = appCfg;
    $scope.aq10UseKey = appCfg.aq10UseKeyEncrypted?
      LicenseService.decrypt(appCfg.passPhrase, appCfg.aq10UseKeyEncrypted):
      '';

    // actions
    ctrl.cancel = function(): void {
      $scope.appCfg = angular.copy(require('electron').remote.getGlobal('appCfg'));
      var window = require('electron').remote.getCurrentWindow();
      window.close();
    };
    ctrl.save = function(): void {
      var aq10UseKeyEncrypted = $scope.aq10UseKey?
        LicenseService.encrypt($scope.appCfg.passPhrase, $scope.aq10UseKey):
        '';
      var options = {
        'mainWindow':$scope.appCfg.mainWindow,
        'audioServVer':$scope.appCfg.audioServVer,
        'showMsgPane':$scope.appCfg.showMsgPane,
        'acceptFirstMouse':$scope.appCfg.acceptFirstMouse,
        'passPhrase':$scope.appCfg.passPhrase,
        'aq10UseKeyEncrypted':aq10UseKeyEncrypted
      };
      ipcRenderer.send('updateAppConfig', options);
    };
    ctrl.reset = function(): void {
      ipcRenderer.send('resetAppConfig', '');
    };
  }]);

