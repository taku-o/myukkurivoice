// angular model
angular.module('yvoiceModel', [])
  .factory('YConfig', function() {
    return {
      'tutorial': false
    }
  })
  .factory('YVoice', function() {
    return {
      'id': null,
      'name': 'aq_yukkuri',
      'phont': 1,
      //'effect': 2,
      //'intonation': true,
      'speed': 100,
      'volume': 100,
      'seq_write': false,
      'seq_write_options':{
        'dir': '',
        'prefix': ''
      }
    }
  })
  .factory('YVoiceInitialData', function() {
    return [
      {
        'id': 'sample_1',
        'name': 'サンプル設定1',
        'phont': 'aq_yukkuri',
        'speed': 100,
        'volume': 100,
        'seq_write': false,
        'seq_write_options':{
          'dir': '',
          'prefix': ''
        }
      },
      {
        'id': 'sample_2',
        'name': 'サンプル設定2',
        'phont': 'aq_f1c',
        'speed': 100,
        'volume': 100,
        'seq_write': false,
        'seq_write_options':{
          'dir': '',
          'prefix': ''
        }
      },
      {
        'id': 'sample_3',
        'name': 'サンプル設定3',
        'phont': 'aq_f3a',
        'speed': 100,
        'volume': 100,
        'seq_write': false,
        'seq_write_options':{
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
      'source': 'MYukkuriVoiceへようこそ',
      'encoded': "ヌイウックリボ'イスエ+ヨ'ーコソ。"
    }
  });
