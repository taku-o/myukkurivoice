// controllers
class HelpSearchController implements yubo.HelpSearchController {
  constructor(
    private $timeout: ng.ITimeoutService,
    public store: yubo.HelpSearchStore,
    private reducer: yubo.HelpSearchReducer
  ) {
    reducer.addObserver(this);
  }

  // action
  searchInPage(): void {
    this.reducer.searchInPage();
  }
  clearSearchForm(): void {
    this.reducer.clearSearchForm();
  }
  closeSearchForm(): void {
    const curwindow = require('electron').remote.getCurrentWindow();
    curwindow.hide();
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
