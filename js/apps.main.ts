var _log :any, log = () => { _log = _log || require('electron-log'); return _log; };

// env
var DEBUG = process.env.DEBUG != null;

// source-map-support
if (DEBUG) {
  try {
    require('source-map-support').install();
  } catch(e) {
    log().error('source-map-support or devtron is not installed.');
  }
}

// angular app
angular.module('mainApp', ['mainControllers', 'mainEvents'])
  // config
  .config(['$qProvider', '$compileProvider', ($qProvider: ng.IQProvider, $compileProvider: ng.ICompileProvider) => {
    $qProvider.errorOnUnhandledRejections(false);
    $compileProvider.debugInfoEnabled(DEBUG);
  }])
  .factory('$exceptionHandler', () => {
    return (exception: Error, cause: string) => {
      log().warn('main:catch angularjs exception: %s, cause:%s', exception, cause);
    };
  });
