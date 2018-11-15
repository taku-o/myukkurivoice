"use strict";
exports.__esModule = true;
var spectron_1 = require("spectron");
var assert = require("assert");
var temp = require("temp");
temp.track();
describe('specWindow-dict-models', function () {
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
    it('KindList', function () {
        return this.client
            .click('#get-kind-list')
            .getValue('#get-kind-list-result').then(function (value) {
            var parsed = JSON.parse(value);
            assert.equal(parsed.length, 28);
            for (var i = 0; i < parsed.length; i++) {
                assert.equal(i, parsed[i].id);
                assert.ok(parsed[i].kind);
            }
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('KindHash', function () {
        return this.client
            .click('#get-kind-hash')
            .getValue('#get-kind-hash-result').then(function (value) {
            var parsed = JSON.parse(value);
            for (var i = 0; i < 28; i++) {
                assert.ok(parsed[i]);
            }
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
});
