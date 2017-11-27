var Application = require('spectron').Application;
var assert = require('assert');

describe('settingsView', function() {
  this.timeout(10000);

  beforeEach(function() {
    this.app = new Application({
      path: 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/MacOS/MYukkuriVoice'
    });
    return this.app.start();
  });

  afterEach(function() {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it('settingsView seq_write_box option', function() {
    var client = this.app.client;
    return this.app.client
      .click('#switch-settings-view')
      .isSelected('#seq_write_box .checkbox input').then(function(isSelected) {
        client.isVisible('#seq_write_box .form-group').then(function(isVisible) {
          assert.equal(isVisible, isSelected);
        })
      })
      // error check
      .isExisting('tr.message-item.error').then(function(error) {
        assert.ok(! error)
      })
      .isExisting('tr.message-item.syserror').then(function(error) {
        assert.ok(! error)
      })
  });

});
