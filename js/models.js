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
      'volume': 100
    }
  })
  .factory('YVoiceInitialData', function() {
    return [
      {
        'id': 'sample_1',
        'name': 'サンプル設定1',
        'phont': 1,
        'speed': 100,
        'volume': 100
      },
      {
        'id': 'sample_2',
        'name': 'サンプル設定2',
        'phont': 2,
        'speed': 100,
        'volume': 100
      },
      {
        'id': 'sample_3',
        'name': 'サンプル設定3',
        'phont': 3,
        'speed': 100,
        'volume': 100
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
