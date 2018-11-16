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
        assert.ok(value);
      })
      .getValue('#load-err').then((value: string) => {
        assert.ok(! value);
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });

  it('initialData', function() {
    return this.client
      .click('#initial-data')
      .getValue('#initial-data-result').then((value: string) => {
        assert.ok(value);
        const parsed = JSON.parse(value);
        assert.equal(parsed.length, 4);
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });

  it('create', function() {
    return this.client
      .click('#create')
      .getValue('#create-result').then((value: string) => {
        assert.ok(value);
        const parsed = JSON.parse(value);
        assert.ok(parsed.id);
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });

  it('copy', function() {
    return this.client
      .click('#copy')
      .getValue('#copy-result').then((value: string) => {
        assert.ok(value);
        const parsed = JSON.parse(value);
        assert.ok(parsed.id);
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });

  it('save', function() {
    return this.client
      .getValue('#save-data-result').then((value: string) => {
        assert.equal('', value);
        const isExists = fs.existsSync(`${dirPath}/data.json`);
        assert.ok(! isExists);
      })
      .click('#save-data')
      .waitForValue('#save-data-result', 2000)
      .getValue('#save-data-result').then((value: string) => {
        assert.equal('ok', value);
        const data = fs.readFileSync(`${dirPath}/data.json`);
        const parsed = JSON.parse(data.toString());
        assert.equal(parsed.length, 4);
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });

  it('clear', function() {
    return this.client
      // before test, save data
      .click('#save-data')
      .waitForValue('#save-data-result', 2000)
      .getValue('#save-data-result').then((value: string) => {
        assert.equal('ok', value);
      })
      // test
      .getValue('#clear-result').then((value: string) => {
        assert.equal('', value);
        const isExists = fs.existsSync(`${dirPath}/data.json`);
        assert.ok(isExists);
        const data = fs.readFileSync(`${dirPath}/data.json`);
        const parsed = JSON.parse(data.toString());
        assert.equal(parsed.length, 4);
      })
      .click('#clear')
      .waitForValue('#clear-result', 2000)
      .getValue('#clear-result').then((value: string) => {
        assert.equal('ok', value);
        const isExists = fs.existsSync(`${dirPath}/data.json`);
        assert.ok(! isExists);
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });
});
