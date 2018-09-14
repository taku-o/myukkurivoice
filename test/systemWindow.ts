import {Application} from 'spectron';
import * as assert from 'assert';
import * as temp from 'temp';
temp.track();

describe('systemWindow', function() {
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
      .click('#show-system-window')
      .windowByIndex(1);
  });

  afterEach(function() {
    return this.client.close();
  });

  it('systemWindow load config', function() {
    return this.client
      .getValue('#main-width').then((value: number) => {
        assert.ok(value);
      })
      .getValue('#main-height').then((value: number) => {
        assert.ok(value);
      })
      // error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });

  // TODO save config
  // TODO load config
});
