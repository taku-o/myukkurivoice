var _log, log = () => { _log = _log || require('electron-log'); return _log; };

// env
var DEBUG = process.env.DEBUG != null;
var CONSOLELOG = process.env.CONSOLELOG != null;

// source-map-support
if (DEBUG) {
  try {
    require('source-map-support').install();
  } catch(e) {
    log().error('source-map-support or devtron is not installed.');
  }
}
// replace renderer console log, and disable file log
if (CONSOLELOG) {
  const remoteConsole = require('electron').remote.require('console');
  /* eslint-disable-next-line no-global-assign */
  console = remoteConsole;
  delete log().transports['file'];
}

// angular app
angular.module('helpApp', ['helpControllers'])
  // config
  .config(['$qProvider', '$compileProvider', ($qProvider: ng.IQProvider, $compileProvider: ng.ICompileProvider) => {
    $qProvider.errorOnUnhandledRejections(false);
    $compileProvider.debugInfoEnabled(DEBUG);
  }])
  .factory('$exceptionHandler', () => {
    return (exception: Error, cause: string) => {
      log().warn('help:catch angularjs exception: %s, cause:%s', exception, cause);
    };
  });

