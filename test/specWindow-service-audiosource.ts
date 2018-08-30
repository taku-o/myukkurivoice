import {Application} from 'spectron';
import * as assert from 'assert';
import * as temp from 'temp';
temp.track();

describe('specWindow-service-AudioSourceService', function() {
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

  // AudioSourceService
  it('AudioSourceService', function() {
    return this.client
      // sourceFname
      .setValue('#wav-file-path', '/tmp/_myukkurivoice_hogehoge.wav')
      .click('#source-fname')
      .getValue('#source-fname-result').then((value: string) => {
        assert.equal(value, '/tmp/_myukkurivoice_hogehoge.txt');
      })
      // save
      .setValue('#file-path', '/tmp/_myukkurivoice_hogehoge.txt')
      .setValue('#source-text', 'hogehoge')
      .click('#save')
      .getValue('#save-result').then((value: string) => {
        assert.ok(value);
      });
      // TODO tmp file
      // TODO file exists
      // TODO file content
  });
});
