import {Application} from 'spectron';
import * as assert from 'assert';
import * as temp from 'temp';
temp.track();

describe('specWindow-model-YPhontList', function() {
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

  it('YPhontList', function() {
    return this.client
      .click('#get-yphont-list')
      .getValue('#get-yphont-list-result').then((value: string) => {
        const parsed = JSON.parse(value);
        assert.equal(parsed.length, 26);

        for (let i=0; i < parsed.length; i++) {
          const version = parsed[i].version;
          switch (version) {
            case 'talk1':
              assert.ok(parsed[i].id);
              assert.ok(parsed[i].name);
              assert.ok('idVoice' in parsed[i]);
              break;
            case 'talk2':
              assert.ok(parsed[i].id);
              assert.ok(parsed[i].name);
              assert.ok(parsed[i].path);
              break;
            case 'talk10':
              assert.ok(parsed[i].id);
              assert.ok(parsed[i].name);
              assert.ok('bas' in parsed[i].struct);
              assert.ok('spd' in parsed[i].struct);
              assert.ok('vol' in parsed[i].struct);
              assert.ok('pit' in parsed[i].struct);
              assert.ok('acc' in parsed[i].struct);
              assert.ok('lmd' in parsed[i].struct);
              assert.ok('fsc' in parsed[i].struct);
              break;
            default:
              assert.fail('unknown version');
          }
        }
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });
});
