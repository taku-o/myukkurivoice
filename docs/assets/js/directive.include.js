"use strict";
class StaticInclude {
    constructor() {
        this.restrict = 'AE';
    }
    templateUrl(element, attrs) {
        return attrs.templatePath;
    }
}
angular.module('IncludeDirectives', [])
    .directive('staticInclude', [
    () => new StaticInclude(),
]);
