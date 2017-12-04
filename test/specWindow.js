var Application = require('spectron').Application;
var assert = require('assert');

describe('specWindow', function() {
  this.timeout(10000);

  before(function() {
    this.app = new Application({
      path: 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/MacOS/MYukkuriVoice',
      env: { DEBUG: 1, NODE_ENV: 'test' },
    });
    return this.app.start()
  });

  after(function() {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  beforeEach(function() {
    this.client = this.app.client;
    return this.client
      .click('#show-spec-window')
      .windowByIndex(1)
  });

  afterEach(function() {
    return this.client.close()
  });

  it('specWindow LicenseService', function() {
    return this.client
      // encrypt
      .setValue('#pass-phrase', 'hogehoge')
      .setValue('#plain-key', 'this is a plain key')
      .click('#encrypt')
      .getValue('#encrypted-key').then(function(value) {
        assert.ok(value)
        console.log('tested encrypted key is :'+ value);
      })
      // decrypt
      .setValue('#plain-key', '')
      .click('#decrypt')
      .getValue('#plain-key').then(function(value) {
        assert.equal(value, 'this is a plain key')
      })
      // consumerKey aquesTalk10DevKey
      .setValue('#license-type', 'aquesTalk10DevKey')
      .setValue('#consumer-key-result', '')
      .setValue('#consumer-key-err', '')
      .click('#consumer-key')
      .waitForValue('#consumer-key-result', 5000)
      .getValue('#consumer-key-result').then(function(value) {
        assert.ok(value)
      })
      .getValue('#consumer-key-err').then(function(value) {
        assert.ok(! value)
      })
      // consumerKey unknown key
      .setValue('#license-type', 'unknown')
      .setValue('#consumer-key-result', 'initial value')
      .setValue('#consumer-key-err', '')
      .click('#consumer-key')
      .waitForValue('#consumer-key-done', 5000)
      .getValue('#consumer-key-result').then(function(value) {
        assert.ok(! value)
      })
      .getValue('#consumer-key-err').then(function(value) {
        assert.ok(! value)
      })
  });

  it('specWindow MessageService', function() {
    return this.client
      // action
      .setValue('#message', 'post action message.')
      .setValue('#message-result', '')
      .click('#action')
      .waitForValue('#message-result', 2000)
      .getValue('#message-result').then(function(value) {
        var parsed = JSON.parse(value);
        assert.ok(parsed.created);
        assert.equal(parsed.body, 'post action message.');
        assert.equal(parsed.type, 'action');
      })
      // record
      .setValue('#message', 'post record message.')
      .setValue('#mess-wav-file-path', '/tmp/hogehoge.wav')
      .setValue('#message-result', '')
      .click('#record')
      .waitForValue('#record-result', 2000)
      .getValue('#record-message-result').then(function(value) {
        var parsed = JSON.parse(value);
        assert.ok(parsed.created);
        assert.equal(parsed.body, 'post record message.');
        assert.equal(parsed.wavFilePath, '/tmp/hogehoge.wav');
        assert.equal(parsed.wavFileName, 'hogehoge.wav');
        assert.equal(parsed.type, 'record');
      })
      .getValue('#record-wavGenerated-result').then(function(value) {
        var parsed = JSON.parse(value);
        assert.ok(parsed.created);
        assert.equal(parsed.body, 'post record message.');
        assert.equal(parsed.wavFilePath, '/tmp/hogehoge.wav');
        assert.equal(parsed.wavFileName, 'hogehoge.wav');
        assert.equal(parsed.type, 'record');
      })
      // info
      .setValue('#message', 'post info message.')
      .setValue('#message-result', '')
      .click('#info')
      .waitForValue('#message-result', 2000)
      .getValue('#message-result').then(function(value) {
        var parsed = JSON.parse(value);
        assert.ok(parsed.created);
        assert.equal(parsed.body, 'post info message.');
        assert.equal(parsed.type, 'info');
      })
      // error
      .setValue('#message', 'post error message.')
      .setValue('#message-result', '')
      .click('#error')
      .waitForValue('#message-result', 2000)
      .getValue('#message-result').then(function(value) {
        var parsed = JSON.parse(value);
        assert.ok(parsed.created);
        assert.equal(parsed.body, 'post error message.');
        assert.equal(parsed.type, 'error');
      })
      // syserror
      .setValue('#message', 'post syserror message.')
      .setValue('#message-err', "{ message:'error cause.' }")
      .setValue('#message-result', '')
      .click('#syserror')
      .waitForValue('#message-result', 2000)
      .getValue('#message-result').then(function(value) {
        var parsed = JSON.parse(value);
        assert.ok(parsed.created);
        assert.equal(parsed.body, 'post syserror message.error cause.');
        assert.equal(parsed.type, 'syserror');
      })
      // syserror with no error
      .setValue('#message', 'post syserror message.')
      .setValue('#message-err', '')
      .setValue('#message-result', '')
      .click('#syserror')
      .waitForValue('#message-result', 2000)
      .getValue('#message-result').then(function(value) {
        var parsed = JSON.parse(value);
        assert.ok(parsed.created);
        assert.equal(parsed.body, 'post syserror message.');
        assert.equal(parsed.type, 'syserror');
      })
  });

  it('specWindow DataService', function() {
    return this.client
      // load
      .click('#load')
      .waitForValue('#load-result', 2000)
      .getValue('#load-result').then(function(value) {
        assert.ok(value)
      })
      .getValue('#load-err').then(function(value) {
        assert.ok(! value)
      })
      // initialData
      .click('#initial-data')
      .getValue('#initial-data-result').then(function(value) {
        assert.ok(value)
        var parsed = JSON.parse(value);
        assert.equal(parsed.length, 4);
      })
      // create
      .click('#create')
      .getValue('#create-result').then(function(value) {
        assert.ok(value)
        var parsed = JSON.parse(value);
        assert.ok(parsed.id);
      })
      // copy
      .click('#copy')
      .getValue('#copy-result').then(function(value) {
        assert.ok(value)
        var parsed = JSON.parse(value);
        assert.ok(parsed.id);
      })
  });

  // AquesService
  it('specWindow AquesService', function() {
    return this.client
      // encode
      .setValue('#source', 'test')
      .click('#encode')
      .getValue('#encode-result').then(function(value) {
        assert.equal(value, "テ'_スト");
      })
      // encode empty string
      .setValue('#source', '')
      .setValue('#encode-result', '')
      .click('#encode')
      .getValue('#encode-result').then(function(value) {
        assert.ok(!value);
      })
      // wave talk1
      .setValue('#encoded', "テ'_スト")
      .setValue('#wave-result', '')
      .setValue('#wave-err', '')
      .click('#wave-ver1')
      .waitForValue('#wave-result', 5000)
      .getValue('#wave-result').then(function(value) {
        assert.equal(value, 'ok');
      })
      .getValue('#wave-err').then(function(value) {
        assert.ok(! value)
      })
      // wave talk1 empty
      .setValue('#encoded', '')
      .setValue('#wave-result', '')
      .setValue('#wave-err', '')
      .click('#wave-ver1')
      .getValue('#wave-result').then(function(value) {
        assert.ok(!value);
      })
      .getValue('#wave-err').then(function(value) {
        assert.ok(! value)
      })
      // wave talk2
      .setValue('#encoded', "テ'_スト")
      .setValue('#wave-result', '')
      .setValue('#wave-err', '')
      .click('#wave-ver2')
      .waitForValue('#wave-result', 5000)
      .getValue('#wave-result').then(function(value) {
        assert.equal(value, 'ok');
      })
      .getValue('#wave-err').then(function(value) {
        assert.ok(! value)
      })
      // wave talk2 empty
      .setValue('#encoded', '')
      .setValue('#wave-result', '')
      .setValue('#wave-err', '')
      .click('#wave-ver2')
      .getValue('#wave-result').then(function(value) {
        assert.ok(!value);
      })
      .getValue('#wave-err').then(function(value) {
        assert.ok(! value)
      })
      // wave talk10
      .setValue('#encoded', "テ'_スト")
      .setValue('#wave-result', '')
      .setValue('#wave-err', '')
      .click('#wave-ver10')
      .waitForValue('#wave-result', 5000)
      .getValue('#wave-result').then(function(value) {
        assert.equal(value, 'ok');
      })
      .getValue('#wave-err').then(function(value) {
        assert.ok(! value)
      })
      // wave talk10 empty
      .setValue('#encoded', '')
      .setValue('#wave-result', '')
      .setValue('#wave-err', '')
      .click('#wave-ver10')
      .getValue('#wave-result').then(function(value) {
        assert.ok(!value);
      })
      .getValue('#wave-err').then(function(value) {
        assert.ok(! value)
      })
  });

  // AudioService1
  it('specWindow AudioService1', function() {
    return this.client
      // play aquestalk1
      .setValue('#play-result-1', '')
      .click('#play1-aqver1')
      .waitForValue('#play-result-1', 5000)
      .getValue('#play-result-1').then(function(value) {
        assert.equal(value, 'ok')
      })
      // play aquestalk2
      .setValue('#play-result-1', '')
      .click('#play1-aqver2')
      .waitForValue('#play-result-1', 5000)
      .getValue('#play-result-1').then(function(value) {
        assert.equal(value, 'ok')
      })
      // play aquestalk10
      .setValue('#play-result-1', '')
      .click('#play1-aqver10')
      .waitForValue('#play-result-1', 5000)
      .getValue('#play-result-1').then(function(value) {
        assert.equal(value, 'ok')
      })
      // record aquestalk1
      .setValue('#wav-file-path-1', '/tmp/_myukkurivoice_hogehoge.wav')
      .setValue('#record-result-1', '')
      .click('#record1-aqver1')
      .waitForValue('#record-result-1', 5000)
      .getValue('#record-result-1').then(function(value) {
        assert.equal(value, 'ok')
      })
      // record aquestalk2
      .setValue('#wav-file-path-1', '/tmp/_myukkurivoice_hogehoge.wav')
      .setValue('#record-result-1', '')
      .click('#record1-aqver2')
      .waitForValue('#record-result-1', 5000)
      .getValue('#record-result-1').then(function(value) {
        assert.equal(value, 'ok')
      })
      // record aquestalk10
      .setValue('#wav-file-path-1', '/tmp/_myukkurivoice_hogehoge.wav')
      .setValue('#record-result-1', '')
      .click('#record1-aqver10')
      .waitForValue('#record-result-1', 5000)
      .getValue('#record-result-1').then(function(value) {
        assert.equal(value, 'ok')
      })
      // TODO tmp file
      // TODO file exists
  });

  // AudioService2
  it('specWindow AudioService2', function() {
    return this.client
      // play aquestalk1
      .setValue('#play-result-2', '')
      .click('#play2-aqver1')
      .waitForValue('#play-result-2', 5000)
      .getValue('#play-result-2').then(function(value) {
        assert.equal(value, 'ok')
      })
      // play aquestalk2
      .setValue('#play-result-2', '')
      .click('#play2-aqver2')
      .waitForValue('#play-result-2', 5000)
      .getValue('#play-result-2').then(function(value) {
        assert.equal(value, 'ok')
      })
      // play aquestalk10
      .setValue('#play-result-2', '')
      .click('#play2-aqver10')
      .waitForValue('#play-result-2', 5000)
      .getValue('#play-result-2').then(function(value) {
        assert.equal(value, 'ok')
      })
      // record aquestalk1
      .setValue('#wav-file-path-2', '/tmp/_myukkurivoice_hogehoge.wav')
      .setValue('#record-result-2', '')
      .click('#record2-aqver1')
      .waitForValue('#record-result-2', 5000)
      .getValue('#record-result-2').then(function(value) {
        assert.equal(value, 'ok')
      })
      // record aquestalk2
      .setValue('#wav-file-path-2', '/tmp/_myukkurivoice_hogehoge.wav')
      .setValue('#record-result-2', '')
      .click('#record2-aqver2')
      .waitForValue('#record-result-2', 5000)
      .getValue('#record-result-2').then(function(value) {
        assert.equal(value, 'ok')
      })
      // record aquestalk10
      .setValue('#wav-file-path-2', '/tmp/_myukkurivoice_hogehoge.wav')
      .setValue('#record-result-2', '')
      .click('#record2-aqver10')
      .waitForValue('#record-result-2', 5000)
      .getValue('#record-result-2').then(function(value) {
        assert.equal(value, 'ok')
      })
      // TODO tmp file
      // TODO file exists
  });

  // AudioSourceService
  it('specWindow AudioSourceService', function() {
    return this.client
      // sourceFname
      .setValue('#wav-file-path', '/tmp/_myukkurivoice_hogehoge.wav')
      .click('#source-fname')
      .getValue('#source-fname-result').then(function(value) {
        assert.equal(value, '/tmp/_myukkurivoice_hogehoge.txt')
      })
      // save
      .setValue('#file-path', '/tmp/_myukkurivoice_hogehoge.txt')
      .setValue('#source-text', 'hogehoge')
      .click('#save')
      .getValue('#save-result').then(function(value) {
        assert.ok(value)
      })
      // TODO tmp file
      // TODO file exists
      // TODO file content
  });

  it('specWindow MasterService', function() {
    return this.client
      // getPhontList
      .click('#get-phont-list')
      .getValue('#get-phont-list-result').then(function(value) {
        var parsed = JSON.parse(value);
        assert.equal(parsed.length, 26);
      })
  });

  it('specWindow SeqFNameService', function() {
    return this.client
      // nextFname
      .setValue('#prefix', 'foo')
      .setValue('#num', '200')
      .click('#next-fname')
      .getValue('#next-fname-result').then(function(value) {
        assert.equal(value, 'foo0200.wav')
      })
  });

  it('specWindow AppUtilService', function() {
    return this.client
      // disableRhythm
      .setValue('#rhythm-text', 'test\' val/ue')
      .click('#disable-rhythm')
      .getValue('#disable-rhythm-result').then(function(value) {
        assert.equal(value, 'test value')
      })
      // disableRhythm not contains
      .setValue('#rhythm-text', 'this is not a rhythm text')
      .click('#disable-rhythm')
      .getValue('#disable-rhythm-result').then(function(value) {
        assert.equal(value, 'this is not a rhythm text')
      })
      // disableRhythm empty
      .setValue('#rhythm-text', '')
      .click('#disable-rhythm')
      .getValue('#disable-rhythm-result').then(function(value) {
        assert.ok(!value)
      })
  });

});

