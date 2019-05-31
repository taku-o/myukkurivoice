// controllers
class HelpController implements yubo.HelpController {
  constructor(
    private $timeout: ng.ITimeoutService,
    public store: yubo.HelpStore,
    private reducer: yubo.HelpReducer
  ) {
    reducer.addObserver(this);
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
    this.$timeout(() => {});
  }
}
angular.module('helpControllers', ['helpStores', 'helpReducers', 'IncludeDirectives'])
  .controller('HelpController', [
    '$timeout',
    'HelpStore',
    'HelpReducer',
    (
      $timeout: ng.ITimeoutService,
      store: yubo.HelpStore,
      reducer: yubo.HelpReducer
    ) => new HelpController($timeout, store, reducer),
  ]);
