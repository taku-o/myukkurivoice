var ipcRenderer = require('electron').ipcRenderer
var log = require('electron-log');

// application settings
var app_cfg = angular.copy(require('electron').remote.getGlobal('app_cfg'));

// handle uncaughtException
process.on('uncaughtException', function(err) {
  log.error('appcfg:event:uncaughtException');
  log.error(err);
  log.error(err.stack);
});

// application config app
angular.module('yvoiceAppCfg', [])
  .config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  }])
  .controller('AppcfgController', ['$scope', '$timeout', function($scope, $timeout) {
    // init
    var ctrl = this;
    $timeout(function(){ $scope.$apply(); });
    $scope.app_cfg = app_cfg;

    // actions
    ctrl.cancel = function() {
      $scope.app_cfg = angular.copy(require('electron').remote.getGlobal('app_cfg'));
      var window = require('electron').remote.getCurrentWindow();
      window.close();
    };
    ctrl.save = function() {
      var options = {
        'mainWindow':$scope.app_cfg.mainWindow,
        'audio_serv_ver':$scope.app_cfg.audio_serv_ver,
        'show_msg_pane':$scope.app_cfg.show_msg_pane
      };
      ipcRenderer.send('updateAppConfig', options);
    };
    ctrl.reset = function() {
      ipcRenderer.send('resetAppConfig', '');
    };
  }]);

