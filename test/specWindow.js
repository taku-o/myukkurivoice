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
      .click('#consumer-key')
      .waitForValue('#consumer-key-result', 2000)
      .getValue('#consumer-key-result').then(function(value) {
        assert.ok(value)
      })
      // consumerKey unknown key
      .setValue('#consumer-key-result', 'initial value')
      .setValue('#license-type', 'unknown')
      .click('#consumer-key')
      .waitForValue('#consumer-key-result', 2000)
      .getValue('#consumer-key-result').then(function(value) {
        assert.ok(! value)
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
        assert.equal(value, '')
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

});

