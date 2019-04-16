var _ipcRenderer, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };

// env
const TEST = process.env.NODE_ENV == 'test';

// controllers
angular.module('mainControllers', ['mainStores', 'mainReducers', 'mainDirectives', 'mainServices', 'mainModels', 'input-highlight'])
  .controller('MainController', ['$scope', 'MainStore', 'MainReducer', 'YPhontMasterList',
  function($scope: yubo.IMainScope, store: yubo.MainStore, reducer: yubo.MainReducer, YPhontMasterList: yubo.YPhont[]) {

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
  ctrl.store.yvoiceList = dataJson;
  ctrl.store.curYvoice = dataJson.length > 0? dataJson[0]: null;

  ctrl.appCfg = reducer.appCfg;
  ctrl.aq10BasList = [{name:'F1E', id:0}, {name:'F2E', id:1}, {name:'M1E', id:2}];
  ctrl.YPhontMasterList = YPhontMasterList;
  ctrl.isTest = TEST;

  // $onInit
  this.$onInit = (): void => {
    reducer.onLoad($scope);
  };

  // selected text highlight
  ctrl.blurOnSource = function(): void {
    reducer.blurOnSource();
  };
  ctrl.blurOnEncoded = function(): void {
    reducer.blurOnEncoded();
  };
  ctrl.focusOnSource = function(): void {
    reducer.focusOnSource();
  };
  ctrl.focusOnEncoded = function(): void {
    reducer.focusOnEncoded();
  };

  // list box selection changed
  ctrl.onChangePhont = function(): void {
    reducer.onChangePhont();
  };

  // action
  ctrl.play = function(): void {
    reducer.play();
  };
  ctrl.stop = function(): void {
    reducer.stop();
  };
  ctrl.record = function(): void {
    reducer.record();
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
    reducer.tutorial();
  };
  ctrl.shortcut = function(): void {
    reducer.shortcut($scope);
  };
  ctrl.select = function(index: number): void {
    reducer.select(index);
  };
  ctrl.plus = function(): void {
    reducer.plus();
  };
  ctrl.minus = function(index: number): void {
    reducer.minus(index);
  };
  ctrl.copy = function(index: number): void {
    reducer.copy(index);
  };
  ctrl.save = function(): void {
    reducer.save();
  };
  ctrl.reset = function(): void {
    reducer.reset();
  };
  ctrl.quickLookMessage = function(message: yubo.IWriteMessage): void {
    reducer.quickLookMessage(message);
  };
  ctrl.recentDocument = function(message: yubo.IRecordMessage): void {
    reducer.recentDocument(message);
  };
  ctrl.clearRecentDocuments = function(): void {
    reducer.clearRecentDocuments();
  };

  ctrl.encode = function(): void {
    reducer.encode();
  };
  ctrl.clear = function(): void {
    reducer.clear();
  };
  ctrl.fromClipboard = function(): void {
    reducer.fromClipboard();
  };
  ctrl.putVoiceName = function(): void {
    reducer.putVoiceName($scope);
  };
  ctrl.directory = function(): void {
    reducer.directory($scope);
  };

  ctrl.switchSettingsView = function(): void {
    reducer.switchSettingsView();
  };
  ctrl.switchMainView = function(): void {
    reducer.switchMainView();
  };
  ctrl.switchMessageListType = function(): void {
    reducer.switchMessageListType();
  };
  ctrl.switchAlwaysOnTop = function(): void {
    reducer.switchAlwaysOnTop();
  };
  ipcRenderer().on('switchAlwaysOnTop', (event: Electron.Event, newflg: boolean) => {
    reducer.onSwitchAlwaysOnTop($scope, event, newflg);
  });

  // run init
  reducer.init();
}]);

declare var dataJson: yubo.YVoice[];
