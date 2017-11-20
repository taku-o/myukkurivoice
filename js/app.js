var app = require('electron').remote.app;
var ipcRenderer = require('electron').ipcRenderer;
var clipboard = require('electron').clipboard;
var util = require('util');
var path = require('path');
var log = require('electron-log');
var http = require('http');

var desktop_dir = app.getPath('desktop');

// application settings
var app_cfg = require('electron').remote.getGlobal('app_cfg');

// handle uncaughtException
process.on('uncaughtException', function(err) {
  log.error('main:event:uncaughtException');
  log.error(err);
  log.error(err.stack);
});

// angular app
angular.module('yvoiceApp', ['input-highlight', 'yvoiceService', 'yvoiceModel'])
  .config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  }])
  // wav-draggable
  .directive('wavDraggable', function($parse) {
    return {
      link: function(scope, element, attr) {

    scope.$watch(attr.wavPath, function(value) {
        console.log('----------');
        console.log(scope.message);
        console.log(value);
    });


        var el = element[0];
        var wav_file_path = el.getAttribute("data-wav-path");

        console.log(scope);
        console.log(scope.message);
        console.log(scope.message.wav_file_path);
        var rr = $parse('message.wav_file_path')(scope);
        console.log(rr);
        if (false) {
          return;
        }

        var local_wav_file_path = 'file://'+ wav_file_path;
        var wav_file_name = path.basename(wav_file_path);
        var file_details = "application/octet-stream:"+wav_file_name+":"+local_wav_file_path;

        el.draggable = true;
        el.addEventListener(
          'dragstart',
          function(e) {
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('DownloadURL', file_details);
            this.classList.add('drag');
            return false;
          },
          false
        );
      }
    }
  })
  // controller
  .controller('MainController',
    ['$scope', '$timeout', 'MessageService', 'DataService', 'MasterService', 'AquesService',
     'AudioService1', 'AudioService2', 'AudioSourceService', 'SeqFNameService', 'AppUtilService', 'IntroService',
     'YInput', 'YInputInitialData',
    function($scope, $timeout, MessageService, DataService, MasterService, AquesService,
             audioServVer1, audioServVer2, AudioSourceService, SeqFNameService, AppUtilService, IntroService,
             YInput, YInputInitialData) {

    // event listener
    $scope.$on('message', function(event, message) {
      $scope.message_list.unshift(message);
      while ($scope.message_list.length > 5) {
        $scope.message_list.pop();
      }
      $timeout(function(){ $scope.$apply(); });
    });
    $scope.$on('duration', function(event, duration) {
      $scope.duration = duration;
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
        case 'from_clipboard':
          document.getElementById('from_clipboard').click();
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

    // application settings
    var AudioService = app_cfg.audio_serv_ver == 'html5audio'? audioServVer1: audioServVer2;
    $scope.app_cfg = app_cfg;

    // init
    var ctrl = this;
    $scope.display = 'main';
    $scope.phont_list = MasterService.get_phont_list();
    $scope.yinput = angular.copy(YInput);
    $scope.message_list = [];
    load_data();

    // util
    function load_data() {
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
    function selected_source() {
      var textarea = document.getElementById('source');
      var start = textarea.selectionStart;
      var end = textarea.selectionEnd;
      var selected_text = textarea.value.substring(start, end);
      return selected_text;
    }
    function selected_encoded() {
      var textarea = document.getElementById('encoded');
      var start = textarea.selectionStart;
      var end = textarea.selectionEnd;
      var selected_text = textarea.value.substring(start, end);
      return selected_text;
    };

    // selected text highlight
    $scope.source_highlight = {
      '#619FFF' : "{{ source_highlight['#619FFF'] }}"
    };
    $scope.encoded_highlight = {
      '#619FFF' : "{{ encoded_highlight['#619FFF'] }}"
    };
    ctrl.blur_on_source = function() {
      $scope.source_highlight['#619FFF'] = selected_source();
    };
    ctrl.blur_on_encoded = function() {
      $scope.encoded_highlight['#619FFF'] = selected_encoded();
    };
    ctrl.focus_on_source = function() {
      clearSourceSelection();
      clearEncodedSelection();
    };
    ctrl.focus_on_encoded = function() {
      clearSourceSelection();
      clearEncodedSelection();
    };
    function clearSourceSelection() {
      $scope.source_highlight['#619FFF'] = '';
      var textarea = document.getElementById('source');
      textarea.selectionStart = 0;
      textarea.selectionEnd = 0;
    }
    function clearEncodedSelection() {
      $scope.encoded_highlight['#619FFF'] = '';
      var textarea = document.getElementById('encoded');
      textarea.selectionStart = 0;
      textarea.selectionEnd = 0;
    }

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
      var _selected_encoded = selected_encoded();
      if (_selected_encoded) {
          encoded = _selected_encoded;
          clearSourceSelection();
      }
      if (!encoded) {
        var source = $scope.yinput.source;
        var _selected_source = selected_source();
        if (_selected_source) {
          source = _selected_source;
        }
        encoded = AquesService.encode(source);
        if (!encoded) {
          MessageService.error('音記号列に変換できませんでした。');
          return;
        }
      }

      // disable rhythm if option is on
      if (! $scope.yvoice.rhythm_on) {
        encoded = AppUtilService.disable_rhythm(encoded);
      }

      var speed = $scope.yvoice.speed;
      if (! Number($scope.yvoice.write_margin_ms)===parseInt($scope.yvoice.write_margin_ms)) {
        $scope.yvoice.write_margin_ms = 150;
      }
      var wave_options = {
        volume:$scope.yvoice.volume,
        playback_rate:$scope.yvoice.playback_rate,
        detune:$scope.yvoice.detune,
        write_margin_ms:$scope.yvoice.write_margin_ms,
      };

      AquesService.wave(encoded, phont, speed).then(
        function(buf_wav) {
          return AudioService.play(buf_wav, wave_options);
        },
        function(err) {
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
      var _selected_encoded = selected_encoded();
      if (_selected_encoded) {
        encoded = _selected_encoded;
        clearSourceSelection();
      }
      if (!encoded) {
        var source = $scope.yinput.source;
        var _selected_source = selected_source();
        if (_selected_source) {
          source = _selected_source;
        }
        encoded = AquesService.encode(source);
        if (!encoded) {
          MessageService.error('音記号列に変換できませんでした。');
          return;
        }
      }

      // disable rhythm if option is on
      if (! $scope.yvoice.rhythm_on) {
        encoded = AppUtilService.disable_rhythm(encoded);
      }

      var speed = $scope.yvoice.speed;
      if (! Number($scope.yvoice.write_margin_ms)===parseInt($scope.yvoice.write_margin_ms)) {
        $scope.yvoice.write_margin_ms = 150;
      }
      var wave_options = {
        volume:$scope.yvoice.volume,
        playback_rate:$scope.yvoice.playback_rate,
        detune:$scope.yvoice.detune,
        write_margin_ms:$scope.yvoice.write_margin_ms,
      };

      // 連番保存
      if ($scope.yvoice.seq_write) {
        var dir = $scope.yvoice.seq_write_options.dir;
        var prefix = $scope.yvoice.seq_write_options.prefix;
        if (!dir) {
          dir = desktop_dir;
        }

        SeqFNameService.next_number(dir, prefix)
          .then(function(next_num) {
            var next_fname = SeqFNameService.next_fname(prefix, next_num);
            var file_path = path.join(dir, next_fname);

            AquesService.wave(encoded, phont, speed).then(
              function(buf_wav) {
                AudioService.record(file_path, buf_wav, wave_options);
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
        ipcRenderer.once('showSaveDialog', function (event, file_path) {
          if (!file_path) {
            MessageService.error('保存先が指定されませんでした。');
            return;
          }

          AquesService.wave(encoded, phont, speed)
            .then(
              function(buf_wav) {
                AudioService.record(file_path, buf_wav, wave_options);
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
        MessageService.info('標準の画面に切り替えます。');
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
      DataService.clear().then(load_data());
      $scope.yinput = angular.copy(YInputInitialData);
      $scope.display = 'main';
      clearSourceSelection();
      clearEncodedSelection();
    };

    ctrl.encode = function() {
      MessageService.action('encode source text.');
      var source = $scope.yinput.source;
      var _selected_source = selected_source();
      if (_selected_source) {
        source = _selected_source;
      }
      var encoded = AquesService.encode(source);
      $scope.yinput.encoded = encoded;
      clearEncodedSelection();
    };
    ctrl.clear = function() {
      MessageService.action('clear input text.');
      $scope.yinput.source = '';
      $scope.yinput.encoded = '';
      clearSourceSelection();
      clearEncodedSelection();
    };
    ctrl.from_clipboard = function() {
      MessageService.action('paste clipboard text to source.');
      var text = clipboard.readText();
      if (text) {
        $scope.yinput.source = text;
        $scope.yinput.encoded = '';
        clearSourceSelection();
        clearEncodedSelection();
      } else {
        MessageService.info('クリップボードにデータがありません。');
      }
    };
    ctrl.directory = function() {
      MessageService.action('select directory.');
      if (!$scope.yvoice.seq_write) {
        MessageService.error('連番ファイル設定が無効です。');
        return;
      }

      ipcRenderer.once('showDirDialog', function (event, dirs) {
        if (!dirs || dirs.length < 1) {
          return;
        }
        $scope.yvoice.seq_write_options.dir = dirs[0];
        $timeout(function(){ $scope.$apply(); });
      });
      var opt_dir = $scope.yvoice.seq_write_options.dir;
      if (!opt_dir) { opt_dir = desktop_dir; }
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

