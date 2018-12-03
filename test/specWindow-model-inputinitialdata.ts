import {Application} from 'spectron';
import * as assert from 'assert';
import {position} from 'caller-position';
import * as temp from 'temp';
temp.track();

require('source-map-support').install();

describe('specWindow-model-YInputInitialData', function() {
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
        const parsed = JSON.parse(value);
        assert.equal('エムユックリボイスへようこそ。ゆっくりしていってね！', parsed.source, position());
        assert.equal("エムユックリボ'イスエ/ヨ'ーコソ。ユック'リ/シテイッテ'ネ、", parsed.encoded, position());
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
