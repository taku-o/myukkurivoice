// controllers
class HelpSearchController {
  constructor(
    private store: yubo.HelpSearchStore,
    private reducer: yubo.HelpSearchReducer
  ) {}

  // accessor
  get searchText() {
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
}
angular.module('helpSearchControllers', ['helpSearchStores', 'helpSearchReducers'])
  .controller('HelpSearchController', [
    'HelpSearchStore',
    'HelpSearchReducer',
    (store: yubo.HelpSearchStore, reducer: yubo.HelpSearchReducer) => new HelpSearchController(store, reducer),
  ]);
