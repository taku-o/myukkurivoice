// (UI dependecy contains)
var _ipcRenderer, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };

// angular directive
angular.module('DragDirectives', []);

// wav-draggable
class WavDraggable implements yubo.WavDraggable {
  constructor() {}
  link(scope: ng.IScope, element: ng.IDocumentService, attr: ng.IAttributes) {
    let f: (e: Event) => boolean;
    scope.$watch('ctrl.store.lastWavFile', (value: yubo.IRecordMessage) => {
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
      f = (e: Event) => {
        e.preventDefault();
        ipcRenderer().send('ondragstartwav', wavFilePath);
        return false;
      };
      el.addEventListener('dragstart', f, false);
    });
  }
}
angular.module('DragDirectives')
  .directive('wavDraggable', [
    () => new WavDraggable(),
  ]);

// txt-droppable
class TxtDroppable implements yubo.TxtDroppable {
  constructor() {}
  link (scope: yubo.IMainScope, element: ng.IDocumentService, attr: ng.IAttributes) {
    const el: HTMLElement = element[0];

    el.addEventListener('drop', (e: DragEvent) => {
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
  }
}
angular.module('DragDirectives')
  .directive('txtDroppable', [
    () => new TxtDroppable(),
  ]);
