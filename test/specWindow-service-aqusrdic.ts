import {Application} from 'spectron';
import {assert} from 'chai';
import {position} from 'caller-position';
import * as rimraf from 'rimraf';
import * as path from 'path';
import * as fs from 'fs';
import * as temp from 'temp';
temp.track();

require('source-map-support').install();

describe('specWindow-service-AqUsrDicService', function() {
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

  it('generateUserDict', function() {
    fs.mkdirSync(`${dirPath}/userdict`);
    fs.closeSync(fs.openSync(`${dirPath}/userdict/aqdic.bin`, 'a+')); // create with 644 permission.
    fs.closeSync(fs.openSync(`${dirPath}/userdict/aq_user.csv`, 'a+')); // create with 644 permission.
    const customDictPath = `${path.dirname(__dirname)}/node_modules/@taku-o/myukkurivoice-vendor/test/aq_dic_large`;
    fs.writeFileSync(`${dirPath}/userdict/aqdic.bin`, fs.readFileSync(`${customDictPath}/aqdic.bin`));
    fs.writeFileSync(`${dirPath}/userdict/aq_user.csv`, fs.readFileSync(`${customDictPath}/aq_user.csv`));

    return (
      this.client
        .setValue('#csv-path', `${dirPath}/userdict/aq_user.csv`)
        .setValue('#user-dic-path', `${dirPath}/userdict/aq_user.dic`)
        .setValue('#generate-user-dict-result', '')
        .click('#generate-user-dict')
        .waitForValue('#generate-user-dict-result', 5000)
        .getValue('#generate-user-dict-result')
        .then((value: string) => {
          assert.equal(value, 'ok', position());
          return new Promise((resolve, reject) => {
            fs.readFile(`${dirPath}/userdict/aq_user.dic`, 'binary', (err, data) => {
              assert.ok(!err, position());
              assert.ok(data, position());
              resolve();
            });
          });
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

  it('generateCSV', function() {
    fs.mkdirSync(`${dirPath}/userdict`);
    fs.closeSync(fs.openSync(`${dirPath}/userdict/aqdic.bin`, 'a+')); // create with 644 permission.
    fs.closeSync(fs.openSync(`${dirPath}/userdict/aq_user.dic`, 'a+')); // create with 644 permission.
    const customDictPath = `${path.dirname(__dirname)}/node_modules/@taku-o/myukkurivoice-vendor/test/aq_dic_large`;
    fs.writeFileSync(`${dirPath}/userdict/aqdic.bin`, fs.readFileSync(`${customDictPath}/aqdic.bin`));
    fs.writeFileSync(`${dirPath}/userdict/aq_user.dic`, fs.readFileSync(`${customDictPath}/aq_user.dic`));

    return (
      this.client
        .setValue('#csv-path', `${dirPath}/userdict/aq_user.csv`)
        .setValue('#user-dic-path', `${dirPath}/userdict/aq_user.dic`)
        .setValue('#generate-user-dict-result', '')
        .click('#generate-csv')
        .waitForValue('#generate-csv-result', 5000)
        .getValue('#generate-csv-result')
        .then((value: string) => {
          assert.equal(value, 'ok', position());
          return new Promise((resolve, reject) => {
            fs.readFile(`${dirPath}/userdict/aq_user.csv`, 'binary', (err, data) => {
              assert.ok(!err, position());
              assert.ok(data, position());
              resolve();
            });
          });
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

  it('validateInput', function() {
    return (
      this.client
        .setValue('#surface', '日本')
        .setValue('#yomi', 'ニホン')
        .setValue('#pos-code', '1')
        .setValue('#validate-input-result', '')
        .click('#validate-input')
        .waitForValue('#validate-input-result', 5000)
        .getValue('#validate-input-result')
        .then((value: string) => {
          assert.equal(value, 'ok', position());
        })
        .setValue('#surface', '日本')
        .setValue('#yomi', 'xxxx')
        .setValue('#pos-code', '1')
        .setValue('#validate-input-result', '')
        .click('#validate-input')
        .waitForValue('#validate-input-result', 5000)
        .getValue('#validate-input-result')
        .then((value: string) => {
          assert.notEqual(value, 'ok', position());
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

  it('getLastError', function() {
    return (
      this.client
        .setValue('#surface', '日本')
        .setValue('#yomi', 'xxxx')
        .setValue('#pos-code', '1')
        .setValue('#validate-input-result', '')
        .click('#validate-input')
        .waitForValue('#validate-input-result', 5000)
        .getValue('#validate-input-result')
        .then((value: string) => {
          assert.notEqual(value, 'ok', position());
        })
        .click('#get-last-error')
        .waitForValue('#get-last-error-result', 5000)
        .getValue('#get-last-error-result')
        .then((value: string) => {
          assert.equal(value, '0:読みに定義外の文字が指定されている', position());
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
