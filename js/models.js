// angular model
angular.module('yvoiceModel', [])
  .factory('YVoice', function() {
    return {
      'id': null,
      'name': 'f1 女声1(ゆっくり)',
      'phont': 'at1_f1',
      //'effect': 2,
      //'intonation': true,
      'speed': 100,
      'playbackRate': 1.0,
      'detune': 0,
      'volume': 1.0,
      'rhythmOn': true,
      'writeMarginMs': 150,
      'sourceWrite': false,
      'seqWrite': false,
      'seqWriteOptions':{
        'dir': '',
        'prefix': ''
      }
    }
  })
  .factory('YVoiceInitialData', function() {
    return [
      {
        'id': 'sample_1',
        'name': 'f1 女声1(ゆっくり)',
        'phont': 'at1_f1',
        'speed': 100,
        'playbackRate': 1.0,
        'detune': 0,
        'volume': 1.0,
        'rhythmOn': true,
        'writeMarginMs': 150,
        'sourceWrite': false,
        'seqWrite': false,
        'seqWriteOptions':{
          'dir': '',
          'prefix': ''
        }
      },
      {
        'id': 'sample_2',
        'name': 'aq_yukkuri(サンプル設定2)',
        'phont': 'aq_yukkuri',
        'speed': 100,
        'playbackRate': 1.0,
        'detune': 0,
        'volume': 1.0,
        'rhythmOn': true,
        'writeMarginMs': 150,
        'sourceWrite': false,
        'seqWrite': false,
        'seqWriteOptions':{
          'dir': '',
          'prefix': ''
        }
      },
      {
        'id': 'sample_3',
        'name': 'f1c 女声(サンプル設定3)',
        'phont': 'aq_f1c',
        'speed': 100,
        'playbackRate': 1.0,
        'detune': 0,
        'volume': 1.0,
        'rhythmOn': true,
        'writeMarginMs': 150,
        'sourceWrite': false,
        'seqWrite': false,
        'seqWriteOptions':{
          'dir': '',
          'prefix': ''
        }
      },
      {
        'id': 'sample_4',
        'name': 'aq10-F1 女声1(新ゆっくり)',
        'phont': 'gVoice_F1',
        'speed': 100,
        'playbackRate': 1.0,
        'detune': 0,
        'volume': 1.0,
        'rhythmOn': true,
        'writeMarginMs': 150,
        'sourceWrite': false,
        'seqWrite': false,
        'seqWriteOptions':{
          'dir': '',
          'prefix': ''
        }
      }
    ]
  })
  .factory('YInput', function() {
    return {
      'source': '',
      'encoded': ''
    }
  })
  .factory('YInputInitialData', function() {
    return {
      'source': 'エムユックリボイスへようこそ。ゆっくりしていってね！',
      'encoded': "エムユックリボ'イスエ/ヨ'ーコソ。ユック'リ/シテイッテ'ネ、"
    }
  });
