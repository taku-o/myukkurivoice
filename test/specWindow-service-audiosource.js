"use strict";
exports.__esModule = true;
var spectron_1 = require("spectron");
var assert = require("assert");
var fs = require("fs");
var temp = require("temp");
temp.track();
describe('specWindow-service-AudioSourceService', function () {
    this.timeout(10000);
    var dirPath = null;
    before(function () {
        var fsprefix = "_myubo_test" + Date.now().toString(36);
        dirPath = temp.mkdirSync(fsprefix);
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
    it('sourceFname', function () {
        return this.client
            .setValue('#wav-file-path', '/tmp/_myukkurivoice_hogehoge.wav')
            .click('#source-fname')
            .getValue('#source-fname-result').then(function (value) {
            assert.equal(value, '/tmp/_myukkurivoice_hogehoge.txt');
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('save', function () {
        var txtfile = dirPath + "/_myukkurivoice_hogehoge.txt";
        return this.client
            .setValue('#file-path', txtfile)
            .setValue('#source-text', 'hogehoge')
            .click('#save')
            .waitForValue('#save-result', 5000)
            .getValue('#save-result').then(function (value) {
            assert.ok(value);
            fs.readFile(txtfile, 'utf8', function (err, text) {
                assert.ok(!err);
                assert.equal('hogehoge', text);
            });
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
});
