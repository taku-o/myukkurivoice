var path = require('path');

// angular message service
angular.module('yvoiceMessageService', [])
  .factory('MessageService', ['$rootScope', ($rootScope) => {
    return {
        action: function(message): void {
        var post: myv.IMessage = {
          created: new Date(),
          body: message,
          type: 'action',
        };
        $rootScope.$broadcast('message', post);
      },
      record: function(message, wavFilePath): void {
        var wavFileName = path.basename(wavFilePath);
        var post: myv.IRecordMessage = {
          created: new Date(),
          body: message,
          wavFilePath: wavFilePath,
          wavFileName: wavFileName,
          type: 'record',
        };
        $rootScope.$broadcast('message', post);
        $rootScope.$broadcast('wavGenerated', post);
      },
      info: function(message): void {
        var post: myv.IMessage = {
          created: new Date(),
          body: message,
          type: 'info',
        };
        $rootScope.$broadcast('message', post);
      },
      error: function(message): void {
        var post: myv.IMessage = {
          created: new Date(),
          body: message,
          type: 'error',
        };
        $rootScope.$broadcast('message', post);
      },
      syserror: function(message, err = null): void {
        if (err) {
          message = message + err.message;
        }
        var post: myv.IMessage = {
          created: new Date(),
          body: message,
          type: 'syserror',
        };
        $rootScope.$broadcast('message', post);
      },
    };
  }]);

namespace myv {
  export interface IMessage {
    readonly created: Date;
    readonly body: string;
    readonly type: string;
  }

  export interface IRecordMessage {
    readonly created: Date;
    readonly body: string;
    readonly wavFilePath: string;
    readonly wavFileName: string;
    readonly type: string;
  }
}
