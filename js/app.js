const ipcRenderer = require('electron').ipcRenderer
const util = require('util');

// angular app
angular.module('yvoiceApp', ['yvoiceService', 'yvoiceModel'])
  .controller('MainController',
    ['$scope', 'ConfigService', 'DataService', 'MasterService', 'AquesService', 'AudioService', 'IntroService', 'YInput', 'YInputInitialData',
    function($scope, ConfigService, DataService, MasterService, AquesService, AudioService, IntroService, YInput, YInputInitialData) {

    // init
    var ctrl = this;
    $scope.phont_list = MasterService.get_phont_list();
    $scope.effect_list = MasterService.get_effect_list();
    $scope.yinput = angular.copy(YInput);
    load_data();

    // util
    function load_data() {
      ConfigService.load(function(config) {
        $scope.yconfig = config;
        $scope.$apply();
      });

      DataService.load(function(data_list) {
        if (data_list.length < 1) {
          data_list = DataService.initial_data();
        }
        $scope.yvoice_list = data_list;
        $scope.yvoice = $scope.yvoice_list[0];
        $scope.$apply();
      });
    };

    // action
    ctrl.play = function() {
      if (!$scope.yinput.encoded) { return; }
      if ($scope.phont_list.length <= $scope.yvoice.phont) { return; }
      var encoded = $scope.yinput.encoded;
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
      if (!$scope.yinput.encoded) { return; }
      if ($scope.phont_list.length <= $scope.yvoice.phont) { return; }
      var encoded = $scope.yinput.encoded;
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
      IntroService.tutorial();
    }
    ctrl.shortcut = function() {
      IntroService.shortcut();
    }

    ctrl.select = function(index) {
      $scope.yvoice = $scope.yvoice_list[index];
    };
    ctrl.plus = function() {
      var new_yvoice = DataService.create();
      $scope.yvoice_list.push(new_yvoice);
    };
    ctrl.minus = function(index) {
      if ($scope.yvoice_list.length < 2) {
        return;
      }
      $scope.yvoice_list.splice(index, 1);
      $scope.yvoice = $scope.yvoice_list[0];
    };
    ctrl.copy = function(index) {
      var original = $scope.yvoice_list[index];
      var new_yvoice = DataService.copy(original);
      $scope.yvoice_list.push(new_yvoice);
    };
    ctrl.save = function() {
      DataService.save($scope.yvoice_list);
    };
    ctrl.reset = function() {
      ConfigService.clear(function() {
        DataService.clear(function() {
          load_data();
        });
      });
      $scope.yinput = angular.copy(YInputInitialData);
    };

    ctrl.encode = function() {
      var source = $scope.yinput.source;
      var encoded = AquesService.encode(source);
      $scope.yinput.encoded = encoded;
    };
    ctrl.clear = function() {
      $scope.yinput.source = '';
      $scope.yinput.encoded = '';
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

    // menu
    ipcRenderer.on('menu', function (event, action) {
      switch (action) {
        case 'clear':
          document.getElementById('clear').click();
          $scope.$apply();
          break;
        case 'stop':
          document.getElementById('stop').click();
          break;
        case 'plus':
          document.getElementById('plus').click();
          $scope.$apply();
          break;
        case 'minus':
          var index = $scope.yvoice_list.indexOf($scope.yvoice);
          ctrl.minus(index);
          $scope.$apply();
          break;
        case 'copy':
          var index = $scope.yvoice_list.indexOf($scope.yvoice);
          ctrl.copy(index);
          $scope.$apply();
          break;
        case 'save':
          document.getElementById('save').click();
          break;
        case 'reset':
          ctrl.reset();
          break;
        case 'tutorial':
          document.getElementById('tutorial').click();
          break;
      }
    });
  }]);

