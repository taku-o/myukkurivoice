"use strict";
exports.__esModule = true;
var spectron_1 = require("spectron");
var assert = require("assert");
var fs = require("fs");
var temp = require("temp");
temp.track();
describe('specWindow-service-AudioService2', function () {
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
    it('play', function () {
        return this.client
            // play aquestalk1
            .setValue('#play2-encoded', "テ'_スト")
            .setValue('#play-result-2', '')
            .click('#play2-aqver1')
            .waitForValue('#play-result-2', 5000)
            .getValue('#play-result-2').then(function (value) {
            assert.equal(value, 'ok');
        })
            // play aquestalk2
            .setValue('#play2-encoded', "テ'_スト")
            .setValue('#play-result-2', '')
            .click('#play2-aqver2')
            .waitForValue('#play-result-2', 5000)
            .getValue('#play-result-2').then(function (value) {
            assert.equal(value, 'ok');
        })
            // play aquestalk10
            .setValue('#play2-encoded', "テ'_スト")
            .setValue('#play-result-2', '')
            .click('#play2-aqver10')
            .waitForValue('#play-result-2', 5000)
            .getValue('#play-result-2').then(function (value) {
            assert.equal(value, 'ok');
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('record', function () {
        return this.client
            // record aquestalk1
            .setValue('#play2-encoded', "テ'_スト")
            .setValue('#wav-file-path-2', dirPath + "/_myukkurivoice_hogehoge_1.wav")
            .setValue('#record-result-2', '')
            .click('#record2-aqver1')
            .waitForValue('#record-result-2', 5000)
            .getValue('#record-result-2').then(function (value) {
            assert.equal(value, 'ok');
            return new Promise(function (resolve, reject) {
                fs.readFile(dirPath + "/_myukkurivoice_hogehoge_1.wav", function (err, data) {
                    assert.ok(!err);
                    assert.ok(data);
                    resolve();
                });
            });
        })
            // record aquestalk2
            .setValue('#play2-encoded', "テ'_スト")
            .setValue('#wav-file-path-2', dirPath + "/_myukkurivoice_hogehoge_2.wav")
            .setValue('#record-result-2', '')
            .click('#record2-aqver2')
            .waitForValue('#record-result-2', 5000)
            .getValue('#record-result-2').then(function (value) {
            assert.equal(value, 'ok');
            return new Promise(function (resolve, reject) {
                fs.readFile(dirPath + "/_myukkurivoice_hogehoge_2.wav", function (err, data) {
                    assert.ok(!err);
                    assert.ok(data);
                    resolve();
                });
            });
        })
            // record aquestalk10
            .setValue('#play2-encoded', "テ'_スト")
            .setValue('#wav-file-path-2', dirPath + "/_myukkurivoice_hogehoge_10.wav")
            .setValue('#record-result-2', '')
            .click('#record2-aqver10')
            .waitForValue('#record-result-2', 5000)
            .getValue('#record-result-2').then(function (value) {
            assert.equal(value, 'ok');
            return new Promise(function (resolve, reject) {
                fs.readFile(dirPath + "/_myukkurivoice_hogehoge_10.wav", function (err, data) {
                    assert.ok(!err);
                    assert.ok(data);
                    resolve();
                });
            });
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
});
