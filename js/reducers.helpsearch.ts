// action reducer
class HelpSearchReducer implements yubo.HelpSearchReducer {
  constructor(
    private store: yubo.HelpSearchStore
  ) {}

  searchInPage(): void {
    const win = require('electron').remote.getCurrentWindow();
    if (this.store.searchText) {
      win.getParentWindow().webContents.findInPage(this.store.searchText);
    } else {
      win.getParentWindow().webContents.stopFindInPage('clearSelection');
    }
  }
  clearSearchForm(): void {
    this.store.searchText = '';
    const win = require('electron').remote.getCurrentWindow();
    win.getParentWindow().webContents.stopFindInPage('clearSelection');
  }

  // store observer
  private observers: yubo.StoreObserver[] = [];
  addObserver(observer: yubo.StoreObserver): void {
    this.observers.push(observer);
  }
  private notifyUpdates(objects: {[key: string]: any}): void {
    for (let o of this.observers) {
      o.update(objects);
    }
  }
}

angular.module('helpSearchReducers', ['helpSearchStores'])
  .service('HelpSearchReducer', [
    'HelpSearchStore',
    HelpSearchReducer,
  ]);
