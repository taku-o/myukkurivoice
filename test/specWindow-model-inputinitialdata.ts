import {Application} from 'spectron';
import * as assert from 'assert';
import * as temp from 'temp';
temp.track();

describe('specWindow-model-YInputInitialData', function() {
  this.timeout(10000);

  before(function() {
    var fsprefix = `_myubo_test${Date.now().toString(36)}`;
    var dirPath = temp.mkdirSync(fsprefix);
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

  it('YInputInitialData', function() {
    return this.client
      .click('#get-yinput-initial-data')
      .getValue('#get-yinput-initial-data-result').then((value: string) => {
        var parsed = JSON.parse(value);
        assert.equal('エムユックリボイスへようこそ。ゆっくりしていってね！', parsed.source);
        assert.equal("エムユックリボ'イスエ/ヨ'ーコソ。ユック'リ/シテイッテ'ネ、", parsed.encoded);
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });
});
