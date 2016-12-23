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

