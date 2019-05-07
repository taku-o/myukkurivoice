import {Application} from 'spectron';
import {assert} from 'chai';
import {position} from 'caller-position';
import * as temp from 'temp';
temp.track();

require('source-map-support').install();

describe('specWindow-service-MessageService', function() {
  this.timeout(10000);

  before(function() {
    const fsprefix = `_myubo_test${Date.now().toString(36)}`;
    const dirPath = temp.mkdirSync(fsprefix);
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
    return this.client.click('#show-spec-window').windowByIndex(1);
  });

  afterEach(function() {
    return this.client.close();
  });

  it('action', function() {
    return (
      this.client
        .setValue('#message-service-post', '')
        .click('#action')
        .waitForValue('#message-service-post', 5000)
        .getValue('#message-service-post')
        .then((value: string) => {
          const parsed = JSON.parse(value);
          assert.ok(parsed.created, position());
          assert.equal('action message', parsed.body, position());
          assert.equal('action', parsed.type, position());
        })
        // catch error
        .catch((err: Error) => {
          assert.fail(err.message);
        })
        .getMainProcessLogs()
        .then((logs: string[]) => {
          logs.forEach((log) => {
            if (log.match(/error/i) && !log.match(/gles2_cmd_decoder.cc/)) {
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

  it('record', function() {
    return (
      this.client
        .setValue('#message-service-post', '')
        .setValue('#last-wav-file', '')
        .click('#record')
        // event on message
        .waitForValue('#message-service-post', 5000)
        .getValue('#message-service-post')
        .then((value: string) => {
          const parsed = JSON.parse(value);
          assert.ok(parsed.created, position());
          assert.equal('record message', parsed.body, position());
          assert.equal('record', parsed.type, position());
          assert.equal('/tmp/hoge.wav', parsed.wavFilePath, position());
          assert.equal('hoge.wav', parsed.wavFileName, position());
          assert.equal('/tmp/hoge.txt', parsed.srcTextPath, position());
          assert.equal('/tmp/hoge.wav', parsed.quickLookPath, position());
        })
        // event on wavGenerated
        .waitForValue('#last-wav-file', 5000)
        .getValue('#last-wav-file')
        .then((value: string) => {
          const parsed = JSON.parse(value);
          assert.ok(parsed.created, position());
          assert.equal('record message', parsed.body, position());
          assert.equal('record', parsed.type, position());
          assert.equal('/tmp/hoge.wav', parsed.wavFilePath, position());
          assert.equal('hoge.wav', parsed.wavFileName, position());
          assert.equal('/tmp/hoge.txt', parsed.srcTextPath, position());
          assert.equal('/tmp/hoge.wav', parsed.quickLookPath, position());
        })
        // catch error
        .catch((err: Error) => {
          assert.fail(err.message);
        })
        .getMainProcessLogs()
        .then((logs: string[]) => {
          logs.forEach((log) => {
            if (log.match(/error/i) && !log.match(/gles2_cmd_decoder.cc/)) {
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

  it('recordSource', function() {
    return (
      this.client
        .setValue('#message-service-post', '')
        .click('#record-source')
        // event on message
        .waitForValue('#message-service-post', 5000)
        .getValue('#message-service-post')
        .then((value: string) => {
          const parsed = JSON.parse(value);
          assert.ok(parsed.created, position());
          assert.equal('record source', parsed.body, position());
          assert.equal('source', parsed.type, position());
          assert.equal('/tmp/hoge.txt', parsed.srcTextPath, position());
          assert.equal('/tmp/hoge.txt', parsed.quickLookPath, position());
        })
        // catch error
        .catch((err: Error) => {
          assert.fail(err.message);
        })
        .getMainProcessLogs()
        .then((logs: string[]) => {
          logs.forEach((log) => {
            if (log.match(/error/i) && !log.match(/gles2_cmd_decoder.cc/)) {
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

  it('info', function() {
    return (
      this.client
        .setValue('#message-service-post', '')
        .click('#info')
        .waitForValue('#message-service-post', 5000)
        .getValue('#message-service-post')
        .then((value: string) => {
          const parsed = JSON.parse(value);
          assert.ok(parsed.created, position());
          assert.equal('info message', parsed.body, position());
          assert.equal('info', parsed.type, position());
        })
        // catch error
        .catch((err: Error) => {
          assert.fail(err.message);
        })
        .getMainProcessLogs()
        .then((logs: string[]) => {
          logs.forEach((log) => {
            if (log.match(/error/i) && !log.match(/gles2_cmd_decoder.cc/)) {
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

  it('error', function() {
    return (
      this.client
        // with error
        .setValue('#message-service-post', '')
        .click('#error')
        .waitForValue('#message-service-post', 5000)
        .getValue('#message-service-post')
        .then((value: string) => {
          const parsed = JSON.parse(value);
          assert.ok(parsed.created, position());
          assert.equal('error message' + 'err', parsed.body, position());
          assert.equal('error', parsed.type, position());
        })
        // with no error
        .setValue('#message-service-post', '')
        .click('#error-null')
        .waitForValue('#message-service-post', 5000)
        .getValue('#message-service-post')
        .then((value: string) => {
          const parsed = JSON.parse(value);
          assert.ok(parsed.created, position());
          assert.equal('error message', parsed.body, position());
          assert.equal('error', parsed.type, position());
        })
        // catch error
        .catch((err: Error) => {
          assert.fail(err.message);
        })
        .getMainProcessLogs()
        .then((logs: string[]) => {
          logs.forEach((log) => {
            if (log.match(/error/i) && !log.match(/gles2_cmd_decoder.cc/)) {
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

  it('syserror', function() {
    return (
      this.client
        // with error
        .setValue('#message-service-post', '')
        .click('#syserror')
        .waitForValue('#message-service-post', 5000)
        .getValue('#message-service-post')
        .then((value: string) => {
          const parsed = JSON.parse(value);
          assert.ok(parsed.created, position());
          assert.equal('syserror message' + 'err', parsed.body, position());
          assert.equal('syserror', parsed.type, position());
        })
        // with no error
        .setValue('#message-service-post', '')
        .click('#syserror-null')
        .waitForValue('#message-service-post', 5000)
        .getValue('#message-service-post')
        .then((value: string) => {
          const parsed = JSON.parse(value);
          assert.ok(parsed.created, position());
          assert.equal('syserror message', parsed.body, position());
          assert.equal('syserror', parsed.type, position());
        })
        // catch error
        .catch((err: Error) => {
          assert.fail(err.message);
        })
        .getMainProcessLogs()
        .then((logs: string[]) => {
          logs.forEach((log) => {
            if (log.match(/error/i) && !log.match(/gles2_cmd_decoder.cc/)) {
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
