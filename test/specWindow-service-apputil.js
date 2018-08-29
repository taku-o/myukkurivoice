"use strict";
var _this = this;
exports.__esModule = true;
var spectron_1 = require("spectron");
var assert = require("assert");
var temp = require("temp");
temp.track();
describe('specWindow-service-AppUtilService', function () {
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
    it('AppUtilService', function () {
        return _this.client
            // disableRhythm
            .setValue('#rhythm-text', 'test\' val/ue')
            .click('#disable-rhythm')
            .getValue('#disable-rhythm-result').then(function (value) {
            assert.equal(value, 'test value');
        })
            // disableRhythm not contains
            .setValue('#rhythm-text', 'this is not a rhythm text')
            .click('#disable-rhythm')
            .getValue('#disable-rhythm-result').then(function (value) {
            assert.equal(value, 'this is not a rhythm text');
        })
            // disableRhythm empty
            .setValue('#rhythm-text', '')
            .click('#disable-rhythm')
            .getValue('#disable-rhythm-result').then(function (value) {
            assert.ok(!value);
        });
    });
});
