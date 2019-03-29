"use strict";
angular.module('helpControllers', ['helpReducers', 'IncludeDirectives'])
    .controller('HelpController', ['$scope', '$location', 'HelpReducer',
    function ($scope, $location, reducer) {
        var ctrl = this;
        $scope.$location = $location;
        $scope.$on('$locationChangeSuccess', function (event) {
            reducer.locationChangeSuccess($scope);
        });
        $scope.$on('shortcut', function (event, action) {
            reducer.onShortcut($scope, action);
        });
        ctrl.openSearchForm = function () {
            reducer.openSearchForm();
        };
        ctrl.browser = function (url) {
            reducer.browser(url);
        };
        ctrl.showItemInFolder = function (path) {
            reducer.browser(path);
        };
        ctrl.showSystemWindow = function () {
            reducer.showSystemWindow();
        };
    }]);
