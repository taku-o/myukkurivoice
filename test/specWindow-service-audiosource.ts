import {Application} from 'spectron';
import * as assert from 'assert';
import {position} from 'caller-position';
import * as fs from 'fs';
import * as temp from 'temp';
temp.track();

require('source-map-support').install();

describe('specWindow-service-AudioSourceService', function() {
  this.timeout(10000);

  let dirPath: string = null;
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

  it('sourceFname', function() {
    return this.client
      .setValue('#wav-file-path', '/tmp/_myukkurivoice_hogehoge.wav')
      .click('#source-fname')
      .getValue('#source-fname-result').then((value: string) => {
        assert.equal(value, '/tmp/_myukkurivoice_hogehoge.txt', position());
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });

  it('save', function() {
    const txtfile = `${dirPath}/_myukkurivoice_hogehoge.txt`;
    return this.client
      .setValue('#file-path', txtfile)
      .setValue('#source-text', 'hogehoge')
      .click('#save')
      .waitForValue('#save-result', 5000)
      .getValue('#save-result').then((value: string) => {
        assert.ok(value, position());
        fs.readFile(txtfile, 'utf8', (err, text) => {
          assert.ok(!err, position());
          assert.equal('hogehoge', text, position());
        });
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });
});
