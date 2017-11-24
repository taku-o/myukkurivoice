var Application = require('spectron').Application
var assert = require('assert')

describe('application launch', function() {
  this.timeout(10000)

  beforeEach(function() {
    this.app = new Application({
      path: 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/MacOS/MYukkuriVoice'
    })
    return this.app.start()
  });

  afterEach(function() {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  });

  // test
  it('open application window at startup', function() {
    return this.app.client.getWindowCount().then(function (count) {
      assert.equal(count, 1)
    })
  });

  // menu
  it('menu', function(done) {
    //var menu = this.app.electron.remote.Menu.getApplicationMenu();
    //assert.ok(true);
    return done();
  });


});

