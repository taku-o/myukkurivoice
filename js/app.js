const ipcRenderer = require('electron').ipcRenderer
const util = require('util');

// angular app
angular.module('yvoiceApp', ['yvoiceService', 'yvoiceModel'])
  .controller('MainController',
    ['$scope', 'MessageService', 'ConfigService', 'DataService', 'MasterService', 'AquesService', 'AudioService', 'IntroService', 'YInput', 'YInputInitialData',
    function($scope, MessageService, ConfigService, DataService, MasterService, AquesService, AudioService, IntroService, YInput, YInputInitialData) {

    // event listener
    $scope.$on('message', function(event, log) {
      $scope.message_list.unshift(log);
      while ($scope.message_list.length > 5) {
        $scope.message_list.pop();
      }
    });

    // shortcut
    ipcRenderer.on('shortcut', function (event, action) {
      switch (action) {
        case 'play':
          document.getElementById('play').click();
          break;
        case 'stop':
          document.getElementById('stop').click();
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
        case 'swich_next_config':
          var index = $scope.yvoice_list.indexOf($scope.yvoice);
          if ($scope.yvoice_list.length > index + 1) {
            $scope.yvoice = $scope.yvoice_list[index + 1];
          } else {
            $scope.yvoice = $scope.yvoice_list[0];
          }
          $scope.$apply();
          break;
        case 'swich_previous_config':
          var index = $scope.yvoice_list.indexOf($scope.yvoice);
          if (index - 1 >= 0) {
            $scope.yvoice = $scope.yvoice_list[index - 1];
          } else {
            $scope.yvoice = $scope.yvoice_list[$scope.yvoice_list.length - 1];
          }
          $scope.$apply();
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
        case 'shortcut':
          document.getElementById('shortcut').click();
          break;
        case 'tutorial':
          document.getElementById('tutorial').click();
          break;
      }
    });

    // init
    var ctrl = this;
    $scope.phont_list = MasterService.get_phont_list();
    $scope.effect_list = MasterService.get_effect_list();
    $scope.yinput = angular.copy(YInput);
    $scope.message_list = [];
    load_data();

    // util
    function load_data() {
      ConfigService.load(function(config) {
        $scope.yconfig = config;
        $scope.$apply();
      });

      DataService.load(function(data_list) {
        if (data_list.length < 1) {
          MessageService.info('初期データを読み込みます。');
          data_list = DataService.initial_data();
        }
        $scope.yvoice_list = data_list;
        $scope.yvoice = $scope.yvoice_list[0];
        $scope.$apply();
      });
    };

    // action
    ctrl.play = function() {
      MessageService.action('start to play voice.');
      if (!$scope.yinput.source && !$scope.yinput.encoded) {
        MessageService.error('メッセージ、音記号列、どちらも入力されていません。');
        return;
      }

      var phont = null;
      angular.forEach($scope.phont_list, function(value, key) {
        if (value.id == $scope.yvoice.phont.id) { phont = value; }
      });
      if (!phont) {
        MessageService.error('声の種類が未指定です。');
        return;
      }

      var encoded = $scope.yinput.encoded;
      if (!encoded) {
        var source = $source.yinput.source;
        encoded = AquesService.encode(source);
        if (!encoded) {
          MessageService.error('音記号列に変換できませんでした。');
          return;
        }
      }

      var volume = $scope.yvoice.volume;
      var speed = $scope.yvoice.speed;

      var buf_wav = AquesService.wave(encoded, phont, speed, volume);
      if (!buf_wav) {
        MessageService.error('音声データを作成できませんでした。');
        return;
      }

      AudioService.play(buf_wav);
    };
    ctrl.stop = function() {
      MessageService.action('stop playing voice.');
      AudioService.stop();
    };
    ctrl.record = function() {
      MessageService.action('record voice.');
      if (!$scope.yinput.source && !$scope.yinput.encoded) {
        MessageService.error('メッセージ、音記号列、どちらも入力されていません。');
        return;
      }
      if ($scope.phont_list.length <= $scope.yvoice.phont) { return; }

      var encoded = $scope.yinput.encoded;
      if (!encoded) {
        var source = $source.yinput.source;
        encoded = AquesService.encode(source);
        if (!encoded) {
          MessageService.error('音記号列に変換できませんでした。');
          return;
        }
      }

      var volume = $scope.yvoice.volume;
      var speed = $scope.yvoice.speed;
      var phont = $scope.phont_list[$scope.yvoice.phont];

      ipcRenderer.on('showSaveDialog', function (event, file_path) {
        if (!file_path) {
          MessageService.error('保存先が指定されませんでした。');
          return;
        }
        var buf_wav = AquesService.wave(encoded, phont, speed, volume);
        if (!buf_wav) {
          MessageService.error('音声データを作成できませんでした。');
          return;
        }
        AudioService.record(file_path, buf_wav);
      });
      ipcRenderer.send('showSaveDialog', 'wav');
    };
    ctrl.tutorial = function() {
      MessageService.action('run tutorial.');
      IntroService.tutorial();
    }
    ctrl.shortcut = function() {
      MessageService.action('show shortcut key help.');
      IntroService.shortcut();
    }

    ctrl.select = function(index) {
      MessageService.action('switch voice config.');
      $scope.yvoice = $scope.yvoice_list[index];
    };
    ctrl.plus = function() {
      MessageService.action('add new voice config.');
      var new_yvoice = DataService.create();
      $scope.yvoice_list.push(new_yvoice);
    };
    ctrl.minus = function(index) {
      MessageService.action('delete voice config.');
      if ($scope.yvoice_list.length < 2) {
        MessageService.error('ボイス設定は1件以上必要です。');
        return;
      }
      $scope.yvoice_list.splice(index, 1);
      $scope.yvoice = $scope.yvoice_list[0];
    };
    ctrl.copy = function(index) {
      MessageService.action('copy and create new voice config.');
      var original = $scope.yvoice_list[index];
      var new_yvoice = DataService.copy(original);
      $scope.yvoice_list.push(new_yvoice);
    };
    ctrl.save = function() {
      MessageService.action('save voice config.');
      DataService.save($scope.yvoice_list);
    };
    ctrl.reset = function() {
      MessageService.action('reset all config data.');
      ConfigService.clear(function() {
        DataService.clear(function() {
          load_data();
        });
      });
      $scope.yinput = angular.copy(YInputInitialData);
    };

    ctrl.encode = function() {
      MessageService.action('encode source text.');
      var source = $scope.yinput.source;
      var encoded = AquesService.encode(source);
      $scope.yinput.encoded = encoded;
    };
    ctrl.clear = function() {
      MessageService.action('clear input text.');
      $scope.yinput.source = '';
      $scope.yinput.encoded = '';
    };
  }]);

