var _ipcRenderer, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };

// event listeners
class HelpShortcutEvent implements yubo.HelpShortcutEvent {
  constructor(
    private reducer: yubo.HelpReducer
  ) {}
  link(scope: ng.IScope): void {
    ipcRenderer().on('shortcut', (event: Electron.Event, action: string) => {
      switch (action) {
        case 'moveToPreviousHelp':
        case 'moveToNextHelp':
          scope.$broadcast('shortcut', action);
          break;
        case 'openSearchForm':
          this.reducer.openSearchForm();
          break;
      }
    });
  }
}
angular.module('helpEvents', ['helpReducers'])
  .directive('shortcut', [
    'HelpReducer',
    (reducer: yubo.HelpReducer) => new HelpShortcutEvent(reducer),
  ]);
