import {Application} from 'spectron';
import * as assert from 'assert';
import * as temp from 'temp';
temp.track();

describe('specWindow-service-AudioService1', () => {
  this.timeout(10000);

  before(() => {
    var fsprefix = '_myubo_test' + Date.now().toString(36);
    var dirPath = temp.mkdirSync(fsprefix);
    this.app = new Application({
      path: 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/MacOS/MYukkuriVoice',
      env: { DEBUG: 1, NODE_ENV: 'test', userData: dirPath },
    });
    return this.app.start();
  });

  after(() => {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  beforeEach(() => {
    this.client = this.app.client;
    return this.client
      .click('#show-spec-window')
      .windowByIndex(1);
  });

  afterEach(() => {
    return this.client.close();
  });

  // AudioService1
  it('AudioService1', () => {
    return this.client
      // play aquestalk1
      .setValue('#play1-encoded', "テ'_スト")
      .setValue('#play-result-1', '')
      .click('#play1-aqver1')
      .waitForValue('#play-result-1', 5000)
      .getValue('#play-result-1').then((value) => {
        assert.equal(value, 'ok');
      })
      // play aquestalk2
      .setValue('#play1-encoded', "テ'_スト")
      .setValue('#play-result-1', '')
      .click('#play1-aqver2')
      .waitForValue('#play-result-1', 5000)
      .getValue('#play-result-1').then((value) => {
        assert.equal(value, 'ok');
      })
      // play aquestalk10
      .setValue('#play1-encoded', "テ'_スト")
      .setValue('#play-result-1', '')
      .click('#play1-aqver10')
      .waitForValue('#play-result-1', 5000)
      .getValue('#play-result-1').then((value) => {
        assert.equal(value, 'ok');
      })
      // record aquestalk1
      .setValue('#play1-encoded', "テ'_スト")
      .setValue('#wav-file-path-1', '/tmp/_myukkurivoice_hogehoge.wav')
      .setValue('#record-result-1', '')
      .click('#record1-aqver1')
      .waitForValue('#record-result-1', 5000)
      .getValue('#record-result-1').then((value) => {
        assert.equal(value, 'ok');
      })
      // record aquestalk2
      .setValue('#play1-encoded', "テ'_スト")
      .setValue('#wav-file-path-1', '/tmp/_myukkurivoice_hogehoge.wav')
      .setValue('#record-result-1', '')
      .click('#record1-aqver2')
      .waitForValue('#record-result-1', 5000)
      .getValue('#record-result-1').then((value) => {
        assert.equal(value, 'ok');
      })
      // record aquestalk10
      .setValue('#play1-encoded', "テ'_スト")
      .setValue('#wav-file-path-1', '/tmp/_myukkurivoice_hogehoge.wav')
      .setValue('#record-result-1', '')
      .click('#record1-aqver10')
      .waitForValue('#record-result-1', 5000)
      .getValue('#record-result-1').then((value) => {
        assert.equal(value, 'ok');
      });
      // TODO tmp file
      // TODO file exists
  });
});
