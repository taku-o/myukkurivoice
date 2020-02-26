import {Application} from 'spectron';
import {assert} from 'chai';
import {position} from 'caller-position';
import * as temp from 'temp';
temp.track();

require('source-map-support').install();

describe('settingsView', function() {
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

  it('settingsView seq-write-box option', function() {
    const client = this.app.client;
    return (
      this.app.client
        .click('#switch-settings-view')
        .isSelected('#seq-write-box .checkbox input')
        .then((isSelected: boolean) => {
          client.isVisible('#seq-write-box .form-group').then((isVisible: boolean) => {
            assert.equal(isVisible, isSelected, position());
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
            if (
              log.match(/error/i) &&
              !log.match(/gles2_cmd_decoder.cc/) &&
              !log.match(/shared_image_manager.cc/) &&
              !log.match(/media_internals.cc/) &&
              !log.match(/logger.cc/)
            ) {
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

  it('settingsView tutorial intro', function() {
    return (
      this.app.client
        .click('#switch-settings-view')
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
            if (
              log.match(/error/i) &&
              !log.match(/gles2_cmd_decoder.cc/) &&
              !log.match(/shared_image_manager.cc/) &&
              !log.match(/media_internals.cc/) &&
              !log.match(/logger.cc/)
            ) {
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
