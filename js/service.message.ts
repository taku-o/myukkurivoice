var _path: any, path = () => { _path = _path || require('path'); return _path; };

// angular message service
class MessageService implements yubo.MessageService {
  constructor(
    private $rootScope: ng.IRootScopeService
  ) {}

  action(message: string): void {
    const post: yubo.IMessage = {
      created: new Date(),
      body: message,
      type: 'action',
    };
    this.$rootScope.$broadcast('message', post);
  }

  record(message: string, opts:{wavFilePath: string, srcTextPath: string, source: string, encoded: string, duration: number}): void {
    const wavFileName = path().basename(opts.wavFilePath);
    const post: yubo.IRecordMessage = {
      created: new Date(),
      body: message,
      wavFilePath: opts.wavFilePath,
      wavFileName: wavFileName,
      srcTextPath: opts.srcTextPath,
      quickLookPath: opts.wavFilePath,
      source: opts.source,
      encoded: opts.encoded,
      duration: opts.duration,
      type: 'record',
    };
    this.$rootScope.$broadcast('message', post);
    this.$rootScope.$broadcast('wavGenerated', post);
  }

  recordSource(message: string, opts: {srcTextPath: string, source: string}): void {
    const post: yubo.ISourceMessage = {
      created: new Date(),
      body: message,
      srcTextPath: opts.srcTextPath,
      quickLookPath: opts.srcTextPath,
      source: opts.source,
      type: 'source',
    };
    this.$rootScope.$broadcast('message', post);
  }

  info(message: string): void {
    const post: yubo.IMessage = {
      created: new Date(),
      body: message,
      type: 'info',
    };
    this.$rootScope.$broadcast('message', post);
  }

  error(message: string, err: Error | null = null): void {
    if (err) {
      message = message + err.message;
    }
    const post: yubo.IMessage = {
      created: new Date(),
      body: message,
      type: 'error',
    };
    this.$rootScope.$broadcast('message', post);
  }

  syserror(message: string, err: Error | null = null): void {
    if (err) {
      message = message + err.message;
    }
    const post: yubo.IMessage = {
      created: new Date(),
      body: message,
      type: 'syserror',
    };
    this.$rootScope.$broadcast('message', post);
  }
}

angular.module('MessageServices', [])
  .service('MessageService', [
    '$rootScope',
    MessageService,
  ]);
