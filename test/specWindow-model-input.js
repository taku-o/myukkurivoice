var Application = require('spectron').Application;
var assert = require('assert');
var temp = require('temp').track();

describe('specWindow-model-YInput', function() {
  this.timeout(10000);

  before(function() {
    var fsprefix = '_myubo_test' + Date.now().toString(36);
    var dirPath = temp.mkdirSync(fsprefix);
    this.app = new Application({
      path: 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/MacOS/MYukkuriVoice',
      env: { DEBUG: 1, NODE_ENV: 'test', userData: dirPath },
    });
    return this.app.start();
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
      .windowByIndex(1);
  });

  afterEach(function() {
    return this.client.close();
  });

  it('YInput', function() {
    return this.client
      .click('#getYInput')
      .getValue('#getYInput-result').then(function(value) {
        var parsed = JSON.parse(value);
        assert.equal('', parsed.source);
        assert.equal('', parsed.encoded);
      });
  });
});
