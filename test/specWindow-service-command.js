"use strict";
exports.__esModule = true;
var spectron_1 = require("spectron");
var assert = require("assert");
var temp = require("temp");
temp.track();
describe('specWindow-service-CommandService', function () {
    this.timeout(10000);
    before(function () {
        var fsprefix = "_myubo_test" + Date.now().toString(36);
        var dirPath = temp.mkdirSync(fsprefix);
        this.app = new spectron_1.Application({
            path: 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/MacOS/MYukkuriVoice',
            env: { DEBUG: 1, NODE_ENV: 'test', userData: dirPath }
        });
        return this.app.start();
    });
    after(function () {
        if (this.app && this.app.isRunning()) {
            return this.app.stop();
        }
    });
    beforeEach(function () {
        this.client = this.app.client;
        return this.client
            .click('#show-spec-window')
            .windowByIndex(1);
    });
    afterEach(function () {
        return this.client.close();
    });
    it('containsCommand', function () {
        var isCmd = 'aq_yukkuri(サンプル設定2)＞test';
        var isNotCmd = 'notaq_yukkuri(サンプル設定2)＞test';
        var isCmdML1 = 'test\naq_yukkuri(サンプル設定2)＞test';
        var isCmdML2 = 'aq_yukkuri(サンプル設定2)＞test\ntest';
        var isCmdML3 = 'test\naq_yukkuri(サンプル設定2)＞test\ntest';
        return this.client
            .setValue('#contains-command-input', isCmd)
            .click('#contains-command')
            .getValue('#contains-command-result').then(function (value) {
            assert.equal('true', value, 'isCmd');
        })
            .setValue('#contains-command-input', isNotCmd)
            .click('#contains-command')
            .getValue('#contains-command-result').then(function (value) {
            assert.equal('false', value, 'isNotCmd');
        })
            .setValue('#contains-command-input', isCmdML1)
            .click('#contains-command')
            .getValue('#contains-command-result').then(function (value) {
            assert.equal('true', value, 'isCmdML1');
        })
            .setValue('#contains-command-input', isCmdML2)
            .click('#contains-command')
            .getValue('#contains-command-result').then(function (value) {
            assert.equal('true', value, 'isCmdML2');
        })
            .setValue('#contains-command-input', isCmdML3)
            .click('#contains-command')
            .getValue('#contains-command-result').then(function (value) {
            assert.equal('true', value, 'isCmdML3');
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('parseInput', function () {
        var simple = 'aq_yukkuri(サンプル設定2)＞test';
        var empty = 'test';
        var defaultAnd = 'test\naq_yukkuri(サンプル設定2)＞test2';
        return this.client
            .setValue('#parse-input-input', simple)
            .click('#parse-input')
            .getValue('#parse-input-result').then(function (value) {
            var parsed = JSON.parse(value);
            assert.equal(1, parsed.length);
            assert.equal('aq_yukkuri(サンプル設定2)', parsed[0].name);
            assert.equal('test', parsed[0].text);
        })
            .setValue('#parse-input-input', empty)
            .click('#parse-input')
            .getValue('#parse-input-result').then(function (value) {
            var parsed = JSON.parse(value);
            assert.equal(1, parsed.length);
            assert.equal('f1 女声1(ゆっくり)', parsed[0].name);
            assert.equal('test', parsed[0].text);
        })
            .setValue('#parse-input-input', defaultAnd)
            .click('#parse-input')
            .getValue('#parse-input-result').then(function (value) {
            var parsed = JSON.parse(value);
            assert.equal(2, parsed.length);
            assert.equal('f1 女声1(ゆっくり)', parsed[0].name);
            assert.equal('test', parsed[0].text);
            assert.equal('aq_yukkuri(サンプル設定2)', parsed[1].name);
            assert.equal('test2', parsed[1].text);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('detectVoiceConfig', function () {
        var cmdInput = {
            name: 'aq_yukkuri(サンプル設定2)',
            text: 'test'
        };
        return this.client
            .setValue('#command-input-source', JSON.stringify(cmdInput))
            .click('#detect-voice-config')
            .getValue('#detect-voice-config-result').then(function (value) {
            var parsed = JSON.parse(value);
            assert.equal('sample_2', parsed.id);
            assert.equal('aq_yukkuri(サンプル設定2)', parsed.name);
            assert.equal('talk2', parsed.version);
            assert.equal(150, parsed.writeMarginMs);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('toString', function () {
        var cmdInputList = [
            {
                name: 'aq_yukkuri(サンプル設定2)',
                text: 'test'
            },
            {
                name: 'f1 女声1(ゆっくり)',
                text: 'test1'
            },
            {
                name: 'aq_yukkuri(サンプル設定2)',
                text: 'test2'
            },
        ];
        var cmdInputListToString = 'aq_yukkuri(サンプル設定2)＞test\n'
            + 'f1 女声1(ゆっくり)＞test1\n'
            + 'aq_yukkuri(サンプル設定2)＞test2\n';
        return this.client
            .setValue('#command-input-list', JSON.stringify(cmdInputList))
            .click('#to-string')
            .getValue('#to-string-result').then(function (value) {
            var log = require('electron-log');
            log.error('--');
            log.error(value);
            log.error(cmdInputListToString);
            // @ts-ignore
            log.error(value == cmdInputListToString);
            // @ts-ignore
            log.error(value == cmdInputListToString);
            assert.equal(cmdInputListToString, value);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
});
