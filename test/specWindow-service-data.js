var Application = require('spectron').Application;
var assert = require('assert');
var temp = require('temp').track();

describe('specWindow-service-DataService', function() {
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

  it('DataService', function() {
    return this.client
      // load
      .click('#load')
      .waitForValue('#load-result', 2000)
      .getValue('#load-result').then(function(value) {
        assert.ok(value);
      })
      .getValue('#load-err').then(function(value) {
        assert.ok(! value);
      })
      // initialData
      .click('#initial-data')
      .getValue('#initial-data-result').then(function(value) {
        assert.ok(value);
        var parsed = JSON.parse(value);
        assert.equal(parsed.length, 4);
      })
      // create
      .click('#create')
      .getValue('#create-result').then(function(value) {
        assert.ok(value);
        var parsed = JSON.parse(value);
        assert.ok(parsed.id);
      })
      // copy
      .click('#copy')
      .getValue('#copy-result').then(function(value) {
        assert.ok(value);
        var parsed = JSON.parse(value);
        assert.ok(parsed.id);
      });
  });
});
