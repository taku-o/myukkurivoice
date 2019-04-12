// controllers
class HelpController implements yubo.HelpController {
  constructor(
    private store: yubo.HelpStore,
    private reducer: yubo.HelpReducer
  ) {}

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
}
angular.module('helpControllers', ['helpStores', 'helpReducers', 'IncludeDirectives'])
  .controller('HelpController', [
    'HelpStore',
    'HelpReducer',
    (store: yubo.HelpStore, reducer: yubo.HelpReducer) => new HelpController(store, reducer),
  ]);
