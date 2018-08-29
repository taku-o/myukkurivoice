import {Application} from 'spectron';
import * as assert from 'assert';
import * as temp from 'temp';
temp.track();

describe('specWindow-service-MasterService', () => {
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

  it('MasterService', () => {
    return this.client
      // getPhontList
      .click('#get-phont-list')
      .getValue('#get-phont-list-result').then((value) => {
        var parsed = JSON.parse(value);
        assert.equal(parsed.length, 26);
      });
  });
});
