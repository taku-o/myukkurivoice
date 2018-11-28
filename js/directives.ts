// (UI dependecy contains)
var _ipcRenderer, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };

// angular directive
angular.module('Directives', [])
  // static-include
  .directive('staticInclude', () => {
    return {
      restrict: 'AE',
      templateUrl: (element, attrs) => {
        return attrs.templatePath;
      },
    };
  })
  // wav-draggable
  .directive('wavDraggable', ($parse) => {
    return (scope: ng.IScope, element, attr) => {
      let f;
      scope.$watch('lastWavFile', (value: yubo.IRecordMessage) => {
        const message = value;
        if (!message || !message.wavFilePath) {
          return;
        }
        const wavFilePath = message.wavFilePath;

        const el = element[0];
        el.draggable = true;

        // replace event listener
        if (f) {
          el.removeEventListener('dragstart', f, false);
        }
        f = (e) => {
          e.preventDefault();
          ipcRenderer().send('ondragstartwav', wavFilePath);
          return false;
        };
        el.addEventListener('dragstart', f, false);
      });
    };
  })
  // txt-droppable
  .directive('txtDroppable', ($parse) => {
    return (scope: yubo.IMainScope, element, attr) => {
      const el = element[0];

      el.addEventListener('drop', (e) => {
        e.preventDefault();

        // read dropped file and set.
        const reader = new FileReader();
        reader.onload = (loadedFile) => {
          // yinput.source or yinput.encoded
          scope.yinput[el.id] = reader.result;
          scope.$apply();
        };
        const file = e.dataTransfer.files[0];
        reader.readAsText(file);
        return false;
      });
    };
  });
