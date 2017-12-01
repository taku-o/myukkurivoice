var Application = require('spectron').Application;
var assert = require('assert');

describe('specWindow', function() {
  this.timeout(10000);

  before(function() {
    this.app = new Application({
      path: 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/MacOS/MYukkuriVoice',
      env: { NODE_ENV: 'test' },
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

  it('specWindow load config', function() {
    return this.client
      .getWindowCount().then(function(count) {
        assert.equal(count, 2);
      })
      .element('#stext').then(function(value) {
          console.log(value);
        assert.ok(value);
      })
  });

});

