var app = require('electron').remote.app;
var _ipcRenderer, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };
var _log, log                 = () => { _log = _log || require('electron-log'); return _log; };
var _fs, fs                   = () => { _fs = _fs || require('fs'); return _fs; };
var _parse, parse             = () => { _parse = _parse || require('csv-parse/lib/sync'); return _parse; };
var _stringify, stringify     = () => { _stringify = _stringify || require('csv-stringify/lib/sync'); return _stringify; };
var _epath, epath             = () => { _epath = _epath || require('electron-path'); return _epath; };
var _monitor, monitor         = () => { _monitor = _monitor || require('electron-performance-monitor'); return _monitor; };

var unpackedPath = epath().getUnpackedPath();

// env
var MONITOR = process.env.MONITOR != null;

// action reducer
class DictReducer implements yubo.DictReducer {
  readonly htmlTitle: string = document.title;
  // AqDicEdit, MYukkuriVoice data dir
  readonly rscDictDir: string = `${unpackedPath}/vendor/aq_dic_large`;
  readonly mAppDictDir: string = `${app.getPath('userData')}/userdict`;

  constructor(
    private $q: ng.IQService,
    private $timeout: ng.ITimeoutService,
    private $interval: ng.IIntervalService,
    private AqUsrDicService: yubo.AqUsrDicService,
    private IntroService: yubo.IntroService,
    private KindList: yubo.KindEntry[]
  ) {}

  // event
  onMenu($scope: yubo.IDictScope, action: string): void {
    switch (action) {
      case 'reset':
        this.reset($scope);
        break;
    }
  }

  // $onInit
  init($scope: yubo.IDictScope): void {
    this.setup().then(() => {
      return this.loadCsv().then((records: yubo.DictRecord[]) => {
        $scope.gridOptions.data = records;
        this.$timeout(() => { $scope.$apply(); });
        if (MONITOR) { log().warn(monitor().format('apps.dict', 'record loaded')); }
        return true;
      });
    });
  }
  onLoad($scope: yubo.IDictScope): void {
    // initialize records
    $scope.gridOptions = {
      enableFiltering: true,
      enableRowSelection: true,
      multiSelect: true,
      onRegisterApi: (gridApi: any/*IGridApi*/) => {
        $scope.gridApi = gridApi;
        $scope.gridApi.edit.on.afterCellEdit(
          $scope,
          (rowEntity: any/*TEntity*/, colDef: any/*IColumnDefOf<TEntity>*/, newValue: any, oldValue: any) => {
            // do nothing
          }
        );
        $scope.gridApi.rowEdit.on.saveRow($scope, (rowEntity: any/*TEntity*/) => {
          const d = this.$q.defer<string>();
          this.toIsInEditing($scope);
          $scope.gridApi.rowEdit.setSavePromise(rowEntity, d.promise);

          if (!rowEntity.source) {
            rowEntity.error = '表記が入力されていません';
            //return this.$q.reject(new Error('source is empty.')); // why not working ?
            d.reject(new Error('source is empty.')); return d.promise;
          }
          if (!rowEntity.encoded) {
            rowEntity.error = '読みが入力されていません';
            //return this.$q.reject(new Error('encoded is empty.')); // why not working ?
            d.reject(new Error('encoded is empty.')); return d.promise;
          }

          const r = this.AqUsrDicService.validateInput(rowEntity.source, rowEntity.encoded, rowEntity.kind);
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
        cellFilter: 'mapKind', editDropdownValueLabel: 'kind', editDropdownOptionsArray: this.KindList,
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
  }

  setup(): ng.IPromise<string> {
    const d = this.$q.defer<string>();
    // mkdir
    fs().stat(`${this.mAppDictDir}`, (err: Error, stats: fs.Stats) => {
      if (err) {
        fs().mkdirSync(`${this.mAppDictDir}`);
      }
    // copy resource
    fs().stat(`${this.mAppDictDir}/aq_user.csv`, (err: Error, stats: fs.Stats) => {
      if (err) {
        fs().writeFileSync(`${this.mAppDictDir}/aq_user.csv`, fs().readFileSync(`${this.rscDictDir}/aq_user.csv`));
      }
      d.resolve('ok');
    });
    });
    return d.promise;
  }
  loadCsv(): ng.IPromise<yubo.DictRecord[]> {
    const d = this.$q.defer<yubo.DictRecord[]>();
    fs().readFile(`${this.mAppDictDir}/aq_user.csv`, 'utf-8', (err: Error, data: Buffer) => {
      if (err) {
        d.reject(err); return;
      }
      const records: yubo.DictRecord[] = (parse())(data, {
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
  }

  toIsInEditing($scope: yubo.IDictScope): void {
    const win = require('electron').remote.getCurrentWindow();
    $scope.isInEditing = true;
    win.setDocumentEdited(true);
    win.setTitle(`* ${this.htmlTitle}`);
  }
  clearInEditing($scope: yubo.IDictScope): void {
    const win = require('electron').remote.getCurrentWindow();
    $scope.isInEditing = false;
    win.setDocumentEdited(false);
    win.setTitle(this.htmlTitle);
  }

  add($scope: yubo.IDictScope): void {
    this.toIsInEditing($scope);
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
      this.$interval(() => { $scope.gridApi.rowEdit.setRowsDirty([newrow]); }, 0, 1);
    } else {
      const newrow = {
        source: '',
        encoded: '',
        kind: '0',
      };
      $scope.gridOptions.data.unshift(newrow);
      $scope.message = '新規レコードを作業データに追加しました。';
      this.$interval(() => { $scope.gridApi.rowEdit.setRowsDirty([newrow]); }, 0, 1);
    }
  }
  remove($scope: yubo.IDictScope): void {
    if ($scope.gridApi.selection.getSelectedRows().length > 0) {
      this.toIsInEditing($scope);
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
  }
  save($scope: yubo.IDictScope): void {
    this.validateData($scope).then(() => {
      const data = (stringify())($scope.gridOptions.data, {
        columns: [
          'source',
          'encoded',
          'kind',
        ],
        quote: '',
      });
      fs().writeFileSync(`${this.mAppDictDir}/aq_user.csv`, data);
      this.clearInEditing($scope);
      $scope.message = '作業データを保存しました。';
      this.$timeout(() => { $scope.$apply(); });
    })
    .catch((err: Error) => {
      $scope.message = 'エラー。不正な作業データが残っています。修正するまで保存できません。';
      this.$timeout(() => { $scope.$apply(); });
    });
  }
  cancel($scope: yubo.IDictScope): ng.IPromise<boolean> {
    return this.loadCsv().then((records: yubo.DictRecord[]) => {
      $scope.gridApi.rowEdit.setRowsClean($scope.gridOptions.data);
      $scope.gridOptions.data = records;
      this.clearInEditing($scope);
      $scope.message = '保存していない編集中の作業データを取り消しました。';
      this.$timeout(() => { $scope.$apply(); });
      return true;
    });
  }
  dump($scope: yubo.IDictScope): void {
    if ($scope.isInEditing) { return; }
    this.validateData($scope).then(() => {
      // copy resource
      fs().stat(`${this.mAppDictDir}/aqdic.bin`, (err: Error, stats: fs.Stats) => {
        if (err) {
          fs().writeFileSync(`${this.mAppDictDir}/aqdic.bin`, fs().readFileSync(`${this.rscDictDir}/aqdic.bin`));
        }
        // generate user dict
        const r = this.AqUsrDicService.generateUserDict(`${this.mAppDictDir}/aq_user.csv`, `${this.mAppDictDir}/aq_user.dic`);
        if (!r.success) {
          $scope.message = r.message;
          this.$timeout(() => { $scope.$apply(); });
          return;
        }
        $scope.message = 'ユーザー辞書を更新しました。';
        this.$timeout(() => { $scope.$apply(); });
      });
    })
    .catch((err: Error) => {
      $scope.message = 'エラー。不正な作業データが残っています。修正するまでエクスポートできません。';
      this.$timeout(() => { $scope.$apply(); });
    });
  }
  reset($scope: yubo.IDictScope): ng.IPromise<boolean> {
    const d = this.$q.defer<boolean>();
    // reset csv
    fs().writeFileSync(`${this.mAppDictDir}/aq_user.csv`, fs().readFileSync(`${this.rscDictDir}/aq_user.csv`));
    // and load
    this.loadCsv().then((records: yubo.DictRecord[]) => {
      $scope.gridApi.rowEdit.setRowsClean($scope.gridOptions.data);
      $scope.gridOptions.data = records;
      this.clearInEditing($scope);
      $scope.message = 'マスター辞書データで作業データをリセットしました。';
      this.$timeout(() => { $scope.$apply(); });
      d.resolve(true);
    });
    return d.promise;
  }
  reload($scope: yubo.IDictScope): void {
    ipcRenderer().send('reloadMainWindow', 'reload');
    $scope.message = 'MYukkuriVoiceのメイン画面を更新します。';
  }
  validateData($scope: yubo.IDictScope): ng.IPromise<boolean> {
    const d = this.$q.defer<boolean>();
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
  }

  tutorial(): void {
    this.IntroService.dictTutorial();
  }
}

angular.module('dictReducers', ['dictModels', 'dictServices'])
  .service('DictReducer', [
    '$q',
    '$timeout',
    '$interval',
    'AqUsrDicService',
    'IntroService',
    'KindList',
    DictReducer,
  ]);
