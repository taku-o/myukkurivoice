"use strict";
exports.__esModule = true;
var spectron_1 = require("spectron");
var assert = require("assert");
var temp = require("temp");
temp.track();
describe('specWindow-service-LicenseService', function () {
    this.timeout(10000);
    before(function () {
        var fsprefix = "_myubo_test" + Date.now().toString(36);
        var dirPath = temp.mkdirSync(fsprefix);
        this.app = new spectron_1.Application({
            path: 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/MacOS/MYukkuriVoice',
            env: { DEBUG: 1, NODE_ENV: 'test', transparent: 1, userData: dirPath }
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
    it('encrypt', function () {
        return this.client
            .setValue('#pass-phrase', 'hogehoge')
            .setValue('#plain-key', 'this is a plain key')
            .click('#encrypt')
            .getValue('#encrypted-key').then(function (value) {
            assert.ok(value);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('decrypt', function () {
        return this.client
            .setValue('#encrypted-key', 'LF7ZJec+SPvmUhhpzPDEJ0ubiVt42NR62WoVW1vJKtaCQR2ActwuiO7vVAs893tIICMBniWOqDmY29hK1YUNAP6EWydrrBFzIU5GBxWtNqj36R5VjR0iJ7j2BhAZWp7lK2lMm2HJxoz9ZmNA2WMBxy/aKloM3KiW5A+cZBNjf6w=?IDFnCDZ/lAmXjxFfV5YSiXc6oFcGkFRBWWou13O5osRA5pVneS52yOEzqVrl56wq')
            .setValue('#pass-phrase', 'hogehoge')
            .setValue('#plain-key', '')
            .click('#decrypt')
            .getValue('#plain-key').then(function (value) {
            assert.equal(value, 'this is a plain key');
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('consumerKey', function () {
        return this.client
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
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
});
