import {Application} from 'spectron';
import {assert} from 'chai';
import {position} from 'caller-position';
import * as temp from 'temp';
temp.track();

require('source-map-support').install();

describe('specWindow-service-IntroService-dict', function() {
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
    return this.client.click('#show-spec-window').windowByIndex(1);
  });

  afterEach(function() {
    return this.client.close();
  });

  it('dictTutorial', function() {
    return (
      this.client
        .click('#dict-tutorial')
        .waitForVisible('.introjs-tooltip', 5000)
        .isVisible('.introjs-tooltip')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        // error
        .catch((err: Error) => {
          assert.fail(err.message);
        })
        .getMainProcessLogs()
        .then((logs: string[]) => {
          logs.forEach((log) => {
            assert.ok(!log.match(/error/i), position());
          });
        })
        .getRenderProcessLogs()
        .then((logs: WebdriverIO.LogEntry[]) => {
          logs.forEach((log) => {
            assert.ok(!log.message.match(/error/i), position());
          });
        })
    );
  });
});
