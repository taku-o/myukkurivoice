var _ipcRenderer, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };

// event listeners
angular.module('mainEvents', []);

// shortcut
class MainShortcutEvent {
  constructor() {}
  link(scope: ng.IScope): void {
    ipcRenderer().on('shortcut', (event: Electron.Event, action: string) => {
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
          scope.$broadcast('shortcut', action);
          break;
        case 'moveToSource':
          document.getElementById('source').focus();
          break;
        case 'moveToEncoded':
          document.getElementById('encoded').focus();
          break;
        case 'swichNextConfig':
          scope.$broadcast('shortcut', action);
          break;
        case 'swichPreviousConfig':
          scope.$broadcast('shortcut', action);
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
    () => new MainShortcutEvent(),
  ]);

// menu
class MainMenuEvent {
  constructor() {}
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
          scope.$broadcast('menu', action);
          break;
        case 'copy':
          scope.$broadcast('menu', action);
          break;
        case 'save':
          document.getElementById('save').click();
          break;
        case 'reset':
          scope.$broadcast('menu', action);
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
          scope.$broadcast('menu', action);
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
    () => new MainMenuEvent(),
  ]);

// dropTextFile
class MainDropTextFileEvent {
  constructor() {}
  link(scope: ng.IScope): void {
    ipcRenderer().on('dropTextFile', (event: Electron.Event, filePath: string) => {
      scope.$broadcast('dropTextFile', filePath);
    });
  }
}
angular.module('mainEvents')
  .directive('dropTextFile', [
    () => new MainDropTextFileEvent(),
  ]);

// recentDocument
class MainRecentDocumentEvent {
  constructor() {}
  link(scope: ng.IScope): void {
    ipcRenderer().on('recentDocument', (event: Electron.Event, filePath: string) => {
      scope.$broadcast('recentDocument', filePath);
    });
  }
}
angular.module('mainEvents')
  .directive('recentDocument', [
    () => new MainRecentDocumentEvent(),
  ]);
