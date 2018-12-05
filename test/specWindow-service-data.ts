import {Application} from 'spectron';
import * as assert from 'assert';
import {position} from 'caller-position';
import * as fs from 'fs';
import * as temp from 'temp';
temp.track();

require('source-map-support').install();

describe('specWindow-service-DataService', function() {
  this.timeout(10000);

  let dirPath: string = null;
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

  it('load', function() {
    return this.client
      .click('#load')
      .waitForValue('#load-result', 2000)
      .getValue('#load-result').then((value: string) => {
        assert.ok(value, position());
      })
      .getValue('#load-err').then((value: string) => {
        assert.ok(! value, position());
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

  it('initialData', function() {
    return this.client
      .click('#initial-data')
      .getValue('#initial-data-result').then((value: string) => {
        assert.ok(value, position());
        const parsed = JSON.parse(value);
        assert.equal(parsed.length, 4, position());
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

  it('create', function() {
    return this.client
      .click('#create')
      .getValue('#create-result').then((value: string) => {
        assert.ok(value, position());
        const parsed = JSON.parse(value);
        assert.ok(parsed.id, position());
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

  it('copy', function() {
    return this.client
      .click('#copy')
      .getValue('#copy-result').then((value: string) => {
        assert.ok(value, position());
        const parsed = JSON.parse(value);
        assert.ok(parsed.id, position());
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

  it('save', function() {
    return this.client
      .getValue('#save-data-result').then((value: string) => {
        assert.equal('', value, position());
        const isExists = fs.existsSync(`${dirPath}/data.json`);
        assert.ok(! isExists, position());
      })
      .click('#save-data')
      .waitForValue('#save-data-result', 2000)
      .getValue('#save-data-result').then((value: string) => {
        assert.equal('ok', value, position());
        const data = fs.readFileSync(`${dirPath}/data.json`);
        const parsed = JSON.parse(data.toString());
        assert.equal(parsed.length, 4, position());
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

  it('clear', function() {
    return this.client
      // before test, save data
      .click('#save-data')
      .waitForValue('#save-data-result', 2000)
      .getValue('#save-data-result').then((value: string) => {
        assert.equal('ok', value, position());
      })
      // test
      .getValue('#clear-result').then((value: string) => {
        assert.equal('', value, position());
        const isExists = fs.existsSync(`${dirPath}/data.json`);
        assert.ok(isExists, position());
        const data = fs.readFileSync(`${dirPath}/data.json`);
        const parsed = JSON.parse(data.toString());
        assert.equal(parsed.length, 4, position());
      })
      .click('#clear')
      .waitForValue('#clear-result', 2000)
      .getValue('#clear-result').then((value: string) => {
        assert.equal('ok', value, position());
        const isExists = fs.existsSync(`${dirPath}/data.json`);
        assert.ok(! isExists, position());
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

  // TODO HistoryService
});
