// angular model
angular.module('yvoiceModel', [])
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
  });
