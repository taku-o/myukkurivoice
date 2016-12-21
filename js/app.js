var ipcRenderer = require('electron').ipcRenderer
var util = require('util');

// angular app
angular.module('yvoiceApp', ['yvoiceService', 'yvoiceModel'])
  .controller('MainController',
    ['$scope', 'DbService', 'MasterService', 'AquesService', 'AudioService',
    function($scope, DbService, MasterService, AquesService, AudioService) {

    // init
    var ctrl = this;
    $scope.phont_list = MasterService.get_phont_list();
    $scope.effect_list = MasterService.get_effect_list();

    DbService.load(function(data_list){
      if (data_list.length < 1) {
        var new_yvoice = DbService.create();
        data_list.push(new_yvoice);
      }
      $scope.yvoice_list = data_list;
      $scope.yvoice = $scope.yvoice_list[0];
      $scope.$apply();
    });

    // action
    ctrl.play = function() {
      if (!$scope.yvoice.encoded) { return; }
      if ($scope.phont_list.length <= $scope.yvoice.phont) { return; }
      var encoded = $scope.yvoice.encoded;
      var volume = $scope.yvoice.volume;
      var speed = $scope.yvoice.speed;
      var phont = $scope.phont_list[$scope.yvoice.phont];

      var buf_wav = AquesService.wave(encoded, phont, speed, volume);
      if (!buf_wav) { return; }

      AudioService.play(buf_wav);
    };
    ctrl.stop = function() {
      AudioService.stop();
    };
    ctrl.record = function() {
      if (!$scope.yvoice.encoded) { return; }
      if ($scope.phont_list.length <= $scope.yvoice.phont) { return; }
      var encoded = $scope.yvoice.encoded;
      var volume = $scope.yvoice.volume;
      var speed = $scope.yvoice.speed;
      var phont = $scope.phont_list[$scope.yvoice.phont];

      ipcRenderer.on('showSaveDialog', function (event, file_path) {
        if (!file_path) { return; }
        var buf_wav = AquesService.wave(encoded, phont, speed, volume);
        if (!buf_wav) { return; }
        AudioService.record(file_path, buf_wav);
      });
      ipcRenderer.send('showSaveDialog', 'wav');
    };
    ctrl.tutorial = function() {
      introJs().start();
    }

    ctrl.select = function(index) {
      $scope.yvoice = $scope.yvoice_list[index];
    };
    ctrl.plus = function() {
      var new_yvoice = DbService.create();
      $scope.yvoice_list.push(new_yvoice);
    };
    ctrl.minus = function(index) {
      $scope.yvoice_list.splice(index, 1);
    };
    ctrl.copy = function(index) {
      var original = $scope.yvoice_list[index];
      var new_yvoice = DbService.copy(original);
      $scope.yvoice_list.push(new_yvoice);
    };
    ctrl.save = function() {
      DbService.save($scope.yvoice_list);
    };

    ctrl.encode = function() {
      var source = $scope.yvoice['source'];
      var encoded = AquesService.encode(source);
      $scope.yvoice['encoded'] = encoded;
    };
    ctrl.clear = function() {
      $scope.yvoice['source'] = '';
      $scope.yvoice['encoded'] = '';
    };

    // shortcut
    ipcRenderer.on('shortcut', function (event, action) {
      switch (action) {
        case 'play':
          document.getElementById('play').click();
          break;
        case 'record':
          document.getElementById('record').click();
          break;
        case 'move_to_source':
          document.getElementById('source').focus();
          break;
        case 'move_to_encoded':
          document.getElementById('encoded').focus();
          break;
        case 'encode':
          document.getElementById('encode').click();
          break;
      }
    });
  }]);

