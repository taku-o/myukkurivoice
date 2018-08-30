import {Application} from 'spectron';
import * as assert from 'assert';
import * as temp from 'temp';
temp.track();

describe('specWindow-service-AudioService2', function() {
  this.timeout(10000);

  before(function() {
    var fsprefix = '_myubo_test' + Date.now().toString(36);
    var dirPath = temp.mkdirSync(fsprefix);
    this.app = new Application({
      path: 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/MacOS/MYukkuriVoice',
      env: { DEBUG: 1, NODE_ENV: 'test', userData: dirPath },
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

  // AudioService2
  it('AudioService2', function() {
    return this.client
      // play aquestalk1
      .setValue('#play2-encoded', "テ'_スト")
      .setValue('#play-result-2', '')
      .click('#play2-aqver1')
      .waitForValue('#play-result-2', 5000)
      .getValue('#play-result-2').then((value: string) => {
        assert.equal(value, 'ok');
      })
      // play aquestalk2
      .setValue('#play2-encoded', "テ'_スト")
      .setValue('#play-result-2', '')
      .click('#play2-aqver2')
      .waitForValue('#play-result-2', 5000)
      .getValue('#play-result-2').then((value: string) => {
        assert.equal(value, 'ok');
      })
      // play aquestalk10
      .setValue('#play2-encoded', "テ'_スト")
      .setValue('#play-result-2', '')
      .click('#play2-aqver10')
      .waitForValue('#play-result-2', 5000)
      .getValue('#play-result-2').then((value: string) => {
        assert.equal(value, 'ok');
      })
      // record aquestalk1
      .setValue('#play2-encoded', "テ'_スト")
      .setValue('#wav-file-path-2', '/tmp/_myukkurivoice_hogehoge.wav')
      .setValue('#record-result-2', '')
      .click('#record2-aqver1')
      .waitForValue('#record-result-2', 5000)
      .getValue('#record-result-2').then((value: string) => {
        assert.equal(value, 'ok');
      })
      // record aquestalk2
      .setValue('#play2-encoded', "テ'_スト")
      .setValue('#wav-file-path-2', '/tmp/_myukkurivoice_hogehoge.wav')
      .setValue('#record-result-2', '')
      .click('#record2-aqver2')
      .waitForValue('#record-result-2', 5000)
      .getValue('#record-result-2').then((value: string) => {
        assert.equal(value, 'ok');
      })
      // record aquestalk10
      .setValue('#play2-encoded', "テ'_スト")
      .setValue('#wav-file-path-2', '/tmp/_myukkurivoice_hogehoge.wav')
      .setValue('#record-result-2', '')
      .click('#record2-aqver10')
      .waitForValue('#record-result-2', 5000)
      .getValue('#record-result-2').then((value: string) => {
        assert.equal(value, 'ok');
      });
      // TODO tmp file
      // TODO file exists
  });
});
