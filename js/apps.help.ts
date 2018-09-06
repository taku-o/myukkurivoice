var app = require('electron').remote.app;
var ipcRenderer = require('electron').ipcRenderer;
var shell = require('electron').shell;
var log = require('electron-log');

var homeDir = app.getPath('home');

// handle uncaughtException
process.on('uncaughtException', (err) => {
  log.error('help:event:uncaughtException');
  log.error(err);
  log.error(err.stack);
});

// help app
angular.module('yvoiceAppHelp', [])
  .config(['$qProvider', ($qProvider) => {
    $qProvider.errorOnUnhandledRejections(false);
  }])
  .controller('HelpController', ['$scope', '$timeout', '$location',
                         function($scope, $timeout, $location) {

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
      'shortcut',
      'help',
    ];

    // init
    const ctrl = this;
    $scope.$location = $location;

    // event url hash changed
    $scope.$on('$locationChangeSuccess', (event) => {
      const hash = $location.hash();
      if (menuList.includes(hash)) {
        $scope.display = hash;
      } else {
        $scope.display = 'about';
      }
      $timeout(() => { $scope.$apply(); });
    });

    // shortcut
    ipcRenderer.on('shortcut', (event, action) => {
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
      shell.openExternal(url);
    };
    ctrl.showItemInFolder = function(path): void {
      const expanded = path.replace('$HOME', homeDir);
      shell.showItemInFolder(expanded);
    };
    ctrl.showSystemWindow = function(): void {
      ipcRenderer.send('showSystemWindow', 'system');
    };
  }]);

