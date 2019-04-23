var _ipcRenderer: any, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };

// event listeners
angular.module('dictEvents', ['dictReducers']);

// shortcut
class DictShortcutEvent implements yubo.DictShortcutEvent {
  constructor() {}
  link(scope: ng.IScope): void {
    ipcRenderer().on('shortcut', (event: Electron.Event, action: string) => {
      switch (action) {
        case 'add':
          document.getElementById('append-record').click();
          break;
        case 'save':
          document.getElementById('save').click();
          break;
      }
    });
  }
}
angular.module('dictEvents')
  .directive('shortcut', [
    () => new DictShortcutEvent(),
  ]);

// menu
class DictMenuEvent implements yubo.DictMenuEvent {
  constructor(
    private reducer: yubo.DictReducer
  ) {}
  link(scope: ng.IScope): void {
    ipcRenderer().on('menu', (event: Electron.Event, action: string) => {
      switch (action) {
        case 'add':
          document.getElementById('append-record').click();
          break;
        case 'delete':
          document.getElementById('delete-record').click();
          break;
        case 'save':
          document.getElementById('save').click();
          break;
        case 'cancel':
          document.getElementById('cancel').click();
          break;
        case 'export':
          document.getElementById('export').click();
          break;
        case 'reset':
          this.reducer.reset();
          break;
        case 'tutorial':
          document.getElementById('tutorial').click();
          break;
      }
    });
  }
}
angular.module('dictEvents')
  .directive('menu', [
    'DictReducer',
    (reducer: yubo.DictReducer) => new DictMenuEvent(reducer),
  ]);
