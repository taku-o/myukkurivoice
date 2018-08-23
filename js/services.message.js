var path = require('path');

// angular message service
angular.module('yvoiceMessageService', [])
  .factory('MessageService', ['$rootScope', function($rootScope) {
    return {
      action: function(message) {
        var post = {
          created: new Date(),
          body: message,
          type: 'action',
        };
        $rootScope.$broadcast('message', post);
      },
      record: function(message, wavFilePath) {
        var wavFileName = path.basename(wavFilePath);
        var post = {
          created: new Date(),
          body: message,
          wavFilePath: wavFilePath,
          wavFileName: wavFileName,
          type: 'record',
        };
        $rootScope.$broadcast('message', post);
        $rootScope.$broadcast('wavGenerated', post);
      },
      info: function(message) {
        var post = {
          created: new Date(),
          body: message,
          type: 'info',
        };
        $rootScope.$broadcast('message', post);
      },
      error: function(message) {
        var post = {
          created: new Date(),
          body: message,
          type: 'error',
        };
        $rootScope.$broadcast('message', post);
      },
      syserror: function(message, err = null) {
        if (err) {
          message = message + err.message;
        }
        var post = {
          created: new Date(),
          body: message,
          type: 'syserror',
        };
        $rootScope.$broadcast('message', post);
      },
    };
  }]);
