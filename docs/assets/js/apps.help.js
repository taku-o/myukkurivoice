"use strict";
angular.module('helpApp', ['IncludeDirectives'])
    .config(['$qProvider', '$compileProvider', function ($qProvider, $compileProvider) {
        $qProvider.errorOnUnhandledRejections(false);
        $compileProvider.debugInfoEnabled(false);
    }])
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
        var ctrl = this;
        $scope.$location = $location;
        $scope.$on('$locationChangeSuccess', function (event) {
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
        ctrl.browser = function (url) {
            $window.open(url);
        };
        ctrl.showItemInFolder = function (path) {
        };
        ctrl.showSystemWindow = function () {
        };
    }]);
