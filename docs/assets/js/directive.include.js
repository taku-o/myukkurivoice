"use strict";
angular.module('IncludeDirectives', [])
    .directive('staticInclude', () => {
    return {
        restrict: 'AE',
        templateUrl: (element, attrs) => {
            return attrs.templatePath;
        },
    };
});
