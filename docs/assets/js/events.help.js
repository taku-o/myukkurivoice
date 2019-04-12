"use strict";
var _ipcRenderer, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };
angular.module('helpEvents', ['helpReducers']);
class HelpUrlEvent {
    constructor(reducer) {
        this.reducer = reducer;
    }
    link(scope) {
        scope.$on('$locationChangeSuccess', (event) => {
            this.reducer.locationChangeSuccess();
        });
    }
}
angular.module('helpEvents')
    .directive('urls', [
    'HelpReducer',
    (reducer) => new HelpUrlEvent(reducer),
]);
class HelpShortcutEvent {
    constructor(reducer) {
        this.reducer = reducer;
    }
    link(scope) {
        ipcRenderer().on('shortcut', (event, action) => {
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
    (reducer) => new HelpShortcutEvent(reducer),
]);
