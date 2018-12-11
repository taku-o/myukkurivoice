// angular directive
angular.module('IncludeDirectives', [])
  // static-include
  .directive('staticInclude', () => {
    return {
      restrict: 'AE',
      templateUrl: (element, attrs) => {
        return attrs.templatePath;
      },
    };
  });
