const storage = require('electron-json-storage');
const log = require('electron-log');
const fs = require('fs');
const ffi = require('ffi');
const ref = require('ref');
const temp = require("temp").track();

const app = require('electron').remote.app;
const app_path = app.getAppPath();

// angular service
angular.module('yvoiceService', ['yvoiceModel'])
  .factory('ConfigService', ['YConfig', function(YConfig) {
    return {
      load: function(fn) {
        storage.get('config', function (error, data) {
          if (error) { throw error; }
          if (Object.keys(data).length === 0) {
            var new_config = angular.copy(YConfig);
            fn(new_config);
          } else {
            fn(data);
          }
        });
      },
      save: function(config) {
        storage.set('config', config, function(error) {
          if (error) { throw error; }
        });
      },
      clear: function(fn) {
        storage.remove('config', function(error) {
          if (error) { throw error; }
          fn();
        });
      }
    }
  }])
  .factory('DataService', ['YVoice', 'YVoiceInitialData', function(YVoice, YVoiceInitialData) {

    function uniq_id() {
      return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
    }

    return {
      load: function(fn) {
        storage.get('data', function (error, data) {
          if (error) { throw error; }
          if (Object.keys(data).length === 0) {
            fn([]);
          } else {
            fn(data);
          }
        });
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
          if (error) { throw error; }
        });
      },
      clear: function(fn) {
        storage.remove('data', function(error) {
          if (error) { throw error; }
          fn();
        });
      }
    }
  }])
  .factory('MasterService', function() {
    var phont_list = [
      {'id':1,  'name':'aq_yukkuri', 'path':app_path + '/vendor/aqtk2-mac-eva/phont/aq_yukkuri.phont'},
      {'id':2,  'name':'aq_f1c',     'path':app_path + '/vendor/aqtk2-mac-eva/phont/aq_f1c.phont'},
      {'id':3,  'name':'aq_f3a',     'path':app_path + '/vendor/aqtk2-mac-eva/phont/aq_f3a.phont'},
      {'id':4,  'name':'aq_huskey',  'path':app_path + '/vendor/aqtk2-mac-eva/phont/aq_huskey.phont'},
      {'id':5,  'name':'aq_m4b',     'path':app_path + '/vendor/aqtk2-mac-eva/phont/aq_m4b.phont'},
      {'id':6,  'name':'aq_mf1',     'path':app_path + '/vendor/aqtk2-mac-eva/phont/aq_mf1.phont'},
      {'id':7,  'name':'aq_rb2',     'path':app_path + '/vendor/aqtk2-mac-eva/phont/aq_rb2.phont'},
      {'id':8,  'name':'aq_rb3',     'path':app_path + '/vendor/aqtk2-mac-eva/phont/aq_rb3.phont'},
      {'id':9,  'name':'aq_rm',      'path':app_path + '/vendor/aqtk2-mac-eva/phont/aq_rm.phont'},
      {'id':10, 'name':'aq_robo',    'path':app_path + '/vendor/aqtk2-mac-eva/phont/aq_robo.phont'},
      {'id':11, 'name':'ar_f4',      'path':app_path + '/vendor/aqtk2-mac-eva/phont/ar_f4.phont'},
      {'id':12, 'name':'ar_m5',      'path':app_path + '/vendor/aqtk2-mac-eva/phont/ar_m5.phont'},
      {'id':13, 'name':'ar_mf2',     'path':app_path + '/vendor/aqtk2-mac-eva/phont/ar_mf2.phont'},
      {'id':14, 'name':'ar_rm3',     'path':app_path + '/vendor/aqtk2-mac-eva/phont/ar_rm3.phont'}
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
  .factory('AquesService', function() {
    var ptr_void  = ref.refType(ref.types.void);
    var ptr_int   = ref.refType(ref.types.int);
    var ptr_char = ref.refType(ref.types.char);
    var ptr_uchar = ref.refType(ref.types.uchar);

    // void * AqKanji2Koe_Create (const char *pathDic, int *pErr)
    // void AqKanji2Koe_Release (void * hAqKanji2Koe)
    // int AqKanji2Koe_Convert (void * hAqKanji2Koe, const char *kanji, char *koe, int nBufKoe)
    var framework_path = app_path + '/vendor/aqk2k_mac_eva/AqKanji2KoeEva.framework/Versions/A/AqKanji2KoeEva';
    var ptr_AqKanji2Koe_Create  = ffi.DynamicLibrary(framework_path).get('AqKanji2Koe_Create');
    var ptr_AqKanji2Koe_Release = ffi.DynamicLibrary(framework_path).get('AqKanji2Koe_Release');
    var ptr_AqKanji2Koe_Convert = ffi.DynamicLibrary(framework_path).get('AqKanji2Koe_Convert')
    var fn_AqKanji2Koe_Create   = ffi.ForeignFunction(ptr_AqKanji2Koe_Create, ptr_void, [ 'string', ptr_int ]);
    var fn_AqKanji2Koe_Release  = ffi.ForeignFunction(ptr_AqKanji2Koe_Release, 'void', [ ptr_void ]);
    var fn_AqKanji2Koe_Convert  = ffi.ForeignFunction(ptr_AqKanji2Koe_Convert, 'int', [ ptr_void, 'string', ptr_char, 'int' ]);

    // unsigned char * AquesTalk2_Synthe_Utf8(const char *koe, int iSpeed, int * size, void *phontDat)
    // void AquesTalk2_FreeWave (unsigned char *wav)
    var framework_path = app_path + '/vendor/aqtk2-mac-eva/AquesTalk2Eva.framework/Versions/A/AquesTalk2Eva';
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
      if (code >= 1000 && code <= 1008) { return 'Phontデータが正しくない'; }
    }

    return {
      encode: function(source) {
        if (!source) { return ''; }

        var alloc_int = ref.alloc('int');
        var aqKanji2Koe = fn_AqKanji2Koe_Create(app_path + '/vendor/aqk2k_mac_eva/aq_dic', alloc_int);
        var error_code = alloc_int.deref();
        if (error_code != 0) {
          log.warn('fn_AqKanji2Koe_Create raise error. error_code:' + error_table_AqKanji2Koe(error_code));
          return '';
        }

        var source_length = (new Blob([source_length], {type: "text/plain"})).size;
        var encoded_length = source_length >= 256? source_length * 2 : 256;
        var buf = Buffer.alloc(source_length);
        // crash ?
        var r = fn_AqKanji2Koe_Convert(aqKanji2Koe, source, buf, encoded_length);
        if (r != 0) {
          log.info('fn_AqKanji2Koe_Convert raise error. error_code:' + error_table_AqKanji2Koe(r));
          return '';
        }
        var encoded = ref.readCString(buf, 0);

        fn_AqKanji2Koe_Release(aqKanji2Koe);
        return encoded;
      },
      wave: function(encoded, phont, speed, volume) {
        if (!encoded) { return null; }
        var phont_data = fs.readFileSync(phont.path);

        var alloc_int = ref.alloc('int');
        var r = fn_AquesTalk2_Synthe_Utf8(encoded, speed, alloc_int, phont_data);
        if (r == ref.NULL) {
          var error_code = alloc_int.deref();
          log.info('fn_AquesTalk2_Synthe_Utf8 raise error. error_code:' + error_table_AquesTalk2(r));
          return null;
        }

        var ptr_buf = ref.alloc('pointer');
        ref.writePointer(ptr_buf, 0, r);
        var buf_wav = ref.readPointer(ptr_buf, 0, alloc_int.deref());

        var r = fn_AquesTalk2_FreeWave(r);
        return buf_wav;
      }
    }
  })
  .factory('AudioService', function() {
    //var sourceNode = null;
    var audio = null;

    //function to_array_buffer(buf_wav) {
    //  var a_buffer = new ArrayBuffer(buf_wav.length);
    //  var view = new Uint8Array(a_buffer);
    //  for (var i = 0; i < buf_wav.length; ++i) {
    //    view[i] = buf_wav[i];
    //  }
    //  return a_buffer;
    //};

    return {
      play: function(buf_wav) {
        if (!buf_wav) { return null; }
        //var a_buffer = to_array_buffer(buf_wav);
        //
        //var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        //audioCtx.decodeAudioData(a_buffer).then(function(decodedData) {
        //  sourceNode = audioCtx.createBufferSource();
        //  sourceNode.buffer = decodedData;
        //  sourceNode.connect(audioCtx.destination);
        //  sourceNode.start(0);
        //});

        temp.open('_myukkurivoice', function(err, info) {
          if (!err) {
            fs.writeFileSync(info.path, buf_wav);
            audio = new Audio(info.path);
            audio.play();
          }
        });

      },
      stop: function() {
        //if (!sourceNode) { return; }
        //sourceNode.stop();
        if (!audio) { return; }
        audio.pause();
      },
      record: function(file_path, buf_wav) {
        if (!file_path) { return; }
        if (!buf_wav) { return; }
        fs.writeFileSync(file_path, buf_wav);
      }
    }
  })
  .factory('IntroService', function() {
    return {
      'tutorial': function() {
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
              intro: 'すると、メッセージが音記号列に変換した結果が入ります'
            },
            {
              element: '#play',
              intro: '音記号列を発声させます'
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

