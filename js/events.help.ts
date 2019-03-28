var _ipcRenderer, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };

// event listeners
angular.module('helpEvents', ['helpReducers'])
  .directive('shortcut', ['HelpReducer', (reducer) => {
    return {
      link: (scope: ng.IScope): void => {
        ipcRenderer().on('shortcut', (event: Electron.Event, action: string) => {
          switch (action) {
            case 'moveToPreviousHelp':
            case 'moveToNextHelp':
              scope.$broadcast('shortcut', action);
              break;
            case 'openSearchForm':
              reducer.openSearchForm();
              break;
            case 'closeSearchForm':
              reducer.closeSearchForm();
              break;
          }
        });
      },
    };
  }]);

