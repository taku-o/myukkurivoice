"use strict";
angular.module('IncludeDirectives', [])
    .directive('staticInclude', function () {
    return {
        restrict: 'AE',
        templateUrl: function (element, attrs) {
            return attrs.templatePath;
        }
    };
});
