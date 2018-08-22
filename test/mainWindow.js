var Application = require('spectron').Application;
var assert = require('assert');
var temp = require('temp').track();

describe('mainWindow', function() {
  this.timeout(10000);

  beforeEach(function() {
    var fsprefix = '_myubo_test' + Date.now().toString(36);
    var dirPath = temp.mkdirSync(fsprefix);
    this.app = new Application({
      path: 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/MacOS/MYukkuriVoice',
      env: { DEBUG: 1, NODE_ENV: 'test', userData: dirPath },
    });
    return this.app.start();
  });

  afterEach(function() {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it('open mainWindow at startup', function() {
    return this.app.client
      .getWindowCount().then(function(count) {
        assert.equal(count, 1);
      })
      .isVisible('#main-pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .isVisible('#settings-pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .getTitle().then(function(title) {
        assert.equal(title, 'MYukkuriVoice');
      })
      // error check
      .isExisting('tr.message-item.error').then(function(error) {
        assert.ok(! error)
      })
      .isExisting('tr.message-item.syserror').then(function(error) {
        assert.ok(! error)
      })
  });

  it('mainWindow input', function() {
    return this.app.client
      // encode
      .setValue('#source', 'test')
      .click('#encode')
      .getValue('#encoded').then(function(encoded) {
        assert.equal(encoded, "テ'_スト");
      })
      // clear
      .click('#clear')
      .getValue('#source').then(function(source) {
        assert.equal(source, '');
      })
      .getValue('#encoded').then(function(encoded) {
        assert.equal(encoded, '');
      })
      // play and record is enabled
      .isEnabled('#play').then(function(isEnabled) {
        assert.ok(! isEnabled);
      })
      .setValue('#source', 'test')
      .isEnabled('#play').then(function(isEnabled) {
        assert.ok(isEnabled);
      })
      .click('#clear')
      .isEnabled('#play').then(function(isEnabled) {
        assert.ok(! isEnabled);
      })
      .setValue('#encoded', "テ'_スト")
      .isEnabled('#play').then(function(isEnabled) {
        assert.ok(isEnabled);
      })
      // error check
      .isExisting('tr.message-item.error').then(function(error) {
        assert.ok(! error)
      })
      .isExisting('tr.message-item.syserror').then(function(error) {
        assert.ok(! error)
      })
  });

  it('mainWindow phont selection', function() {
    return this.app.client
      .elements('#phont option').then(function(response) {
        assert.equal(response.value.length, 26);
      })
  });

  it('mainWindow voice config', function() {
    var voiceConfigLength = 999;
    return this.app.client
      // filter
      .elements('.voice-config-item').then(function(response) {
        assert.ok(response.value.length > 0);
      })
      .setValue('#filter-text', 'xxxxxxxxxxxxxxxxxx')
      .elements('.voice-config-item').then(function(response) {
        assert.equal(response.value.length, 0);
      })
      .setValue('#filter-text', '')
      .elements('.voice-config-item').then(function(response) {
        assert.ok(response.value.length > 0);
      })
      // add config
      .elements('.voice-config-item').then(function(response) {
        voiceConfigLength = response.value.length;
      })
      .click('#plus')
      .elements('.voice-config-item').then(function(response) {
        assert.equal(response.value.length, voiceConfigLength + 1);
      })
      // error check
      .isExisting('tr.message-item.error').then(function(error) {
        assert.ok(! error)
      })
      .isExisting('tr.message-item.syserror').then(function(error) {
        assert.ok(! error)
      })
  });

  it('mainWindow play', function() {
    return this.app.client
      .setValue('#encoded', "テ'_スト")
      .click('#play')
      .waitForText('#duration', 2000)
      .getValue('#duration').then(function(duration) {
        assert.ok(duration != '');
      })
      .click('#stop')
      // error check
      .isExisting('tr.message-item.error').then(function(error) {
        assert.ok(! error)
      })
      .isExisting('tr.message-item.syserror').then(function(error) {
        assert.ok(! error)
      })
  });

  it('mainWindow alwaysOnTop', function() {
    var app = this.app;
    return this.app.client
      .getAttribute('#always-on-top-btn span.icon', 'class').then(function(classes) {
        assert.ok(! classes.includes('active'));
        app.browserWindow.isAlwaysOnTop().then(function(isAlwaysOnTop) {
          assert.ok(! isAlwaysOnTop);
        })
      })
      .click('#always-on-top-btn')
      .getAttribute('#always-on-top-btn span.icon', 'class').then(function(classes) {
        assert.ok(classes.includes('active'));
        app.browserWindow.isAlwaysOnTop().then(function(isAlwaysOnTop) {
          assert.ok(isAlwaysOnTop);
        })
      })
      .click('#always-on-top-btn')
      .getAttribute('#always-on-top-btn span.icon', 'class').then(function(classes) {
        assert.ok(! classes.includes('active'));
        app.browserWindow.isAlwaysOnTop().then(function(isAlwaysOnTop) {
          assert.ok(! isAlwaysOnTop);
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

  it('mainWindow help', function() {
    return this.app.client
      .click('#help')
      .getWindowCount().then(function(count) {
        assert.equal(count, 2);
      })
      .windowByIndex(1)
      .getTitle().then(function(title) {
        assert.equal(title, 'MYukkuriVoice Help');
      })
      // error check
      .windowByIndex(0)
      .isExisting('tr.message-item.error').then(function(error) {
        assert.ok(! error)
      })
      .isExisting('tr.message-item.syserror').then(function(error) {
        assert.ok(! error)
      })
  });

  it('mainWindow shortcut intro', function() {
    return this.app.client
      .isVisible('.introjs-tooltip').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .click('#shortcut')
      .isVisible('.introjs-tooltip').then(function(isVisible) {
        assert.ok(isVisible);
      })
      // error check
      .isExisting('tr.message-item.error').then(function(error) {
        assert.ok(! error)
      })
      .isExisting('tr.message-item.syserror').then(function(error) {
        assert.ok(! error)
      })
  });

  it('mainWindow tutorial intro', function() {
    return this.app.client
      .isVisible('.introjs-tooltip').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .click('#tutorial')
      .isVisible('.introjs-tooltip').then(function(isVisible) {
        assert.ok(isVisible);
      })
      // error check
      .isExisting('tr.message-item.error').then(function(error) {
        assert.ok(! error)
      })
      .isExisting('tr.message-item.syserror').then(function(error) {
        assert.ok(! error)
      })
  });

  it('mainWindow switchSettingsView', function() {
    return this.app.client
      .click('#switch-settings-view')
      .isVisible('#main-pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#settings-pane').then(function(isVisible) {
        assert.ok(isVisible);
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

