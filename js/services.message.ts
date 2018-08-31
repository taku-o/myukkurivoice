var path = require('path');

// angular message service
angular.module('yvoiceMessageService', [])
  .factory('MessageService', ['$rootScope', ($rootScope): yubo.MessageService => {
    return {
      action: function(message: string): void {
        var post: yubo.IMessage = {
          created: new Date(),
          body: message,
          type: 'action',
        };
        $rootScope.$broadcast('message', post);
      },
      record: function(message: string, wavFilePath: string): void {
        var wavFileName = path.basename(wavFilePath);
        var post: yubo.IRecordMessage = {
          created: new Date(),
          body: message,
          wavFilePath: wavFilePath,
          wavFileName: wavFileName,
          type: 'record',
        };
        $rootScope.$broadcast('message', post);
        $rootScope.$broadcast('wavGenerated', post);
      },
      info: function(message: string): void {
        var post: yubo.IMessage = {
          created: new Date(),
          body: message,
          type: 'info',
        };
        $rootScope.$broadcast('message', post);
      },
      error: function(message: string, err: Error = null): void {
        if (err) {
          message = message + err.message;
        }
        var post: yubo.IMessage = {
          created: new Date(),
          body: message,
          type: 'error',
        };
        $rootScope.$broadcast('message', post);
      },
      syserror: function(message: string, err: Error = null): void {
        if (err) {
          message = message + err.message;
        }
        var post: yubo.IMessage = {
          created: new Date(),
          body: message,
          type: 'syserror',
        };
        $rootScope.$broadcast('message', post);
      },
    };
  }]);
