"use strict";
angular.module('helpControllers', ['helpReducers', 'IncludeDirectives'])
    .controller('HelpController', ['$scope', 'HelpReducer',
    function ($scope, reducer) {
        const ctrl = this;
        $scope.$on('$locationChangeSuccess', (event) => {
            reducer.locationChangeSuccess($scope);
        });
        $scope.$on('shortcut', (event, action) => {
            reducer.onShortcut($scope, action);
        });
        ctrl.page = function (pageName) {
            reducer.page(pageName);
        };
        ctrl.openSearchForm = function () {
            reducer.openSearchForm();
        };
        ctrl.browser = function (url) {
            reducer.browser(url);
        };
        ctrl.showItemInFolder = function (path) {
            reducer.showItemInFolder(path);
        };
        ctrl.showSystemWindow = function () {
            reducer.showSystemWindow();
        };
    }]);
