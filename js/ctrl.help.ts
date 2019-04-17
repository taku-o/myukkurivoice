// controllers
class HelpController implements yubo.HelpController {
  constructor(
    private $scope: ng.IScope,
    private $timeout: ng.ITimeoutService,
    private store: yubo.HelpStore,
    private reducer: yubo.HelpReducer
  ) {
    reducer.addObserver(this);
  }

  // accessor
  get display(): string {
    return this.store.display;
  }

  // action
  page(pageName: string): void {
    this.reducer.page(pageName);
  }
  openSearchForm(): void {
    this.reducer.openSearchForm();
  }
  browser(url: string): void {
    this.reducer.browser(url);
  }
  showItemInFolder(path: string): void {
    this.reducer.showItemInFolder(path);
  }
  showSystemWindow(): void {
    this.reducer.showSystemWindow();
  }

  // store observer
  update(objects: {[key: string]: any}): void {
    this.$timeout(() => { this.$scope.$apply(); });
  }
}
angular.module('helpControllers', ['helpStores', 'helpReducers', 'IncludeDirectives'])
  .controller('HelpController', [
    '$scope',
    '$timeout',
    'HelpStore',
    'HelpReducer',
    (
      $scope: ng.IScope,
      $timeout: ng.ITimeoutService,
      store: yubo.HelpStore,
      reducer: yubo.HelpReducer
    ) => new HelpController($scope, $timeout, store, reducer),
  ]);
