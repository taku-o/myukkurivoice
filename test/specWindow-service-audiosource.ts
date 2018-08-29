import {Application} from 'spectron';
import * as assert from 'assert';
import * as temp from 'temp';
temp.track();

describe('specWindow-service-AudioSourceService', () => {
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

  // AudioSourceService
  it('AudioSourceService', () => {
    return this.client
      // sourceFname
      .setValue('#wav-file-path', '/tmp/_myukkurivoice_hogehoge.wav')
      .click('#source-fname')
      .getValue('#source-fname-result').then((value) => {
        assert.equal(value, '/tmp/_myukkurivoice_hogehoge.txt');
      })
      // save
      .setValue('#file-path', '/tmp/_myukkurivoice_hogehoge.txt')
      .setValue('#source-text', 'hogehoge')
      .click('#save')
      .getValue('#save-result').then((value) => {
        assert.ok(value);
      });
      // TODO tmp file
      // TODO file exists
      // TODO file content
  });
});
