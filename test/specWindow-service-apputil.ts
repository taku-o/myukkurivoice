import {Application} from 'spectron';
import * as assert from 'assert';
import * as temp from 'temp';
temp.track();

describe('specWindow-service-AppUtilService', function() {
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

  it('disableRhythm', function() {
    return this.client
      // disableRhythm
      .setValue('#rhythm-text', 'test\' val/ue')
      .click('#disable-rhythm')
      .getValue('#disable-rhythm-result').then((value: string) => {
        assert.equal(value, 'test value');
      })
      // disableRhythm not contains
      .setValue('#rhythm-text', 'this is not a rhythm text')
      .click('#disable-rhythm')
      .getValue('#disable-rhythm-result').then((value: string) => {
        assert.equal(value, 'this is not a rhythm text');
      })
      // disableRhythm empty
      .setValue('#rhythm-text', '')
      .click('#disable-rhythm')
      .getValue('#disable-rhythm-result').then((value: string) => {
        assert.ok(!value);
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });

  // TODO reportDuration(duration: number): void;
  it('reportDuration', function() {
    return this.client
      .setValue('#rhythm-text', 'test\' val/ue');
  });
});
