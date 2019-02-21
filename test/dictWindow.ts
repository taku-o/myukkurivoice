import {Application} from 'spectron';
import * as assert from 'assert';
import {position} from 'caller-position';
import * as temp from 'temp';
temp.track();

require('source-map-support').install();

describe('dictWindow', function() {
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
    return this.client.click('#dictionary').windowByIndex(1);
  });

  afterEach(function() {
    return this.client.close();
  });

  it('tutorial', function() {
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
        // catch error
        .catch((err: Error) => {
          assert.fail(err.message);
        })
        .getMainProcessLogs()
        .then((logs: string[]) => {
          logs.forEach((log) => {
            assert.ok(!log.match(/error/i), position());
          });
        })
        .getRenderProcessLogs()
        .then((logs: WebdriverIO.LogEntry[]) => {
          logs.forEach((log) => {
            assert.ok(!log.message.match(/error/i), position());
          });
        })
    );
  });

  it('save', function() {
    return (
      this.app.client
        .click('#save')
        .waitForVisible('#footer h1', 2000)
        .getText('#footer h1')
        .then((message: string) => {
          assert.equal(message, '作業データを保存しました。', position());
        })
        // catch error
        .catch((err: Error) => {
          assert.fail(err.message);
        })
        .getMainProcessLogs()
        .then((logs: string[]) => {
          logs.forEach((log) => {
            assert.ok(!log.match(/error/i), position());
          });
        })
        .getRenderProcessLogs()
        .then((logs: WebdriverIO.LogEntry[]) => {
          logs.forEach((log) => {
            assert.ok(!log.message.match(/error/i), position());
          });
        })
    );
  });

  it('cancel', function() {
    return (
      this.app.client
        .click('#cancel')
        .waitForVisible('#footer h1', 2000)
        .getText('#footer h1')
        .then((message: string) => {
          assert.equal(message, '保存していない編集中の作業データを取り消しました。', position());
        })
        // catch error
        .catch((err: Error) => {
          assert.fail(err.message);
        })
        .getMainProcessLogs()
        .then((logs: string[]) => {
          logs.forEach((log) => {
            assert.ok(!log.match(/error/i), position());
          });
        })
        .getRenderProcessLogs()
        .then((logs: WebdriverIO.LogEntry[]) => {
          logs.forEach((log) => {
            assert.ok(!log.message.match(/error/i), position());
          });
        })
    );
  });

  it('export', function() {
    return (
      this.app.client
        .click('#export')
        .waitForVisible('#footer h1', 2000)
        .getText('#footer h1')
        .then((message: string) => {
          assert.equal(message, 'ユーザー辞書を更新しました。', position());
        })
        // catch error
        .catch((err: Error) => {
          assert.fail(err.message);
        })
        .getMainProcessLogs()
        .then((logs: string[]) => {
          logs.forEach((log) => {
            assert.ok(!log.match(/error/i), position());
          });
        })
        .getRenderProcessLogs()
        .then((logs: WebdriverIO.LogEntry[]) => {
          logs.forEach((log) => {
            assert.ok(!log.message.match(/error/i), position());
          });
        })
    );
  });

  it('reload', function() {
    return (
      this.app.client
        .click('#reload')
        .waitForVisible('#footer h1', 2000)
        .getText('#footer h1')
        .then((message: string) => {
          assert.equal(message, 'MYukkuriVoiceのメイン画面を更新します。', position());
        })
        // catch error
        .catch((err: Error) => {
          assert.fail(err.message);
        })
        .getMainProcessLogs()
        .then((logs: string[]) => {
          logs.forEach((log) => {
            assert.ok(!log.match(/error/i), position());
          });
        })
        .getRenderProcessLogs()
        .then((logs: WebdriverIO.LogEntry[]) => {
          logs.forEach((log) => {
            assert.ok(!log.message.match(/error/i), position());
          });
        })
    );
  });
});
