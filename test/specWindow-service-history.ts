import {Application} from 'spectron';
import * as assert from 'assert';
import {position} from 'caller-position';
import * as fs from 'fs';
import * as temp from 'temp';
temp.track();

require('source-map-support').install();

describe('specWindow-service-HistoryService', function() {
  this.timeout(10000);

  let dirPath: string = null;
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
      .click('#show-spec-window')
      .windowByIndex(1);
  });

  afterEach(function() {
    return this.client.close();
  });

  // TODO data check
  it('load', function() {
    return this.client
      .click('#history-load')
      .waitForValue('#history-result', 2000)
      .getValue('#history-result').then((value: string) => {
        assert.ok(value, position());
      })
      .getValue('#history-err').then((value: string) => {
        assert.ok(! value, position());
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

  // TODO data check
  it('save', function() {
    return this.client
      .click('#history-save')
      .waitForValue('#history-result', 2000)
      .getValue('#history-result').then((value: string) => {
        assert.ok(value, position());
      })
      .getValue('#history-err').then((value: string) => {
        assert.ok(! value, position());
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

  // TODO data check
  it('clear', function() {
    return this.client
      .click('#history-clear')
      .waitForValue('#history-result', 2000)
      .getValue('#history-result').then((value: string) => {
        assert.ok(value, position());
      })
      .getValue('#history-err').then((value: string) => {
        assert.ok(! value, position());
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

  // TODO
  //it('get', function() {
  //  return this.client
  //    .setValue('#history-key', '')
  //    .click('#history-get')
  //    .waitForValue('#history-result', 2000)
  //    .getValue('#history-result').then((value: string) => {
  //      assert.ok(value, position());
  //    })
  //    .getValue('#history-err').then((value: string) => {
  //      assert.ok(! value, position());
  //    })
  //    // catch error
  //    .catch((err: Error) => {
  //      assert.fail(err.message);
  //    })
  //    .getMainProcessLogs().then((logs) => {
  //      logs.forEach((log) => {
  //        assert.ok(! log.match(/error/i), position());
  //      });
  //    })
  //    .getRenderProcessLogs().then((logs) => {
  //      logs.forEach((log) => {
  //        assert.ok(! log.message.match(/error/i), position());
  //      });
  //    });
  //});

  // TODO
  //it('add', function() {
  //  return this.client
  //    .click('#history-add')
  //    .waitForValue('#history-result', 2000)
  //    .getValue('#history-result').then((value: string) => {
  //      assert.ok(value, position());
  //    })
  //    .getValue('#history-err').then((value: string) => {
  //      assert.ok(! value, position());
  //    })
  //    // catch error
  //    .catch((err: Error) => {
  //      assert.fail(err.message);
  //    })
  //    .getMainProcessLogs().then((logs) => {
  //      logs.forEach((log) => {
  //        assert.ok(! log.match(/error/i), position());
  //      });
  //    })
  //    .getRenderProcessLogs().then((logs) => {
  //      logs.forEach((log) => {
  //        assert.ok(! log.message.match(/error/i), position());
  //      });
  //    });
  //});

  // TODO test pattern
  it('getList', function() {
    return this.client
      .click('#history-get-list')
      .waitForValue('#history-result', 2000)
      .getValue('#history-result').then((value: string) => {
        assert.equal('[]', value, position());
      })
      .getValue('#history-err').then((value: string) => {
        assert.ok(! value, position());
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
