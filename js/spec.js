
// application spec app
angular.module('yvoiceSpec', ['yvoiceLicenseService'])
  .config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  }])
  .controller('SpecController', ['$scope', 'LicenseService',
      function($scope, LicenseService) {

    // init
    var ctrl = this;
    $scope.source = 'aaaaaaaaaaa';


//      encrypt: function(passPhrase, plainKey) {
//        return encrypt(passPhrase, plainKey);
//      },
//      decrypt: function(passPhrase, encryptedKey) {
//        return decrypt(passPhrase, encryptedKey);
//      },
//      consumerKey: function(lisenceType) {
 

  }]);

