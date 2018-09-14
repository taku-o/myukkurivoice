import {Application} from 'spectron';
import * as assert from 'assert';
import * as temp from 'temp';
temp.track();

describe('specWindow-service-CommandService', function() {
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

  it('containsCommand', function() {
    const isCmd = 'aq_yukkuri(サンプル設定2)＞test';
    const isNotCmd = 'notaq_yukkuri(サンプル設定2)＞test';
    const isCmdML1 = 'test\naq_yukkuri(サンプル設定2)＞test';
    const isCmdML2 = 'aq_yukkuri(サンプル設定2)＞test\ntest';
    const isCmdML3 = 'test\naq_yukkuri(サンプル設定2)＞test\ntest';

    return this.client
      .setValue('#contains-command-input', isCmd)
      .click('#contains-command')
      .getValue('#contains-command-result').then((value: string) => {
        assert.equal('true', value, 'isCmd');
      })
      .setValue('#contains-command-input', isNotCmd)
      .click('#contains-command')
      .getValue('#contains-command-result').then((value: string) => {
        assert.equal('false', value, 'isNotCmd');
      })
      .setValue('#contains-command-input', isCmdML1)
      .click('#contains-command')
      .getValue('#contains-command-result').then((value: string) => {
        assert.equal('true', value, 'isCmdML1');
      })
      .setValue('#contains-command-input', isCmdML2)
      .click('#contains-command')
      .getValue('#contains-command-result').then((value: string) => {
        assert.equal('true', value, 'isCmdML2');
      })
      .setValue('#contains-command-input', isCmdML3)
      .click('#contains-command')
      .getValue('#contains-command-result').then((value: string) => {
        assert.equal('true', value, 'isCmdML3');
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });

  it('parseInput', function() {
    const simple = 'aq_yukkuri(サンプル設定2)＞test';
    const empty = 'test';
    const defaultAnd = 'test\naq_yukkuri(サンプル設定2)＞test2';

    return this.client
      .setValue('#parse-input-input', simple)
      .click('#parse-input')
      .getValue('#parse-input-result').then((value: string) => {
        const parsed = JSON.parse(value);
        assert.equal(1, parsed.length);
        assert.equal('aq_yukkuri(サンプル設定2)', parsed[0].name);
        assert.equal('test', parsed[0].text);
      })
      .setValue('#parse-input-input', empty)
      .click('#parse-input')
      .getValue('#parse-input-result').then((value: string) => {
        const parsed = JSON.parse(value);
        assert.equal(1, parsed.length);
        assert.equal('f1 女声1(ゆっくり)', parsed[0].name);
        assert.equal('test', parsed[0].text);
      })
      .setValue('#parse-input-input', defaultAnd)
      .click('#parse-input')
      .getValue('#parse-input-result').then((value: string) => {
        const parsed = JSON.parse(value);
        assert.equal(2, parsed.length);
        assert.equal('f1 女声1(ゆっくり)', parsed[0].name);
        assert.equal('test', parsed[0].text);
        assert.equal('aq_yukkuri(サンプル設定2)', parsed[1].name);
        assert.equal('test2', parsed[1].text);
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });

  it('detectVoiceConfig', function() {
    const cmdInput = {
      name: 'aq_yukkuri(サンプル設定2)',
      text: 'test',
    };
    return this.client
      .setValue('#command-input-source', JSON.stringify(cmdInput))
      .click('#detect-voice-config')
      .getValue('#detect-voice-config-result').then((value: string) => {
        const parsed = JSON.parse(value);
        assert.equal('sample_2', parsed.id);
        assert.equal('aq_yukkuri(サンプル設定2)', parsed.name);
        assert.equal('talk2', parsed.version);
        assert.equal(150, parsed.writeMarginMs);
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });

  it('toString', function() {
    const cmdInputList = [
      {
        name: 'aq_yukkuri(サンプル設定2)',
        text: 'test',
      },
      {
        name: 'f1 女声1(ゆっくり)',
        text: 'test1',
      },
      {
        name: 'aq_yukkuri(サンプル設定2)',
        text: 'test2',
      },
    ];
    const cmdInputListToString =
      'aq_yukkuri(サンプル設定2)＞test\n'
      + 'f1 女声1(ゆっくり)＞test1\n'
      + 'aq_yukkuri(サンプル設定2)＞test2\n';

    return this.client
      .setValue('#command-input-list', JSON.stringify(cmdInputList))
      .click('#to-string')
      .getValue('#to-string-result').then((value: string) => {
        assert.equal(cmdInputListToString, value);
      })
      // catch error
      .catch((err: Error) => {
        assert.fail(err.message);
      });
  });
});
