import {Application} from 'spectron';
import * as assert from 'assert';
import * as temp from 'temp';
temp.track();

describe('specWindow-service-DataService', function() {
  this.timeout(10000);

  before(function() {
    const fsprefix = `_myubo_test${Date.now().toString(36)}`;
    const dirPath = temp.mkdirSync(fsprefix);
    this.app = new Application({
      path: 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/MacOS/MYukkuriVoice',
      env: {DEBUG: 1, NODE_ENV: 'test', transparent: 1, userData: dirPath},
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

  // TODO  save(dataList: yubo.YVoice[]): void;
  it('save', function() {
    return this.client
      .click('#copy')
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });

  // TODO  clear(): ng.IPromise<boolean>;
  it('clear', function() {
    return this.client
      .click('#copy')
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });
});
