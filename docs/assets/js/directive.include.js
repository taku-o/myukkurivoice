"use strict";
// angular directive
angular.module('IncludeDirectives', [])
    // static-include
    .directive('staticInclude', function () {
    return {
        restrict: 'AE',
        templateUrl: function (element, attrs) {
            return attrs.templatePath;
        }
    };
});
