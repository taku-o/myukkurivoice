var Application = require('spectron').Application;
var assert = require('assert');

describe('helpWindow', function() {
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
      .click('#help')
      .windowByIndex(1)
  });

  afterEach(function() {
    return this.client.close()
  });

  it('helpWindow menu list', function() {
    return this.client
      .elements('.nav-group-item.help-item').then(function(response) {
        assert.equal(response.value.length, 8);
      })
      .elements('.nav-group-item.functions-item').then(function(response) {
        assert.equal(response.value.length, 9);
      })
  });

  it('helpWindow menu click', function() {
    return this.client
      .isVisible('#about-pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .isVisible('#voicecode-pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#trouble-pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#update-pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#uninstall-pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#backup-pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#license-pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#contact-pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#funclist-pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#play-pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#tuna-pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#writing-pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#dataconfig-pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#dragout-pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#multivoice-pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#shortcut-pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#help-pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .click('#menu-about')
      .isVisible('#about-pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-voicecode')
      .isVisible('#voicecode-pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-trouble')
      .isVisible('#trouble-pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-update')
      .isVisible('#update-pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-uninstall')
      .isVisible('#uninstall-pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-backup')
      .isVisible('#backup-pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-license')
      .isVisible('#license-pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-contact')
      .isVisible('#contact-pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-funclist')
      .isVisible('#funclist-pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-play')
      .isVisible('#play-pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-tuna')
      .isVisible('#tuna-pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-writing')
      .isVisible('#writing-pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-dataconfig')
      .isVisible('#dataconfig-pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-dragout')
      .isVisible('#dragout-pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-multivoice')
      .isVisible('#multivoice-pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-shortcut')
      .isVisible('#shortcut-pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-help')
      .isVisible('#help-pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      // finally
      .isVisible('#about-pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
  });

});

