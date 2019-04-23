var _ipcRenderer: any, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };

// action reducer
class SystemReducer implements yubo.SystemReducer {
  constructor(
    private store: yubo.SystemStore,
    private LicenseService: yubo.LicenseService
  ) {}

  // $onInit
  onLoad(): void {
    const appCfg = require('electron').remote.getGlobal('appCfg');
    this.store.appCfg = appCfg;
    this.store.aq10UseKey = appCfg.aq10UseKeyEncrypted?
      this.LicenseService.decrypt(appCfg.passPhrase, appCfg.aq10UseKeyEncrypted):
      '';
  }

  cancel(): void {
    this.store.appCfg = angular.copy(require('electron').remote.getGlobal('appCfg'));
    const curwindow = require('electron').remote.getCurrentWindow();
    curwindow.close();
  }
  save(): void {
    const aq10UseKeyEncrypted = this.store.aq10UseKey?
      this.LicenseService.encrypt(this.store.appCfg.passPhrase, this.store.aq10UseKey):
      '';
    const options = {
      'mainWindow': this.store.appCfg.mainWindow,
      'audioServVer': this.store.appCfg.audioServVer,
      'showMsgPane': this.store.appCfg.showMsgPane,
      'passPhrase': this.store.appCfg.passPhrase,
      'aq10UseKeyEncrypted':aq10UseKeyEncrypted,
    };
    ipcRenderer().send('updateAppConfig', options);
  }
  reset(): void {
    ipcRenderer().send('resetAppConfig', '');
  }

  // store observer
  private observers: yubo.StoreObserver[] = [];
  addObserver(observer: yubo.StoreObserver): void {
    this.observers.push(observer);
  }
  private notifyUpdates(objects: {[key: string]: any}): void {
    for (let o of this.observers) {
      o.update(objects);
    }
  }
}

angular.module('systemReducers', ['systemStores', 'LicenseServices'])
  .service('SystemReducer', [
    'SystemStore',
    'LicenseService',
    SystemReducer,
  ]);
