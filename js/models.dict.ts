angular.module('dictModels', [])
  // KindList: yubo.KindEntry[]
  .constant('KindList',
    [
      {id: 0,  kind: '名詞', hoge:'foo'},
      {id: 1,  kind: '名詞(サ変)'},
      {id: 2,  kind: '人名'},
      {id: 3,  kind: '人名(姓)'},
      {id: 4,  kind: '人名(名)'},
      {id: 5,  kind: '固有名詞'},
      {id: 6,  kind: '固有名詞(組織)'},
      {id: 7,  kind: '固有名詞(地域)'},
      {id: 8,  kind: '固有名詞(国)'},
      {id: 9,  kind: '代名詞'},
      {id: 10, kind: '代名詞(縮約)'},
      {id: 11, kind: '名詞(副詞可能)'},
      {id: 12, kind: '名詞(接続詞的)'},
      {id: 13, kind: '名詞(形容動詞語幹)'},
      {id: 14, kind: '名詞(ナイ形容詞語幹)'},
      {id: 15, kind: '形容詞'},
      {id: 16, kind: '副詞'},
      {id: 17, kind: '副詞(助詞類接続)'},
      {id: 18, kind: '接頭詞(名詞接続)'},
      {id: 19, kind: '接頭詞(動詞接続)'},
      {id: 20, kind: '接頭詞(数接続)'},
      {id: 21, kind: '接頭詞(形容詞接続)'},
      {id: 22, kind: '接続詞'},
      {id: 23, kind: '連体詞'},
      {id: 24, kind: '記号'},
      {id: 25, kind: '記号(アルファベット)'},
      {id: 26, kind: '感動詞'},
      {id: 27, kind: '間投詞'},
    ]
  )
  // KindHash: yubo.KindHash
  .constant('KindHash',
    {
      0: '名詞',
      1: '名詞(サ変)',
      2: '人名',
      3: '人名(姓)',
      4: '人名(名)',
      5: '固有名詞',
      6: '固有名詞(組織)',
      7: '固有名詞(地域)',
      8: '固有名詞(国)',
      9: '代名詞',
      10: '代名詞(縮約)',
      11: '名詞(副詞可能)',
      12: '名詞(接続詞的)',
      13: '名詞(形容動詞語幹)',
      14: '名詞(ナイ形容詞語幹)',
      15: '形容詞',
      16: '副詞',
      17: '副詞(助詞類接続)',
      18: '接頭詞(名詞接続)',
      19: '接頭詞(動詞接続)',
      20: '接頭詞(数接続)',
      21: '接頭詞(形容詞接続)',
      22: '接続詞',
      23: '連体詞',
      24: '記号',
      25: '記号(アルファベット)',
      26: '感動詞',
      27: '間投詞',
    }
  );

