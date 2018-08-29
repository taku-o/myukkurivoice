"use strict";
var _this = this;
exports.__esModule = true;
var spectron_1 = require("spectron");
var assert = require("assert");
var temp = require("temp");
temp.track();
describe('specWindow-service-AquesService', function () {
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
    // AquesService
    it('AquesService', function () {
        return _this.client
            // encode
            .setValue('#source', 'test')
            .click('#encode')
            .getValue('#encode-result').then(function (value) {
            assert.equal(value, "テ'_スト");
        })
            // encode empty string
            .setValue('#source', '')
            .setValue('#encode-result', '')
            .click('#encode')
            .getValue('#encode-result').then(function (value) {
            assert.ok(!value);
        })
            // wave talk1
            .setValue('#encoded', "テ'_スト")
            .setValue('#wave-result', '')
            .setValue('#wave-err', '')
            .click('#wave-ver1')
            .waitForValue('#wave-result', 5000)
            .getValue('#wave-result').then(function (value) {
            assert.equal(value, 'ok');
        })
            .getValue('#wave-err').then(function (value) {
            assert.ok(!value);
        })
            // wave talk1 empty
            .setValue('#encoded', '')
            .setValue('#wave-result', '')
            .setValue('#wave-err', '')
            .click('#wave-ver1')
            .getValue('#wave-result').then(function (value) {
            assert.ok(!value);
        })
            .getValue('#wave-err').then(function (value) {
            assert.ok(!value);
        })
            // wave talk2
            .setValue('#encoded', "テ'_スト")
            .setValue('#wave-result', '')
            .setValue('#wave-err', '')
            .click('#wave-ver2')
            .waitForValue('#wave-result', 5000)
            .getValue('#wave-result').then(function (value) {
            assert.equal(value, 'ok');
        })
            .getValue('#wave-err').then(function (value) {
            assert.ok(!value);
        })
            // wave talk2 empty
            .setValue('#encoded', '')
            .setValue('#wave-result', '')
            .setValue('#wave-err', '')
            .click('#wave-ver2')
            .getValue('#wave-result').then(function (value) {
            assert.ok(!value);
        })
            .getValue('#wave-err').then(function (value) {
            assert.ok(!value);
        })
            // wave talk10
            .setValue('#encoded', "テ'_スト")
            .setValue('#wave-result', '')
            .setValue('#wave-err', '')
            .click('#wave-ver10')
            .waitForValue('#wave-result', 5000)
            .getValue('#wave-result').then(function (value) {
            assert.equal(value, 'ok');
        })
            .getValue('#wave-err').then(function (value) {
            assert.ok(!value);
        })
            // wave talk10 empty
            .setValue('#encoded', '')
            .setValue('#wave-result', '')
            .setValue('#wave-err', '')
            .click('#wave-ver10')
            .getValue('#wave-result').then(function (value) {
            assert.ok(!value);
        })
            .getValue('#wave-err').then(function (value) {
            assert.ok(!value);
        });
    });
});
