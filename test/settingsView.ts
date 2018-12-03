import {Application} from 'spectron';
import * as assert from 'assert';
import {position} from 'caller-position';
import * as temp from 'temp';
temp.track();

require('source-map-support').install();

describe('settingsView', function() {
  this.timeout(10000);

  beforeEach(function() {
    const fsprefix = `_myubo_test${Date.now().toString(36)}`;
    const dirPath = temp.mkdirSync(fsprefix);
    this.app = new Application({
      path: 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/MacOS/MYukkuriVoice',
      env: {DEBUG: 1, NODE_ENV: 'test', userData: dirPath},
    });
    return this.app.start();
  });

  afterEach(function() {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it('settingsView seq-write-box option', function() {
    const client = this.app.client;
    return this.app.client
      .click('#switch-settings-view')
      .isSelected('#seq-write-box .checkbox input').then((isSelected: boolean) => {
        client.isVisible('#seq-write-box .form-group').then((isVisible: boolean) => {
          assert.equal(isVisible, isSelected, position());
        });
      })
      // error check
      .isExisting('tr.message-item.error').then((error: boolean) => {
        assert.ok(! error, position());
      })
      .isExisting('tr.message-item.syserror').then((error: boolean) => {
        assert.ok(! error, position());
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      })
      .getMainProcessLogs().then((logs) => {
        logs.forEach((log) => {
          assert.ok(! log.match(/error/i), position());
        });
      })
      .getRenderProcessLogs().then((logs) => {
        logs.forEach((log) => {
          assert.ok(! log.message.match(/error/i), position());
        });
      });
  });

  it('settingsView tutorial intro', function() {
    return this.app.client
      .click('#switch-settings-view')
      .isVisible('.introjs-tooltip').then((isVisible: boolean) => {
        assert.ok(! isVisible, position());
      })
      .click('#tutorial')
      .isVisible('.introjs-tooltip').then((isVisible: boolean) => {
        assert.ok(isVisible, position());
      })
      // error check
      .isExisting('tr.message-item.error').then((error: boolean) => {
        assert.ok(! error, position());
      })
      .isExisting('tr.message-item.syserror').then((error: boolean) => {
        assert.ok(! error, position());
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      })
      .getMainProcessLogs().then((logs) => {
        logs.forEach((log) => {
          assert.ok(! log.match(/error/i), position());
        });
      })
      .getRenderProcessLogs().then((logs) => {
        logs.forEach((log) => {
          assert.ok(! log.message.match(/error/i), position());
        });
      });
  });
});
