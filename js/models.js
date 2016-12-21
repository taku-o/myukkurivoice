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
      'source': '',
      'encoded': '',
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
        'source': 'MYukkuriVoiceへようこそ',
        'encoded': "ヌイウックリボ'イスエ+ヨ'ーコソ。",
        'phont': 1,
        'speed': 100,
        'volume': 100
      },
      {
        'id': 'sample_2',
        'name': 'サンプル設定2',
        'source': 'サンプルその2',
        'encoded': "サ'ンプル/ソヌ/ヌ'。",
        'phont': 2,
        'speed': 100,
        'volume': 100
      },
      {
        'id': 'sample_3',
        'name': 'サンプル設定3',
        'source': 'サンプルその3',
        'encoded': "サ'ンプル/ソヌ/サン。",
        'phont': 3,
        'speed': 100,
        'volume': 100
      }
    ]
  });
