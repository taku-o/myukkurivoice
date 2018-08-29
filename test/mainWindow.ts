import {Application} from 'spectron';
import * as assert from 'assert';
import * as temp from 'temp';
temp.track();

describe('mainWindow', () => {
  this.timeout(10000);

  beforeEach(() => {
    var fsprefix = '_myubo_test' + Date.now().toString(36);
    var dirPath = temp.mkdirSync(fsprefix);
    this.app = new Application({
      path: 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/MacOS/MYukkuriVoice',
      env: { DEBUG: 1, NODE_ENV: 'test', userData: dirPath },
    });
    return this.app.start();
  });

  afterEach(() => {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it('open mainWindow at startup', () => {
    return this.app.client
      .getWindowCount().then((count) => {
        assert.equal(count, 1);
      })
      .isVisible('#main-pane').then((isVisible) => {
        assert.ok(isVisible);
      })
      .isVisible('#settings-pane').then((isVisible) => {
        assert.ok(! isVisible);
      })
      .getTitle().then((title) => {
        assert.equal(title, 'MYukkuriVoice');
      })
      // error check
      .isExisting('tr.message-item.error').then((error) => {
        assert.ok(! error);
      })
      .isExisting('tr.message-item.syserror').then((error) => {
        assert.ok(! error);
      });
  });

  // TODO multivoice
  it('mainWindow input', () => {
    return this.app.client
      // encode
      .setValue('#source', 'test')
      .click('#encode')
      .getValue('#encoded').then((encoded) => {
        assert.equal(encoded, "テ'_スト");
      })
      // clear
      .click('#clear')
      .getValue('#source').then((source) => {
        assert.equal(source, '');
      })
      .getValue('#encoded').then((encoded) => {
        assert.equal(encoded, '');
      })
      // play and record is enabled
      .isEnabled('#play').then((isEnabled) => {
        assert.ok(! isEnabled);
      })
      .setValue('#source', 'test')
      .isEnabled('#play').then((isEnabled) => {
        assert.ok(isEnabled);
      })
      .click('#clear')
      .isEnabled('#play').then((isEnabled) => {
        assert.ok(! isEnabled);
      })
      .setValue('#encoded', "テ'_スト")
      .isEnabled('#play').then((isEnabled) => {
        assert.ok(isEnabled);
      })
      // error check
      .isExisting('tr.message-item.error').then((error) => {
        assert.ok(! error);
      })
      .isExisting('tr.message-item.syserror').then((error) => {
        assert.ok(! error);
      });
  });

  it('mainWindow phont selection', () => {
    return this.app.client
      .elements('#phont option').then((response) => {
        assert.equal(response.value.length, 26);
      });
  });

  // TODO initial
  // TODO save config
  // TODO delete config
  // TODO copy config
  // TODO filter
  it('mainWindow voice config', () => {
    var voiceConfigLength = 999;
    return this.app.client
      // filter
      .elements('.voice-config-item').then((response) => {
        assert.ok(response.value.length > 0);
      })
      .setValue('#filter-text', 'xxxxxxxxxxxxxxxxxx')
      .elements('.voice-config-item').then((response) => {
        assert.equal(response.value.length, 0);
      })
      .setValue('#filter-text', '')
      .elements('.voice-config-item').then((response) => {
        assert.ok(response.value.length > 0);
      })
      // add config
      .elements('.voice-config-item').then((response) => {
        voiceConfigLength = response.value.length;
      })
      .click('#plus')
      .elements('.voice-config-item').then((response) => {
        assert.equal(response.value.length, voiceConfigLength + 1);
      })
      // error check
      .isExisting('tr.message-item.error').then((error) => {
        assert.ok(! error);
      })
      .isExisting('tr.message-item.syserror').then((error) => {
        assert.ok(! error);
      });
  });

  // TODO multivoice
  it('mainWindow play', () => {
    return this.app.client
      .setValue('#encoded', "テ'_スト")
      .click('#play')
      .waitForText('#duration', 2000)
      .getValue('#duration').then((duration) => {
        assert.ok(duration != '');
      })
      .click('#stop')
      // error check
      .isExisting('tr.message-item.error').then((error) => {
        assert.ok(! error);
      })
      .isExisting('tr.message-item.syserror').then((error) => {
        assert.ok(! error);
      });
  });

  // TODO record
  //it('mainWindow play', () => {
  //});

  it('mainWindow alwaysOnTop', () => {
    var app = this.app;
    return this.app.client
      .getAttribute('#always-on-top-btn span.icon', 'class').then((classes) => {
        assert.ok(! classes.includes('active'));
        app.browserWindow.isAlwaysOnTop().then((isAlwaysOnTop) => {
          assert.ok(! isAlwaysOnTop);
        });
      })
      .click('#always-on-top-btn')
      .getAttribute('#always-on-top-btn span.icon', 'class').then((classes) => {
        assert.ok(classes.includes('active'));
        app.browserWindow.isAlwaysOnTop().then((isAlwaysOnTop) => {
          assert.ok(isAlwaysOnTop);
        });
      })
      .click('#always-on-top-btn')
      .getAttribute('#always-on-top-btn span.icon', 'class').then((classes) => {
        assert.ok(! classes.includes('active'));
        app.browserWindow.isAlwaysOnTop().then((isAlwaysOnTop) => {
          assert.ok(! isAlwaysOnTop);
        });
      })
      // error check
      .isExisting('tr.message-item.error').then((error) => {
        assert.ok(! error);
      })
      .isExisting('tr.message-item.syserror').then((error) => {
        assert.ok(! error);
      });
  });

  it('mainWindow help', () => {
    return this.app.client
      .click('#help')
      .getWindowCount().then((count) => {
        assert.equal(count, 2);
      })
      .windowByIndex(1)
      .getTitle().then((title) => {
        assert.equal(title, 'MYukkuriVoice Help');
      })
      // error check
      .windowByIndex(0)
      .isExisting('tr.message-item.error').then((error) => {
        assert.ok(! error);
      })
      .isExisting('tr.message-item.syserror').then((error) => {
        assert.ok(! error);
      });
  });

  it('mainWindow shortcut intro', () => {
    return this.app.client
      .isVisible('.introjs-tooltip').then((isVisible) => {
        assert.ok(! isVisible);
      })
      .click('#shortcut')
      .isVisible('.introjs-tooltip').then((isVisible) => {
        assert.ok(isVisible);
      })
      // error check
      .isExisting('tr.message-item.error').then((error) => {
        assert.ok(! error);
      })
      .isExisting('tr.message-item.syserror').then((error) => {
        assert.ok(! error);
      });
  });

  it('mainWindow tutorial intro', () => {
    return this.app.client
      .isVisible('.introjs-tooltip').then((isVisible) => {
        assert.ok(! isVisible);
      })
      .click('#tutorial')
      .isVisible('.introjs-tooltip').then((isVisible) => {
        assert.ok(isVisible);
      })
      // error check
      .isExisting('tr.message-item.error').then((error) => {
        assert.ok(! error);
      })
      .isExisting('tr.message-item.syserror').then((error) => {
        assert.ok(! error);
      });
  });

  it('mainWindow switchSettingsView', () => {
    return this.app.client
      .click('#switch-settings-view')
      .isVisible('#main-pane').then((isVisible) => {
        assert.ok(! isVisible);
      })
      .isVisible('#settings-pane').then((isVisible) => {
        assert.ok(isVisible);
      })
      // error check
      .isExisting('tr.message-item.error').then((error) => {
        assert.ok(! error);
      })
      .isExisting('tr.message-item.syserror').then((error) => {
        assert.ok(! error);
      });
  });
});
