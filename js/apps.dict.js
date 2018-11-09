"use strict";
var app = require('electron').remote.app;
var _ipcRenderer, ipcRenderer = function () { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };
var _log, log = function () { _log = _log || require('electron-log'); return _log; };
var _fs, fs = function () { _fs = _fs || require('fs'); return _fs; };
var _parse, parse = function () { _parse = _parse || require('csv-parse/lib/sync'); return _parse; };
var _stringify, stringify = function () { _stringify = _stringify || require('csv-stringify/lib/sync'); return _stringify; };
var _epath, epath = function () { _epath = _epath || require('electron-path'); return _epath; };
var unpackedPath = epath().getUnpackedPath();
// handle uncaughtException
process.on('uncaughtException', function (err) {
    log().error('main:event:uncaughtException');
    log().error(err);
    log().error(err.stack);
});
// angular app
angular.module('dictApp', ['dictModel', 'dictService',
    'ui.grid', 'ui.grid.edit', 'ui.grid.rowEdit', 'ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.cellNav',
])
    .config(['$qProvider', function ($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
    }])
    // controller
    .controller('DictController', ['$scope', '$q', '$timeout', '$interval', 'AquesService', 'IntroService', 'KindList',
    function ($scope, $q, $timeout, $interval, AquesService, IntroService, KindList) {
        // init
        var ctrl = this;
        $scope.isEditing = false;
        $scope.message = '';
        $scope.alwaysOnTop = false;
        // AqDicEdit, MYukkuriVoice data dir
        var rscDictDir = unpackedPath + "/vendor/aq_dic_large";
        var mAppDictDir = app.getPath('userData') + "/userdict";
        // initialize records
        $scope.gridOptions = {
            enableFiltering: true,
            enableRowSelection: true,
            multiSelect: true,
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                $scope.gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                    // do nothing
                });
                $scope.gridApi.rowEdit.on.saveRow($scope, function (rowEntity) {
                    var d = $q.defer();
                    $scope.isEditing = true;
                    $scope.gridApi.rowEdit.setSavePromise(rowEntity, d.promise);
                    if (!rowEntity.source) {
                        rowEntity.error = '表記が入力されていません';
                        d.reject(new Error('source is empty.'));
                        return d.promise;
                    }
                    if (!rowEntity.encoded) {
                        rowEntity.error = '読みが入力されていません';
                        d.reject(new Error('encoded is empty.'));
                        return d.promise;
                    }
                    var r = AquesService.validateInput(rowEntity.source, rowEntity.encoded, rowEntity.kind);
                    if (!r.success) {
                        rowEntity.error = r.message;
                        d.reject(new Error(r.message));
                    }
                    else {
                        delete rowEntity.error;
                        d.resolve('ok');
                    }
                    return d.promise;
                });
            }
        };
        $scope.gridOptions.columnDefs = [
            {
                name: 'source', displayName: '表記', enableCellEdit: true,
                field: 'source', enableFiltering: true,
                enableHiding: false, enableColumnMenu: true
            },
            {
                name: 'encoded', displayName: '読み', enableCellEdit: true,
                field: 'encoded', enableFiltering: true,
                enableHiding: false, enableColumnMenu: true
            },
            {
                name: 'kind', displayName: '品詞', editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'mapKind', editDropdownValueLabel: 'kind', editDropdownOptionsArray: KindList,
                field: 'kind', enableFiltering: false,
                enableHiding: false, enableColumnMenu: true
            },
            {
                name: 'error', displayName: 'Note', enableCellEdit: false,
                field: 'error', enableFiltering: true,
                enableHiding: true, enableColumnMenu: true
            },
        ];
        $scope.gridOptions.data = [];
        this.init = function () {
            var _this = this;
            return this.setup().then(function () {
                return _this.loadCsv().then(function (records) {
                    $scope.gridOptions.data = records;
                    $timeout(function () { $scope.$apply(); });
                    return true;
                });
            });
        };
        this.setup = function () {
            var d = $q.defer();
            // mkdir
            fs().stat("" + mAppDictDir, function (err, stats) {
                if (err) {
                    fs().mkdirSync("" + mAppDictDir);
                }
                // copy resource
                fs().stat(mAppDictDir + "/aq_user.csv", function (err, stats) {
                    if (err) {
                        fs().writeFileSync(mAppDictDir + "/aq_user.csv", fs().readFileSync(rscDictDir + "/aq_user.csv"));
                    }
                    d.resolve('ok');
                });
            });
            return d.promise;
        };
        this.loadCsv = function () {
            var d = $q.defer();
            fs().readFile(mAppDictDir + "/aq_user.csv", 'utf-8', function (err, data) {
                if (err) {
                    d.reject(err);
                    return;
                }
                var records = (parse())(data, {
                    columns: [
                        'source',
                        'encoded',
                        'kind',
                    ],
                    skip_empty_lines: true
                });
                d.resolve(records);
            });
            return d.promise;
        };
        this.init();
        // action
        ctrl.add = function () {
            $scope.isEditing = true;
            if ($scope.gridApi.selection.getSelectedRows()) {
                var row = $scope.gridApi.selection.getSelectedRows()[0];
                var index = $scope.gridOptions.data.indexOf(row);
                var newrow_1 = {
                    source: '',
                    encoded: '',
                    kind: '0'
                };
                $scope.gridOptions.data.splice(index, 0, newrow_1);
                $scope.message = 'insert new record.';
                $interval(function () { $scope.gridApi.rowEdit.setRowsDirty([newrow_1]); }, 0, 1);
            }
            else {
                var newrow_2 = {
                    source: '',
                    encoded: '',
                    kind: '0'
                };
                $scope.gridOptions.data.unshift(newrow_2);
                $scope.message = 'add new record.';
                $interval(function () { $scope.gridApi.rowEdit.setRowsDirty([newrow_2]); }, 0, 1);
            }
        };
        ctrl["delete"] = function () {
            if ($scope.gridApi.selection.getSelectedRows()) {
                $scope.isEditing = true;
                var rows = $scope.gridApi.selection.getSelectedRows();
                for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                    var row = rows_1[_i];
                    var index = $scope.gridOptions.data.indexOf(row);
                    $scope.gridOptions.data.splice(index, 1);
                }
                $scope.gridApi.rowEdit.setRowsClean(rows);
                $scope.message = 'delete selected records.';
            }
            else {
                $scope.message = 'no record are selected. can not delete data.';
            }
        };
        ctrl.save = function () {
            this.validateData().then(function () {
                var data = (stringify())($scope.gridOptions.data, {
                    columns: [
                        'source',
                        'encoded',
                        'kind',
                    ],
                    quote: ''
                });
                fs().writeFileSync(mAppDictDir + "/aq_user.csv", data);
                $scope.isEditing = false;
                $scope.message = 'save records, DONE.';
                $timeout(function () { $scope.$apply(); });
            })["catch"](function (err) {
                $scope.message = 'error data are found. can not save data, until fix these.';
                $timeout(function () { $scope.$apply(); });
            });
        };
        ctrl.cancel = function () {
            return this.loadCsv().then(function (records) {
                $scope.gridOptions.data = records;
                $scope.isEditing = false;
                $scope.message = 'cancel, and reload working records.';
                $timeout(function () { $scope.$apply(); });
                return true;
            });
        };
        ctrl["export"] = function () {
            if ($scope.isEditing) {
                return;
            }
            this.validateData().then(function () {
                // copy resource
                fs().stat(mAppDictDir + "/aqdic.bin", function (err, stats) {
                    if (err) {
                        fs().writeFileSync(mAppDictDir + "/aqdic.bin", fs().readFileSync(rscDictDir + "/aqdic.bin"));
                    }
                    // generate user dict
                    var r = AquesService.generateUserDict(mAppDictDir + "/aq_user.csv", mAppDictDir + "/aq_user.dic");
                    if (!r.success) {
                        $scope.message = r.message;
                        $timeout(function () { $scope.$apply(); });
                        return;
                    }
                    $scope.message = 'export user dictionary, DONE.';
                    $timeout(function () { $scope.$apply(); });
                });
            })["catch"](function (err) {
                $scope.message = 'error data are found. can not export data, until fix these.';
                $timeout(function () { $scope.$apply(); });
            });
        };
        ctrl.reset = function () {
            var d = $q.defer();
            // reset csv
            fs().writeFileSync(mAppDictDir + "/aq_user.csv", fs().readFileSync(rscDictDir + "/aq_user.csv"));
            // and load
            this.loadCsv().then(function (records) {
                $scope.gridApi.rowEdit.setRowsClean($scope.gridOptions.data);
                $scope.gridOptions.data = records;
                $scope.isEditing = false;
                $scope.message = 'reset working records with master dictionary data.';
                $timeout(function () { $scope.$apply(); });
                d.resolve(true);
            });
            return d.promise;
        };
        ctrl.reload = function () {
            ipcRenderer().send('reloadMainWindow', 'reload');
        };
        this.validateData = function () {
            var d = $q.defer();
            $scope.gridApi.rowEdit.flushDirtyRows($scope.gridApi.grid).then(function () {
                var errorRows = $scope.gridApi.rowEdit.getErrorRows($scope.gridApi.grid);
                if (errorRows.length > 0) {
                    d.reject(new Error('error data found.'));
                }
                else {
                    d.resolve(true);
                }
            })["catch"](function (err) {
                d.reject(err);
            });
            return d.promise;
        };
        ctrl.tutorial = function () {
            IntroService.tutorial();
        };
    }])
    .filter('mapKind', ['KindHash', function (KindHash) {
        var kindHash = KindHash;
        return function (input) {
            return kindHash[input] ? kindHash[input] : '';
        };
    }]);
