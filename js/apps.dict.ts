var app = require('electron').remote.app;
var _ipcRenderer, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };
var _log, log                 = () => { _log = _log || require('electron-log'); return _log; };
var _fs, fs                   = () => { _fs = _fs || require('fs'); return _fs; };
var _parse, parse             = () => { _parse = _parse || require('csv-parse/lib/sync'); return _parse; };
var _stringify, stringify     = () => { _stringify = _stringify || require('csv-stringify/lib/sync'); return _stringify; };
var _epath, epath             = () => { _epath = _epath || require('electron-path'); return _epath; };

var unpackedPath = epath().getUnpackedPath();

// handle uncaughtException
process.on('uncaughtException', (err: Error) => {
  log().error('main:event:uncaughtException');
  log().error(err);
  log().error(err.stack);
});

// angular app
angular.module('dictApp',
  ['dictModels', 'dictServices',
   'ui.grid', 'ui.grid.edit', 'ui.grid.rowEdit', 'ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.cellNav',
  ])
  .config(['$qProvider', ($qProvider) => {
    $qProvider.errorOnUnhandledRejections(false);
  }])
  // controller
  .controller('DictController',
    ['$scope', '$q', '$timeout', '$interval',
     'AqUsrDicService', 'IntroService', 'KindList',
    function($scope, $q, $timeout, $interval,
      AqUsrDicService: yubo.AqUsrDicService, IntroService: yubo.IntroService, KindList: yubo.KindEntry[]) {

    // menu
    ipcRenderer().on('menu', (event, action: string) => {
      switch (action) {
        case 'add':
          document.getElementById('append-record').click();
          $timeout(() => { $scope.$apply(); });
          break;
        case 'delete':
          document.getElementById('delete-record').click();
          $timeout(() => { $scope.$apply(); });
          break;
        case 'save':
          document.getElementById('save').click();
          break;
        case 'cancel':
          document.getElementById('cancel').click();
          break;
        case 'export':
          document.getElementById('export').click();
          break;
        case 'reset':
          ctrl.reset();
          break;
        case 'tutorial':
          document.getElementById('tutorial').click();
          $timeout(() => { $scope.$apply(); });
          break;
      }
    });
    // shortcut
    ipcRenderer().on('shortcut', (event, action: string) => {
      switch (action) {
        case 'add':
          document.getElementById('append-record').click();
          $timeout(() => { $scope.$apply(); });
          break;
        case 'save':
          document.getElementById('save').click();
          break;
      }
    });

    // init
    const ctrl = this;
    $scope.isInEditing = false;
    $scope.message = '';
    $scope.alwaysOnTop = false;
    // AqDicEdit, MYukkuriVoice data dir
    const rscDictDir = `${unpackedPath}/vendor/aq_dic_large`;
    const mAppDictDir = `${app.getPath('userData')}/userdict`;

    // initialize records
    $scope.gridOptions = {
      enableFiltering: true,
      enableRowSelection: true,
      multiSelect: true,
      onRegisterApi: (gridApi) => {
        $scope.gridApi = gridApi;
        $scope.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newValue, oldValue) => {
          // do nothing
        });
        $scope.gridApi.rowEdit.on.saveRow($scope, (rowEntity) => {
          const d = $q.defer();
          ctrl.toIsInEditing();
          $scope.gridApi.rowEdit.setSavePromise(rowEntity, d.promise);

          if (!rowEntity.source) {
            rowEntity.error = '表記が入力されていません';
            d.reject(new Error('source is empty.')); return d.promise;
          }
          if (!rowEntity.encoded) {
            rowEntity.error = '読みが入力されていません';
            d.reject(new Error('encoded is empty.')); return d.promise;
          }

          const r = AqUsrDicService.validateInput(rowEntity.source, rowEntity.encoded, rowEntity.kind);
          if (!r.success) {
            rowEntity.error = r.message;
            d.reject(new Error(r.message));
          } else {
            delete rowEntity.error;
            d.resolve('ok');
          }
          return d.promise;
        });
      },
    };

    $scope.gridOptions.columnDefs = [
      {
        name: 'source', displayName: '表記', enableCellEdit: true, enableCellEditOnFocus: true,
        field: 'source', enableFiltering: true,
        enableHiding: false, enableColumnMenu: true,
      },
      {
        name: 'encoded', displayName: '読み', enableCellEdit: true, enableCellEditOnFocus: true,
        field: 'encoded', enableFiltering: true,
        enableHiding: false, enableColumnMenu: true,
      },
      {
        name: 'kind', displayName: '品詞', editableCellTemplate: 'ui-grid/dropdownEditor', enableCellEditOnFocus: true,
        cellFilter: 'mapKind', editDropdownValueLabel: 'kind', editDropdownOptionsArray: KindList,
        field: 'kind', enableFiltering: false,
        enableHiding: false, enableColumnMenu: true,
      },
      {
        name: 'error', displayName: 'Note', enableCellEdit: false,
        field: 'error', enableFiltering: true,
        enableHiding: true, enableColumnMenu: true,
      },
    ];
    $scope.gridOptions.data = [];

    this.init = function(): ng.IPromise<boolean> {
      return this.setup().then(() => {
      return this.loadCsv().then((records) => {
        $scope.gridOptions.data = records;
        $timeout(() => { $scope.$apply(); });
        return true;
      });
      });
    };
    this.setup = function(): ng.IPromise<string> {
      const d = $q.defer();
      // mkdir
      fs().stat(`${mAppDictDir}`, (err: Error, stats) => {
        if (err) {
          fs().mkdirSync(`${mAppDictDir}`);
        }
      // copy resource
      fs().stat(`${mAppDictDir}/aq_user.csv`, (err: Error, stats) => {
        if (err) {
          fs().writeFileSync(`${mAppDictDir}/aq_user.csv`, fs().readFileSync(`${rscDictDir}/aq_user.csv`));
        }
        d.resolve('ok');
      });
      });
      return d.promise;
    };
    this.loadCsv = function(): ng.IPromise<any> {
      const d = $q.defer();
      fs().readFile(`${mAppDictDir}/aq_user.csv`, 'utf-8', (err: Error, data) => {
        if (err) {
          d.reject(err); return;
        }
        const records = (parse())(data, {
          columns: [
            'source',
            'encoded',
            'kind',
          ],
          skip_empty_lines: true,
        });
        d.resolve(records);
      });
      return d.promise;
    };
    this.init();

    // editing state
    const title = document.title;
    ctrl.toIsInEditing = function(): void {
      document.title = `* ${title}`;
      $scope.isInEditing = true;
    };
    ctrl.clearInEditing = function(): void {
      document.title = `${title}`;
      $scope.isInEditing = false;
    };

    // action
    ctrl.add = function(): void {
      ctrl.toIsInEditing();
      if ($scope.gridApi.selection.getSelectedRows().length > 0) {
        const row = $scope.gridApi.selection.getSelectedRows()[0];
        const index = $scope.gridOptions.data.indexOf(row);
        const newrow = {
          source: '',
          encoded: '',
          kind: '0',
        };
        $scope.gridOptions.data.splice(index, 0, newrow);
        $scope.message = '新規レコードを作業データに挿入しました。';
        $interval(() => { $scope.gridApi.rowEdit.setRowsDirty([newrow]); }, 0, 1);
      } else {
        const newrow = {
          source: '',
          encoded: '',
          kind: '0',
        };
        $scope.gridOptions.data.unshift(newrow);
        $scope.message = '新規レコードを作業データに追加しました。';
        $interval(() => { $scope.gridApi.rowEdit.setRowsDirty([newrow]); }, 0, 1);
      }
    };
    ctrl.delete = function(): void {
      if ($scope.gridApi.selection.getSelectedRows().length > 0) {
        ctrl.toIsInEditing();
        const rows = $scope.gridApi.selection.getSelectedRows();
        for (let row of rows) {
          const index = $scope.gridOptions.data.indexOf(row);
          $scope.gridOptions.data.splice(index, 1);
        }
        $scope.gridApi.rowEdit.setRowsClean(rows);
        $scope.message = 'レコードを削除しました。';
      } else {
        $scope.message = 'エラー。削除対象のレコードが選択されていません。';
      }
    };

    ctrl.save = function(): void {
      this.validateData().then(() => {
        const data = (stringify())($scope.gridOptions.data, {
          columns: [
            'source',
            'encoded',
            'kind',
          ],
          quote: '',
        });
        fs().writeFileSync(`${mAppDictDir}/aq_user.csv`, data);
        ctrl.clearInEditing();
        $scope.message = '作業データを保存しました。';
        $timeout(() => { $scope.$apply(); });
      })
      .catch((err: Error) => {
        $scope.message = 'エラー。不正な作業データが残っています。修正するまで保存できません。';
        $timeout(() => { $scope.$apply(); });
      });
    };
    ctrl.cancel = function(): ng.IPromise<boolean> {
      return this.loadCsv().then((records) => {
        $scope.gridApi.rowEdit.setRowsClean($scope.gridOptions.data);
        $scope.gridOptions.data = records;
        ctrl.clearInEditing();
        $scope.message = '保存していない編集中の作業データを取り消しました。';
        $timeout(() => { $scope.$apply(); });
        return true;
      });
    };
    ctrl.export = function(): void {
      if ($scope.isInEditing) { return; }
      this.validateData().then(() => {
        // copy resource
        fs().stat(`${mAppDictDir}/aqdic.bin`, (err: Error, stats) => {
          if (err) {
            fs().writeFileSync(`${mAppDictDir}/aqdic.bin`, fs().readFileSync(`${rscDictDir}/aqdic.bin`));
          }
          // generate user dict
          const r = AqUsrDicService.generateUserDict(`${mAppDictDir}/aq_user.csv`, `${mAppDictDir}/aq_user.dic`);
          if (!r.success) {
            $scope.message = r.message;
            $timeout(() => { $scope.$apply(); });
            return;
          }
          $scope.message = 'ユーザー辞書を更新しました。';
          $timeout(() => { $scope.$apply(); });
        });
      })
      .catch((err: Error) => {
        $scope.message = 'エラー。不正な作業データが残っています。修正するまでエクスポートできません。';
        $timeout(() => { $scope.$apply(); });
      });
    };
    ctrl.reset = function(): ng.IPromise<boolean> {
      const d = $q.defer();
      // reset csv
      fs().writeFileSync(`${mAppDictDir}/aq_user.csv`, fs().readFileSync(`${rscDictDir}/aq_user.csv`));
      // and load
      this.loadCsv().then((records) => {
        $scope.gridApi.rowEdit.setRowsClean($scope.gridOptions.data);
        $scope.gridOptions.data = records;
        ctrl.clearInEditing();
        $scope.message = 'マスター辞書データで作業データをリセットしました。';
        $timeout(() => { $scope.$apply(); });
        d.resolve(true);
      });
      return d.promise;
    };
    ctrl.reload = function(): void {
      ipcRenderer().send('reloadMainWindow', 'reload');
      $scope.message = 'MYukkuriVoiceのメイン画面を更新します。';
    };
    this.validateData = function(): ng.IPromise<boolean> {
      const d = $q.defer();
      $scope.gridApi.rowEdit.flushDirtyRows($scope.gridApi.grid).then(() => {
        const errorRows = $scope.gridApi.rowEdit.getErrorRows($scope.gridApi.grid);
        if (errorRows.length < 1) {
          d.resolve(true); return;
        }
        // check errorRows that is really error ?
        for (let row of errorRows) {
          if (row.error) {
            d.reject(new Error('error data found.'));
            return;
          }
        }
        // fix error rows to clean.
        $scope.gridApi.rowEdit.setRowsClean(errorRows);
        d.resolve(true);
      })
      .catch((err: Error) => {
        d.reject(err);
      });
      return d.promise;
    };

    ctrl.tutorial = function(): void {
      IntroService.dictTutorial();
    };
  }])
  .filter('mapKind', ['KindHash', function(KindHash) {
    const kindHash = KindHash;
    return function(input) {
      return kindHash[input]? kindHash[input]: '';
    };
  }]);
