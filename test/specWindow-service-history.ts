import {Application} from 'spectron';
import {assert} from 'chai';
import {position} from 'caller-position';
import * as temp from 'temp';
temp.track();

require('source-map-support').install();

describe('specWindow-service-HistoryService', function() {
  this.timeout(10000);

  let dirPath: string | null = null;
  before(function() {
    const fsprefix = `_myubo_test${Date.now().toString(36)}`;
    dirPath = temp.mkdirSync(fsprefix);
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

  // load
  // getList
  // add
  // save
  // get
  // load
  // getList
  // clear
  // load
  // getList
  it('history scenario test', function() {
    const dummyData = {
      wavFilePath: '/tmp/aa0001.wav',
      wavFileName: 'aa0001.wav',
      srcTextPath: '/tmp/aa0001.txt',
      source: 'test',
      encoded: "テ'_スト",
      created: '2018-12-17T00:50:19.163Z',
      body: '音声ファイルを保存しました',
      quickLookPath: '/tmp/aa0001.wav',
      duration: 1.4,
      type: 'record',
    };

    return (
      this.client
        // load
        .click('#history-load')
        .waitForValue('#history-result', 2000)
        .getValue('#history-result')
        .then((value: string) => {
          assert.ok(value, position());
        })
        .getValue('#history-err')
        .then((value: string) => {
          assert.ok(!value, position());
        })
        // getList
        .click('#history-get-list')
        .waitForValue('#history-result', 2000)
        .getValue('#history-result')
        .then((value: string) => {
          assert.equal('[]', value, position());
        })
        .getValue('#history-err')
        .then((value: string) => {
          assert.ok(!value, position());
        })
        // add
        .setValue('#history-entry', JSON.stringify(dummyData))
        .click('#history-add')
        .waitForValue('#history-result', 2000)
        .getValue('#history-result')
        .then((value: string) => {
          assert.ok(value, position());
        })
        .getValue('#history-err')
        .then((value: string) => {
          assert.ok(!value, position());
        })
        // save
        .click('#history-save')
        .waitForValue('#history-result', 2000)
        .getValue('#history-result')
        .then((value: string) => {
          assert.ok(value, position());
        })
        .getValue('#history-err')
        .then((value: string) => {
          assert.ok(!value, position());
        })
        // get
        .setValue('#history-key', '/tmp/aa0001.wav')
        .click('#history-get')
        .waitForValue('#history-result', 2000)
        .getValue('#history-result')
        .then((value: string) => {
          const parsed = JSON.parse(value);
          assert.equal(parsed.srcTextPath, '/tmp/aa0001.txt', position());
        })
        .getValue('#history-err')
        .then((value: string) => {
          assert.ok(!value, position());
        })
        // getList
        .click('#history-get-list')
        .waitForValue('#history-result', 2000)
        .getValue('#history-result')
        .then((value: string) => {
          const parsed = JSON.parse(value);
          assert.equal(parsed.length, 1, position());
        })
        .getValue('#history-err')
        .then((value: string) => {
          assert.ok(!value, position());
        })
        // clear
        .click('#history-clear')
        .waitForValue('#history-result', 2000)
        .getValue('#history-result')
        .then((value: string) => {
          assert.ok(value, position());
        })
        .getValue('#history-err')
        .then((value: string) => {
          assert.ok(!value, position());
        })
        // load
        .click('#history-load')
        .waitForValue('#history-result', 2000)
        .getValue('#history-result')
        .then((value: string) => {
          assert.ok(value, position());
        })
        .getValue('#history-err')
        .then((value: string) => {
          assert.ok(!value, position());
        })
        // getList
        .click('#history-get-list')
        .waitForValue('#history-result', 2000)
        .getValue('#history-result')
        .then((value: string) => {
          assert.equal(value, '[]', position());
        })
        .getValue('#history-err')
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
