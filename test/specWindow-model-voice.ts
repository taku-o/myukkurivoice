import {Application} from 'spectron';
import * as assert from 'assert';
import * as temp from 'temp';
temp.track();

describe('specWindow-model-YVoice', function() {
  this.timeout(10000);

  before(function() {
    var fsprefix = `_myubo_test${Date.now().toString(36)}`;
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

  it('YVoice', function() {
    return this.client
      .click('#getYVoice')
      .getValue('#getYVoice-result').then((value: string) => {
        var parsed = JSON.parse(value);
        assert.equal(null, parsed.id);
        assert.equal('f1 女声1(ゆっくり)', parsed.name);
        assert.equal('at1_f1', parsed.phont);
        assert.equal('talk1', parsed.version);
        assert.equal(100, parsed.speed);
        assert.equal(1.0, parsed.playbackRate);
        assert.equal(0, parsed.detune);
        assert.equal(1.0, parsed.volume);
        assert.equal(true, parsed.rhythmOn);
        assert.equal(150, parsed.writeMarginMs);
        assert.equal(false, parsed.sourceWrite);
        assert.equal(false, parsed.seqWrite);
        assert.equal('', parsed.seqWriteOptions.dir);
        assert.equal('', parsed.seqWriteOptions.prefix);
      });
  });
});
