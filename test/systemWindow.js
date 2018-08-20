var Application = require('spectron').Application;
var assert = require('assert');

describe('systemWindow', function() {
  this.timeout(10000);

  before(function() {
    this.app = new Application({
      path: 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/MacOS/MYukkuriVoice',
      env: { DEBUG: 1, NODE_ENV: 'test', userData: 'test/userData' },
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
      .click('#show-system-window')
      .windowByIndex(1)
  });

  afterEach(function() {
    return this.client.close()
  });

  it('systemWindow load config', function() {
    return this.client
      .getValue('#main-width').then(function(value) {
        assert.ok(value);
      })
      .getValue('#main-height').then(function(value) {
        assert.ok(value);
      })
  });

});

