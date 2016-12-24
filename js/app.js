var app = require('electron').remote.app;
var ipcRenderer = require('electron').ipcRenderer
var util = require('util');
var path = require('path');

var home_dir = app.getPath('home');

// handle uncaughtException
process.on('uncaughtException', function(err) {
  console.log('main:event:uncaughtException');
  console.error(err);
  console.error(err.stack);
});

// angular app
angular.module('yvoiceApp', ['yvoiceService', 'yvoiceModel'])
  .config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  }])
  .controller('MainController',
    ['$scope', '$timeout', 'MessageService', 'ConfigService', 'DataService', 'MasterService', 'AquesService',
     'AudioService', 'AudioSourceService', 'SeqFNameService', 'IntroService', 'YInput', 'YInputInitialData',
    function($scope, $timeout, MessageService, ConfigService, DataService, MasterService, AquesService,
             AudioService, AudioSourceService, SeqFNameService, IntroService, YInput, YInputInitialData) {

    // event listener
    $scope.$on('message', function(event, log) {
      $scope.message_list.unshift(log);
      while ($scope.message_list.length > 5) {
        $scope.message_list.pop();
      }
      $timeout(function(){ $scope.$apply(); });
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
          $scope.display = 'main';
          $timeout(function(){ $scope.$apply(); });
          break;
        case 'swich_previous_config':
          var index = $scope.yvoice_list.indexOf($scope.yvoice);
          if (index - 1 >= 0) {
            $scope.yvoice = $scope.yvoice_list[index - 1];
          } else {
            $scope.yvoice = $scope.yvoice_list[$scope.yvoice_list.length - 1];
          }
          $scope.display = 'main';
          $timeout(function(){ $scope.$apply(); });
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
          $timeout(function(){ $scope.$apply(); });
          break;
        case 'plus':
          document.getElementById('plus').click();
          $timeout(function(){ $scope.$apply(); });
          break;
        case 'minus':
          var index = $scope.yvoice_list.indexOf($scope.yvoice);
          ctrl.minus(index);
          $timeout(function(){ $scope.$apply(); });
          break;
        case 'copy':
          var index = $scope.yvoice_list.indexOf($scope.yvoice);
          ctrl.copy(index);
          $timeout(function(){ $scope.$apply(); });
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
    $scope.display = 'main';
    $scope.phont_list = MasterService.get_phont_list();
    $scope.effect_list = MasterService.get_effect_list();
    $scope.yinput = angular.copy(YInput);
    $scope.message_list = [];
    load_data();

    // util
    function load_data() {
      ConfigService.load().then(function(config) {
        $scope.yconfig = config;
        $timeout(function(){ $scope.$apply(); });
      });

      DataService.load().then(function(data_list) {
        if (data_list.length < 1) {
          MessageService.info('初期データを読み込みます。');
          data_list = DataService.initial_data();
        }
        $scope.yvoice_list = data_list;
        $scope.yvoice = $scope.yvoice_list[0];
        $timeout(function(){ $scope.$apply(); });
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
        if (value.id == $scope.yvoice.phont) { phont = value; }
      });
      if (!phont) {
        MessageService.error('声の種類が未指定です。');
        return;
      }

      var encoded = $scope.yinput.encoded;
      if (!encoded) {
        var source = $scope.yinput.source;
        encoded = AquesService.encode(source);
        if (!encoded) {
          MessageService.error('音記号列に変換できませんでした。');
          return;
        }
      }

      var volume = $scope.yvoice.volume;
      var speed = $scope.yvoice.speed;

      AquesService.wave(encoded, phont, speed, volume).then(
        function(buf_wav) {
          AudioService.play(buf_wav);
        }, function(err) {
          MessageService.error('音声データを作成できませんでした。');
        }
      );
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

      var phont = null;
      angular.forEach($scope.phont_list, function(value, key) {
        if (value.id == $scope.yvoice.phont) { phont = value; }
      });
      if (!phont) {
        MessageService.error('声の種類が未指定です。');
        return;
      }

      var encoded = $scope.yinput.encoded;
      if (!encoded) {
        var source = $scope.yinput.source;
        encoded = AquesService.encode(source);
        if (!encoded) {
          MessageService.error('音記号列に変換できませんでした。');
          return;
        }
      }

      var volume = $scope.yvoice.volume;
      var speed = $scope.yvoice.speed;

      // 連番保存
      if ($scope.yvoice.seq_write) {
        var dir = $scope.yvoice.seq_write_options.dir;
        var prefix = $scope.yvoice.seq_write_options.prefix;
        if (!dir) {
          dir = home_dir;
        }

        SeqFNameService.next_number(dir, prefix)
          .then(function(next_num) {
            var next_fname = SeqFNameService.next_fname(prefix, next_num);
            var file_path = path.join(dir, next_fname);

            AquesService.wave(encoded, phont, speed, volume).then(
              function(buf_wav) {
                AudioService.record(file_path, buf_wav);
                return file_path;
              },
              function(err) {
                MessageService.error('音声データを作成できませんでした。');
                throw err;
              }
            )
            .then(function(file_path) {
              if (!$scope.yvoice.source_write) { return; }
              var source_fname = AudioSourceService.source_fname(file_path);
              AudioSourceService.save(source_fname, $scope.yinput.source);
            });
          });

      // 通常保存
      } else {
        ipcRenderer.on('showSaveDialog', function (event, file_path) {
          if (!file_path) {
            MessageService.error('保存先が指定されませんでした。');
            return;
          }

          AquesService.wave(encoded, phont, speed, volume)
            .then(
              function(buf_wav) {
                AudioService.record(file_path, buf_wav);
                return file_path;
              },
              function(err) {
                MessageService.error('音声データを作成できませんでした。');
                throw err;
              }
            )
            .then(function(file_path) {
              if (!$scope.yvoice.source_write) { return; }
              var source_fname = AudioSourceService.source_fname(file_path);
              AudioSourceService.save(source_fname, $scope.yinput.source);
            });
        });
        ipcRenderer.send('showSaveDialog', 'wav');
      }
    };
    ctrl.help = function() {
      MessageService.action('open help window.');
      ipcRenderer.send('showHelpWindow', 'help');
    };
    ctrl.tutorial = function() {
      if ($scope.display == 'main') {
        MessageService.action('run main tutorial.');
        IntroService.main_tutorial();
      } else {
        MessageService.action('run settings tutorial.');
        IntroService.settings_tutorial();
      }
    };
    ctrl.shortcut = function() {
      MessageService.action('show shortcut key help.');
      if ($scope.display == 'main') {
        IntroService.shortcut();
      } else {
        $scope.display = 'main';
        MessageService.info('標準の画面に切り替えます');
        $timeout(function(){
          $scope.$apply();
          IntroService.shortcut();
        });
      }
    }
    ctrl.select = function(index) {
      MessageService.action('switch voice config.');
      $scope.yvoice = $scope.yvoice_list[index];
      $scope.display = 'main';
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
      $scope.display = 'main';
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
      ConfigService.clear().then(DataService.clear().then(load_data()));
      $scope.yinput = angular.copy(YInputInitialData);
      $scope.display = 'main';
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
    ctrl.directory = function() {
      MessageService.action('select directory.');
      if (!$scope.yvoice.seq_write) {
        MessageService.error('連番ファイル設定が無効です。');
        return;
      }

      ipcRenderer.on('showDirDialog', function (event, dirs) {
        if (!dirs || dirs.length < 1) {
          return;
        }
        $scope.yvoice.seq_write_options.dir = dirs[0];
        $timeout(function(){ $scope.$apply(); });
      });
      var opt_dir = $scope.yvoice.seq_write_options.dir;
      if (!opt_dir) { opt_dir = home_dir; }
      ipcRenderer.send('showDirDialog', opt_dir);
    };

    ctrl.switch_settings_view = function() {
      MessageService.action('switch to settings view.');
      $scope.display = 'settings';
    };
    ctrl.switch_main_view = function() {
      MessageService.action('switch to main view.');
      $scope.display = 'main';
    };
  }]);

