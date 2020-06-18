var _ipcRenderer: any, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };

// event listeners
angular.module('mainEvents', ['mainReducers']);

// message
class MainMessageEvent implements yubo.MainMessageEvent {
  constructor(
    private reducer: yubo.MainReducer
  ) {}
  link(scope: ng.IScope): void {
    ipcRenderer().on('info', (event: Electron.Event, message: string) => {
      this.reducer.onMessage('info', message);
    });
  }
}
angular.module('mainEvents')
  .directive('message', [
    'MainReducer',
    (reducer: yubo.MainReducer) => new MainMessageEvent(reducer),
  ]);

// shortcut
class MainShortcutEvent implements yubo.MainShortcutEvent {
  constructor(
    private reducer: yubo.MainReducer
  ) {}
  link(scope: ng.IScope): void {
    ipcRenderer().on('shortcut', (event: Electron.Event, action: string, numKey: number) => {
      switch (action) {
        case 'play':
          document.getElementById('play').click();
          break;
        case 'stop':
          document.getElementById('stop').click();
          break;
        case 'record':
          document.getElementById('record').click();
          break;
        case 'fromClipboard':
          document.getElementById('from-clipboard').click();
          break;
        case 'putVoiceName':
          this.reducer.onShortcut(action);
          break;
        case 'moveToSource':
          document.getElementById('source').focus();
          break;
        case 'moveToEncoded':
          document.getElementById('encoded').focus();
          break;
        case 'swichNextConfig':
          this.reducer.onShortcut(action);
          break;
        case 'swichPreviousConfig':
          this.reducer.onShortcut(action);
          break;
        case 'swichNumberConfig':
          this.reducer.onShortcut(action, numKey);
          break;
        case 'encode':
          document.getElementById('encode').click();
          break;
      }
    });
  }
}
angular.module('mainEvents')
  .directive('shortcut', [
    'MainReducer',
    (reducer: yubo.MainReducer) => new MainShortcutEvent(reducer),
  ]);

// menu
class MainMenuEvent implements yubo.MainMenuEvent {
  constructor(
    private reducer: yubo.MainReducer
  ) {}
  link(scope: ng.IScope): void {
    ipcRenderer().on('menu', (event: Electron.Event, action: string) => {
      switch (action) {
        case 'clear':
          document.getElementById('clear').click();
          break;
        case 'plus':
          document.getElementById('plus').click();
          break;
        case 'minus':
          this.reducer.onMenu(action);
          break;
        case 'copy':
          this.reducer.onMenu(action);
          break;
        case 'save':
          document.getElementById('save').click();
          break;
        case 'reset':
          this.reducer.onMenu(action);
          break;
        case 'dictionary':
          document.getElementById('dictionary').click();
          break;
        case 'shortcut':
          document.getElementById('shortcut').click();
          break;
        case 'tutorial':
          document.getElementById('tutorial').click();
          break;
        case 'clearRecentDocuments':
          this.reducer.onMenu(action);
          break;
        case 'switchAlwaysOnTop':
          this.reducer.onMenu(action);
          break;
        case 'devtron':
          require('devtron').install();
          break;
        case 'gc':
          global.gc();
          break;
      }
    });
  }
}
angular.module('mainEvents')
  .directive('menu', [
    'MainReducer',
    (reducer: yubo.MainReducer) => new MainMenuEvent(reducer),
  ]);

// dropTextFile
class MainDropTextFileEvent implements yubo.MainDropTextFileEvent {
  constructor(
    private reducer: yubo.MainReducer
  ) {}
  link(scope: ng.IScope): void {
    ipcRenderer().on('dropTextFile', (event: Electron.Event, filePath: string) => {
      this.reducer.onDropTextFile(filePath);
    });
  }
}
angular.module('mainEvents')
  .directive('dropTextFile', [
    'MainReducer',
    (reducer: yubo.MainReducer) => new MainDropTextFileEvent(reducer),
  ]);

// recentDocument
class MainRecentDocumentEvent implements yubo.MainRecentDocumentEvent {
  constructor(
    private reducer: yubo.MainReducer
  ) {}
  link(scope: ng.IScope): void {
    ipcRenderer().on('recentDocument', (event: Electron.Event, filePath: string) => {
      this.reducer.onRecentDocument(filePath);
    });
  }
}
angular.module('mainEvents')
  .directive('recentDocument', [
    'MainReducer',
    (reducer: yubo.MainReducer) => new MainRecentDocumentEvent(reducer),
  ]);
