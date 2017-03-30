var ipcRenderer = require('electron').ipcRenderer
var exec = require('child_process').exec;
var temp = require('temp').track();
var log = require('electron-log');

var app = require('electron').remote.app;
var app_path = app.getAppPath();
var unpacked_path = app_path.replace('app.asar', 'app.asar.unpacked');

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
  .controller('AppcfgController', ['$scope', '$q', '$timeout', function($scope, $q, $timeout) {
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
        'show_msg_pane':$scope.app_cfg.show_msg_pane,
        'debug':$scope.app_cfg.debug
      };
      ipcRenderer.send('updateAppConfig', options);
    };
    ctrl.reset = function() {
      ipcRenderer.send('resetAppConfig', '');
    };

    ctrl.install_ssrc = function() {
      var d = $q.defer();
      temp.mkdir('_myukkurivoice_install_ssrc', function(err, dirPath) {
        if (err) { d.reject(null); return; }

      var cmd_options = {
        cwd: dirPath
      };
      var cmd = '/usr/bin/curl -O http://www.rarewares.org/files/others/ssrc-1.30-macosx.tar.gz';
      exec(cmd, cmd_options, (err, stdout, stderr) => {
        if (err) { d.reject(null); return; }

      var cmd_options = {
        cwd: dirPath
      };
      var cmd = '/usr/bin/tar xzf ssrc-1.30-macosx.tar.gz';
      exec(cmd, cmd_options, (err, stdout, stderr) => {
        if (err) { d.reject(null); return; }

      var cmd = 'cp '+ dirPath+ '/ssrc '+ unpacked_path+ '/vendor/ssrc';
      exec(cmd, {}, (err, stdout, stderr) => {
        if (err) { d.reject(null); return; }
        ipcRenderer.send('finishedToInstall', 'SSRC');
        d.resolve('OK');

      }); // cp
      }); // tar xzf
      }); // curl -O
      }); // temp.mkdir
      return d.promise;
    };
  }]);

