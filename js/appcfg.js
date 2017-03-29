var log = require('electron-log');
var Config = require('electron-config');

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
    };
    ctrl.save = function() {
      var config = Config();
      config.set('mainWindow',     $scope.app_cfg.mainWindow);
      config.set('audio_serv_ver', $scope.app_cfg.audio_serv_ver);
      config.set('show_msg_pane',  $scope.app_cfg.show_msg_pane);
      config.set('debug',          $scope.app_cfg.debug);
    };
    ctrl.reset = function() {
      var config = Config();
      config.set('mainWindow',     { width: 800, height: 665 });
      config.set('audio_serv_ver', 'webaudioapi');
      config.set('show_msg_pane',  true);
      config.set('debug',          false);
    };
  }]);

