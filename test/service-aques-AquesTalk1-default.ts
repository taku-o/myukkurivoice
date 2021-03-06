import {Application} from 'spectron';
import {assert} from 'chai';
import {position} from 'caller-position';
import * as temp from 'temp';
temp.track();

require('source-map-support').install();

describe('service-AquesService-AquesTalk1-default', function() {
  this.timeout(20000);

  before(function() {
    const fsprefix = `_myubo_test${Date.now().toString(36)}`;
    const dirPath = temp.mkdirSync(fsprefix);
    this.app = new Application({
      path: 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/MacOS/MYukkuriVoice',
      chromeDriverArgs: ['remote-debugging-port=9222'],
      env: {DEBUG: 1, NODE_ENV: 'test', userData: dirPath, RUNTIME_ENV: 'default'},
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

  it('isI386Supported-default-play', function() {
    return (
      this.client
        // play aquestalk1 in default env
        .setValue('#is-i386-supported-play-encoded', "テ'_スト")
        .setValue('#is-i386-supported-play-result', '')
        .click('#is-i386-supported-play')
        .waitForValue('#is-i386-supported-play-result', 5000)
        .getValue('#is-i386-supported-play-result')
        .then((value: string) => {
          assert.equal(value, 'ok', position());
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

  it('get-generator-path', function() {
    return (
      this.client
        .click('#get-generator-path')
        .getValue('#get-generator-path-result')
        .then((value: string) => {
          assert(value.match(/maquestalk1$/), position());
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
