var _log :any, log         = () => { _log = _log || require('electron-log'); return _log; };
var _monitor :any, monitor = () => { _monitor = _monitor || require('electron-performance-monitor'); return _monitor; };

// env
var MONITOR = process.env.MONITOR != null;

// after-render
class AfterRender implements yubo.AfterRender {
  constructor(
    private reducer: yubo.MainReducer
  ) {}
  readonly restrict: string = 'A';
  link (scope: ng.IScope, element: ng.IDocumentService, attr: ng.IAttributes) {
    (angular as any).getTestability(element).whenStable(() => {
      if (MONITOR) { log().warn(monitor().format('apps.main', 'app launch finished')); }
      this.reducer.afterRender();
    });
  }
}
angular.module('AfterRenderDirectives', ['mainReducers'])
  .directive('afterRender', [
    'MainReducer',
    (reducer: yubo.MainReducer) => new AfterRender(reducer),
  ]);
