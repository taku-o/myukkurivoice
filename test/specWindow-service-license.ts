import {Application} from 'spectron';
import * as assert from 'assert';
import * as temp from 'temp';
temp.track();

describe('specWindow-service-LicenseService', function() {
  this.timeout(10000);

  before(function() {
    const fsprefix = `_myubo_test${Date.now().toString(36)}`;
    const dirPath = temp.mkdirSync(fsprefix);
    this.app = new Application({
      path: 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/MacOS/MYukkuriVoice',
      env: {DEBUG: 1, NODE_ENV: 'test', transparent: 1, userData: dirPath},
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

  it('encrypt', function() {
    return this.client
      .setValue('#pass-phrase', 'hogehoge')
      .setValue('#plain-key', 'this is a plain key')
      .click('#encrypt')
      .getValue('#encrypted-key').then((value: string) => {
        assert.ok(value);
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });

  it('decrypt', function() {
    return this.client
      .setValue('#encrypted-key', 'LF7ZJec+SPvmUhhpzPDEJ0ubiVt42NR62WoVW1vJKtaCQR2ActwuiO7vVAs893tIICMBniWOqDmY29hK1YUNAP6EWydrrBFzIU5GBxWtNqj36R5VjR0iJ7j2BhAZWp7lK2lMm2HJxoz9ZmNA2WMBxy/aKloM3KiW5A+cZBNjf6w=?IDFnCDZ/lAmXjxFfV5YSiXc6oFcGkFRBWWou13O5osRA5pVneS52yOEzqVrl56wq')
      .setValue('#pass-phrase', 'hogehoge')
      .setValue('#plain-key', '')
      .click('#decrypt')
      .getValue('#plain-key').then((value: string) => {
        assert.equal(value, 'this is a plain key');
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });

  it('consumerKey', function() {
    return this.client
      // consumerKey aquesTalk10DevKey
      .setValue('#license-type', 'aquesTalk10DevKey')
      .setValue('#consumer-key-result', '')
      .setValue('#consumer-key-err', '')
      .click('#consumer-key')
      .waitForValue('#consumer-key-result', 5000)
      .getValue('#consumer-key-result').then((value: string) => {
        assert.ok(value);
      })
      .getValue('#consumer-key-err').then((value: string) => {
        assert.ok(! value);
      })
      // consumerKey unknown key
      .setValue('#license-type', 'unknown')
      .setValue('#consumer-key-result', 'initial value')
      .setValue('#consumer-key-err', '')
      .click('#consumer-key')
      .waitForValue('#consumer-key-done', 5000)
      .getValue('#consumer-key-result').then((value: string) => {
        assert.ok(! value);
      })
      .getValue('#consumer-key-err').then((value: string) => {
        assert.ok(! value);
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });
});
