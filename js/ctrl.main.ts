var _ipcRenderer, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };

// env
const TEST = process.env.NODE_ENV == 'test';

// controllers
angular.module('mainControllers', ['mainStores', 'mainReducers', 'mainDirectives', 'mainServices', 'mainModels', 'input-highlight'])
  .controller('MainController', ['$scope', 'MainStore', 'MainReducer', 'YPhontMasterList', 'YInput',
  function($scope: yubo.IMainScope, store: yubo.MainStore, reducer: yubo.MainReducer, YPhontMasterList: yubo.YPhont[], YInput: yubo.YInput) {

  // event bridge
  $scope.$on('shortcut', (event: ng.IAngularEvent, action: string) => {
    reducer.onShortcut($scope, action);
  });
  $scope.$on('menu', (event: ng.IAngularEvent, action: string) => {
    reducer.onMenu($scope, action);
  });
  $scope.$on('dropTextFile', (event: ng.IAngularEvent, filePath: string) => {
    reducer.onDropTextFile($scope, filePath);
  });
  $scope.$on('recentDocument', (event: ng.IAngularEvent, filePath: string) => {
    reducer.onRecentDocument($scope, filePath);
  });

  // init
  const ctrl = this;
  ctrl.store = store;
  ctrl.aq10BasList = [{name:'F1E', id:0}, {name:'F2E', id:1}, {name:'M1E', id:2}];
  ctrl.YPhontMasterList = YPhontMasterList;

  $scope.yinput = angular.copy(YInput);
  ctrl.isTest = TEST;
  $scope.yvoiceList = dataJson;
  $scope.yvoice = dataJson.length > 0? dataJson[0]: null;

  // $onInit
  this.$onInit = (): void => {
    reducer.onLoad($scope);
  };

  // selected text highlight
  $scope.sourceHighlight = {
    '#619FFF' : '{{ sourceHighlight["#619FFF"] }}',
  };
  $scope.encodedHighlight = {
    '#619FFF' : '{{ encodedHighlight["#619FFF"] }}',
  };
  ctrl.blurOnSource = function(): void {
    reducer.blurOnSource($scope);
  };
  ctrl.blurOnEncoded = function(): void {
    reducer.blurOnEncoded($scope);
  };
  ctrl.focusOnSource = function(): void {
    reducer.focusOnSource($scope);
  };
  ctrl.focusOnEncoded = function(): void {
    reducer.focusOnEncoded($scope);
  };

  // list box selection changed
  ctrl.onChangePhont = function(): void {
    reducer.onChangePhont($scope);
  };

  // action
  ctrl.play = function(): void {
    reducer.play($scope);
  };
  ctrl.stop = function(): void {
    reducer.stop();
  };
  ctrl.record = function(): void {
    reducer.record($scope);
  };
  ctrl.showSystemWindow = function(): void {
    if (!TEST) { return; }
    reducer.showSystemWindow();
  };
  ctrl.showSpecWindow = function(): void {
    if (!TEST) { return; }
    reducer.showSpecWindow();
  };
  ctrl.help = function(): void {
    reducer.help();
  };
  ctrl.dictionary = function(): void {
    reducer.dictionary();
  };
  ctrl.tutorial = function(): void {
    reducer.tutorial($scope);
  };
  ctrl.shortcut = function(): void {
    reducer.shortcut($scope);
  };
  ctrl.select = function(index: number): void {
    reducer.select($scope, index);
  };
  ctrl.plus = function(): void {
    reducer.plus($scope);
  };
  ctrl.minus = function(index: number): void {
    reducer.minus($scope, index);
  };
  ctrl.copy = function(index: number): void {
    reducer.copy($scope, index);
  };
  ctrl.save = function(): void {
    reducer.save($scope);
  };
  ctrl.reset = function(): void {
    reducer.reset($scope);
  };
  ctrl.quickLookMessage = function(message: yubo.IWriteMessage): void {
    reducer.quickLookMessage(message);
  };
  ctrl.recentDocument = function(message: yubo.IRecordMessage): void {
    reducer.recentDocument($scope, message);
  };
  ctrl.clearRecentDocuments = function(): void {
    reducer.clearRecentDocuments($scope);
  };

  ctrl.encode = function(): void {
    reducer.encode($scope);
  };
  ctrl.clear = function(): void {
    reducer.clear($scope);
  };
  ctrl.fromClipboard = function(): void {
    reducer.fromClipboard($scope);
  };
  ctrl.putVoiceName = function(): void {
    reducer.putVoiceName($scope);
  };
  ctrl.directory = function(): void {
    reducer.directory($scope);
  };

  ctrl.switchSettingsView = function(): void {
    reducer.switchSettingsView($scope);
  };
  ctrl.switchMainView = function(): void {
    reducer.switchMainView($scope);
  };
  ctrl.switchMessageListType = function(): void {
    reducer.switchMessageListType($scope);
  };
  ctrl.switchAlwaysOnTop = function(): void {
    reducer.switchAlwaysOnTop();
  };
  ipcRenderer().on('switchAlwaysOnTop', (event: Electron.Event, newflg: boolean) => {
    reducer.onSwitchAlwaysOnTop($scope, event, newflg);
  });

  // run init
  reducer.init($scope);
}]);

declare var dataJson: yubo.YVoice[];
