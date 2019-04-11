// controllers
angular.module('helpControllers', ['helpReducers', 'IncludeDirectives'])
  .controller('HelpController', ['$scope', 'HelpReducer',
  function($scope: yubo.IHelpScope, reducer: yubo.HelpReducer) {
    // init
    const ctrl = this;

    // event url hash changed
    $scope.$on('$locationChangeSuccess', (event: ng.IAngularEvent) => {
      reducer.locationChangeSuccess($scope);
    });
    // shortcut event bridge
    $scope.$on('shortcut', (event: ng.IAngularEvent, action: string) => {
      reducer.onShortcut($scope, action);
    });

    // action
    ctrl.page = function(pageName: string): void {
      reducer.page(pageName);
    };
    ctrl.openSearchForm = function(): void {
      reducer.openSearchForm();
    };
    ctrl.browser = function(url: string): void {
      reducer.browser(url);
    };
    ctrl.showItemInFolder = function(path: string): void {
      reducer.showItemInFolder(path);
    };
    ctrl.showSystemWindow = function(): void {
      reducer.showSystemWindow();
    };
  }]);

