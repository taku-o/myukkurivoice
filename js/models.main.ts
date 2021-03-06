var _epath: any, epath = () => { _epath = _epath || require('electron-path'); return _epath; };
var unpackedPath = epath().getUnpackedPath();
var vendorPath = `${unpackedPath}/vendor`;

// angular model
angular.module('mainModels', [])
  // YPhontMasterList: yubo.YPhont[]
  .constant('YPhontMasterList',
    [
      {id:'at1_f1',     name:'f1 女声1(ゆっくり)',        version:'talk1',  idVoice:0, catalina:true},
      {id:'at1_m1',     name:'m1 男声1',                  version:'talk1',  idVoice:1, catalina:false},
      {id:'aq_f1c',     name:'f1c 女声',                  version:'talk2',  path:`${vendorPath}/phont/aq_f1c.phont`},
      {id:'aq_f3a',     name:'f3a 女声',                  version:'talk2',  path:`${vendorPath}/phont/aq_f3a.phont`},
      {id:'aq_huskey',  name:'huskey ハスキー',           version:'talk2',  path:`${vendorPath}/phont/aq_huskey.phont`},
      {id:'aq_m4b',     name:'m4b 男声',                  version:'talk2',  path:`${vendorPath}/phont/aq_m4b.phont`},
      {id:'aq_mf1',     name:'mf1 中性的',                version:'talk2',  path:`${vendorPath}/phont/aq_mf1.phont`},
      {id:'aq_rb2',     name:'rb2 小さいロボ',            version:'talk2',  path:`${vendorPath}/phont/aq_rb2.phont`},
      {id:'aq_rb3',     name:'rb3 ロボ',                  version:'talk2',  path:`${vendorPath}/phont/aq_rb3.phont`},
      {id:'aq_rm',      name:'rm 女声',                   version:'talk2',  path:`${vendorPath}/phont/aq_rm.phont`},
      {id:'aq_robo',    name:'robo ロボット',             version:'talk2',  path:`${vendorPath}/phont/aq_robo.phont`},
      {id:'aq_yukkuri', name:'aq_yukkuri',                version:'talk2',  path:`${vendorPath}/phont/aq_yukkuri.phont`},
      {id:'ar_f4',      name:'f4 女声',                   version:'talk2',  path:`${vendorPath}/phont/ar_f4.phont`},
      {id:'ar_m5',      name:'m5 男声',                   version:'talk2',  path:`${vendorPath}/phont/ar_m5.phont`},
      {id:'ar_mf2',     name:'mf2 機械声',                version:'talk2',  path:`${vendorPath}/phont/ar_mf2.phont`},
      {id:'ar_rm3',     name:'rm3 女声',                  version:'talk2',  path:`${vendorPath}/phont/ar_rm3.phont`},
      {id:'aq_defo1',   name:'aq_defo1',                  version:'talk2',  path:`${vendorPath}/phont/aq_defo1.phont`},
      {id:'aq_momo1',   name:'aq_momo1',                  version:'talk2',  path:`${vendorPath}/phont/aq_momo1.phont`},
      {id:'aq_teto1',   name:'aq_teto1',                  version:'talk2',  path:`${vendorPath}/phont/aq_teto1.phont`},
      {id:'gVoice_F1',  name:'aq10-F1 女声1(新ゆっくり)', version:'talk10', struct:{bas:0, spd:100, vol:100, pit:100, acc:100, lmd:100, fsc:100}},
      {id:'gVoice_F2',  name:'aq10-F2 女声2',             version:'talk10', struct:{bas:1, spd:100, vol:100, pit:77,  acc:150, lmd:100, fsc:100}},
      {id:'gVoice_F3',  name:'aq10-F3 女声3',             version:'talk10', struct:{bas:0, spd:80,  vol:100, pit:100, acc:100, lmd:61,  fsc:148}},
      {id:'gVoice_M1',  name:'aq10-M1 男声1',             version:'talk10', struct:{bas:2, spd:100, vol:100, pit:30,  acc:100, lmd:100, fsc:100}},
      {id:'gVoice_M2',  name:'aq10-M2 男声2',             version:'talk10', struct:{bas:2, spd:105, vol:100, pit:45,  acc:130, lmd:120, fsc:100}},
      {id:'gVoice_R1',  name:'aq10-R1 ロボット1',         version:'talk10', struct:{bas:2, spd:100, vol:100, pit:30,  acc:20,  lmd:190, fsc:100}},
      {id:'gVoice_R2',  name:'aq10-R2 ロボット2',         version:'talk10', struct:{bas:1, spd:70,  vol:100, pit:50,  acc:50,  lmd:50,  fsc:180}},
    ]
  )
  // YPhontMasterIosEnvList: yubo.YPhont[]
  .constant('YPhontMasterIosEnvList',
    [
      {id:'at1_f1',     name:'f1 女声1(ゆっくり)',        version:'talk1',  idVoice:0, catalina:true},
      //{id:'at1_m1',     name:'m1 男声1',                  version:'talk1',  idVoice:1, catalina:false},
      {id:'aq_f1c',     name:'f1c 女声',                  version:'talk2',  path:`${vendorPath}/phont/aq_f1c.phont`},
      {id:'aq_f3a',     name:'f3a 女声',                  version:'talk2',  path:`${vendorPath}/phont/aq_f3a.phont`},
      {id:'aq_huskey',  name:'huskey ハスキー',           version:'talk2',  path:`${vendorPath}/phont/aq_huskey.phont`},
      {id:'aq_m4b',     name:'m4b 男声',                  version:'talk2',  path:`${vendorPath}/phont/aq_m4b.phont`},
      {id:'aq_mf1',     name:'mf1 中性的',                version:'talk2',  path:`${vendorPath}/phont/aq_mf1.phont`},
      {id:'aq_rb2',     name:'rb2 小さいロボ',            version:'talk2',  path:`${vendorPath}/phont/aq_rb2.phont`},
      {id:'aq_rb3',     name:'rb3 ロボ',                  version:'talk2',  path:`${vendorPath}/phont/aq_rb3.phont`},
      {id:'aq_rm',      name:'rm 女声',                   version:'talk2',  path:`${vendorPath}/phont/aq_rm.phont`},
      {id:'aq_robo',    name:'robo ロボット',             version:'talk2',  path:`${vendorPath}/phont/aq_robo.phont`},
      {id:'aq_yukkuri', name:'aq_yukkuri',                version:'talk2',  path:`${vendorPath}/phont/aq_yukkuri.phont`},
      {id:'ar_f4',      name:'f4 女声',                   version:'talk2',  path:`${vendorPath}/phont/ar_f4.phont`},
      {id:'ar_m5',      name:'m5 男声',                   version:'talk2',  path:`${vendorPath}/phont/ar_m5.phont`},
      {id:'ar_mf2',     name:'mf2 機械声',                version:'talk2',  path:`${vendorPath}/phont/ar_mf2.phont`},
      {id:'ar_rm3',     name:'rm3 女声',                  version:'talk2',  path:`${vendorPath}/phont/ar_rm3.phont`},
      {id:'aq_defo1',   name:'aq_defo1',                  version:'talk2',  path:`${vendorPath}/phont/aq_defo1.phont`},
      {id:'aq_momo1',   name:'aq_momo1',                  version:'talk2',  path:`${vendorPath}/phont/aq_momo1.phont`},
      {id:'aq_teto1',   name:'aq_teto1',                  version:'talk2',  path:`${vendorPath}/phont/aq_teto1.phont`},
      {id:'gVoice_F1',  name:'aq10-F1 女声1(新ゆっくり)', version:'talk10', struct:{bas:0, spd:100, vol:100, pit:100, acc:100, lmd:100, fsc:100}},
      {id:'gVoice_F2',  name:'aq10-F2 女声2',             version:'talk10', struct:{bas:1, spd:100, vol:100, pit:77,  acc:150, lmd:100, fsc:100}},
      {id:'gVoice_F3',  name:'aq10-F3 女声3',             version:'talk10', struct:{bas:0, spd:80,  vol:100, pit:100, acc:100, lmd:61,  fsc:148}},
      {id:'gVoice_M1',  name:'aq10-M1 男声1',             version:'talk10', struct:{bas:2, spd:100, vol:100, pit:30,  acc:100, lmd:100, fsc:100}},
      {id:'gVoice_M2',  name:'aq10-M2 男声2',             version:'talk10', struct:{bas:2, spd:105, vol:100, pit:45,  acc:130, lmd:120, fsc:100}},
      {id:'gVoice_R1',  name:'aq10-R1 ロボット1',         version:'talk10', struct:{bas:2, spd:100, vol:100, pit:30,  acc:20,  lmd:190, fsc:100}},
      {id:'gVoice_R2',  name:'aq10-R2 ロボット2',         version:'talk10', struct:{bas:1, spd:70,  vol:100, pit:50,  acc:50,  lmd:50,  fsc:180}},
    ]
  )
  // YVoice: yubo.YVoice
  .constant('YVoice',
    {
      id: null,
      name: 'f1 女声1(ゆっくり)',
      phont: 'at1_f1',
      version: 'talk1',
      speed: 100,
      playbackRate: 1.0,
      detune: 0,
      volume: 1.0,
      rhythmOn: true,
      sourceWrite: false,
      seqWrite: false,
      seqWriteOptions: {
        dir: '',
        prefix: '',
        bookmark: '',
      },
    }
  )
  // YVoiceInitialData: yubo.YVoice[]
  .constant('YVoiceInitialData',
    [
      {
        id: 'sample_1',
        name: 'f1 女声1(ゆっくり)',
        phont: 'at1_f1',
        version: 'talk1',
        speed: 100,
        playbackRate: 1.0,
        detune: 0,
        volume: 1.0,
        rhythmOn: true,
        sourceWrite: false,
        seqWrite: false,
        seqWriteOptions: {
          dir: '',
          prefix: '',
          bookmark: '',
        },
      },
      {
        id: 'sample_2',
        name: 'aq_yukkuri(サンプル設定2)',
        phont: 'aq_yukkuri',
        version: 'talk2',
        speed: 100,
        playbackRate: 1.0,
        detune: 0,
        volume: 1.0,
        rhythmOn: true,
        sourceWrite: false,
        seqWrite: false,
        seqWriteOptions: {
          dir: '',
          prefix: '',
          bookmark: '',
        },
      },
      {
        id: 'sample_3',
        name: 'f1c 女声(サンプル設定3)',
        phont: 'aq_f1c',
        version: 'talk2',
        speed: 100,
        playbackRate: 1.0,
        detune: 0,
        volume: 1.0,
        rhythmOn: true,
        sourceWrite: false,
        seqWrite: false,
        seqWriteOptions: {
          dir: '',
          prefix: '',
          bookmark: '',
        },
      },
      {
        id: 'sample_4',
        name: 'aq10-F1 女声1(新ゆっくり)',
        phont: 'gVoice_F1',
        version: 'talk10',
        bas: 0,
        spd: 100,
        vol: 100,
        pit: 100,
        acc: 100,
        lmd: 100,
        fsc: 100,
        speed: 100,
        playbackRate: 1.0,
        detune: 0,
        volume: 1.0,
        rhythmOn: true,
        sourceWrite: false,
        seqWrite: false,
        seqWriteOptions: {
          dir: '',
          prefix: '',
          bookmark: '',
        },
      },
    ]
  )
  // YInput: yubo.YInput
  .constant('YInput',
    {
      source: '',
      encoded: '',
    }
  )
  // YInputInitialData: yubo.YInput
  .constant('YInputInitialData',
    {
      source: 'エムユックリボイスへようこそ。ゆっくりしていってね！',
      encoded: "エムユックリボ'イスエ/ヨ'ーコソ。ユック'リ/シテイッテ'ネ、",
    }
  )
  // YCommandInput: yubo.YCommandInput
  .constant('YCommandInput',
    {
      id: null,
      name: '',
      text: '',
    }
  );
