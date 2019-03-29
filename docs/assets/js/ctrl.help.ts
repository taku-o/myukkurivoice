// controllers
angular.module('helpControllers', ['helpReducers', 'IncludeDirectives'])
  .controller('HelpController', ['$scope', '$location', 'HelpReducer',
  function($scope: yubo.IHelpScope, $location: ng.ILocationService, reducer: yubo.HelpReducer) {
    // init
    const ctrl = this;
    $scope.$location = $location;

    // event url hash changed
    $scope.$on('$locationChangeSuccess', (event: ng.IAngularEvent) => {
      reducer.locationChangeSuccess($scope);
    });
    // shortcut event bridge
    $scope.$on('shortcut', (event: ng.IAngularEvent, action: string) => {
      reducer.onShortcut($scope, action);
    });

    // action
    ctrl.openSearchForm = function(): void {
      reducer.openSearchForm();
    };
    ctrl.browser = function(url: string): void {
      reducer.browser(url);
    };
    ctrl.showItemInFolder = function(path: string): void {
      reducer.browser(path);
    };
    ctrl.showSystemWindow = function(): void {
      reducer.showSystemWindow();
    };
  }]);

