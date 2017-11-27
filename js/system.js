var ipcRenderer = require('electron').ipcRenderer
var log = require('electron-log');
var cryptico = require("cryptico.js");

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
    // encrypt / decrypt
    this.encrypt = function(passPhrase, plainKey) {
      var bits = 1024;
      var mattsRSAkey = cryptico.generateRSAKey(passPhrase, bits);
      var mattsPublicKeyString = cryptico.publicKeyString(mattsRSAkey);
      var encryptionResult = cryptico.encrypt(plainKey, mattsPublicKeyString);
      return encryptionResult.cipher;
    };
    this.decrypt = function(passPhrase, encryptedKey) {
      var bits = 1024;
      var mattsRSAkey = cryptico.generateRSAKey(passPhrase, bits);
      var decryptionResult = cryptico.decrypt(encryptedKey, mattsRSAkey);
      if (decryptionResult.status == 'success' && decryptionResult.signature == 'verified') {
        // ok
      } else {
        return '';
      }
      return decryptionResult.plaintext;
    };

    // init
    var ctrl = this;
    $timeout(function(){ $scope.$apply(); });
    $scope.appCfg = appCfg;
    $scope.aq10UseKey = this.decrypt(appCfg.passPhrase, appCfg.aq10UseKeyEncrypted);

    // actions
    ctrl.cancel = function() {
      $scope.appCfg = angular.copy(require('electron').remote.getGlobal('appCfg'));
      var window = require('electron').remote.getCurrentWindow();
      window.close();
    };
    ctrl.save = function() {
      var aq10UseKeyEncrypted = this.decrypt($scope.appCfg.passPhrase, $scope.aq10UseKey);
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
    ctrl.reset = function() {
      ipcRenderer.send('resetAppConfig', '');
    };
  }]);

