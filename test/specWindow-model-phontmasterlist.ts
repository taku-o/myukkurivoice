import {Application} from 'spectron';
import {assert} from 'chai';
import {position} from 'caller-position';
import * as temp from 'temp';
temp.track();

require('source-map-support').install();

describe('specWindow-model-YPhontMasterList', function() {
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
    return this.client.click('#show-spec-window').windowByIndex(1);
  });

  afterEach(function() {
    return this.client.close();
  });

  it('YPhontMasterList', function() {
    return (
      this.client
        .click('#get-yphont-master-list')
        .getValue('#get-yphont-master-list-result')
        .then((value: string) => {
          const parsed = JSON.parse(value);
          assert.equal(parsed.length, 26, position());

          for (let i = 0; i < parsed.length; i++) {
            const version = parsed[i].version;
            switch (version) {
              case 'talk1':
                assert.ok(parsed[i].id, position());
                assert.ok(parsed[i].name, position());
                assert.ok('idVoice' in parsed[i], position());
                break;
              case 'talk2':
                assert.ok(parsed[i].id, position());
                assert.ok(parsed[i].name, position());
                assert.ok(parsed[i].path, position());
                break;
              case 'talk10':
                assert.ok(parsed[i].id, position());
                assert.ok(parsed[i].name, position());
                assert.ok('bas' in parsed[i].struct, position());
                assert.ok('spd' in parsed[i].struct, position());
                assert.ok('vol' in parsed[i].struct, position());
                assert.ok('pit' in parsed[i].struct, position());
                assert.ok('acc' in parsed[i].struct, position());
                assert.ok('lmd' in parsed[i].struct, position());
                assert.ok('fsc' in parsed[i].struct, position());
                break;
              default:
                assert.fail('unknown version');
            }
          }
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
              !log.match(/media_internals.cc/)
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

  it('YPhontMasterIosEnvList', function() {
    return (
      this.client
        .click('#get-yphont-master-iosenv-list')
        .getValue('#get-yphont-master-list-result')
        .then((value: string) => {
          const parsed = JSON.parse(value);
          assert.equal(parsed.length, 25, position());

          for (let i = 0; i < parsed.length; i++) {
            const version = parsed[i].version;
            switch (version) {
              case 'talk1':
                assert.ok(parsed[i].id, position());
                assert.ok(parsed[i].name, position());
                assert.ok('idVoice' in parsed[i], position());
                assert.ok(parsed[i].catalina, position());
                break;
              case 'talk2':
                assert.ok(parsed[i].id, position());
                assert.ok(parsed[i].name, position());
                assert.ok(parsed[i].path, position());
                break;
              case 'talk10':
                assert.ok(parsed[i].id, position());
                assert.ok(parsed[i].name, position());
                assert.ok('bas' in parsed[i].struct, position());
                assert.ok('spd' in parsed[i].struct, position());
                assert.ok('vol' in parsed[i].struct, position());
                assert.ok('pit' in parsed[i].struct, position());
                assert.ok('acc' in parsed[i].struct, position());
                assert.ok('lmd' in parsed[i].struct, position());
                assert.ok('fsc' in parsed[i].struct, position());
                break;
              default:
                assert.fail('unknown version');
            }
          }
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
              !log.match(/media_internals.cc/)
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
