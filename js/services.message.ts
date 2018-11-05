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
      record: function(message: string, wavFilePath: string, srcTextPath: string): void {
        const wavFileName = path().basename(wavFilePath);
        const post: yubo.IRecordMessage = {
          created: new Date(),
          body: message,
          wavFilePath: wavFilePath,
          wavFileName: wavFileName,
          srcTextPath: srcTextPath,
          quickLookPath: wavFilePath,
          type: 'record',
        };
        $rootScope.$broadcast('message', post);
        $rootScope.$broadcast('wavGenerated', post);
      },
      recordSource: function(message: string, srcTextPath: string): void {
        const post: yubo.ISourceMessage = {
          created: new Date(),
          body: message,
          srcTextPath: srcTextPath,
          quickLookPath: srcTextPath,
          type: 'source',
        };
        $rootScope.$broadcast('message', post);
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
