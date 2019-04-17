var _ipcRenderer, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };
var _log, log                 = () => { _log = _log || require('electron-log'); return _log; };
var _monitor, monitor         = () => { _monitor = _monitor || require('electron-performance-monitor'); return _monitor; };

// env
var DEBUG = process.env.DEBUG != null;
var MONITOR = process.env.MONITOR != null;

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

// perfomance monitoring
if (MONITOR) {
  angular.module('mainApp')
    .directive('afterRender', [() => {
      return {
        restrict: 'A',
        link: (scope, element, attrs) => {
          (angular as any).getTestability(element).whenStable(() => {
            log().warn(monitor().format('apps.main', 'app launch finished'));
          });
        },
      };
    }]);
}
