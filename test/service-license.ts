import {Application} from 'spectron';
import {assert} from 'chai';
import {position} from 'caller-position';
import * as temp from 'temp';
temp.track();

require('source-map-support').install();

describe('service-LicenseService', function() {
  this.timeout(30000);

  before(function() {
    const fsprefix = `_myubo_test${Date.now().toString(36)}`;
    const dirPath = temp.mkdirSync(fsprefix);
    this.app = new Application({
      path: 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/MacOS/MYukkuriVoice',
      chromeDriverArgs: ['remote-debugging-port=9222'],
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
    return this.client.click('#show-spec-window').windowByIndex(1);
  });

  afterEach(function() {
    return this.client.close();
  });

  it('encrypt', function() {
    return (
      this.client
        .setValue('#pass-phrase', 'hogehoge')
        .setValue('#plain-key', 'this is a plain key')
        .click('#encrypt')
        .getValue('#encrypted-key')
        .then((value: string) => {
          assert.ok(value, position());
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

  it('decrypt', function() {
    return (
      this.client
        .setValue(
          '#encrypted-key',
          'LF7ZJec+SPvmUhhpzPDEJ0ubiVt42NR62WoVW1vJKtaCQR2ActwuiO7vVAs893tIICMBniWOqDmY29hK1YUNAP6EWydrrBFzIU5GBxWtNqj36R5VjR0iJ7j2BhAZWp7lK2lMm2HJxoz9ZmNA2WMBxy/aKloM3KiW5A+cZBNjf6w=?IDFnCDZ/lAmXjxFfV5YSiXc6oFcGkFRBWWou13O5osRA5pVneS52yOEzqVrl56wq',
        )
        .setValue('#pass-phrase', 'hogehoge')
        .setValue('#plain-key', '')
        .click('#decrypt')
        .getValue('#plain-key')
        .then((value: string) => {
          assert.equal(value, 'this is a plain key', position());
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

  it('consumerKey aquesTalk10DevKey', function() {
    return (
      this.client
        .setValue('#license-type', 'aquesTalk10DevKey')
        .setValue('#consumer-key-result', '')
        .setValue('#consumer-key-err', '')
        .click('#consumer-key')
        .waitForValue('#consumer-key-result', 5000)
        .getValue('#consumer-key-result')
        .then((value: string) => {
          assert.ok(value, position());
        })
        .getValue('#consumer-key-err')
        .then((value: string) => {
          assert.ok(!value, position());
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

  it('consumerKey unknown key', function() {
    return (
      this.client
        // consumerKey unknown key
        .setValue('#license-type', 'unknown')
        .setValue('#consumer-key-result', 'initial value')
        .setValue('#consumer-key-err', '')
        .click('#consumer-key')
        .waitForValue('#consumer-key-done', 5000)
        .getValue('#consumer-key-result')
        .then((value: string) => {
          assert.ok(!value, position());
        })
        .getValue('#consumer-key-err')
        .then((value: string) => {
          assert.ok(!value, position());
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
