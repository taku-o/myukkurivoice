import {Application} from 'spectron';
import * as assert from 'assert';
import * as temp from 'temp';
temp.track();

describe('specWindow-service-AquesService', function() {
  this.timeout(10000);

  before(function() {
    var fsprefix = `_myubo_test${Date.now().toString(36)}`;
    var dirPath = temp.mkdirSync(fsprefix);
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

  it('encode', function() {
    return this.client
      // encode
      .setValue('#source', 'test')
      .click('#encode')
      .getValue('#encode-result').then((value: string) => {
        assert.equal(value, "テ'_スト");
      })
      // encode empty string
      .setValue('#source', '')
      .setValue('#encode-result', '')
      .click('#encode')
      .getValue('#encode-result').then((value: string) => {
        assert.ok(!value);
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });

  it('wave', function() {
    return this.client
      // wave talk1
      .setValue('#encoded', "テ'_スト")
      .setValue('#wave-result', '')
      .setValue('#wave-err', '')
      .click('#wave-ver1')
      .waitForValue('#wave-result', 5000)
      .getValue('#wave-result').then((value: string) => {
        assert.equal(value, 'ok');
      })
      .getValue('#wave-err').then((value: string) => {
        assert.ok(! value);
      })
      // wave talk1 empty
      .setValue('#encoded', '')
      .setValue('#wave-result', '')
      .setValue('#wave-err', '')
      .click('#wave-ver1')
      .getValue('#wave-result').then((value: string) => {
        assert.ok(!value);
      })
      .getValue('#wave-err').then((value: string) => {
        assert.ok(! value);
      })
      // wave talk2
      .setValue('#encoded', "テ'_スト")
      .setValue('#wave-result', '')
      .setValue('#wave-err', '')
      .click('#wave-ver2')
      .waitForValue('#wave-result', 5000)
      .getValue('#wave-result').then((value: string) => {
        assert.equal(value, 'ok');
      })
      .getValue('#wave-err').then((value: string) => {
        assert.ok(! value);
      })
      // wave talk2 empty
      .setValue('#encoded', '')
      .setValue('#wave-result', '')
      .setValue('#wave-err', '')
      .click('#wave-ver2')
      .getValue('#wave-result').then((value: string) => {
        assert.ok(!value);
      })
      .getValue('#wave-err').then((value: string) => {
        assert.ok(! value);
      })
      // wave talk10
      .setValue('#encoded', "テ'_スト")
      .setValue('#wave-result', '')
      .setValue('#wave-err', '')
      .click('#wave-ver10')
      .waitForValue('#wave-result', 5000)
      .getValue('#wave-result').then((value: string) => {
        assert.equal(value, 'ok');
      })
      .getValue('#wave-err').then((value: string) => {
        assert.ok(! value);
      })
      // wave talk10 empty
      .setValue('#encoded', '')
      .setValue('#wave-result', '')
      .setValue('#wave-err', '')
      .click('#wave-ver10')
      .getValue('#wave-result').then((value: string) => {
        assert.ok(!value);
      })
      .getValue('#wave-err').then((value: string) => {
        assert.ok(! value);
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });
});
