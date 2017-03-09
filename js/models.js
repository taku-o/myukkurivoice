// angular model
angular.module('yvoiceModel', [])
  .factory('YVoice', function() {
    return {
      'id': null,
      'name': 'at1_f1',
      'phont': 'at1_f1',
      //'effect': 2,
      //'intonation': true,
      'speed': 100,
      'volume': 100,
      'source_write': false,
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
        'phont': 'at1_f1',
        'speed': 100,
        'volume': 100,
        'source_write': false,
        'seq_write': false,
        'seq_write_options':{
          'dir': '',
          'prefix': ''
        }
      },
      {
        'id': 'sample_2',
        'name': 'サンプル設定2',
        'phont': 'aq_yukkuri',
        'speed': 100,
        'volume': 100,
        'source_write': false,
        'seq_write': false,
        'seq_write_options':{
          'dir': '',
          'prefix': ''
        }
      },
      {
        'id': 'sample_3',
        'name': 'サンプル設定3',
        'phont': 'aq_f1c',
        'speed': 100,
        'volume': 100,
        'source_write': false,
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
      'source': 'エムユックリボイスへようこそ。ゆっくりしていってね！',
      'encoded': "エムユックリボ'イスエ/ヨ'ーコソ。ユック'リ/シテイッテ'ネ、"
    }
  });
