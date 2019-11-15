var _ipcRenderer: any, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };
var _shell: any, shell             = () => { _shell = _shell || require('electron').shell; return _shell; };

// action reducer
class HelpReducer implements yubo.HelpReducer {
  private readonly menuList = [
    'about',
    'voicecode',
    'trouble',
    'update',
    'uninstall',
    'backup',
    'license',
    'catalina',
    'contact',
    'funclist',
    'play',
    'tuna',
    'writing',
    'dataconfig',
    'dragout',
    'multivoice',
    'dictionary',
    'history',
    'sysconfig',
    'shortcut',
    'help',
    'fcpx-ixml',
    'expand',
  ];
  constructor(
    private $location: ng.ILocationService,
    private $window: ng.IWindowService,
    private store: yubo.HelpStore
  ) {}

  locationChangeSuccess() {
    // fix broken url
    if (this.$location.url().startsWith('/%23')) {
      this.$window.location.href = this.$location.absUrl().replace('%23', '#');
      return;
    }

    const hash = this.$location.hash();
    if (this.menuList.includes(hash)) {
      this.store.display = hash;
    } else {
      this.store.display = 'about';
    }
    this.notifyUpdates({display: this.store.display});
  }

  onShortcut(action: string): void {
    switch (action) {
      case 'moveToPreviousHelp':
        this.moveToPreviousHelp();
        this.notifyUpdates({});
        break;
      case 'moveToNextHelp':
        this.moveToNextHelp();
        this.notifyUpdates({});
        break;
    }
  }
  private moveToPreviousHelp(): void {
    const index = this.menuList.indexOf(this.store.display);
    const moved = index - 1;
    if (index < 0) {
      this.page(this.menuList[0]);
    } else if (moved < 0) {
      this.page(this.menuList[this.menuList.length - 1]);
    } else {
      this.page(this.menuList[moved]);
    }
  }
  private moveToNextHelp(): void {
    const index = this.menuList.indexOf(this.store.display);
    const moved = index + 1;
    if (index < 0) {
      this.page(this.menuList[0]);
    } else if (moved >= this.menuList.length) {
      this.page(this.menuList[0]);
    } else {
      this.page(this.menuList[moved]);
    }
  }

  page(pageName: string): void {
    this.$location.hash(pageName);
  }
  openSearchForm(): void {
    ipcRenderer().send('showHelpSearchDialog', 'show help search dialog');
  }
  browser(url: string): void {
    // run on electron
    if (this.store.onElectron) {
      shell().openExternal(url);
    // run on browser
    } else {
      this.$window.open(url);
    }
  }
  showItemInFolder(path: string): void {
    // run on electron
    if (this.store.onElectron) {
      const app = require('electron').remote.app;
      const homeDir = app.getPath('home');
      const expanded = path.replace('$HOME', homeDir);
      shell().showItemInFolder(expanded);
    }
  }
  showSystemWindow(): void {
    // run on electron
    if (this.store.onElectron) {
      ipcRenderer().send('showSystemWindow', 'system');
    }
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

angular.module('helpReducers', ['helpStores'])
  .service('HelpReducer', [
    '$location',
    '$window',
    'HelpStore',
    HelpReducer,
  ]);
