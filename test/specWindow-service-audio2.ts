import {Application} from 'spectron';
import * as assert from 'assert';
import * as fs from 'fs';
import * as temp from 'temp';
temp.track();

describe('specWindow-service-AudioService2', function() {
  this.timeout(10000);

  let dirPath = null;
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

  it('record', function() {
    return this.client
      // record aquestalk1
      .setValue('#play2-encoded', "テ'_スト")
      .setValue('#wav-file-path-2', `${dirPath}/_myukkurivoice_hogehoge_1.wav`)
      .setValue('#record-result-2', '')
      .click('#record2-aqver1')
      .waitForValue('#record-result-2', 5000)
      .getValue('#record-result-2').then((value: string) => {
        assert.equal(value, 'ok');
        return new Promise((resolve, reject) => {
          fs.readFile(`${dirPath}/_myukkurivoice_hogehoge_1.wav`, (err, data) => {
            assert.ok(!err);
            assert.ok(data);
            resolve();
          });
        });
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });
});
