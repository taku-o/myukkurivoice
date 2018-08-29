"use strict";
var _this = this;
exports.__esModule = true;
var spectron_1 = require("spectron");
var assert = require("assert");
var temp = require("temp");
temp.track();
describe('specWindow-model-YInputInitialData', function () {
    _this.timeout(10000);
    before(function () {
        var fsprefix = '_myubo_test' + Date.now().toString(36);
        var dirPath = temp.mkdirSync(fsprefix);
        _this.app = new spectron_1.Application({
            path: 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/MacOS/MYukkuriVoice',
            env: { DEBUG: 1, NODE_ENV: 'test', userData: dirPath }
        });
        return _this.app.start();
    });
    after(function () {
        if (_this.app && _this.app.isRunning()) {
            return _this.app.stop();
        }
    });
    beforeEach(function () {
        _this.client = _this.app.client;
        return _this.client
            .click('#show-spec-window')
            .windowByIndex(1);
    });
    afterEach(function () {
        return _this.client.close();
    });
    it('YInputInitialData', function () {
        return _this.client
            .click('#getYInputInitialData')
            .getValue('#getYInputInitialData-result').then(function (value) {
            var parsed = JSON.parse(value);
            assert.equal('エムユックリボイスへようこそ。ゆっくりしていってね！', parsed.source);
            assert.equal("エムユックリボ'イスエ/ヨ'ーコソ。ユック'リ/シテイッテ'ネ、", parsed.encoded);
        });
    });
});
