// event listeners
class HelpSearchEvent implements yubo.HelpSearchEvent {
  constructor(
    private $window: ng.IWindowService
  ) {}
  link(scope: ng.IScope): void {
    this.$window.onfocus = (): void => {
      document.getElementById('search-text').focus();
    };
  }
}
angular.module('helpSearchEvents', [])
  .directive('event', [
    '$window',
    ($window: ng.IWindowService) => new HelpSearchEvent($window),
  ]);
