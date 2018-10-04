var _path, path = () => { _path = _path || require('path'); return _path; };

// angular message service
angular.module('yvoiceMessageService', [])
  .factory('MessageService', ['$rootScope', ($rootScope): yubo.MessageService => {
    return {
      action: function(message: string): void {
        const post: yubo.IMessage = {
          created: new Date(),
          body: message,
          type: 'action',
        };
        $rootScope.$broadcast('message', post);
      },
      record: function(message: string, wavFilePath: string): void {
        const wavFileName = path().basename(wavFilePath);
        const post: yubo.IRecordMessage = {
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
        const post: yubo.IMessage = {
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
        const post: yubo.IMessage = {
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
        const post: yubo.IMessage = {
          created: new Date(),
          body: message,
          type: 'syserror',
        };
        $rootScope.$broadcast('message', post);
      },
    };
  }]);
