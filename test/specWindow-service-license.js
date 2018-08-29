"use strict";
var _this = this;
exports.__esModule = true;
var spectron_1 = require("spectron");
var assert = require("assert");
var temp = require("temp");
temp.track();
describe('specWindow-service-LicenseService', function () {
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
    it('LicenseService', function () {
        return _this.client
            // encrypt
            .setValue('#pass-phrase', 'hogehoge')
            .setValue('#plain-key', 'this is a plain key')
            .click('#encrypt')
            .getValue('#encrypted-key').then(function (value) {
            assert.ok(value);
            //console.log('tested encrypted key is :'+ value);
        })
            // decrypt
            .setValue('#plain-key', '')
            .click('#decrypt')
            .getValue('#plain-key').then(function (value) {
            assert.equal(value, 'this is a plain key');
        })
            // consumerKey aquesTalk10DevKey
            .setValue('#license-type', 'aquesTalk10DevKey')
            .setValue('#consumer-key-result', '')
            .setValue('#consumer-key-err', '')
            .click('#consumer-key')
            .waitForValue('#consumer-key-result', 5000)
            .getValue('#consumer-key-result').then(function (value) {
            assert.ok(value);
        })
            .getValue('#consumer-key-err').then(function (value) {
            assert.ok(!value);
        })
            // consumerKey unknown key
            .setValue('#license-type', 'unknown')
            .setValue('#consumer-key-result', 'initial value')
            .setValue('#consumer-key-err', '')
            .click('#consumer-key')
            .waitForValue('#consumer-key-done', 5000)
            .getValue('#consumer-key-result').then(function (value) {
            assert.ok(!value);
        })
            .getValue('#consumer-key-err').then(function (value) {
            assert.ok(!value);
        });
    });
});
