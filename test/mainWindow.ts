import {Application} from 'spectron';
import {assert} from 'chai';
import {position} from 'caller-position';
import * as temp from 'temp';
temp.track();

require('source-map-support').install();

describe('mainWindow', function() {
  this.timeout(10000);

  beforeEach(function() {
    const fsprefix = `_myubo_test${Date.now().toString(36)}`;
    const dirPath = temp.mkdirSync(fsprefix);
    this.app = new Application({
      path: 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/MacOS/MYukkuriVoice',
      chromeDriverArgs: ['remote-debugging-port=9222'],
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
    return (
      this.app.client
        .getWindowCount()
        .then((count: number) => {
          assert.equal(count, 1, position());
        })
        .isVisible('#main-pane')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        .isVisible('#settings-pane')
        .then((isVisible: boolean) => {
          assert.ok(!isVisible, position());
        })
        .getTitle()
        .then((title: string) => {
          assert.equal(title, 'MYukkuriVoice', position());
        })
        // error check
        .isExisting('tr.message-item.error')
        .then((error: boolean) => {
          assert.ok(!error, position());
        })
        .isExisting('tr.message-item.syserror')
        .then((error: boolean) => {
          assert.ok(!error, position());
        })
        // catch error
        .catch((err: Error) => {
          assert.fail(err.message);
        })
        .getMainProcessLogs()
        .then((logs: string[]) => {
          logs.forEach((log) => {
            if (log.match(/error/i) && !log.match(/gles2_cmd_decoder.cc/) && !log.match(/shared_image_manager.cc/)) {
              /* eslint-disable-next-line no-console */
              console.error(log);
              assert.ok(false, position());
            }
          });
        })
        .getRenderProcessLogs()
        .then((logs: WebdriverIO.LogEntry[]) => {
          logs.forEach((log) => {
            if (log.message.match(/error/i)) {
              /* eslint-disable-next-line no-console */
              console.error(log.message);
              assert.ok(false, position());
            }
          });
        })
    );
  });

  // TODO multivoice
  it('input', function() {
    return (
      this.app.client
        // encode
        .setValue('#source', 'test')
        .click('#encode')
        .getValue('#encoded')
        .then((encoded: string) => {
          assert.equal(encoded, "テ'_スト", position());
        })
        // clear
        .click('#clear')
        .getValue('#source')
        .then((source: string) => {
          assert.equal(source, '', position());
        })
        .getValue('#encoded')
        .then((encoded: string) => {
          assert.equal(encoded, '', position());
        })
        // play and record is enabled
        .isEnabled('#play')
        .then((isEnabled: boolean) => {
          assert.ok(!isEnabled, position());
        })
        .setValue('#source', 'test')
        .isEnabled('#play')
        .then((isEnabled: boolean) => {
          assert.ok(isEnabled, position());
        })
        .click('#clear')
        .isEnabled('#play')
        .then((isEnabled: boolean) => {
          assert.ok(!isEnabled, position());
        })
        .setValue('#encoded', "テ'_スト")
        .isEnabled('#play')
        .then((isEnabled: boolean) => {
          assert.ok(isEnabled, position());
        })
        // error check
        .isExisting('tr.message-item.error')
        .then((error: boolean) => {
          assert.ok(!error, position());
        })
        .isExisting('tr.message-item.syserror')
        .then((error: boolean) => {
          assert.ok(!error, position());
        })
        // catch error
        .catch((err: Error) => {
          assert.fail(err.message);
        })
        .getMainProcessLogs()
        .then((logs: string[]) => {
          logs.forEach((log) => {
            if (log.match(/error/i) && !log.match(/gles2_cmd_decoder.cc/) && !log.match(/shared_image_manager.cc/)) {
              /* eslint-disable-next-line no-console */
              console.error(log);
              assert.ok(false, position());
            }
          });
        })
        .getRenderProcessLogs()
        .then((logs: WebdriverIO.LogEntry[]) => {
          logs.forEach((log) => {
            if (log.message.match(/error/i)) {
              /* eslint-disable-next-line no-console */
              console.error(log.message);
              assert.ok(false, position());
            }
          });
        })
    );
  });

  it('phont selection', function() {
    return (
      this.app.client
        .elements('#phont option')
        .then((response: HTMLInputElement) => {
          assert.equal(response.value.length, 26, position());
        })
        // catch error
        .catch((err: Error) => {
          assert.fail(err.message);
        })
        .getMainProcessLogs()
        .then((logs: string[]) => {
          logs.forEach((log) => {
            if (log.match(/error/i) && !log.match(/gles2_cmd_decoder.cc/) && !log.match(/shared_image_manager.cc/)) {
              /* eslint-disable-next-line no-console */
              console.error(log);
              assert.ok(false, position());
            }
          });
        })
        .getRenderProcessLogs()
        .then((logs: WebdriverIO.LogEntry[]) => {
          logs.forEach((log) => {
            if (log.message.match(/error/i)) {
              /* eslint-disable-next-line no-console */
              console.error(log.message);
              assert.ok(false, position());
            }
          });
        })
    );
  });

  // TODO initial
  // TODO save config
  // TODO delete config
  // TODO copy config
  // TODO filter
  it('voice config', function() {
    let voiceConfigLength = 999;
    return (
      this.app.client
        // filter
        .elements('.voice-config-item')
        .then((response: HTMLInputElement) => {
          assert.ok(response.value.length > 0, position());
        })
        .setValue('#filter-text', 'xxxxxxxxxxxxxxxxxx')
        .elements('.voice-config-item')
        .then((response: HTMLInputElement) => {
          assert.equal(response.value.length, 0, position());
        })
        .setValue('#filter-text', '')
        .elements('.voice-config-item')
        .then((response: HTMLInputElement) => {
          assert.ok(response.value.length > 0, position());
        })
        // add config
        .elements('.voice-config-item')
        .then((response: HTMLInputElement) => {
          voiceConfigLength = response.value.length;
        })
        .click('#plus')
        .elements('.voice-config-item')
        .then((response: HTMLInputElement) => {
          assert.equal(response.value.length, voiceConfigLength + 1, position());
        })
        // error check
        .isExisting('tr.message-item.error')
        .then((error: boolean) => {
          assert.ok(!error, position());
        })
        .isExisting('tr.message-item.syserror')
        .then((error: boolean) => {
          assert.ok(!error, position());
        })
        // catch error
        .catch((err: Error) => {
          assert.fail(err.message);
        })
        .getMainProcessLogs()
        .then((logs: string[]) => {
          logs.forEach((log) => {
            if (log.match(/error/i) && !log.match(/gles2_cmd_decoder.cc/) && !log.match(/shared_image_manager.cc/)) {
              /* eslint-disable-next-line no-console */
              console.error(log);
              assert.ok(false, position());
            }
          });
        })
        .getRenderProcessLogs()
        .then((logs: WebdriverIO.LogEntry[]) => {
          logs.forEach((log) => {
            if (log.message.match(/error/i)) {
              /* eslint-disable-next-line no-console */
              console.error(log.message);
              assert.ok(false, position());
            }
          });
        })
    );
  });

  // TODO multivoice
  it('play', function() {
    return (
      this.app.client
        .setValue('#encoded', "テ'_スト")
        .click('#play')
        .waitForText('#duration', 2000)
        .getValue('#duration')
        .then((duration: string) => {
          assert.ok(duration != '', position());
        })
        .click('#stop')
        // error check
        .isExisting('tr.message-item.error')
        .then((error: boolean) => {
          assert.ok(!error, position());
        })
        .isExisting('tr.message-item.syserror')
        .then((error: boolean) => {
          assert.ok(!error, position());
        })
        // catch error
        .catch((err: Error) => {
          assert.fail(err.message);
        })
        .getMainProcessLogs()
        .then((logs: string[]) => {
          logs.forEach((log) => {
            if (log.match(/error/i) && !log.match(/gles2_cmd_decoder.cc/) && !log.match(/shared_image_manager.cc/)) {
              /* eslint-disable-next-line no-console */
              console.error(log);
              assert.ok(false, position());
            }
          });
        })
        .getRenderProcessLogs()
        .then((logs: WebdriverIO.LogEntry[]) => {
          logs.forEach((log) => {
            if (log.message.match(/error/i)) {
              /* eslint-disable-next-line no-console */
              console.error(log.message);
              assert.ok(false, position());
            }
          });
        })
    );
  });

  // TODO record
  //it('mainWindow play', () => {
  //});

  it('alwaysOnTop', function() {
    const app = this.app;
    return (
      this.app.client
        .getAttribute('#always-on-top-btn span.icon', 'class')
        .then((classes: string[]) => {
          assert.ok(!classes.includes('active'), position());
          app.browserWindow.isAlwaysOnTop().then((isAlwaysOnTop: boolean) => {
            assert.ok(!isAlwaysOnTop, position());
          });
        })
        .click('#always-on-top-btn')
        .getAttribute('#always-on-top-btn span.icon', 'class')
        .then((classes: string[]) => {
          assert.ok(classes.includes('active'), position());
          app.browserWindow.isAlwaysOnTop().then((isAlwaysOnTop: boolean) => {
            assert.ok(isAlwaysOnTop, position());
          });
        })
        .click('#always-on-top-btn')
        .getAttribute('#always-on-top-btn span.icon', 'class')
        .then((classes: string[]) => {
          assert.ok(!classes.includes('active'), position());
          app.browserWindow.isAlwaysOnTop().then((isAlwaysOnTop: boolean) => {
            assert.ok(!isAlwaysOnTop, position());
          });
        })
        // error check
        .isExisting('tr.message-item.error')
        .then((error: boolean) => {
          assert.ok(!error, position());
        })
        .isExisting('tr.message-item.syserror')
        .then((error: boolean) => {
          assert.ok(!error, position());
        })
        // catch error
        .catch((err: Error) => {
          assert.fail(err.message);
        })
        .getMainProcessLogs()
        .then((logs: string[]) => {
          logs.forEach((log) => {
            if (log.match(/error/i) && !log.match(/gles2_cmd_decoder.cc/) && !log.match(/shared_image_manager.cc/)) {
              /* eslint-disable-next-line no-console */
              console.error(log);
              assert.ok(false, position());
            }
          });
        })
        .getRenderProcessLogs()
        .then((logs: WebdriverIO.LogEntry[]) => {
          logs.forEach((log) => {
            if (log.message.match(/error/i)) {
              /* eslint-disable-next-line no-console */
              console.error(log.message);
              assert.ok(false, position());
            }
          });
        })
    );
  });

  it('open help', function() {
    return (
      this.app.client
        .click('#help')
        .getWindowCount()
        .then((count: number) => {
          assert.equal(count, 2, position());
        })
        .windowByIndex(1)
        .getTitle()
        .then((title: string) => {
          assert.equal(title, 'ヘルプビューワ', position());
        })
        // error check
        .windowByIndex(0)
        .isExisting('tr.message-item.error')
        .then((error: boolean) => {
          assert.ok(!error, position());
        })
        .isExisting('tr.message-item.syserror')
        .then((error: boolean) => {
          assert.ok(!error, position());
        })
        // catch error
        .catch((err: Error) => {
          assert.fail(err.message);
        })
        .getMainProcessLogs()
        .then((logs: string[]) => {
          logs.forEach((log) => {
            if (log.match(/error/i) && !log.match(/gles2_cmd_decoder.cc/) && !log.match(/shared_image_manager.cc/)) {
              /* eslint-disable-next-line no-console */
              console.error(log);
              assert.ok(false, position());
            }
          });
        })
        .getRenderProcessLogs()
        .then((logs: WebdriverIO.LogEntry[]) => {
          logs.forEach((log) => {
            if (log.message.match(/error/i)) {
              /* eslint-disable-next-line no-console */
              console.error(log.message);
              assert.ok(false, position());
            }
          });
        })
    );
  });

  it('open dictionary', function() {
    return (
      this.app.client
        .click('#dictionary')
        .getWindowCount()
        .then((count: number) => {
          assert.equal(count, 2, position());
        })
        .windowByIndex(1)
        .getTitle()
        .then((title: string) => {
          assert.equal(title, '辞書ツール', position());
        })
        // error check
        .windowByIndex(0)
        .isExisting('tr.message-item.error')
        .then((error: boolean) => {
          assert.ok(!error, position());
        })
        .isExisting('tr.message-item.syserror')
        .then((error: boolean) => {
          assert.ok(!error, position());
        })
        // catch error
        .catch((err: Error) => {
          assert.fail(err.message);
        })
        .getMainProcessLogs()
        .then((logs: string[]) => {
          logs.forEach((log) => {
            if (log.match(/error/i) && !log.match(/gles2_cmd_decoder.cc/) && !log.match(/shared_image_manager.cc/)) {
              /* eslint-disable-next-line no-console */
              console.error(log);
              assert.ok(false, position());
            }
          });
        })
        .getRenderProcessLogs()
        .then((logs: WebdriverIO.LogEntry[]) => {
          logs.forEach((log) => {
            if (log.message.match(/error/i)) {
              /* eslint-disable-next-line no-console */
              console.error(log.message);
              assert.ok(false, position());
            }
          });
        })
    );
  });

  it('shortcut intro', function() {
    return (
      this.app.client
        .isVisible('.introjs-tooltip')
        .then((isVisible: boolean) => {
          assert.ok(!isVisible, position());
        })
        .click('#shortcut')
        .isVisible('.introjs-tooltip')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        // error check
        .isExisting('tr.message-item.error')
        .then((error: boolean) => {
          assert.ok(!error, position());
        })
        .isExisting('tr.message-item.syserror')
        .then((error: boolean) => {
          assert.ok(!error, position());
        })
        // catch error
        .catch((err: Error) => {
          assert.fail(err.message);
        })
        .getMainProcessLogs()
        .then((logs: string[]) => {
          logs.forEach((log) => {
            if (log.match(/error/i) && !log.match(/gles2_cmd_decoder.cc/) && !log.match(/shared_image_manager.cc/)) {
              /* eslint-disable-next-line no-console */
              console.error(log);
              assert.ok(false, position());
            }
          });
        })
        .getRenderProcessLogs()
        .then((logs: WebdriverIO.LogEntry[]) => {
          logs.forEach((log) => {
            if (log.message.match(/error/i)) {
              /* eslint-disable-next-line no-console */
              console.error(log.message);
              assert.ok(false, position());
            }
          });
        })
    );
  });

  it('tutorial intro', function() {
    return (
      this.app.client
        .isVisible('.introjs-tooltip')
        .then((isVisible: boolean) => {
          assert.ok(!isVisible, position());
        })
        .click('#tutorial')
        .isVisible('.introjs-tooltip')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        // error check
        .isExisting('tr.message-item.error')
        .then((error: boolean) => {
          assert.ok(!error, position());
        })
        .isExisting('tr.message-item.syserror')
        .then((error: boolean) => {
          assert.ok(!error, position());
        })
        // catch error
        .catch((err: Error) => {
          assert.fail(err.message);
        })
        .getMainProcessLogs()
        .then((logs: string[]) => {
          logs.forEach((log) => {
            if (log.match(/error/i) && !log.match(/gles2_cmd_decoder.cc/) && !log.match(/shared_image_manager.cc/)) {
              /* eslint-disable-next-line no-console */
              console.error(log);
              assert.ok(false, position());
            }
          });
        })
        .getRenderProcessLogs()
        .then((logs: WebdriverIO.LogEntry[]) => {
          logs.forEach((log) => {
            if (log.message.match(/error/i)) {
              /* eslint-disable-next-line no-console */
              console.error(log.message);
              assert.ok(false, position());
            }
          });
        })
    );
  });

  it('switchSettingsView', function() {
    return (
      this.app.client
        .click('#switch-settings-view')
        .isVisible('#main-pane')
        .then((isVisible: boolean) => {
          assert.ok(!isVisible, position());
        })
        .isVisible('#settings-pane')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        // error check
        .isExisting('tr.message-item.error')
        .then((error: boolean) => {
          assert.ok(!error, position());
        })
        .isExisting('tr.message-item.syserror')
        .then((error: boolean) => {
          assert.ok(!error, position());
        })
        // catch error
        .catch((err: Error) => {
          assert.fail(err.message);
        })
        .getMainProcessLogs()
        .then((logs: string[]) => {
          logs.forEach((log) => {
            if (log.match(/error/i) && !log.match(/gles2_cmd_decoder.cc/) && !log.match(/shared_image_manager.cc/)) {
              /* eslint-disable-next-line no-console */
              console.error(log);
              assert.ok(false, position());
            }
          });
        })
        .getRenderProcessLogs()
        .then((logs: WebdriverIO.LogEntry[]) => {
          logs.forEach((log) => {
            if (log.message.match(/error/i)) {
              /* eslint-disable-next-line no-console */
              console.error(log.message);
              assert.ok(false, position());
            }
          });
        })
    );
  });
});
