
// application spec app
angular.module('yvoiceSpec', ['yvoiceService', 'yvoiceLicenseService'])
  .config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  }])
  .controller('SpecController', ['$scope', 'LicenseService', 'AppUtilService', 'SeqFNameService',
      function($scope, LicenseService, AppUtilService, SeqFNameService) {

    // init
    var ctrl = this;

    // LicenseService
    ctrl.encrypt = function() {
      var r = LicenseService.encrypt($scope.passPhrase, $scope.plainKey);
      $scope.encryptedKey = r;
    };
    ctrl.decrypt = function() {
      var r = LicenseService.decrypt($scope.passPhrase, $scope.encryptedKey);
      $scope.plainKey = r;
    };
    ctrl.consumerKey = function() {
      LicenseService.consumerKey($scope.lisenceType).then(
        function(value) {
          $scope.consumerKeyResult = value;
        },
        function(err) {
        });
    };

    // AppUtilService
    ctrl.disableRhythm = function() {
      var r = AppUtilService.disableRhythm($scope.rhythmText);
      $scope.disableRhythmResult = r;
    };

    // SeqFNameService
    ctrl.nextFname = function() {
      var r = SeqFNameService.nextFname($scope.prefix, $scope.num);
      $scope.nextFnameResult = r;
    };

  }]);

