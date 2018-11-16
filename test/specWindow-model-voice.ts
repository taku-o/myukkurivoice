import {Application} from 'spectron';
import * as assert from 'assert';
import {position} from 'caller-position';
import * as temp from 'temp';
temp.track();

require('source-map-support').install();

describe('specWindow-model-YVoice', function() {
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

  it('YVoice', function() {
    return this.client
      .click('#get-yvoice')
      .getValue('#get-yvoice-result').then((value: string) => {
        const parsed = JSON.parse(value);
        assert.equal(null, parsed.id, position());
        assert.equal('f1 女声1(ゆっくり)', parsed.name, position());
        assert.equal('at1_f1', parsed.phont, position());
        assert.equal('talk1', parsed.version, position());
        assert.equal(100, parsed.speed, position());
        assert.equal(1.0, parsed.playbackRate, position());
        assert.equal(0, parsed.detune, position());
        assert.equal(1.0, parsed.volume, position());
        assert.equal(true, parsed.rhythmOn, position());
        assert.equal(150, parsed.writeMarginMs, position());
        assert.equal(false, parsed.sourceWrite, position());
        assert.equal(false, parsed.seqWrite, position());
        assert.equal('', parsed.seqWriteOptions.dir, position());
        assert.equal('', parsed.seqWriteOptions.prefix, position());
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });
});
