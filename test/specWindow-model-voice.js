"use strict";
var _this = this;
exports.__esModule = true;
var spectron_1 = require("spectron");
var assert = require("assert");
var temp = require("temp");
temp.track();
describe('specWindow-model-YVoice', function () {
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
    it('YVoice', function () {
        return _this.client
            .click('#getYVoice')
            .getValue('#getYVoice-result').then(function (value) {
            var parsed = JSON.parse(value);
            assert.equal(null, parsed.id);
            assert.equal('f1 女声1(ゆっくり)', parsed.name);
            assert.equal('at1_f1', parsed.phont);
            assert.equal('talk1', parsed.version);
            assert.equal(100, parsed.speed);
            assert.equal(1.0, parsed.playbackRate);
            assert.equal(0, parsed.detune);
            assert.equal(1.0, parsed.volume);
            assert.equal(true, parsed.rhythmOn);
            assert.equal(150, parsed.writeMarginMs);
            assert.equal(false, parsed.sourceWrite);
            assert.equal(false, parsed.seqWrite);
            assert.equal('', parsed.seqWriteOptions.dir);
            assert.equal('', parsed.seqWriteOptions.prefix);
        });
    });
});
