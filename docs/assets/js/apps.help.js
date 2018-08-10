//var app = require('electron').remote.app;
//var ipcRenderer = require('electron').ipcRenderer;
//var log = require('electron-log');
//
//var homeDir = app.getPath('home');
//
//// handle uncaughtException
//process.on('uncaughtException', function(err) {
//  log.error('help:event:uncaughtException');
//  log.error(err);
//  log.error(err.stack);
//});

// help app
angular.module('yvoiceAppHelp', [])
  .config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  }])
  .controller('HelpController', ['$scope', '$timeout', '$location', function($scope, $timeout, $location) {

    var menuList = [
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
      'shortcut',
      'help'
    ];

    // init
    var ctrl = this;
    $scope.$location = $location;

    // event url hash changed
    $scope.$on('$locationChangeSuccess', function(event) {
      var hash = $location.hash();
      if (menuList.includes(hash)) {
        $scope.display = hash;
      } else {
        $scope.display = 'about';
      }
      $timeout(function(){ $scope.$apply(); });
    });

    //// shortcut
    //ipcRenderer.on('shortcut', function (event, action) {
    //  switch (action) {
    //    case 'moveToPreviousHelp':
    //      moveToPreviousHelp();
    //      $timeout(function(){ $scope.$apply(); });
    //      break;
    //    case 'moveToNextHelp':
    //      moveToNextHelp();
    //      $timeout(function(){ $scope.$apply(); });
    //      break;
    //  }
    //});
    function moveToPreviousHelp() {
      var index = menuList.indexOf($scope.display);
      var moved = index - 1;
      if (index < 0) {
        $location.hash(menuList[0]);
      } else if (moved < 0) {
        $location.hash(menuList[menuList.length - 1]);
      } else {
        $location.hash(menuList[moved]);
      }
    };
    function moveToNextHelp() {
      var index = menuList.indexOf($scope.display);
      var moved = index + 1;
      if (index < 0) {
        $location.hash(menuList[0]);
      } else if (moved >= menuList.length) {
        $location.hash(menuList[0]);
      } else {
        $location.hash(menuList[moved]);
      }
    };

    // action
    ctrl.browser = function(url) {
      //require('electron').shell.openExternal(url);
      window.location.href = url;
    };
    ctrl.showItemInFolder = function(path) {
      //var expanded = path.replace('\$HOME', homeDir);
      //require('electron').shell.showItemInFolder(expanded);
    };
    ctrl.showSystemWindow = function() {
      //ipcRenderer.send('showSystemWindow', 'system');
    };
  }]);

