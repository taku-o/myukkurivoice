// event listeners
angular.module('dictEvents', [])
  .directive('shortcut', [() => {
    return {
      link: (scope: ng.IScope): void => {
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
      },
    };
  }])
  .directive('menu', [() => {
    return {
      link: (scope: ng.IScope): void => {
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
              scope.$broadcast('menu', action);
              break;
            case 'tutorial':
              document.getElementById('tutorial').click();
              break;
          }
        });
      },
    };
  }]);

