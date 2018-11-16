import {Application} from 'spectron';
import * as assert from 'assert';
import {position} from 'caller-position';
import * as temp from 'temp';
temp.track();

require('source-map-support').install();

describe('specWindow-model-YVoiceInitialData', function() {
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

  it('YVoiceInitialData', function() {
    return this.client
      .click('#get-yvoice-initial-data')
      .getValue('#get-yvoice-initial-data-result').then((value: string) => {
        const parsed = JSON.parse(value);
        assert.equal(parsed.length, 4);

        for (let i=0; i < parsed.length; i++) {
          assert.ok('id' in parsed[i], position());
          assert.ok('name' in parsed[i], position());
          assert.ok('phont' in parsed[i], position());
          assert.ok('version' in parsed[i], position());
          assert.ok('speed' in parsed[i], position());
          assert.ok('playbackRate' in parsed[i], position());
          assert.ok('detune' in parsed[i], position());
          assert.ok('volume' in parsed[i], position());
          assert.ok('rhythmOn' in parsed[i], position());
          assert.ok('writeMarginMs' in parsed[i], position());
          assert.ok('sourceWrite' in parsed[i], position());
          assert.ok('seqWrite' in parsed[i], position());
          assert.equal('', parsed[i].seqWriteOptions.dir);
          assert.equal('', parsed[i].seqWriteOptions.prefix);

          const version = parsed[i].version;
          switch (version) {
            case 'talk1':
            case 'talk2':
              break;
            case 'talk10':
              assert.ok('bas' in parsed[i], position());
              assert.ok('spd' in parsed[i], position());
              assert.ok('vol' in parsed[i], position());
              assert.ok('pit' in parsed[i], position());
              assert.ok('acc' in parsed[i], position());
              assert.ok('lmd' in parsed[i], position());
              assert.ok('fsc' in parsed[i], position());
              break;
            default:
              assert.fail('unknown version');
          }
        }
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });
});
