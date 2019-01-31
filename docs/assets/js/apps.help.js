"use strict";
//var remote = require('electron').remote;
//var app = require('electron').remote.app;
//var _ipcRenderer, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };
//var _shell, shell             = () => { _shell = _shell || require('electron').shell; return _shell; };
//var _log, log                 = () => { _log = _log || require('electron-log'); return _log; };
//
//var homeDir = app.getPath('home');
//
//// env
//var DEBUG = process.env.DEBUG != null;
//
//// source-map-support
//if (DEBUG) {
//  try {
//    require('source-map-support').install();
//  } catch(e) {
//    log().error('source-map-support or devtron is not installed.');
//  }
//}
// help app
angular.module('helpApp', ['IncludeDirectives'])
    .config(['$qProvider', function ($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
    }])
    //.factory('$exceptionHandler', () => {
    //  return (exception, cause) => {
    //    log().warn('help:catch angularjs exception: %s, cause:%s', exception, cause);
    //  };
    //})
    .controller('HelpController', ['$scope', '$timeout', '$location', '$window',
    function ($scope, $timeout, $location, $window) {
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
            'multivoice',
            'dictionary',
            'history',
            'shortcut',
            'help',
            'expand',
        ];
        // init
        var ctrl = this;
        $scope.$location = $location;
        // event url hash changed
        $scope.$on('$locationChangeSuccess', function (event) {
            // fix broken url
            if ($location.url().startsWith('/%23')) {
                $window.location.href = $location.absUrl().replace('%23', '#');
                return;
            }
            var hash = $location.hash();
            if (menuList.includes(hash)) {
                $scope.display = hash;
            }
            else {
                $scope.display = 'about';
            }
            $timeout(function () { $scope.$apply(); });
        });
        //// shortcut
        //ipcRenderer().on('shortcut', (event, action) => {
        //  switch (action) {
        //    case 'moveToPreviousHelp':
        //      moveToPreviousHelp();
        //      $timeout(() => { $scope.$apply(); });
        //      break;
        //    case 'moveToNextHelp':
        //      moveToNextHelp();
        //      $timeout(() => { $scope.$apply(); });
        //      break;
        //    case 'openSearchForm':
        //      ctrl.openSearchForm();
        //      $timeout(() => { $scope.$apply(); });
        //      break;
        //    case 'closeSearchForm':
        //      ctrl.closeSearchForm();
        //      $timeout(() => { $scope.$apply(); });
        //      break;
        //  }
        //});
        //function moveToPreviousHelp(): void {
        //  const index = menuList.indexOf($scope.display);
        //  const moved = index - 1;
        //  if (index < 0) {
        //    $location.hash(menuList[0]);
        //  } else if (moved < 0) {
        //    $location.hash(menuList[menuList.length - 1]);
        //  } else {
        //    $location.hash(menuList[moved]);
        //  }
        //}
        //function moveToNextHelp(): void {
        //  const index = menuList.indexOf($scope.display);
        //  const moved = index + 1;
        //  if (index < 0) {
        //    $location.hash(menuList[0]);
        //  } else if (moved >= menuList.length) {
        //    $location.hash(menuList[0]);
        //  } else {
        //    $location.hash(menuList[moved]);
        //  }
        //}
        //// helpsearch
        //ipcRenderer().on('helpsearch', (event, action) => {
        //  switch (action.task) {
        //    case 'searchInPage':
        //      remote.getCurrentWebContents().findInPage(action.searchText);
        //      $timeout(() => { $scope.$apply(); });
        //      break;
        //      {
        //        const hash = $location.hash();
        //        if (hash != 'expand') {
        //          $location.hash('expand');
        //        }
        //      }
        //      remote.getCurrentWebContents().findInPage(action.searchText);
        //      $timeout(() => { $scope.$apply(); });
        //      break;
        //    case 'clearSelection':
        //      remote.getCurrentWebContents().stopFindInPage('clearSelection');
        //      $timeout(() => { $scope.$apply(); });
        //      break;
        //  }
        //});
        // action
        //ctrl.openSearchForm = function(): void {
        //  ipcRenderer().send('showHelpSearchDialog', 'show help search dialog');
        //};
        ctrl.browser = function (url) {
            //shell().openExternal(url);
            $window.open(url);
        };
        ctrl.showItemInFolder = function (path) {
            //const expanded = path.replace('$HOME', homeDir);
            //shell().showItemInFolder(expanded);
        };
        ctrl.showSystemWindow = function () {
            //ipcRenderer().send('showSystemWindow', 'system');
        };
    }]);
