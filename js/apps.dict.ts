var _log: any, log         = () => { _log = _log || require('electron-log'); return _log; };
var _monitor: any, monitor = () => { _monitor = _monitor || require('@taku-o/electron-performance-monitor'); return _monitor; };

// env
var DEBUG = process.env.DEBUG != null;
var CONSOLELOG = process.env.CONSOLELOG != null;
var MONITOR = process.env.MONITOR != null;

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
// perfomance monitoring
if (MONITOR) { log().warn(monitor().format('apps.dict', '---- start')); }

// angular app
angular.module('dictApp', ['dictControllers', 'dictEvents', 'shortcutHintEvents'])
  // config
  .config(['$qProvider', '$compileProvider', ($qProvider: ng.IQProvider, $compileProvider: ng.ICompileProvider) => {
    $qProvider.errorOnUnhandledRejections(false);
    $compileProvider.debugInfoEnabled(DEBUG);
  }])
  .factory('$exceptionHandler', () => {
    return (exception: Error, cause: string) => {
      log().warn('dict:catch angularjs exception: %s, cause:%s', exception, cause);
    };
  });

