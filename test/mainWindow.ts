import {Application} from 'spectron';
import * as assert from 'assert';
import * as rimraf from 'rimraf';
import * as path from 'path';
import * as fs from 'fs';
import * as temp from 'temp';
temp.track();

describe('mainWindow', function() {
  this.timeout(10000);

  beforeEach(function() {
    const fsprefix = `_myubo_test${Date.now().toString(36)}`;
    const dirPath = temp.mkdirSync(fsprefix);
    this.app = new Application({
      path: 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/MacOS/MYukkuriVoice',
      env: {DEBUG: 1, NODE_ENV: 'test', userData: dirPath},
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
      .getWindowCount().then((count: number) => {
        assert.equal(count, 1);
      })
      .isVisible('#main-pane').then((isVisible: boolean) => {
        assert.ok(isVisible);
      })
      .isVisible('#settings-pane').then((isVisible: boolean) => {
        assert.ok(! isVisible);
      })
      .getTitle().then((title: string) => {
        assert.equal(title, 'MYukkuriVoice');
      })
      // error check
      .isExisting('tr.message-item.error').then((error: boolean) => {
        assert.ok(! error);
      })
      .isExisting('tr.message-item.syserror').then((error: boolean) => {
        assert.ok(! error);
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });

  // TODO multivoice
  it('input', function() {
    return this.app.client
      // encode
      .setValue('#source', 'test')
      .click('#encode')
      .getValue('#encoded').then((encoded: string) => {
        assert.equal(encoded, "テ'_スト");
      })
      // clear
      .click('#clear')
      .getValue('#source').then((source: string) => {
        assert.equal(source, '');
      })
      .getValue('#encoded').then((encoded: string) => {
        assert.equal(encoded, '');
      })
      // play and record is enabled
      .isEnabled('#play').then((isEnabled: boolean) => {
        assert.ok(! isEnabled);
      })
      .setValue('#source', 'test')
      .isEnabled('#play').then((isEnabled: boolean) => {
        assert.ok(isEnabled);
      })
      .click('#clear')
      .isEnabled('#play').then((isEnabled: boolean) => {
        assert.ok(! isEnabled);
      })
      .setValue('#encoded', "テ'_スト")
      .isEnabled('#play').then((isEnabled: boolean) => {
        assert.ok(isEnabled);
      })
      // error check
      .isExisting('tr.message-item.error').then((error: boolean) => {
        assert.ok(! error);
      })
      .isExisting('tr.message-item.syserror').then((error: boolean) => {
        assert.ok(! error);
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });

  it('phont selection', function() {
    return this.app.client
      .elements('#phont option').then((response: HTMLInputElement) => {
        assert.equal(response.value.length, 26);
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });

  // TODO initial
  // TODO save config
  // TODO delete config
  // TODO copy config
  // TODO filter
  it('voice config', function() {
    let voiceConfigLength = 999;
    return this.app.client
      // filter
      .elements('.voice-config-item').then((response: HTMLInputElement) => {
        assert.ok(response.value.length > 0);
      })
      .setValue('#filter-text', 'xxxxxxxxxxxxxxxxxx')
      .elements('.voice-config-item').then((response: HTMLInputElement) => {
        assert.equal(response.value.length, 0);
      })
      .setValue('#filter-text', '')
      .elements('.voice-config-item').then((response: HTMLInputElement) => {
        assert.ok(response.value.length > 0);
      })
      // add config
      .elements('.voice-config-item').then((response: HTMLInputElement) => {
        voiceConfigLength = response.value.length;
      })
      .click('#plus')
      .elements('.voice-config-item').then((response: HTMLInputElement) => {
        assert.equal(response.value.length, voiceConfigLength + 1);
      })
      // error check
      .isExisting('tr.message-item.error').then((error: boolean) => {
        assert.ok(! error);
      })
      .isExisting('tr.message-item.syserror').then((error: boolean) => {
        assert.ok(! error);
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });

  // TODO multivoice
  it('play', function() {
    return this.app.client
      .setValue('#encoded', "テ'_スト")
      .click('#play')
      .waitForText('#duration', 2000)
      .getValue('#duration').then((duration: string) => {
        assert.ok(duration != '');
      })
      .click('#stop')
      // error check
      .isExisting('tr.message-item.error').then((error: boolean) => {
        assert.ok(! error);
      })
      .isExisting('tr.message-item.syserror').then((error: boolean) => {
        assert.ok(! error);
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });

  // TODO record
  //it('mainWindow play', () => {
  //});

  it('alwaysOnTop', function() {
    const app = this.app;
    return this.app.client
      .getAttribute('#always-on-top-btn span.icon', 'class').then((classes: string[]) => {
        assert.ok(! classes.includes('active'));
        app.browserWindow.isAlwaysOnTop().then((isAlwaysOnTop: boolean) => {
          assert.ok(! isAlwaysOnTop);
        });
      })
      .click('#always-on-top-btn')
      .getAttribute('#always-on-top-btn span.icon', 'class').then((classes: string[]) => {
        assert.ok(classes.includes('active'));
        app.browserWindow.isAlwaysOnTop().then((isAlwaysOnTop: boolean) => {
          assert.ok(isAlwaysOnTop);
        });
      })
      .click('#always-on-top-btn')
      .getAttribute('#always-on-top-btn span.icon', 'class').then((classes: string[]) => {
        assert.ok(! classes.includes('active'));
        app.browserWindow.isAlwaysOnTop().then((isAlwaysOnTop: boolean) => {
          assert.ok(! isAlwaysOnTop);
        });
      })
      // error check
      .isExisting('tr.message-item.error').then((error: boolean) => {
        assert.ok(! error);
      })
      .isExisting('tr.message-item.syserror').then((error: boolean) => {
        assert.ok(! error);
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });

  it('open help', function() {
    return this.app.client
      .click('#help')
      .getWindowCount().then((count: number) => {
        assert.equal(count, 2);
      })
      .windowByIndex(1)
      .getTitle().then((title: string) => {
        assert.equal(title, 'MYukkuriVoice Help');
      })
      // error check
      .windowByIndex(0)
      .isExisting('tr.message-item.error').then((error: boolean) => {
        assert.ok(! error);
      })
      .isExisting('tr.message-item.syserror').then((error: boolean) => {
        assert.ok(! error);
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });

  it('open dictionary', function() {
    return this.app.client
      .click('#dictionary')
      .getWindowCount().then((count: number) => {
        assert.equal(count, 2);
      })
      .windowByIndex(1)
      .getTitle().then((title: string) => {
        assert.equal(title, 'MYukkuriVoice Dictionary Editor');
      })
      // error check
      .windowByIndex(0)
      .isExisting('tr.message-item.error').then((error: boolean) => {
        assert.ok(! error);
      })
      .isExisting('tr.message-item.syserror').then((error: boolean) => {
        assert.ok(! error);
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });

  it('shortcut intro', function() {
    return this.app.client
      .isVisible('.introjs-tooltip').then((isVisible: boolean) => {
        assert.ok(! isVisible);
      })
      .click('#shortcut')
      .isVisible('.introjs-tooltip').then((isVisible: boolean) => {
        assert.ok(isVisible);
      })
      // error check
      .isExisting('tr.message-item.error').then((error: boolean) => {
        assert.ok(! error);
      })
      .isExisting('tr.message-item.syserror').then((error: boolean) => {
        assert.ok(! error);
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });

  it('tutorial intro', function() {
    return this.app.client
      .isVisible('.introjs-tooltip').then((isVisible: boolean) => {
        assert.ok(! isVisible);
      })
      .click('#tutorial')
      .isVisible('.introjs-tooltip').then((isVisible: boolean) => {
        assert.ok(isVisible);
      })
      // error check
      .isExisting('tr.message-item.error').then((error: boolean) => {
        assert.ok(! error);
      })
      .isExisting('tr.message-item.syserror').then((error: boolean) => {
        assert.ok(! error);
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });

  it('switchSettingsView', function() {
    return this.app.client
      .click('#switch-settings-view')
      .isVisible('#main-pane').then((isVisible: boolean) => {
        assert.ok(! isVisible);
      })
      .isVisible('#settings-pane').then((isVisible: boolean) => {
        assert.ok(isVisible);
      })
      // error check
      .isExisting('tr.message-item.error').then((error: boolean) => {
        assert.ok(! error);
      })
      .isExisting('tr.message-item.syserror').then((error: boolean) => {
        assert.ok(! error);
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });
});
