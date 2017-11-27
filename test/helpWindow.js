var Application = require('spectron').Application;
var assert = require('assert');

describe('helpWindow', function() {
  this.timeout(10000);

  before(function() {
    this.app = new Application({
      path: 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/MacOS/MYukkuriVoice'
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
        //assert.equal(response.value.length, 8);
        assert.equal(response.value.length, 7);
      })
      .elements('.nav-group-item.functions-item').then(function(response) {
        assert.equal(response.value.length, 7);
      })
  });

  it('helpWindow menu click', function() {
    return this.client
      .isVisible('#about_pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .isVisible('#voicecode_pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#trouble_pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#update_pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#uninstall_pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#backup_pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      //.isVisible('#license_pane').then(function(isVisible) {
      //  assert.ok(! isVisible);
      //})
      .isVisible('#contact_pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#funclist_pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#play_pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#tuna_pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#writing_pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#dataconfig_pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#shortcut_pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .isVisible('#help_pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
      .click('#menu-about')
      .isVisible('#about_pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-voicecode')
      .isVisible('#voicecode_pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-trouble')
      .isVisible('#trouble_pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-update')
      .isVisible('#update_pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-uninstall')
      .isVisible('#uninstall_pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-backup')
      .isVisible('#backup_pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      //.click('#menu-license')
      //.isVisible('#license_pane').then(function(isVisible) {
      //  assert.ok(isVisible);
      //})
      .click('#menu-contact')
      .isVisible('#contact_pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-funclist')
      .isVisible('#funclist_pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-play')
      .isVisible('#play_pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-tuna')
      .isVisible('#tuna_pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-writing')
      .isVisible('#writing_pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-dataconfig')
      .isVisible('#dataconfig_pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-shortcut')
      .isVisible('#shortcut_pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      .click('#menu-help')
      .isVisible('#help_pane').then(function(isVisible) {
        assert.ok(isVisible);
      })
      // finally
      .isVisible('#about_pane').then(function(isVisible) {
        assert.ok(! isVisible);
      })
  });

});



