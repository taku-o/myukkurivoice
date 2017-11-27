var ipcRenderer = require('electron').ipcRenderer
var log = require('electron-log');

// application settings
var appCfg = angular.copy(require('electron').remote.getGlobal('appCfg'));

// handle uncaughtException
process.on('uncaughtException', function(err) {
  log.error('system:event:uncaughtException');
  log.error(err);
  log.error(err.stack);
});

// application config app
angular.module('yvoiceSystem', [])
  .config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  }])
  .controller('SystemController', ['$scope', '$timeout', function($scope, $timeout) {
    // init
    var ctrl = this;
    $timeout(function(){ $scope.$apply(); });
    $scope.appCfg = appCfg;
    $scope.aq10UseKey = appCfg;

    // actions
    ctrl.cancel = function() {
      $scope.appCfg = angular.copy(require('electron').remote.getGlobal('appCfg'));
      var window = require('electron').remote.getCurrentWindow();
      window.close();
    };
    ctrl.save = function() {
      var options = {
        'mainWindow':$scope.appCfg.mainWindow,
        'audioServVer':$scope.appCfg.audioServVer,
        'showMsgPane':$scope.appCfg.showMsgPane,
        'acceptFirstMouse':$scope.appCfg.acceptFirstMouse
      };
      ipcRenderer.send('updateAppConfig', options);
    };
    ctrl.reset = function() {
      ipcRenderer.send('resetAppConfig', '');
    };
  }]);

