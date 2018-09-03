import {Application} from 'spectron';
import * as assert from 'assert';
import * as temp from 'temp';
temp.track();

describe('helpWindow', function() {
  this.timeout(10000);

  before(function() {
    var fsprefix = `_myubo_test${Date.now().toString(36)}`;
    var dirPath = temp.mkdirSync(fsprefix);
    this.app = new Application({
      path: 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/MacOS/MYukkuriVoice',
      env: {DEBUG: 1, NODE_ENV: 'test', userData: dirPath},
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
      .click('#help')
      .windowByIndex(1);
  });

  afterEach(function() {
    return this.client.close();
  });

  it('helpWindow menu list', function() {
    return this.client
      .elements('.nav-group-item.help-item').then((response: HTMLInputElement) => {
        assert.equal(response.value.length, 8);
      })
      .elements('.nav-group-item.functions-item').then((response: HTMLInputElement) => {
        assert.equal(response.value.length, 9);
      });
  });

  it('helpWindow menu click', function() {
    return this.client
      .isVisible('#about-pane').then((isVisible: boolean) => {
        assert.ok(isVisible);
      })
      .isVisible('#voicecode-pane').then((isVisible: boolean) => {
        assert.ok(! isVisible);
      })
      .isVisible('#trouble-pane').then((isVisible: boolean) => {
        assert.ok(! isVisible);
      })
      .isVisible('#update-pane').then((isVisible: boolean) => {
        assert.ok(! isVisible);
      })
      .isVisible('#uninstall-pane').then((isVisible: boolean) => {
        assert.ok(! isVisible);
      })
      .isVisible('#backup-pane').then((isVisible: boolean) => {
        assert.ok(! isVisible);
      })
      .isVisible('#license-pane').then((isVisible: boolean) => {
        assert.ok(! isVisible);
      })
      .isVisible('#contact-pane').then((isVisible: boolean) => {
        assert.ok(! isVisible);
      })
      .isVisible('#funclist-pane').then((isVisible: boolean) => {
        assert.ok(! isVisible);
      })
      .isVisible('#play-pane').then((isVisible: boolean) => {
        assert.ok(! isVisible);
      })
      .isVisible('#tuna-pane').then((isVisible: boolean) => {
        assert.ok(! isVisible);
      })
      .isVisible('#writing-pane').then((isVisible: boolean) => {
        assert.ok(! isVisible);
      })
      .isVisible('#dataconfig-pane').then((isVisible: boolean) => {
        assert.ok(! isVisible);
      })
      .isVisible('#dragout-pane').then((isVisible: boolean) => {
        assert.ok(! isVisible);
      })
      .isVisible('#multivoice-pane').then((isVisible: boolean) => {
        assert.ok(! isVisible);
      })
      .isVisible('#shortcut-pane').then((isVisible: boolean) => {
        assert.ok(! isVisible);
      })
      .isVisible('#help-pane').then((isVisible: boolean) => {
        assert.ok(! isVisible);
      })
      .click('#menu-about')
      .isVisible('#about-pane').then((isVisible: boolean) => {
        assert.ok(isVisible);
      })
      .click('#menu-voicecode')
      .isVisible('#voicecode-pane').then((isVisible: boolean) => {
        assert.ok(isVisible);
      })
      .click('#menu-trouble')
      .isVisible('#trouble-pane').then((isVisible: boolean) => {
        assert.ok(isVisible);
      })
      .click('#menu-update')
      .isVisible('#update-pane').then((isVisible: boolean) => {
        assert.ok(isVisible);
      })
      .click('#menu-uninstall')
      .isVisible('#uninstall-pane').then((isVisible: boolean) => {
        assert.ok(isVisible);
      })
      .click('#menu-backup')
      .isVisible('#backup-pane').then((isVisible: boolean) => {
        assert.ok(isVisible);
      })
      .click('#menu-license')
      .isVisible('#license-pane').then((isVisible: boolean) => {
        assert.ok(isVisible);
      })
      .click('#menu-contact')
      .isVisible('#contact-pane').then((isVisible: boolean) => {
        assert.ok(isVisible);
      })
      .click('#menu-funclist')
      .isVisible('#funclist-pane').then((isVisible: boolean) => {
        assert.ok(isVisible);
      })
      .click('#menu-play')
      .isVisible('#play-pane').then((isVisible: boolean) => {
        assert.ok(isVisible);
      })
      .click('#menu-tuna')
      .isVisible('#tuna-pane').then((isVisible: boolean) => {
        assert.ok(isVisible);
      })
      .click('#menu-writing')
      .isVisible('#writing-pane').then((isVisible: boolean) => {
        assert.ok(isVisible);
      })
      .click('#menu-dataconfig')
      .isVisible('#dataconfig-pane').then((isVisible: boolean) => {
        assert.ok(isVisible);
      })
      .click('#menu-dragout')
      .isVisible('#dragout-pane').then((isVisible: boolean) => {
        assert.ok(isVisible);
      })
      .click('#menu-multivoice')
      .isVisible('#multivoice-pane').then((isVisible: boolean) => {
        assert.ok(isVisible);
      })
      .click('#menu-shortcut')
      .isVisible('#shortcut-pane').then((isVisible: boolean) => {
        assert.ok(isVisible);
      })
      .click('#menu-help')
      .isVisible('#help-pane').then((isVisible: boolean) => {
        assert.ok(isVisible);
      })
      // finally
      .isVisible('#about-pane').then((isVisible: boolean) => {
        assert.ok(! isVisible);
      });
  });
});
