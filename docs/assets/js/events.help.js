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
class HelpScrollEvent {
    constructor($location) {
        this.$location = $location;
    }
    link(scope) {
        scope.$on('$locationChangeSuccess', (event) => {
            const hash = this.$location.hash();
            const menu = document.getElementById(`menu-${hash}`);
            if (hash == 'about' || !menu) {
                const sidebar = document.getElementById('help-sidebar');
                sidebar.scrollTo(0, 0);
            }
            else {
                menu.scrollIntoView({
                    behavior: 'smooth',
                });
            }
        });
    }
}
angular.module('helpEvents')
    .directive('scroll', [
    '$location',
    ($location) => new HelpScrollEvent($location),
]);
