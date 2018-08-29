// (UI dependecy contains)
var ipcRenderer = require('electron').ipcRenderer;

// angular directive
angular.module('yvoiceDirective', [])
  // static-include
  .directive('staticInclude', function() {
    return {
      restrict: 'AE',
      templateUrl: function(element, attrs) {
        return attrs.templatePath;
      },
    };
  })
  // wav-draggable
  .directive('wavDraggable', function($parse) {
    return function(scope, element, attr) {
      var f;
      scope.$watch('lastWavFile', function(value) {
        var message = value;
        // @ts-ignore
        if (!message || !message.wavFilePath) {
          return;
        }
        // @ts-ignore
        var wavFilePath = message.wavFilePath;

        var el = element[0];
        el.draggable = true;

        // replace event listener
        if (f) {
          el.removeEventListener('dragstart', f, false);
        }
        f = function(e) {
          e.preventDefault();
          ipcRenderer.send('ondragstartwav', wavFilePath);
          return false;
        };
        el.addEventListener('dragstart', f, false);
      });
    };
  })
  // txt-droppable
  .directive('txtDroppable', function($parse) {
    return function(scope, element, attr) {
      var el = element[0];

      el.addEventListener('drop', function(e) {
        e.preventDefault();

        // read dropped file and set.
        var reader = new FileReader();
        reader.onload = function(loadedFile) {
          // yinput.source or yinput.encoded
          // @ts-ignore
          scope.yinput[el.id] = loadedFile.target.result;
          scope.$apply();
        };
        var file = e.dataTransfer.files[0];
        reader.readAsText(file);
        return false;
      });
    };
  });
