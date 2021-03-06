import {Application} from 'spectron';
import {assert} from 'chai';
import {position} from 'caller-position';
import * as temp from 'temp';
temp.track();

require('source-map-support').install();

describe('helpWindow', function() {
  this.timeout(10000);

  before(function() {
    const fsprefix = `_myubo_test${Date.now().toString(36)}`;
    const dirPath = temp.mkdirSync(fsprefix);
    this.app = new Application({
      path: 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/MacOS/MYukkuriVoice',
      chromeDriverArgs: ['remote-debugging-port=9222'],
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
    return this.client.click('#help').windowByIndex(1);
  });

  afterEach(function() {
    return this.client.close();
  });

  it('helpWindow menu list', function() {
    return this.client
      .elements('.nav-group-item.help-item')
      .then((response: HTMLInputElement) => {
        assert.equal(response.value.length, 10, position());
      })
      .elements('.nav-group-item.functions-item')
      .then((response: HTMLInputElement) => {
        assert.equal(response.value.length, 13, position());
      })
      .elements('.nav-group-item.navs-item')
      .then((response: HTMLInputElement) => {
        assert.equal(response.value.length, 2, position());
      })
      .getMainProcessLogs()
      .then((logs: string[]) => {
        logs.forEach((log) => {
          if (
            log.match(/error/i) &&
            !log.match(/gles2_cmd_decoder.cc/) &&
            !log.match(/shared_image_manager.cc/) &&
            !log.match(/media_internals.cc/) &&
            !log.match(/logger.cc/)
          ) {
            /* eslint-disable-next-line no-console */
            console.error(log);
            assert.ok(false, position());
          }
        });
      })
      .getRenderProcessLogs()
      .then((logs: WebdriverIO.LogEntry[]) => {
        logs.forEach((log) => {
          if (log.message.match(/error/i)) {
            /* eslint-disable-next-line no-console */
            console.error(log.message);
            assert.ok(false, position());
          }
        });
      });
  });

  it('helpWindow menu click', function() {
    return (
      this.client
        .isVisible('#about-app-pane')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        .isVisible('#voicecode-pane')
        .then((isVisible: boolean) => {
          assert.ok(!isVisible, position());
        })
        .isVisible('#trouble-pane')
        .then((isVisible: boolean) => {
          assert.ok(!isVisible, position());
        })
        .isVisible('#update-pane')
        .then((isVisible: boolean) => {
          assert.ok(!isVisible, position());
        })
        .isVisible('#uninstall-pane')
        .then((isVisible: boolean) => {
          assert.ok(!isVisible, position());
        })
        .isVisible('#backup-pane')
        .then((isVisible: boolean) => {
          assert.ok(!isVisible, position());
        })
        .isVisible('#license-pane')
        .then((isVisible: boolean) => {
          assert.ok(!isVisible, position());
        })
        .isVisible('#sandbox-pane')
        .then((isVisible: boolean) => {
          assert.ok(!isVisible, position());
        })
        .isVisible('#catalina-pane')
        .then((isVisible: boolean) => {
          assert.ok(!isVisible, position());
        })
        .isVisible('#contact-pane')
        .then((isVisible: boolean) => {
          assert.ok(!isVisible, position());
        })
        .isVisible('#funclist-pane')
        .then((isVisible: boolean) => {
          assert.ok(!isVisible, position());
        })
        .isVisible('#play-pane')
        .then((isVisible: boolean) => {
          assert.ok(!isVisible, position());
        })
        .isVisible('#tuna-pane')
        .then((isVisible: boolean) => {
          assert.ok(!isVisible, position());
        })
        .isVisible('#writing-pane')
        .then((isVisible: boolean) => {
          assert.ok(!isVisible, position());
        })
        .isVisible('#dataconfig-pane')
        .then((isVisible: boolean) => {
          assert.ok(!isVisible, position());
        })
        .isVisible('#dragout-pane')
        .then((isVisible: boolean) => {
          assert.ok(!isVisible, position());
        })
        .isVisible('#multivoice-pane')
        .then((isVisible: boolean) => {
          assert.ok(!isVisible, position());
        })
        .isVisible('#dictionary-pane')
        .then((isVisible: boolean) => {
          assert.ok(!isVisible, position());
        })
        .isVisible('#sysconfig-pane')
        .then((isVisible: boolean) => {
          assert.ok(!isVisible, position());
        })
        .isVisible('#shortcut-pane')
        .then((isVisible: boolean) => {
          assert.ok(!isVisible, position());
        })
        .isVisible('#help-pane')
        .then((isVisible: boolean) => {
          assert.ok(!isVisible, position());
        })
        .isVisible('#help-fcpx-ixml')
        .then((isVisible: boolean) => {
          assert.ok(!isVisible, position());
        })
        .click('#menu-about')
        .isVisible('#about-app-pane')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        .click('#menu-voicecode')
        .isVisible('#voicecode-pane')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        .click('#menu-trouble')
        .isVisible('#trouble-pane')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        .click('#menu-update')
        .isVisible('#update-pane')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        .click('#menu-uninstall')
        .isVisible('#uninstall-pane')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        .click('#menu-backup')
        .isVisible('#backup-pane')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        .click('#menu-license')
        .isVisible('#license-pane')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        .click('#menu-sandbox')
        .isVisible('#sandbox-pane')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        .click('#menu-catalina')
        .isVisible('#catalina-pane')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        .click('#menu-contact')
        .isVisible('#contact-pane')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        .click('#menu-funclist')
        .isVisible('#funclist-pane')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        .click('#menu-play')
        .isVisible('#play-pane')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        .click('#menu-tuna')
        .isVisible('#tuna-pane')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        .click('#menu-writing')
        .isVisible('#writing-pane')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        .click('#menu-dataconfig')
        .isVisible('#dataconfig-pane')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        .click('#menu-dragout')
        .isVisible('#dragout-pane')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        .click('#menu-multivoice')
        .isVisible('#multivoice-pane')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        .click('#menu-dictionary')
        .isVisible('#dictionary-pane')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        .click('#menu-sysconfig')
        .isVisible('#sysconfig-pane')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        .click('#menu-shortcut')
        .isVisible('#shortcut-pane')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        .click('#menu-help')
        .isVisible('#help-pane')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        .click('#menu-fcpx-ixml')
        .isVisible('#fcpx-ixml-pane')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        .click('#menu-expand')
        .isVisible('#expand-pane')
        .then((isVisible: boolean) => {
          assert.ok(isVisible, position());
        })
        // finally
        .isVisible('#about-app-pane')
        .then((isVisible: boolean) => {
          assert.ok(!isVisible, position());
        })
        // catch error
        .catch((err: Error) => {
          assert.fail(err.message);
        })
        .getMainProcessLogs()
        .then((logs: string[]) => {
          logs.forEach((log) => {
            if (
              log.match(/error/i) &&
              !log.match(/gles2_cmd_decoder.cc/) &&
              !log.match(/shared_image_manager.cc/) &&
              !log.match(/media_internals.cc/) &&
              !log.match(/logger.cc/)
            ) {
              /* eslint-disable-next-line no-console */
              console.error(log);
              assert.ok(false, position());
            }
          });
        })
        .getRenderProcessLogs()
        .then((logs: WebdriverIO.LogEntry[]) => {
          logs.forEach((log) => {
            if (log.message.match(/error/i)) {
              /* eslint-disable-next-line no-console */
              console.error(log.message);
              assert.ok(false, position());
            }
          });
        })
    );
  });
});
