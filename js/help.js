var log = require('electron-log');

// handle uncaughtException
process.on('uncaughtException', function(err) {
  log.error('help:event:uncaughtException');
  log.error(err);
  log.error(err.stack);
});

// help app
angular.module('yvoiceAppHelp', [])
  .config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  }])
  .controller('HelpController', ['$scope', '$timeout', function($scope, $timeout) {
    // init
    var ctrl = this;
    $scope.display = 'about';
    $timeout(function(){ $scope.$apply(); });

    ctrl.browser = function(url) {
      require('electron').shell.openExternal(url);
    };
  }]);

