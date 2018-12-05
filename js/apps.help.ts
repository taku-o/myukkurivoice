var app = require('electron').remote.app;
var _ipcRenderer, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };
var _shell, shell             = () => { _shell = _shell || require('electron').shell; return _shell; };
var _log, log                 = () => { _log = _log || require('electron-log'); return _log; };

var homeDir = app.getPath('home');

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
// help app
angular.module('helpApp', [])
  .config(['$qProvider', ($qProvider) => {
    $qProvider.errorOnUnhandledRejections(false);
  }])
  .factory('$exceptionHandler', () => {
    return (exception, cause) => {
      log().warn('help:catch angularjs exception: %s, cause:%s', exception, cause);
    };
  })
  .controller('HelpController', ['$scope', '$timeout', '$location', '$window',
  function($scope: yubo.IHelpScope, $timeout, $location, $window) {

    const menuList = [
      'about',
      'voicecode',
      'trouble',
      'update',
      'uninstall',
      'backup',
      'license',
      'contact',
      'funclist',
      'play',
      'tuna',
      'writing',
      'dataconfig',
      'dragout',
      'multivoice',
      'dictionary',
      'shortcut',
      'help',
    ];

    // init
    const ctrl = this;
    $scope.$location = $location;

    // event url hash changed
    $scope.$on('$locationChangeSuccess', (event) => {
      // fix broken url
      if ($location.url().startsWith('/%23')) {
        $window.location.href = $location.absUrl().replace('%23', '#');
        return;
      }

      const hash = $location.hash();
      if (menuList.includes(hash)) {
        $scope.display = hash;
      } else {
        $scope.display = 'about';
      }
      $timeout(() => { $scope.$apply(); });
    });

    // shortcut
    ipcRenderer().on('shortcut', (event, action) => {
      switch (action) {
        case 'moveToPreviousHelp':
          moveToPreviousHelp();
          $timeout(() => { $scope.$apply(); });
          break;
        case 'moveToNextHelp':
          moveToNextHelp();
          $timeout(() => { $scope.$apply(); });
          break;
      }
    });
    function moveToPreviousHelp(): void {
      const index = menuList.indexOf($scope.display);
      const moved = index - 1;
      if (index < 0) {
        $location.hash(menuList[0]);
      } else if (moved < 0) {
        $location.hash(menuList[menuList.length - 1]);
      } else {
        $location.hash(menuList[moved]);
      }
    }
    function moveToNextHelp(): void {
      const index = menuList.indexOf($scope.display);
      const moved = index + 1;
      if (index < 0) {
        $location.hash(menuList[0]);
      } else if (moved >= menuList.length) {
        $location.hash(menuList[0]);
      } else {
        $location.hash(menuList[moved]);
      }
    }

    // action
    ctrl.browser = function(url): void {
      shell().openExternal(url);
    };
    ctrl.showItemInFolder = function(path): void {
      const expanded = path.replace('$HOME', homeDir);
      shell().showItemInFolder(expanded);
    };
    ctrl.showSystemWindow = function(): void {
      ipcRenderer().send('showSystemWindow', 'system');
    };
  }]);

