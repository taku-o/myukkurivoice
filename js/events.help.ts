var _ipcRenderer: any, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };

// event listeners
angular.module('helpEvents', ['helpReducers']);

// url change event
class HelpUrlEvent implements yubo.HelpUrlEvent {
  constructor(
    private reducer: yubo.HelpReducer
  ) {}
  link(scope: ng.IScope): void {
    scope.$on('$locationChangeSuccess', (event: ng.IAngularEvent) => {
      this.reducer.locationChangeSuccess();
    });
  }
}
angular.module('helpEvents')
  .directive('urls', [
    'HelpReducer',
    (reducer: yubo.HelpReducer) => new HelpUrlEvent(reducer),
  ]);

// shortcut
class HelpShortcutEvent implements yubo.HelpShortcutEvent {
  constructor(
    private reducer: yubo.HelpReducer
  ) {}
  link(scope: ng.IScope): void {
    ipcRenderer().on('shortcut', (event: Electron.Event, action: string) => {
      switch (action) {
        case 'moveToPreviousHelp':
        case 'moveToNextHelp':
          this.reducer.onShortcut(action);
          break;
        case 'openSearchForm':
          this.reducer.openSearchForm();
          break;
      }
    });
  }
}
angular.module('helpEvents')
  .directive('shortcut', [
    'HelpReducer',
    (reducer: yubo.HelpReducer) => new HelpShortcutEvent(reducer),
  ]);
