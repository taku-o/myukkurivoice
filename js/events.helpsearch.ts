// event listeners
angular.module('helpSearchEvents', [])
  .directive('event', ['$window', ($window: ng.IWindowService) => {
    return {
      link: (scope: ng.IScope): void => {
        $window.onfocus = (): void => {
          document.getElementById('search-text').focus();
        };
      }
    };
  }]);

