// angular directive
// static-include
class StaticInclude implements yubo.StaticInclude {
  constructor() {}
  readonly restrict: string = 'AE';
  templateUrl(element: ng.IDocumentService, attrs: ng.IAttributes): string {
    return attrs.templatePath;
  }
}
angular.module('IncludeDirectives', [])
  .directive('staticInclude', [
    () => new StaticInclude(),
  ]);
