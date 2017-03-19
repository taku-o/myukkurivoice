var storage      = require('electron-json-storage');
var log          = require('electron-log');
var fs           = require('fs');
var ffi          = require('ffi');
var ref          = require('ref');
var temp         = require('temp').track();
var path         = require('path');
var exec         = require('child_process').exec;
var WaveRecorder = require('wave-recorder');

var app = require('electron').remote.app;
var app_path = app.getAppPath();
var unpacked_path = app_path.replace('app.asar', 'app.asar.unpacked');

// angular service
angular.module('yvoiceService', ['yvoiceModel'])
  .factory('MessageService', ['$rootScope', function($rootScope) {
    return {
      action: function(message) {
        var post = {
          created: new Date(),
          body: message,
          type: 'action'
        }
        $rootScope.$broadcast("message", post);
      },
      info: function(message) {
        var post = {
          created: new Date(),
          body: message,
          type: 'info'
        }
        $rootScope.$broadcast("message", post);
      },
      error: function(message) {
        var post = {
          created: new Date(),
          body: message,
          type: 'error'
        }
        $rootScope.$broadcast("message", post);
      },
      syserror: function(message, err=null) {
        if (err) {
          message = message + err.message;
        }
        var post = {
          created: new Date(),
          body: message,
          type: 'syserror'
        }
        $rootScope.$broadcast("message", post);
      }
    }
  }])
  .factory('DataService', ['$q', 'YVoice', 'YVoiceInitialData', 'MessageService', function($q, YVoice, YVoiceInitialData, MessageService) {

    function uniq_id() {
      return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
    }

    return {
      load: function() {
        var d = $q.defer();
        storage.get('data', function (error, data) {
          if (error) {
            MessageService.syserror('ボイス設定の読込に失敗しました。', error);
            d.reject(error); return;
          }
          if (Object.keys(data).length === 0) {
            d.resolve([]);
          } else {
            d.resolve(data);
          }
        });
        return d.promise;
      },
      initial_data: function() {
        var data_list = angular.copy(YVoiceInitialData);
        return data_list;
      },
      create: function() {
        cloned = angular.copy(YVoice);
        cloned['id'] = uniq_id();
        return cloned;
      },
      copy: function(original) {
        cloned = angular.copy(original);
        cloned['id'] = uniq_id();
        return cloned;
      },
      save: function(data_list) {
        storage.set('data', data_list, function(error) {
          if (error) {
            MessageService.syserror('ボイス設定の保存に失敗しました。', error);
            throw error;
          }
          MessageService.info('ボイス設定を保存しました。');
        });
      },
      clear: function() {
        var d = $q.defer();
        storage.remove('data', function(error) {
          if (error) {
            MessageService.syserror('ボイス設定の削除に失敗しました。', error);
            d.reject(error); return;
          }
          MessageService.info('ボイス設定を削除しました。');
          d.resolve(true);
        });
        return d.promise;
      }
    }
  }])
  .factory('MasterService', function() {
    var phont_list = [
      {'id':'at1_f1',     'name':'f1 女声1(ゆっくり)', 'version':'talk1', 'id_voice':0},
      {'id':'at1_m1',     'name':'m1 男声1',           'version':'talk1', 'id_voice':1},
      {'id':'aq_f1c',     'name':'f1c 女声',           'version':'talk2', 'path':unpacked_path + '/vendor/phont/aq_f1c.phont'},
      {'id':'aq_f3a',     'name':'f3a 女声',           'version':'talk2', 'path':unpacked_path + '/vendor/phont/aq_f3a.phont'},
      {'id':'aq_huskey',  'name':'huskey ハスキー',    'version':'talk2', 'path':unpacked_path + '/vendor/phont/aq_huskey.phont'},
      {'id':'aq_m4b',     'name':'m4b 男声',           'version':'talk2', 'path':unpacked_path + '/vendor/phont/aq_m4b.phont'},
      {'id':'aq_mf1',     'name':'mf1 中性的',         'version':'talk2', 'path':unpacked_path + '/vendor/phont/aq_mf1.phont'},
      {'id':'aq_rb2',     'name':'rb2 小さいロボ',     'version':'talk2', 'path':unpacked_path + '/vendor/phont/aq_rb2.phont'},
      {'id':'aq_rb3',     'name':'rb3 ロボ',           'version':'talk2', 'path':unpacked_path + '/vendor/phont/aq_rb3.phont'},
      {'id':'aq_rm',      'name':'rm 女声',            'version':'talk2', 'path':unpacked_path + '/vendor/phont/aq_rm.phont'},
      {'id':'aq_robo',    'name':'robo ロボット',      'version':'talk2', 'path':unpacked_path + '/vendor/phont/aq_robo.phont'},
      {'id':'aq_yukkuri', 'name':'aq_yukkuri',         'version':'talk2', 'path':unpacked_path + '/vendor/phont/aq_yukkuri.phont'},
      {'id':'ar_f4',      'name':'f4 女声',            'version':'talk2', 'path':unpacked_path + '/vendor/phont/ar_f4.phont'},
      {'id':'ar_m5',      'name':'m5 男声',            'version':'talk2', 'path':unpacked_path + '/vendor/phont/ar_m5.phont'},
      {'id':'ar_mf2',     'name':'mf2 機械声',         'version':'talk2', 'path':unpacked_path + '/vendor/phont/ar_mf2.phont'},
      {'id':'ar_rm3',     'name':'rm3 女声',           'version':'talk2', 'path':unpacked_path + '/vendor/phont/ar_rm3.phont'},
      {'id':'aq_defo1',   'name':'aq_defo1',           'version':'talk2', 'path':unpacked_path + '/vendor/phont/aq_defo1.phont'},
      {'id':'aq_momo1',   'name':'aq_momo1',           'version':'talk2', 'path':unpacked_path + '/vendor/phont/aq_momo1.phont'},
      {'id':'aq_teto1',   'name':'aq_teto1',           'version':'talk2', 'path':unpacked_path + '/vendor/phont/aq_teto1.phont'}
    ];
    var effect_list = [
      {'id':1, 'name':'none'},
      {'id':2, 'name':'echo'}
    ];

    return {
      get_phont_list: function() {
        return phont_list;
      },
      get_effect_list: function() {
        return effect_list;
      }
    }
  })
  .factory('AquesService', ['$q', 'MessageService', function($q, MessageService) {
    var ptr_void  = ref.refType(ref.types.void);
    var ptr_int   = ref.refType(ref.types.int);
    var ptr_char = ref.refType(ref.types.char);
    var ptr_uchar = ref.refType(ref.types.uchar);

    // void * AqKanji2Koe_Create (const char *pathDic, int *pErr)
    // void AqKanji2Koe_Release (void * hAqKanji2Koe)
    // int AqKanji2Koe_Convert (void * hAqKanji2Koe, const char *kanji, char *koe, int nBufKoe)
    var framework_path = unpacked_path + '/vendor/AqKanji2Koe.framework/Versions/A/AqKanji2Koe';
    var ptr_AqKanji2Koe_Create  = ffi.DynamicLibrary(framework_path).get('AqKanji2Koe_Create');
    var ptr_AqKanji2Koe_Release = ffi.DynamicLibrary(framework_path).get('AqKanji2Koe_Release');
    var ptr_AqKanji2Koe_Convert = ffi.DynamicLibrary(framework_path).get('AqKanji2Koe_Convert')
    var fn_AqKanji2Koe_Create   = ffi.ForeignFunction(ptr_AqKanji2Koe_Create, ptr_void, [ 'string', ptr_int ]);
    var fn_AqKanji2Koe_Release  = ffi.ForeignFunction(ptr_AqKanji2Koe_Release, 'void', [ ptr_void ]);
    var fn_AqKanji2Koe_Convert  = ffi.ForeignFunction(ptr_AqKanji2Koe_Convert, 'int', [ ptr_void, 'string', ptr_char, 'int' ]);

    // unsigned char * AquesTalk2_Synthe_Utf8(const char *koe, int iSpeed, int * size, void *phontDat)
    // void AquesTalk2_FreeWave (unsigned char *wav)
    var framework_path = unpacked_path + '/vendor/AquesTalk2.framework/Versions/A/AquesTalk2';
    var ptr_AquesTalk2_Synthe_Utf8 = ffi.DynamicLibrary(framework_path).get('AquesTalk2_Synthe_Utf8');
    var ptr_AquesTalk2_FreeWave    = ffi.DynamicLibrary(framework_path).get('AquesTalk2_FreeWave');
    var fn_AquesTalk2_Synthe_Utf8  = ffi.ForeignFunction(ptr_AquesTalk2_Synthe_Utf8, ptr_uchar, [ 'string', 'int', ptr_int, ptr_void ]);
    var fn_AquesTalk2_FreeWave     = ffi.ForeignFunction(ptr_AquesTalk2_FreeWave, 'void', [ ptr_uchar ]);

    function error_table_AqKanji2Koe(code) {
      if (code == 101)               { return '関数呼び出し時の引数がNULLになっている'; }
      if (code == 105)               { return '入力テキストが長すぎる'; }
      if (code == 107)               { return '変換できない文字コードが含まれている'; }
      if (code >= 200 && code < 300) { return 'システム辞書(aqdic.bin)が不正'; }
      if (code >= 300 && code < 400) { return 'ユーザ辞書(aq_user.dic)が不正'; }
      if (code == 100)               { return 'その他のエラー'; }
      return '';
    }

    function error_table_AquesTalk2(code) {
      if (code == 100)                  { return 'その他のエラー'; }
      if (code == 101)                  { return 'メモリ不足'; }
      if (code == 102)                  { return '音記号列に未定義の読み記号が指定された'; }
      if (code == 103)                  { return '韻律データの時間長がマイナスなっている'; }
      if (code == 104)                  { return '内部エラー(未定義の区切りコード検出)'; }
      if (code == 105)                  { return '音記号列に未定義の読み記号が指定された'; }
      if (code == 106)                  { return '音記号列のタグの指定が正しくない'; }
      if (code == 107)                  { return 'タグの長さが制限を越えている(または[>]がみつからない)'; }
      if (code == 108)                  { return 'タグ内の値の指定が正しくない'; }
      if (code == 109)                  { return 'WAVE再生ができない(サウンドドライバ関連の問題)'; }
      if (code == 110)                  { return 'WAVE再生ができない(サウンドドライバ関連の問題 非同期再生)'; }
      if (code == 111)                  { return '発すべきデータがない'; }
      if (code == 200)                  { return '音記号列が長すぎる'; }
      if (code == 201)                  { return '1つのフレーズ中の読み記号が多すぎる'; }
      if (code == 202)                  { return '音記号列が長い(内部バッファオーバー1)'; }
      if (code == 203)                  { return 'ヒープメモリ不足'; }
      if (code == 204)                  { return '音記号列が長い(内部バッファオーバー1)'; }
      if (code == 205)                  { return 'ライセンスキーが正しくない。または、設定されていない。'; }
      if (code >= 1000 && code <= 1008) { return 'Phontデータが正しくない'; }
    }

    // will released data
    var ptr2_waves = [];

    return {
      encode: function(source) {
        if (!source) {
          MessageService.syserror('音記号列に変換するメッセージが入力されていません。');
          return '';
        }

        var alloc_int = ref.alloc('int');
        var aqKanji2Koe = fn_AqKanji2Koe_Create(unpacked_path + '/vendor/aq_dic_large', alloc_int);
        var error_code = alloc_int.deref();
        if (error_code != 0) {
          MessageService.syserror(error_table_AqKanji2Koe(error_code));
          log.warn('fn_AqKanji2Koe_Create raise error. error_code:' + error_table_AqKanji2Koe(error_code));
          return '';
        }

        var source_length = (new Blob([source_length], {type: "text/plain"})).size;
        var encoded_length = source_length >= 512? source_length * 4 : 512;
        var buf = Buffer.alloc(source_length >= 512? source_length * 4 : 512);
        var r = fn_AqKanji2Koe_Convert(aqKanji2Koe, source, buf, encoded_length);
        if (r != 0) {
          MessageService.syserror(error_table_AqKanji2Koe(r));
          log.info('fn_AqKanji2Koe_Convert raise error. error_code:' + error_table_AqKanji2Koe(r));
          return '';
        }
        var encoded = ref.readCString(buf, 0);

        fn_AqKanji2Koe_Release(aqKanji2Koe);
        return encoded;
      },
      wave: function(encoded, phont, speed) {
        var d = $q.defer();
        if (!encoded) {
          MessageService.syserror('音記号列が入力されていません。');
          d.reject(null); return d.promise;
        }

        // version 1
        if (phont.version == 'talk1') {
          // escape text
          var escaped = '"'+ encoded.replace(/(["\s'$`\\])/g,'\\$1')+'"';

          var cmd_options = {
            env: {
              VOICE: phont.id_voice,
              SPEED: speed
            },
            encoding: 'binary'
          };
          var waver_cmd = unpacked_path + '/vendor/maquestalk1';
          exec('echo "'+ escaped +'" | VOICE='+ phont.id_voice+ ' SPEED='+ speed+ ' '+ waver_cmd, cmd_options, (err, stdout, stderr) => {
            if (err) {
              d.reject(null); return;
            }
            buf_wav = new Buffer(stdout, 'binary');
            d.resolve(buf_wav);
          }).on('close', (status_code) => {
            if (status_code < 0) {
              var error_code = status_code * -1; // maquestalk1 library result
              MessageService.syserror(error_table_AquesTalk2(error_code));
              log.info('AquesTalk_SyntheMV raise error. error_code:' + error_table_AquesTalk2(error_code));
            }
          });

        // version 2
        } else if (phont.version == 'talk2') {
          fs.readFile(phont.path, function(err, phont_data) {
            if (err) {
              MessageService.syserror('phontファイルの読み込みに失敗しました。', err);
              d.reject(err); return;
            }

            var alloc_int = ref.alloc('int');
            var r = fn_AquesTalk2_Synthe_Utf8(encoded, speed, alloc_int, phont_data);
            if (ref.isNull(r)) {
              var error_code = alloc_int.deref();
              MessageService.syserror(error_table_AquesTalk2(error_code));
              log.info('fn_AquesTalk2_Synthe_Utf8 raise error. error_code:' + error_table_AquesTalk2(error_code));
              d.reject(null); return;
            }

            var buf_wav = ref.reinterpret(r, alloc_int.deref(), 0);
            ptr2_waves.push(r);
            d.resolve(buf_wav);
          });
        }
        return d.promise;
      },
      free_wave: function() {
        angular.forEach(ptr2_waves, function(ptr) {
          fn_AquesTalk2_FreeWave(ptr);
        });
        ptr2_waves = [];
      }
    }
  }])
  .factory('AudioService1', ['$q', 'MessageService', function($q, MessageService) {
    // Audio base AudioService
    var audio = null;

    return {
      play: function(buf_wav, options) {
        var d = $q.defer();
        if (!buf_wav) {
          MessageService.syserror('再生する音源が渡されませんでした。');
          d.reject(null); return d.promise;
        }
        if (audio) { audio.pause(); }

        temp.open('_myukkurivoice', function(err, info) {
          if (err) {
            MessageService.syserror('一時作業ファイルを作れませんでした。');
            d.reject(null); return;
          }

          fs.writeFile(info.path, buf_wav, function(err) {
            if (err) {
              MessageService.syserror('一時作業ファイルの書き込みに失敗しました。', err);
              d.reject(err); return;
            }
            audio = new Audio('');
            audio.autoplay = false;
            audio.src = info.path;
            audio.play();
            d.resolve('ok'); return;
          });
        });
        return d.promise;
      },
      stop: function() {
        if (!audio) { return; }
        audio.pause();
      },
      record: function(wav_file_path, buf_wav, options) {
        var d = $q.defer();
        if (!wav_file_path) {
          MessageService.syserror('音声ファイルの保存先が指定されていません。');
          d.reject(null); return d.promise;
        }
        if (!buf_wav) {
          MessageService.syserror('保存する音源が渡されませんでした。');
          d.reject(null); return d.promise;
        }

        fs.writeFile(wav_file_path, buf_wav, function(err) {
          if (err) {
            MessageService.syserror('音声ファイルの書き込みに失敗しました。', err);
            d.reject(err); return;
          }
          MessageService.info('音声ファイルを保存しました。path: ' + wav_file_path);
          d.resolve('ok');
        });
        return d.promise;
      }
    }
  }])
  .factory('AudioService2', ['$q', 'MessageService', function($q, MessageService) {
    // Web Audio API base AudioService
    var audioCtx = new window.AudioContext();
    var sourceNode = null;

    function to_array_buffer(buf_wav) {
      var a_buffer = new ArrayBuffer(buf_wav.length);
      var view = new Uint8Array(a_buffer);
      for (var i = 0; i < buf_wav.length; ++i) {
        view[i] = buf_wav[i];
      }
      return a_buffer;
    };

    return {
      play: function(buf_wav, options) {
        var d = $q.defer();
        if (!buf_wav) {
          MessageService.syserror('再生する音源が渡されませんでした。');
          d.reject(null); return d.promise;
        }
        if (sourceNode) { sourceNode.stop(0); sourceNode = null; }

        var a_buffer = to_array_buffer(buf_wav);
        audioCtx.decodeAudioData(a_buffer).then(
          function(decodedData) {
            // source
            sourceNode = audioCtx.createBufferSource();
            sourceNode.buffer = decodedData;
            sourceNode.onended = function() {
              // do nothing
            };

            var node_list = [];

            // playbackRate
            sourceNode.playbackRate.value = options.playback_rate;
            // detune
            sourceNode.detune.value = options.detune;
            // gain
            var gainNode = audioCtx.createGain();
            gainNode.gain.value = options.volume;
            node_list.push(gainNode);

            // connect
            var last_node = sourceNode;
            angular.forEach(node_list, function(node) {
              last_node.connect(node); last_node = node;
            });
            last_node.connect(audioCtx.destination);

            // and start
            sourceNode.start(0);
            d.resolve('ok'); return;
          },
          function(err) {
            MessageService.syserror('音源の再生に失敗しました。', err);
            d.reject(err); return;
          }
        );
        return d.promise;
      },
      stop: function() {
        if (sourceNode) { sourceNode.stop(0); sourceNode = null; }
      },
      record: function(wav_file_path, buf_wav, options) {
        var d = $q.defer();
        if (!wav_file_path) {
          MessageService.syserror('音声ファイルの保存先が指定されていません。');
          d.reject(null); return d.promise;
        }
        if (!buf_wav) {
          MessageService.syserror('保存する音源が渡されませんでした。');
          d.reject(null); return d.promise;
        }

        var a_buffer = to_array_buffer(buf_wav);
        audioCtx.decodeAudioData(a_buffer).then(
          function(decodedData) {
            // source
            var in_sourceNode = audioCtx.createBufferSource();
            in_sourceNode.buffer = decodedData;
            in_sourceNode.onended = function() {
              // onendedのタイミングでは出力が終わっていない
              setTimeout(function(){
                recorder.end();
                MessageService.info('音声ファイルを保存しました。path: ' + wav_file_path);
                d.resolve('ok');
              }, options.write_margin_ms);
            };

            var node_list = [];

            // playbackRate
            in_sourceNode.playbackRate.value = options.playback_rate;
            // detune
            in_sourceNode.detune.value = options.detune;
            // gain
            var gainNode = audioCtx.createGain();
            gainNode.gain.value = options.volume;
            node_list.push(gainNode);

            // recorder
            var recorder = WaveRecorder(audioCtx, {
              channels: 1,
              bitDepth: 16
            });
            recorder.pipe(fs.createWriteStream(wav_file_path));

            // connect
            var last_node = in_sourceNode;
            angular.forEach(node_list, function(node) {
              last_node.connect(node); last_node = node;
            });
            last_node.connect(recorder.input);

            // and start
            in_sourceNode.start(0);
          },
          function(err) {
            MessageService.syserror('音源の再生に失敗しました。', err);
            d.reject(err); return;
          }
        );
        return d.promise;
      }
    }
  }])
  .factory('AudioSourceService', ['MessageService', function(MessageService) {
    var wave_ext = '.wav';
    var source_ext = '.txt';

    return {
      source_fname: function(wav_file_path) {
        var dir = path.dirname(wav_file_path);
        var basename = path.basename(wav_file_path, wave_ext);
        var filename = basename + source_ext;
        return path.join(dir, filename);
      },
      save: function(file_path, source_text) {
        fs.writeFile(file_path, source_text, 'utf-8', function(err) {
          if (err) {
            MessageService.syserror('メッセージファイルの書き込みに失敗しました。', err);
            return;
          }
          MessageService.info('メッセージファイルを保存しました。path: ' + file_path);
        });
      }
    }
  }])
  .factory('SeqFNameService', ['$q', 'MessageService', function($q, MessageService) {
    var ext = '.wav';
    var num_pattern = '[0-9]{4}';
    var limit = 9999;

    return {
      next_fname: function(prefix, num) {
        formatted = ("0000"+ num).slice(-4)
        return prefix + formatted + ext;
      },
      next_number: function(dir, prefix) {
        var d = $q.defer();
        fs.readdir(dir, function(err, files) {
          if (err) {
            MessageService.syserror('ディレクトリを参照できませんでした。', err);
            d.reject(err); return;
          }

          var pattern = new RegExp('^'+ prefix+ '('+ num_pattern+ ')'+ ext+ '$');

          var np_list = [];
          files.forEach(function (file) {
            try {
              if (pattern.test(file)) {
                var matched = pattern.exec(file);
                np_list.push(Number(matched[1]));
              }
            } catch(err) {
              if (err.code != 'ENOENT') {
                MessageService.syserror('ファイル参照時にエラーが起きました。', err);
                d.reject(err); return;
              }
            }
          });
          if (np_list.length < 1) {
            d.resolve(0); return;
          }

          var max_num = Math.max.apply(null, np_list);
          if (max_num >= limit) {
            MessageService.syserror(limit + 'までファイルが作られているので、これ以上ファイルを作成できません。');
            d.reject(null); return;
          }
          var next = max_num + 1;
          d.resolve(next);
        });
        return d.promise;
      }
    }
  }])
  .factory('IntroService', function() {
    return {
      'main_tutorial': function() {
        var intro = introJs();
        intro.setOption('showProgress', true);
        intro.setOptions({
          steps: [
            {
              element: '#source',
              intro: '発声したいメッセージを入力してください'
            },
            {
              element: '#encode',
              intro: '音記号列へ変換します'
            },
            {
              element: '#encoded',
              intro: 'すると、メッセージが音記号列に変換した結果が入ります<br>細かい発声の調節をする時はここを変更します'
            },
            {
              element: '#play',
              intro: '音記号列を発声させます'
            },
            {
              element: '#source',
              intro: '音声再生時に音記号列が入力されていない場は、ここに入力したメッセージから音声を作るので<br>音記号列は入力しなくても問題ありません'
            },
            {
              element: '#stop',
              intro: '音声の再生を停止します'
            },
            {
              element: '#record',
              intro: '発声が問題なければ、このボタンで音声データを保存できます'
            },
            {
              element: '#phont',
              intro: '声を変えたければここを変更します'
            },
            {
              element: '#speed',
              position: 'top',
              intro: '声の早さの調節はここです'
            },
            {
              element: '#volume',
              position: 'top',
              intro: '声の音量の調節はこちらです'
            },
            {
              element: '#switch-settings-view',
              position: 'top',
              intro: 'このボタンで音声ファイルの保存方法設定画面に移ります'
            },
            {
              element: '#switch-settings-view',
              position: 'top',
              intro: '声の早さ音量以外の、多用しない系統の音声設定も設定画面にあります'
            },
            {
              element: '#tutorial',
              intro: 'チュートリアルは画面ごとに異なりますよ'
            },
            {
              element: '#save',
              intro: '変更した設定はここで保存できます'
            },
            {
              element: '#name',
              intro: '設定には名前をつけられます'
            },
            {
              element: '#sidebar-items',
              position: 'right',
              intro: '設定はこのあたりで、増やしたり、減らしたりできます',
            },
            {
              element: '#sidebar-items',
              position: 'right',
              intro: '設定がおかしくなった時はメニューに「設定オールリセット」があります',
            },
            {
              element: '#tutorial',
              intro: 'チュートリアルは以上です。またチュートリアルをまた確認したくなったら、ここを押してください'
            }
          ]
        });
        intro.start();
      },
      'settings_tutorial': function() {
        var intro = introJs();
        intro.setOption('showProgress', true);
        intro.setOptions({
          steps: [
            {
              element: '#voice_tuna_box',
              intro: '音声の質の調整はここで行います'
            },
            {
              element: '#play',
              intro: '設定画面からでも音声は再生できるので、再生しながら音声を調整してみてください'
            },
            {
              element: '#source_write_box',
              intro: 'ここのチェックを入れると、音声再生時に元のメッセージも保存するようになります'
            },
            {
              element: '#seq_write_box',
              intro: 'このチェックを入れると、ファイルに連番をつけて保存するようになります。<br>出力先のディレクトリと、ファイル名を指定できます。'
            },
            {
              element: '#switch-main-view',
              intro: 'このボタンで標準の画面に戻ります'
            },
            {
              element: '#tutorial',
              intro: 'チュートリアルは画面ごとに異なりますよ'
            },
            {
              element: '#save',
              intro: '変更した設定はここで保存できます'
            },
            {
              element: '#save',
              intro: 'この設定は音声の出力設定ごとに共有です'
            },
            {
              element: '#tutorial',
              intro: 'チュートリアルは以上です'
            }
          ]
        });
        intro.start();
      },
      'shortcut': function() {
        var intro = introJs();
        intro.setOption('showProgress', true);
        intro.setOptions({
          steps: [
            {
              element: '#btn-group-audio',
              intro: 'Command + P で音声再生<br>Command + W で音声再生の停止<br>Command + S で音声保存'
            },
            {
              element: '#source',
              intro: 'Command + ↑ でメッセージ入力欄にカーソル移動'
            },
            {
              element: '#encoded',
              intro: 'Command + ↓ で音記号列入力欄にカーソル移動'
            },
            {
              element: '#encode',
              intro: 'Command + → で音記号列へ変換'
            },
            {
              element: '#from_clipboard',
              intro: 'Command + D でクリップボードに入っているテキストをメッセージ入力欄にコピーします'
            },
            {
              element: '#sidebar-items',
              position: 'right',
              intro: 'Command + ← で次(下)の設定に切り替え<br>Command + Shift + ← で前(上)の設定に切り替え'
            }
          ]
        });
        intro.start();
      }
    }
  });

