var _ipcRenderer, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };

// action reducer
class SystemReducer implements yubo.SystemReducer {
  constructor(
    private LicenseService: yubo.LicenseService
  ) {}

  // $onInit
  onLoad($scope: yubo.ISystemScope): void {
    const appCfg = require('electron').remote.getGlobal('appCfg');
    $scope.appCfg = appCfg;
    $scope.aq10UseKey = appCfg.aq10UseKeyEncrypted?
      this.LicenseService.decrypt(appCfg.passPhrase, appCfg.aq10UseKeyEncrypted):
      '';
  }

  cancel($scope: yubo.ISystemScope): void {
    $scope.appCfg = angular.copy(require('electron').remote.getGlobal('appCfg'));
    const window = require('electron').remote.getCurrentWindow();
    window.close();
  }
  save($scope: yubo.ISystemScope): void {
    const aq10UseKeyEncrypted = $scope.aq10UseKey?
      this.LicenseService.encrypt($scope.appCfg.passPhrase, $scope.aq10UseKey):
      '';
    const options = {
      'mainWindow':$scope.appCfg.mainWindow,
      'audioServVer':$scope.appCfg.audioServVer,
      'showMsgPane':$scope.appCfg.showMsgPane,
      'passPhrase':$scope.appCfg.passPhrase,
      'aq10UseKeyEncrypted':aq10UseKeyEncrypted,
    };
    ipcRenderer().send('updateAppConfig', options);
  }
  reset(): void {
    ipcRenderer().send('resetAppConfig', '');
  }
}

angular.module('systemReducers', ['LicenseServices'])
  .service('SystemReducer', [
    'LicenseService',
    SystemReducer,
  ]);
