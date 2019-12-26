// env
var TEST = process.env.NODE_ENV == 'test';

// controllers
class MainController implements yubo.MainController {
  appCfg: yubo.AppCfg;
  public readonly phontSelectionList: yubo.YPhont[];
  readonly aq10BasList: {[key: string]: any}[] = [{name:'F1E', id:0}, {name:'F2E', id:1}, {name:'M1E', id:2}];
  readonly isTest: boolean = TEST;
  readonly mas: boolean = process.mas;

  constructor(
    private $scope: ng.IScope,
    private $timeout: ng.ITimeoutService,
    public store: yubo.MainStore,
    private reducer: yubo.MainReducer,
    aquesTalk1Lib: yubo.AquesTalk1Lib,
    YPhontMasterList: yubo.YPhont[],
    YPhontMasterIosEnvList: yubo.YPhont[]
  ) {
    reducer.addObserver(this);
    this.appCfg = reducer.appCfg;

    // remove not supported phont
    this.phontSelectionList = aquesTalk1Lib.isI386Supported()? YPhontMasterList: YPhontMasterIosEnvList;

    // run init
    reducer.init();
  }

  // $onInit
  $onInit(): void {
    this.reducer.onLoad(this.$scope);
  }

  // selected text highlight
  blurOnSource(): void {
    this.reducer.blurOnSource();
  }
  blurOnEncoded(): void {
    this.reducer.blurOnEncoded();
  }
  focusOnSource(): void {
    this.reducer.focusOnSource();
  }
  focusOnEncoded(): void {
    this.reducer.focusOnEncoded();
  }

  // list box selection changed
  onChangePhont(): void {
    this.reducer.onChangePhont();
  }

  // action
  play(): void {
    this.reducer.play();
  }
  stop(): void {
    this.reducer.stop();
  }
  record(): void {
    this.reducer.record();
  }
  showSystemWindow(): void {
    if (!this.isTest) { return; }
    this.reducer.showSystemWindow();
  }
  showSpecWindow(): void {
    if (!this.isTest) { return; }
    this.reducer.showSpecWindow();
  }
  help(): void {
    this.reducer.help();
  }
  dictionary(): void {
    this.reducer.dictionary();
  }
  tutorial(): void {
    this.reducer.tutorial();
  }
  shortcut(): void {
    this.reducer.shortcut();
  }
  select(index: number): void {
    this.reducer.select(index);
  }
  plus(): void {
    this.reducer.plus();
  }
  minus(index: number): void {
    this.reducer.minus(index);
  }
  copy(index: number): void {
    this.reducer.copy(index);
  }
  save(): void {
    this.reducer.save();
  }
  reset(): void {
    this.reducer.reset();
  }
  quickLookMessage(message: yubo.IWriteMessage): void {
    this.reducer.quickLookMessage(message);
  }
  recentDocument(message: yubo.IRecordMessage): void {
    this.reducer.recentDocument(message);
  }
  clearRecentDocuments(): void {
    this.reducer.clearRecentDocuments();
  }

  encode(): void {
    this.reducer.encode();
  }
  clear(): void {
    this.reducer.clear();
  }
  fromClipboard(): void {
    this.reducer.fromClipboard();
  }
  putVoiceName(): void {
    this.reducer.putVoiceName();
  }
  directory(): void {
    this.reducer.directory();
  }

  switchSettingsView(): void {
    this.reducer.switchSettingsView();
  }
  switchMainView(): void {
    this.reducer.switchMainView();
  }
  switchMessageListType(): void {
    this.reducer.switchMessageListType();
  }
  switchAlwaysOnTop(): void {
    this.reducer.switchAlwaysOnTop();
  }

  // store observer
  update(objects: {[key: string]: any}): void {
    this.$timeout(() => {});
  }
}
angular.module('mainControllers',
  ['mainStores', 'mainReducers', 'mainDirectives', 'mainServices', 'mainModels', 'input-highlight'])
  .controller('MainController', [
    '$scope',
    '$timeout',
    'MainStore',
    'MainReducer',
    'AquesTalk1Lib',
    'YPhontMasterList',
    'YPhontMasterIosEnvList',
    (
      $scope: ng.IScope,
      $timeout: ng.ITimeoutService,
      store: yubo.MainStore,
      reducer: yubo.MainReducer,
      aquesTalk1Lib: yubo.AquesTalk1Lib,
      YPhontMasterList: yubo.YPhont[],
      YPhontMasterIosEnvList: yubo.YPhont[]
    ) => new MainController($scope, $timeout, store, reducer, aquesTalk1Lib, YPhontMasterList, YPhontMasterIosEnvList),
  ]);
