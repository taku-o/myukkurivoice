// event listeners
class HelpSearchEvent implements yubo.HelpSearchEvent {
  constructor(
    private $window: ng.IWindowService,
    private $document: ng.IDocumentService
  ) {}
  link(scope: ng.IScope): void {
    this.$window.onfocus = (): void => {
      this.$document[0].getElementById('search-text').focus();
    };
  }
}
angular.module('helpSearchEvents', [])
  .directive('event', [
    '$window',
    '$document',
    ($window: ng.IWindowService, $document: ng.IDocumentService) => new HelpSearchEvent($window, $document),
  ]);
