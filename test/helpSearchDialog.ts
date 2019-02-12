import {Application} from 'spectron';
import * as assert from 'assert';
import {position} from 'caller-position';
import * as temp from 'temp';
temp.track();

require('source-map-support').install();

describe('helpSearchDialog', function() {
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
      .click('#help')
      .windowByIndex(1)
      .click('#menu-search')
      .windowByIndex(2);
  });

  afterEach(function() {
    return this.client.close();
  });

  it('dialog ui', function() {
    return this.client
      .isVisible('#search-text').then((isVisible: boolean) => {
        assert.ok(isVisible, position());
      })
      .isVisible('#btn-search').then((isVisible: boolean) => {
        assert.ok(isVisible, position());
      })
      .isVisible('#btn-clear').then((isVisible: boolean) => {
        assert.ok(isVisible, position());
      })
      .isVisible('#btn-close').then((isVisible: boolean) => {
        assert.ok(isVisible, position());
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

  it('search text', function() {
    return this.client
      .click('#btn-search')
      .setValue('#search-text', 'MYu')
      .click('#btn-search')
      .click('#btn-clear')
      .getValue('#search-text').then((input: string) => {
        assert.equal(input, '', position());
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

  it('reopen dialog', function() {
    return this.client
      .setValue('#search-text', 'MYuk')
      .getValue('#search-text').then((input: string) => {
        assert.equal(input, 'MYuk', position());
      })
      .click('#btn-close')
      .windowByIndex(1)
      .click('#menu-search')
      .windowByIndex(2)
      .getValue('#search-text').then((input: string) => {
        assert.equal(input, 'MYuk', position());
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
