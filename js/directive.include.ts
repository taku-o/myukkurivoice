// angular directive
angular.module('IncludeDirectives', [])
  // static-include
  .directive('staticInclude', () => {
    return {
      restrict: 'AE',
      templateUrl: (element: ng.IDocumentService, attrs: ng.IAttributes) => {
        return attrs.templatePath;
      },
    };
  });
