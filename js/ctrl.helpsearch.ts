// controllers
class HelpSearchController implements yubo.HelpSearchController {
  constructor(
    private $timeout: ng.ITimeoutService,
    private store: yubo.HelpSearchStore,
    private reducer: yubo.HelpSearchReducer
  ) {
    reducer.addObserver(this);
  }

  // accessor
  get searchText(): string {
    return this.store.searchText;
  }
  set searchText(input: string) {
    this.store.searchText = input;
  }

  // action
  searchInPage(): void {
    this.reducer.searchInPage();
  }
  clearSearchForm(): void {
    this.reducer.clearSearchForm();
  }
  closeSearchForm(): void {
    const window = require('electron').remote.getCurrentWindow();
    window.hide();
  }

  // store observer
  update(objects: {[key: string]: any}): void {
    this.$timeout(() => {});
  }
}
angular.module('helpSearchControllers', ['helpSearchStores', 'helpSearchReducers'])
  .controller('HelpSearchController', [
    '$timeout',
    'HelpSearchStore',
    'HelpSearchReducer',
    (
      $timeout: ng.ITimeoutService,
      store: yubo.HelpSearchStore,
      reducer: yubo.HelpSearchReducer
    ) => new HelpSearchController($timeout, store, reducer),
  ]);
