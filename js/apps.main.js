var app = require('electron').remote.app;
var ipcRenderer = require('electron').ipcRenderer;
var clipboard = require('electron').clipboard;
var util = require('util');
var path = require('path');
var log = require('electron-log');
var http = require('http');

// application settings
var appCfg = require('electron').remote.getGlobal('appCfg');
var desktopDir = app.getPath('desktop');

// handle uncaughtException
process.on('uncaughtException', function(err) {
  log.error('main:event:uncaughtException');
  log.error(err);
  log.error(err.stack);
});

// angular app
angular.module('yvoiceApp', ['input-highlight', 'yvoiceService', 'yvoiceCommandService', 'yvoiceIntroService', 'yvoiceModel'])
  .config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  }])
  // static-include
  .directive('staticInclude', function() {
    return {
      restrict: 'AE',
      templateUrl: function(element, attrs) {
        return attrs.templatePath;
      }
    };
  })
  // wav-draggable
  .directive('wavDraggable', function($parse) {
    return function(scope, element, attr) {

      var f;
      scope.$watch('lastWavFile', function(value) {
        var message = value;
        if (!message || !message.wavFilePath) {
          return;
        }
        var wavFilePath = message.wavFilePath;

        var el = element[0];
        el.draggable = true;

        // replace event listener
        if (f) {
          el.removeEventListener('dragstart', f, false);
        }
        f = function(e) {
          e.preventDefault();
          ipcRenderer.send('ondragstartwav', wavFilePath)
          return false;
        };
        el.addEventListener('dragstart', f, false);
      });
    }
  })
  // txt-droppable
  .directive('txtDroppable', function($parse) {

    return function(scope, element, attr) {
      var el = element[0];

      el.addEventListener('drop', function(e) {
        e.preventDefault();

        // read dropped file and set.
        var reader = new FileReader();
        reader.onload = function(loadedFile) {
          // yinput.source or yinput.encoded
          scope.yinput[el.id] = loadedFile.target.result;
          scope.$apply();
        };
        var file = e.dataTransfer.files[0];
        reader.readAsText(file);
        return false;
      });
    }
  })
  // controller
  .controller('MainController',
    ['$scope', '$timeout', 'MessageService', 'DataService', 'MasterService', 'AquesService',
     'AudioService1', 'AudioService2', 'AudioSourceService', 'SeqFNameService', 'AppUtilService', 'CommandService', 'IntroService',
     'YInput', 'YInputInitialData',
    function($scope, $timeout, MessageService, DataService, MasterService, AquesService,
             audioServVer1, audioServVer2, AudioSourceService, SeqFNameService, AppUtilService, CommandService, IntroService,
             YInput, YInputInitialData) {

    // event listener
    $scope.$on('message', function(event, message) {
      $scope.messageList.unshift(message);
      while ($scope.messageList.length > 5) {
        $scope.messageList.pop();
      }
      $timeout(function(){ $scope.$apply(); });
    });
    $scope.$on('wavGenerated', function(event, wavFileInfo) {
      $scope.lastWavFile = wavFileInfo;
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
        case 'fromClipboard':
          document.getElementById('from-clipboard').click();
          break;
        case 'moveToSource':
          document.getElementById('source').focus();
          break;
        case 'moveToEncoded':
          document.getElementById('encoded').focus();
          break;
        case 'swichNextConfig':
          var index = $scope.yvoiceList.indexOf($scope.yvoice);
          if ($scope.yvoiceList.length > index + 1) {
            $scope.yvoice = $scope.yvoiceList[index + 1];
          } else {
            $scope.yvoice = $scope.yvoiceList[0];
          }
          $scope.display = 'main';
          $timeout(function(){ $scope.$apply(); });
          break;
        case 'swichPreviousConfig':
          var index = $scope.yvoiceList.indexOf($scope.yvoice);
          if (index - 1 >= 0) {
            $scope.yvoice = $scope.yvoiceList[index - 1];
          } else {
            $scope.yvoice = $scope.yvoiceList[$scope.yvoiceList.length - 1];
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
          var index = $scope.yvoiceList.indexOf($scope.yvoice);
          ctrl.minus(index);
          $timeout(function(){ $scope.$apply(); });
          break;
        case 'copy':
          var index = $scope.yvoiceList.indexOf($scope.yvoice);
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
    var AudioService = appCfg.audioServVer == 'html5audio'? audioServVer1: audioServVer2;
    $scope.appCfg = appCfg;

    // init
    var ctrl = this;
    $scope.display = 'main';
    $scope.phontList = MasterService.getPhontList();
    $scope.aq10BasList = [{name:'F1E', id:0}, {name:'F2E', id:1}, {name:'M1E', id:2}];
    $scope.yinput = angular.copy(YInput);
    $scope.messageList = [];
    $scope.lastWavFile = null;
    $scope.alwaysOnTop = false;
    $scope.isTest = appCfg.isTest;
    loadData();

    // util
    function loadData() {
      DataService.load().then(function(dataList) {
        if (dataList.length < 1) {
          MessageService.info('初期データを読み込みます。');
          dataList = DataService.initialData();
        }
        $scope.yvoiceList = dataList;
        $scope.yvoice = $scope.yvoiceList[0];
        $timeout(function(){ $scope.$apply(); });
      });
    };
    function selectedSource() {
      var textarea = document.getElementById('source');
      var start = textarea.selectionStart;
      var end = textarea.selectionEnd;
      var selectedText = textarea.value.substring(start, end);
      return selectedText;
    }
    function selectedEncoded() {
      var textarea = document.getElementById('encoded');
      var start = textarea.selectionStart;
      var end = textarea.selectionEnd;
      var selectedText = textarea.value.substring(start, end);
      return selectedText;
    };

    // selected text highlight
    $scope.sourceHighlight = {
      '#619FFF' : "{{ sourceHighlight['#619FFF'] }}"
    };
    $scope.encodedHighlight = {
      '#619FFF' : "{{ encodedHighlight['#619FFF'] }}"
    };
    ctrl.blurOnSource = function() {
      $scope.sourceHighlight['#619FFF'] = selectedSource();
    };
    ctrl.blurOnEncoded = function() {
      $scope.encodedHighlight['#619FFF'] = selectedEncoded();
    };
    ctrl.focusOnSource = function() {
      clearSourceSelection();
      clearEncodedSelection();
    };
    ctrl.focusOnEncoded = function() {
      clearSourceSelection();
      clearEncodedSelection();
    };
    function clearSourceSelection() {
      $scope.sourceHighlight['#619FFF'] = '';
      var textarea = document.getElementById('source');
      textarea.selectionStart = 0;
      textarea.selectionEnd = 0;
    }
    function clearEncodedSelection() {
      $scope.encodedHighlight['#619FFF'] = '';
      var textarea = document.getElementById('encoded');
      textarea.selectionStart = 0;
      textarea.selectionEnd = 0;
    }

    // list box selection changed
    ctrl.onChangePhont = function() {
      var phont = null;
      angular.forEach($scope.phontList, function(value, key) {
        if (value.id == $scope.yvoice.phont) { phont = value; }
      });
      if (!phont) { return; }
      $scope.yvoice.version = phont.version;
      if (phont.version == 'talk10') {
        $scope.yvoice.bas = phont.struct.bas;
        $scope.yvoice.pit = phont.struct.pit;
        $scope.yvoice.acc = phont.struct.acc;
        $scope.yvoice.lmd = phont.struct.lmd;
        $scope.yvoice.fsc = phont.struct.fsc;
      } else {
        delete $scope.yvoice.bas;
        delete $scope.yvoice.pit;
        delete $scope.yvoice.acc;
        delete $scope.yvoice.lmd;
        delete $scope.yvoice.fsc;
      }
    };

    // action
    ctrl.play = function() {
      MessageService.action('start to play voice.');
      if (!$scope.yinput.source && !$scope.yinput.encoded) {
        MessageService.error('メッセージ、音記号列、どちらも入力されていません。');
        return;
      }

      var phont = null;
      angular.forEach($scope.phontList, function(value, key) {
        if (value.id == $scope.yvoice.phont) { phont = value; }
      });
      if (!phont) {
        MessageService.error('声の種類が未指定です。');
        return;
      }

      var encoded = $scope.yinput.encoded;
      var _selectedEncoded = selectedEncoded();
      if (_selectedEncoded) {
        encoded = _selectedEncoded;
        clearSourceSelection();
      }
      if (!encoded) {
        var source = $scope.yinput.source;
        var _selectedSource = selectedSource();
        if (_selectedSource) {
          source = _selectedSource;
        }
        encoded = AquesService.encode(source);
        if (!encoded) {
          MessageService.error('音記号列に変換できませんでした。');
          return;
        }
      }

      // disable rhythm if option is on
      if (! $scope.yvoice.rhythmOn) {
        encoded = AppUtilService.disableRhythm(encoded);
      }

      var speed = $scope.yvoice.speed;
      if (! Number($scope.yvoice.writeMarginMs)===parseInt($scope.yvoice.writeMarginMs)) {
        $scope.yvoice.writeMarginMs = 150;
      }

      var waveOptions = {
        passPhrase:appCfg.passPhrase,
        aq10UseKeyEncrypted:appCfg.aq10UseKeyEncrypted
      };
      if (phont.version == 'talk10') {
        waveOptions.bas = $scope.yvoice.bas;
        waveOptions.pit = $scope.yvoice.pit;
        waveOptions.acc = $scope.yvoice.acc;
        waveOptions.lmd = $scope.yvoice.lmd;
        waveOptions.fsc = $scope.yvoice.fsc;
      }
      var playOptions = {
        volume:$scope.yvoice.volume,
        playbackRate:$scope.yvoice.playbackRate,
        detune:$scope.yvoice.detune,
        writeMarginMs:$scope.yvoice.writeMarginMs,
      };

      AquesService.wave(encoded, phont, speed, waveOptions).then(
        function(bufWav) {
          return AudioService.play(bufWav, playOptions);
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
      angular.forEach($scope.phontList, function(value, key) {
        if (value.id == $scope.yvoice.phont) { phont = value; }
      });
      if (!phont) {
        MessageService.error('声の種類が未指定です。');
        return;
      }

      var encoded = $scope.yinput.encoded;
      var _selectedEncoded = selectedEncoded();
      if (_selectedEncoded) {
        encoded = _selectedEncoded;
        clearSourceSelection();
      }
      if (!encoded) {
        var source = $scope.yinput.source;
        var _selectedSource = selectedSource();
        if (_selectedSource) {
          source = _selectedSource;
        }
        encoded = AquesService.encode(source);
        if (!encoded) {
          MessageService.error('音記号列に変換できませんでした。');
          return;
        }
      }

      // disable rhythm if option is on
      if (! $scope.yvoice.rhythmOn) {
        encoded = AppUtilService.disableRhythm(encoded);
      }

      var speed = $scope.yvoice.speed;
      if (! Number($scope.yvoice.writeMarginMs)===parseInt($scope.yvoice.writeMarginMs)) {
        $scope.yvoice.writeMarginMs = 150;
      }
      var waveOptions = {
        passPhrase:appCfg.passPhrase,
        aq10UseKeyEncrypted:appCfg.aq10UseKeyEncrypted
      };
      if (phont.version == 'talk10') {
        waveOptions.bas = $scope.yvoice.bas;
        waveOptions.pit = $scope.yvoice.pit;
        waveOptions.acc = $scope.yvoice.acc;
        waveOptions.lmd = $scope.yvoice.lmd;
        waveOptions.fsc = $scope.yvoice.fsc;
      }
      var playOptions = {
        volume:$scope.yvoice.volume,
        playbackRate:$scope.yvoice.playbackRate,
        detune:$scope.yvoice.detune,
        writeMarginMs:$scope.yvoice.writeMarginMs,
      };

      // 連番保存
      if ($scope.yvoice.seqWrite) {
        var dir = $scope.yvoice.seqWriteOptions.dir;
        var prefix = $scope.yvoice.seqWriteOptions.prefix;
        if (!dir) {
          dir = desktopDir;
        }

        SeqFNameService.nextNumber(dir, prefix)
          .then(function(nextNum) {
            var nextFname = SeqFNameService.nextFname(prefix, nextNum);
            var filePath = path.join(dir, nextFname);

            AquesService.wave(encoded, phont, speed, waveOptions).then(
              function(bufWav) {
                AudioService.record(filePath, bufWav, playOptions);
                return filePath;
              },
              function(err) {
                MessageService.error('音声データを作成できませんでした。');
                throw err;
              }
            )
            .then(function(filePath) {
              if (!$scope.yvoice.sourceWrite) { return; }
              var sourceFname = AudioSourceService.sourceFname(filePath);
              AudioSourceService.save(sourceFname, $scope.yinput.source);
            });
          });

      // 通常保存
      } else {
        ipcRenderer.once('showSaveDialog', function (event, filePath) {
          if (!filePath) {
            MessageService.error('保存先が指定されませんでした。');
            return;
          }

          AquesService.wave(encoded, phont, speed, waveOptions)
            .then(
              function(bufWav) {
                AudioService.record(filePath, bufWav, playOptions);
                return filePath;
              },
              function(err) {
                MessageService.error('音声データを作成できませんでした。');
                throw err;
              }
            )
            .then(function(filePath) {
              if (!$scope.yvoice.sourceWrite) { return; }
              var sourceFname = AudioSourceService.sourceFname(filePath);
              AudioSourceService.save(sourceFname, $scope.yinput.source);
            });
        });
        ipcRenderer.send('showSaveDialog', 'wav');
      }
    };
    ctrl.showSystemWindow = function() {
      if (!appCfg.isTest) { return; }
      ipcRenderer.send('showSystemWindow', 'system');
    };
    ctrl.showSpecWindow = function() {
      if (!appCfg.isTest) { return; }
      ipcRenderer.send('showSpecWindow', 'spec');
    };
    ctrl.help = function() {
      MessageService.action('open help window.');
      ipcRenderer.send('showHelpWindow', 'help');
    };
    ctrl.tutorial = function() {
      if ($scope.display == 'main') {
        MessageService.action('run main tutorial.');
        IntroService.mainTutorial();
      } else {
        MessageService.action('run settings tutorial.');
        IntroService.settingsTutorial();
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
    };
    ctrl.select = function(index) {
      MessageService.action('switch voice config.');
      $scope.yvoice = $scope.yvoiceList[index];
      $scope.display = 'main';
    };
    ctrl.plus = function() {
      MessageService.action('add new voice config.');
      var newYvoice = DataService.create();
      $scope.yvoiceList.push(newYvoice);
    };
    ctrl.minus = function(index) {
      MessageService.action('delete voice config.');
      if ($scope.yvoiceList.length < 2) {
        MessageService.error('ボイス設定は1件以上必要です。');
        return;
      }
      $scope.yvoiceList.splice(index, 1);
      $scope.yvoice = $scope.yvoiceList[0];
      $scope.display = 'main';
    };
    ctrl.copy = function(index) {
      MessageService.action('copy and create new voice config.');
      var original = $scope.yvoiceList[index];
      var newYvoice = DataService.copy(original);
      $scope.yvoiceList.push(newYvoice);
    };
    ctrl.save = function() {
      MessageService.action('save voice config.');
      DataService.save($scope.yvoiceList);
    };
    ctrl.reset = function() {
      MessageService.action('reset all voice config data.');
      // voice data clear
      DataService.clear();
      // set initial data
      $scope.yvoiceList = DataService.initialData();
      $scope.yvoice = $scope.yvoiceList[0];
      $scope.yinput = angular.copy(YInputInitialData);
      $scope.display = 'main';
      clearSourceSelection();
      clearEncodedSelection();
    };

    ctrl.encode = function() {
      MessageService.action('encode source text.');
      var source = $scope.yinput.source;
      var _selectedSource = selectedSource();
      if (_selectedSource) {
        source = _selectedSource;
      }

      // command
      if (CommandService.containsCommand(source, $scope.yvoiceList)) {
        var parsedList = CommandService.parseInput(source, $scope.yvoiceList, $scope.yvoice);
        var encodedList = [];
        angular.forEach(parsedList, function(cinput) {
          cinput.text = AquesService.encode(cinput.text);
          encodedList.push(cinput);
        });
        $scope.yinput.encoded = CommandService.toString(encodedList);
        clearEncodedSelection();
      // not command
      } else {
        var encoded = AquesService.encode(source);
        $scope.yinput.encoded = encoded;
        clearEncodedSelection();
      }
    };
    ctrl.clear = function() {
      MessageService.action('clear input text.');
      $scope.yinput.source = '';
      $scope.yinput.encoded = '';
      clearSourceSelection();
      clearEncodedSelection();
    };
    ctrl.fromClipboard = function() {
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
      if (!$scope.yvoice.seqWrite) {
        MessageService.error('連番ファイル設定が無効です。');
        return;
      }

      ipcRenderer.once('showDirDialog', function (event, dirs) {
        if (!dirs || dirs.length < 1) {
          return;
        }
        $scope.yvoice.seqWriteOptions.dir = dirs[0];
        $timeout(function(){ $scope.$apply(); });
      });
      var optDir = $scope.yvoice.seqWriteOptions.dir;
      if (!optDir) { optDir = desktopDir; }
      ipcRenderer.send('showDirDialog', optDir);
    };

    ctrl.switchSettingsView = function() {
      MessageService.action('switch to settings view.');
      $scope.display = 'settings';
    };
    ctrl.switchMainView = function() {
      MessageService.action('switch to main view.');
      $scope.display = 'main';
    };

    ctrl.switchAlwaysOnTop = function() {
      MessageService.action('switch alwaysOnTop option.');
      ipcRenderer.send('switchAlwaysOnTop', 'mainWindow');
    };
    ipcRenderer.on('switchAlwaysOnTop', function (event, newflg) {
      $scope.alwaysOnTop = newflg;
      MessageService.info('update alwaysOnTop option '+(newflg?'ON':'OFF'));
      $timeout(function(){ $scope.$apply(); });
    });

  }]);

