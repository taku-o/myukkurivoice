import {Application} from 'spectron';
import {assert} from 'chai';
import {position} from 'caller-position';
import * as rimraf from 'rimraf';
import * as path from 'path';
import * as fs from 'fs';
import * as temp from 'temp';
temp.track();

require('source-map-support').install();

describe('specWindow-service-AquesService', function() {
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
    return this.client.click('#show-spec-window').windowByIndex(1);
  });

  afterEach(function() {
    return this.client.close();
  });

  it('encode', function() {
    return (
      this.client
        // encode
        .setValue('#source', 'test')
        .click('#encode')
        .getValue('#encode-result')
        .then((value: string) => {
          assert.equal(value, "テ'_スト", position());
        })
        // encode empty string
        .setValue('#source', '')
        .setValue('#encode-result', '')
        .click('#encode')
        .getValue('#encode-result')
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
            if (log.match(/error/i)) {
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

  it('encode with custom dictionary', function() {
    fs.mkdirSync(`${dirPath}/userdict`);
    const customDictPath = `${path.dirname(__dirname)}/vendor/test/aq_dic_large`;
    fs.closeSync(fs.openSync(`${dirPath}/userdict/aqdic.bin`, 'a+')); // create with 644 permission.
    fs.closeSync(fs.openSync(`${dirPath}/userdict/aq_user.dic`, 'a+')); // create with 644 permission.
    fs.writeFileSync(`${dirPath}/userdict/aqdic.bin`, fs.readFileSync(`${customDictPath}/aqdic.bin`));
    fs.writeFileSync(`${dirPath}/userdict/aq_user.dic`, fs.readFileSync(`${customDictPath}/aq_user.dic`));

    return (
      this.client
        // encode
        .setValue('#source', '百名山')
        .click('#encode')
        .getValue('#encode-result')
        .then((value: string) => {
          assert.equal(value, 'モモナヤマ', position());
        })
        .setValue('#source', '味方さん')
        .click('#encode')
        .getValue('#encode-result')
        .then((value: string) => {
          assert.equal(value, 'アジカタサン', position());
        })
        // encode empty string
        .setValue('#source', '')
        .setValue('#encode-result', '')
        .click('#encode')
        .getValue('#encode-result')
        .then((value: string) => {
          assert.ok(!value, position());
        })
        .then(() => {
          rimraf(`${dirPath}/userdict`, (err: Error) => {});
        })
        // catch error
        .catch((err: Error) => {
          assert.fail(err.message);
        })
        .getMainProcessLogs()
        .then((logs: string[]) => {
          logs.forEach((log) => {
            if (log.match(/error/i)) {
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

  it('wave', function() {
    return (
      this.client
        // wave talk1
        .setValue('#encoded', "テ'_スト")
        .setValue('#wave-result', '')
        .setValue('#wave-err', '')
        .click('#wave-ver1')
        .waitForValue('#wave-result', 5000)
        .getValue('#wave-result')
        .then((value: string) => {
          assert.equal(value, 'ok', position());
        })
        .getValue('#wave-err')
        .then((value: string) => {
          assert.ok(!value, position());
        })
        // wave talk1 empty
        .setValue('#encoded', '')
        .setValue('#wave-result', '')
        .setValue('#wave-err', '')
        .click('#wave-ver1')
        .getValue('#wave-result')
        .then((value: string) => {
          assert.ok(!value, position());
        })
        .getValue('#wave-err')
        .then((value: string) => {
          assert.ok(value, position());
        })
        // wave talk2
        .setValue('#encoded', "テ'_スト")
        .setValue('#wave-result', '')
        .setValue('#wave-err', '')
        .click('#wave-ver2')
        .waitForValue('#wave-result', 5000)
        .getValue('#wave-result')
        .then((value: string) => {
          assert.equal(value, 'ok', position());
        })
        .getValue('#wave-err')
        .then((value: string) => {
          assert.ok(!value, position());
        })
        // wave talk2 empty
        .setValue('#encoded', '')
        .setValue('#wave-result', '')
        .setValue('#wave-err', '')
        .click('#wave-ver2')
        .getValue('#wave-result')
        .then((value: string) => {
          assert.ok(!value, position());
        })
        .getValue('#wave-err')
        .then((value: string) => {
          assert.ok(value, position());
        })
        // wave talk10
        .setValue('#encoded', "テ'_スト")
        .setValue('#wave-result', '')
        .setValue('#wave-err', '')
        .click('#wave-ver10')
        .waitForValue('#wave-result', 5000)
        .getValue('#wave-result')
        .then((value: string) => {
          assert.equal(value, 'ok', position());
        })
        .getValue('#wave-err')
        .then((value: string) => {
          assert.ok(!value, position());
        })
        // wave talk10 empty
        .setValue('#encoded', '')
        .setValue('#wave-result', '')
        .setValue('#wave-err', '')
        .click('#wave-ver10')
        .getValue('#wave-result')
        .then((value: string) => {
          assert.ok(!value, position());
        })
        .getValue('#wave-err')
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
            if (log.match(/error/i)) {
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
