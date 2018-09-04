import {Application} from 'spectron';
import * as assert from 'assert';
import * as temp from 'temp';
temp.track();

describe('specWindow-service-LicenseService', function() {
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

  it('LicenseService', function() {
    return this.client
      // encrypt
      .setValue('#pass-phrase', 'hogehoge')
      .setValue('#plain-key', 'this is a plain key')
      .click('#encrypt')
      .getValue('#encrypted-key').then((value: string) => {
        assert.ok(value);
        //console.log('tested encrypted key is :'+ value);
      })
      // decrypt
      .setValue('#plain-key', '')
      .click('#decrypt')
      .getValue('#plain-key').then((value: string) => {
        assert.equal(value, 'this is a plain key');
      })
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
