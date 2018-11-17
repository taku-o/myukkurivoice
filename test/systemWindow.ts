import {Application} from 'spectron';
import * as assert from 'assert';
import {position} from 'caller-position';
import * as temp from 'temp';
temp.track();

require('source-map-support').install();

describe('systemWindow', function() {
  this.timeout(10000);

  let dirPath = null;
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
      .click('#show-system-window')
      .windowByIndex(1);
  });

  afterEach(function() {
    return this.client.close();
  });

  it('initial settings', function() {
    return this.client
      .getValue('#main-width').then((value: number) => {
        assert.equal(value, 800, position());
      })
      .getValue('#main-height').then((value: number) => {
        assert.equal(value, 665, position());
      })
      .isSelected('#audio-serv-ver-html5audio').then((selected: boolean) => {
        assert.ok(! selected, position());
      })
      .isSelected('#audio-serv-ver-webaudioapi').then((selected: boolean) => {
        assert.ok(selected, position());
      })
      .isSelected('#show-msg-pane').then((selected: boolean) => {
        assert.ok(selected, position());
      })
      .isSelected('#accept-first-mouse').then((selected: boolean) => {
        assert.ok(selected, position());
      })
      .getValue('#aq10-use-key').then((value: string) => {
        assert.ok(! value, position());
      })
      // error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });

  // TODO [CAN NOT TEST] update system config test
  // TODO [CAN NOT TEST] reset system config test
});
