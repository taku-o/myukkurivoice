import {Application} from 'spectron';
import * as assert from 'assert';
import {position} from 'caller-position';
import * as fs from 'fs';
import * as temp from 'temp';
temp.track();

require('source-map-support').install();

describe('specWindow-service-SeqFNameService', function() {
  this.timeout(10000);

  let dirPath: string | null = null;
  before(function() {
    const fsprefix = `_myubo_test${Date.now().toString(36)}`;
    dirPath = temp.mkdirSync(fsprefix);
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
      .click('#show-spec-window')
      .windowByIndex(1);
  });

  afterEach(function() {
    return this.client.close();
  });

  it('nextFname', function() {
    return this.client
      .setValue('#prefix', 'foo')
      .setValue('#num', '200')
      .click('#next-fname')
      .getValue('#next-fname-result').then((value: string) => {
        assert.equal(value, 'foo0200.wav', position());
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      })
      .getMainProcessLogs().then((logs) => {
        logs.forEach((log) => {
          assert.ok(! log.match(/error/i), position());
        });
      })
      .getRenderProcessLogs().then((logs) => {
        logs.forEach((log) => {
          assert.ok(! log.message.match(/error/i), position());
        });
      });
  });

  it('splitFname', function() {
    return this.client
      .setValue('#split-fname-filepath', '/tmp/hoge/foo.txt')
      .click('#split-fname')
      .getValue('#split-fname-result').then((value: string) => {
        const r = JSON.parse(value);
        assert.equal('/tmp/hoge', r.dir, position());
        assert.equal('foo.txt', r.basename, position());
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      })
      .getMainProcessLogs().then((logs) => {
        logs.forEach((log) => {
          assert.ok(! log.match(/error/i), position());
        });
      })
      .getRenderProcessLogs().then((logs) => {
        logs.forEach((log) => {
          assert.ok(! log.message.match(/error/i), position());
        });
      });
  });

  it('nextNumber', function() {
    const prefixP1 = 'prefix';
    const prefixP2 = 'some';
    const prefixP3 = 'hoge';
    const prefixP4 = 'phlx';
    const fileP1 = `${dirPath}/${prefixP1}0101.wav`;
    const fileP2 = `${dirPath}/${prefixP2}0000.wav`;
    const fileP3 = `${dirPath}/${prefixP3}.wav`;
    fs.closeSync(fs.openSync(fileP1, 'w'));
    fs.closeSync(fs.openSync(fileP2, 'w'));
    fs.closeSync(fs.openSync(fileP3, 'w'));

    return this.client
      // get simply next number
      .setValue('#next-number-dir', dirPath)
      .setValue('#next-number-prefix', prefixP1)
      .click('#next-number')
      .waitForValue('#next-number-result', 5000)
      .getValue('#next-number-result').then((value: number) => {
        assert.equal(102, value, position());
      })
      // count up
      .setValue('#next-number-dir', dirPath)
      .setValue('#next-number-prefix', prefixP2)
      .click('#next-number')
      .waitForValue('#next-number-result', 5000)
      .getValue('#next-number-result').then((value: number) => {
        assert.equal(1, value, position());
      })
      // newly
      .setValue('#next-number-dir', dirPath)
      .setValue('#next-number-prefix', prefixP3)
      .click('#next-number')
      .waitForValue('#next-number-result', 5000)
      .getValue('#next-number-result').then((value: number) => {
        assert.equal(0, value, position());
      })
      // not exists
      .setValue('#next-number-dir', dirPath)
      .setValue('#next-number-prefix', prefixP4)
      .click('#next-number')
      .waitForValue('#next-number-result', 5000)
      .getValue('#next-number-result').then((value: number) => {
        assert.equal(0, value, position());
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      })
      .getMainProcessLogs().then((logs) => {
        logs.forEach((log) => {
          assert.ok(! log.match(/error/i), position());
        });
      })
      .getRenderProcessLogs().then((logs) => {
        logs.forEach((log) => {
          assert.ok(! log.message.match(/error/i), position());
        });
      });
  });
});
