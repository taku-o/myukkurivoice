var _ipcRenderer, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };
var _shell, shell             = () => { _shell = _shell || require('electron').shell; return _shell; };

// action reducer
class HelpReducer implements yubo.HelpReducer {
  readonly menuList = [
    'about',
    'voicecode',
    'trouble',
    'update',
    'uninstall',
    'backup',
    'license',
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
    'shortcut',
    'help',
    'expand',
  ];
  constructor(
    private $timeout: ng.ITimeoutService,
    private $location: ng.ILocationService,
    private $window: ng.IWindowService
  ) {}

  locationChangeSuccess($scope: yubo.IHelpScope) {
    // fix broken url
    if (this.$location.url().startsWith('/%23')) {
      this.$window.location.href = this.$location.absUrl().replace('%23', '#');
      return;
    }

    const hash = this.$location.hash();
    if (this.menuList.includes(hash)) {
      $scope.display = hash;
    } else {
      $scope.display = 'about';
    }
    this.$timeout(() => { $scope.$apply(); });
  }

  onShortcut($scope: yubo.IHelpScope, action: string): void {
    switch (action) {
      case 'moveToPreviousHelp':
        this.moveToPreviousHelp($scope);
        break;
      case 'moveToNextHelp':
        this.moveToNextHelp($scope);
        break;
    }
  }
  moveToPreviousHelp($scope: yubo.IHelpScope): void {
    const index = this.menuList.indexOf($scope.display);
    const moved = index - 1;
    if (index < 0) {
      this.$location.hash(this.menuList[0]);
    } else if (moved < 0) {
      this.$location.hash(this.menuList[this.menuList.length - 1]);
    } else {
      this.$location.hash(this.menuList[moved]);
    }
    this.$timeout(() => { $scope.$apply(); });
  }
  moveToNextHelp($scope: yubo.IHelpScope): void {
    const index = this.menuList.indexOf($scope.display);
    const moved = index + 1;
    if (index < 0) {
      this.$location.hash(this.menuList[0]);
    } else if (moved >= this.menuList.length) {
      this.$location.hash(this.menuList[0]);
    } else {
      this.$location.hash(this.menuList[moved]);
    }
    this.$timeout(() => { $scope.$apply(); });
  }

  openSearchForm(): void {
    ipcRenderer().send('showHelpSearchDialog', 'show help search dialog');
  }
  browser(url: string): void {
    // run on electron
    if ('process' in window) {
      shell().openExternal(url);
    // run on browser
    } else {
      this.$window.open(url);
    }
  }
  showItemInFolder(path: string): void {
    // run on electron
    if ('process' in window) {
      const app = require('electron').remote.app;
      const homeDir = app.getPath('home');
      const expanded = path.replace('$HOME', homeDir);
      shell().showItemInFolder(expanded);
    }
  }
  showSystemWindow(): void {
    // run on electron
    if ('process' in window) {
      ipcRenderer().send('showSystemWindow', 'system');
    }
  }
}

angular.module('helpReducers', [])
  .service('HelpReducer', [
    '$timeout',
    '$location',
    '$window',
    HelpReducer,
  ]);
