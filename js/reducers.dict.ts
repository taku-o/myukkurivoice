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
  private readonly htmlTitle: string = document.title;
  // AqDicEdit, MYukkuriVoice data dir
  private readonly rscDictDir: string = `${unpackedPath}/vendor/aq_dic_large`;
  private readonly mAppDictDir: string = `${app.getPath('userData')}/userdict`;
  // ui-grid
  private gridApi: any/*IGridApi*/;

  constructor(
    private $q: ng.IQService,
    private $interval: ng.IIntervalService,
    private store: yubo.DictStore,
    private AqUsrDicService: yubo.AqUsrDicService,
    private IntroService: yubo.IntroService,
    private KindList: yubo.KindEntry[]
  ) {}

  // event
  onMenu(action: string): void {
    switch (action) {
      case 'reset':
        this.reset();
        break;
    }
  }

  // $onInit
  init(): void {
    this.setup().then(() => {
      return this.loadCsv().then((records: yubo.DictRecord[]) => {
        this.store.gridOptions.data = records;
        this.notifyUpdates({gridOptions: this.store.gridOptions});
        if (MONITOR) { log().warn(monitor().format('apps.dict', 'record loaded')); }
        return true;
      });
    });
  }
  onLoad($scope: ng.IScope): void {
    // initialize records
    this.store.gridOptions = {
      enableFiltering: true,
      enableRowSelection: true,
      multiSelect: true,
      onRegisterApi: (gridApi: any/*IGridApi*/) => {
        this.gridApi = gridApi;
        this.gridApi.edit.on.afterCellEdit(
          $scope,
          (rowEntity: any/*TEntity*/, colDef: any/*IColumnDefOf<TEntity>*/, newValue: any, oldValue: any) => {
            // do nothing
          }
        );
        this.gridApi.rowEdit.on.saveRow($scope, (rowEntity: any/*TEntity*/) => {
          const d = this.$q.defer<string>();
          this.toIsInEditing();
          this.gridApi.rowEdit.setSavePromise(rowEntity, d.promise);

          if (!rowEntity.source) {
            rowEntity.error = '表記が入力されていません';
            return this.$q.reject(new Error('source is empty.'));
          }
          if (!rowEntity.encoded) {
            rowEntity.error = '読みが入力されていません';
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

    this.store.gridOptions.columnDefs = [
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
    this.store.gridOptions.data = [];
  }

  private setup(): ng.IPromise<string> {
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
  private loadCsv(): ng.IPromise<yubo.DictRecord[]> {
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

  toIsInEditing(): void {
    const win = require('electron').remote.getCurrentWindow();
    this.store.isInEditing = true;
    win.setDocumentEdited(true);
    win.setTitle(`* ${this.htmlTitle}`);
  }
  clearInEditing(): void {
    const win = require('electron').remote.getCurrentWindow();
    this.store.isInEditing = false;
    win.setDocumentEdited(false);
    win.setTitle(this.htmlTitle);
  }

  add(): void {
    this.toIsInEditing();
    if (this.gridApi.selection.getSelectedRows().length > 0) {
      const row = this.gridApi.selection.getSelectedRows()[0];
      const index = this.store.gridOptions.data.indexOf(row);
      const newrow = {
        source: '',
        encoded: '',
        kind: '0',
      };
      this.store.gridOptions.data.splice(index, 0, newrow);
      this.store.message = '新規レコードを作業データに挿入しました。';
      this.$interval(() => { this.gridApi.rowEdit.setRowsDirty([newrow]); }, 0, 1);
    } else {
      const newrow = {
        source: '',
        encoded: '',
        kind: '0',
      };
      this.store.gridOptions.data.unshift(newrow);
      this.store.message = '新規レコードを作業データに追加しました。';
      this.$interval(() => { this.gridApi.rowEdit.setRowsDirty([newrow]); }, 0, 1);
    }
  }
  remove(): void {
    if (this.gridApi.selection.getSelectedRows().length > 0) {
      this.toIsInEditing();
      const rows = this.gridApi.selection.getSelectedRows();
      for (let row of rows) {
        const index = this.store.gridOptions.data.indexOf(row);
        this.store.gridOptions.data.splice(index, 1);
      }
      this.gridApi.rowEdit.setRowsClean(rows);
      this.store.message = 'レコードを削除しました。';
    } else {
      this.store.message = 'エラー。削除対象のレコードが選択されていません。';
    }
  }
  save(): void {
    this.validateData().then(() => {
      const data = (stringify())(this.store.gridOptions.data, {
        columns: [
          'source',
          'encoded',
          'kind',
        ],
        quote: '',
      });
      fs().writeFileSync(`${this.mAppDictDir}/aq_user.csv`, data);
      this.clearInEditing();
      this.store.message = '作業データを保存しました。';
      this.notifyUpdates({});
    })
    .catch((err: Error) => {
      this.store.message = 'エラー。不正な作業データが残っています。修正するまで保存できません。';
      this.notifyUpdates({message: this.store.message});
    });
  }
  cancel(): ng.IPromise<boolean> {
    return this.loadCsv().then((records: yubo.DictRecord[]) => {
      this.gridApi.rowEdit.setRowsClean(this.store.gridOptions.data);
      this.store.gridOptions.data = records;
      this.clearInEditing();
      this.store.message = '保存していない編集中の作業データを取り消しました。';
      this.notifyUpdates({});
      return true;
    });
  }
  dump(): void {
    if (this.store.isInEditing) { return; }
    this.validateData().then(() => {
      // copy resource
      fs().stat(`${this.mAppDictDir}/aqdic.bin`, (err: Error, stats: fs.Stats) => {
        if (err) {
          fs().writeFileSync(`${this.mAppDictDir}/aqdic.bin`, fs().readFileSync(`${this.rscDictDir}/aqdic.bin`));
        }
        // generate user dict
        const r = this.AqUsrDicService.generateUserDict(`${this.mAppDictDir}/aq_user.csv`, `${this.mAppDictDir}/aq_user.dic`);
        if (!r.success) {
          this.store.message = r.message;
          this.notifyUpdates({message: this.store.message});
          return;
        }
        this.store.message = 'ユーザー辞書を更新しました。';
        this.notifyUpdates({message: this.store.message});
      });
    })
    .catch((err: Error) => {
      this.store.message = 'エラー。不正な作業データが残っています。修正するまでエクスポートできません。';
      this.notifyUpdates({message: this.store.message});
    });
  }
  reset(): ng.IPromise<boolean> {
    const d = this.$q.defer<boolean>();
    // reset csv
    fs().writeFileSync(`${this.mAppDictDir}/aq_user.csv`, fs().readFileSync(`${this.rscDictDir}/aq_user.csv`));
    // and load
    this.loadCsv().then((records: yubo.DictRecord[]) => {
      this.gridApi.rowEdit.setRowsClean(this.store.gridOptions.data);
      this.store.gridOptions.data = records;
      this.clearInEditing();
      this.store.message = 'マスター辞書データで作業データをリセットしました。';
      this.notifyUpdates({});
      d.resolve(true);
    });
    return d.promise;
  }
  reload(): void {
    ipcRenderer().send('reloadMainWindow', 'reload');
    this.store.message = 'MYukkuriVoiceのメイン画面を更新します。';
  }
  private validateData(): ng.IPromise<boolean> {
    const d = this.$q.defer<boolean>();
    this.gridApi.rowEdit.flushDirtyRows(this.gridApi.grid).then(() => {
      const errorRows = this.gridApi.rowEdit.getErrorRows(this.gridApi.grid);
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
      this.gridApi.rowEdit.setRowsClean(errorRows);
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

angular.module('dictReducers', ['dictStores', 'dictModels', 'dictServices'])
  .service('DictReducer', [
    '$q',
    '$interval',
    'DictStore',
    'AqUsrDicService',
    'IntroService',
    'KindList',
    DictReducer,
  ]);
