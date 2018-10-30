"use strict";
exports.__esModule = true;
var spectron_1 = require("spectron");
var assert = require("assert");
var temp = require("temp");
temp.track();
var fs = require("fs");
describe('specWindow-service-SeqFNameService', function () {
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
    it('nextFname', function () {
        return this.client
            .setValue('#prefix', 'foo')
            .setValue('#num', '200')
            .click('#next-fname')
            .getValue('#next-fname-result').then(function (value) {
            assert.equal(value, 'foo0200.wav');
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('splitFname', function () {
        return this.client
            .setValue('#split-fname-filepath', '/tmp/hoge/foo.txt')
            .click('#split-fname')
            .getValue('#split-fname-result').then(function (value) {
            var r = JSON.parse(value);
            assert.equal('/tmp/hoge', r.dir);
            assert.equal('foo.txt', r.basename);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('nextNumber', function () {
        var prefixP1 = 'prefix';
        var prefixP2 = 'some';
        var prefixP3 = 'hoge';
        var prefixP4 = 'phlx';
        var fileP1 = dirPath + "/" + prefixP1 + "0101.wav";
        var fileP2 = dirPath + "/" + prefixP2 + "0000.wav";
        var fileP3 = dirPath + "/" + prefixP3 + ".wav";
        fs.closeSync(fs.openSync(fileP1, 'w'));
        fs.closeSync(fs.openSync(fileP2, 'w'));
        fs.closeSync(fs.openSync(fileP3, 'w'));
        return this.client
            // get simply next number
            .setValue('#next-number-dir', dirPath)
            .setValue('#next-number-prefix', prefixP1)
            .click('#next-number')
            .waitForValue('#next-number-result', 5000)
            .getValue('#next-number-result').then(function (value) {
            assert.equal(102, value);
        })
            // count up
            .setValue('#next-number-dir', dirPath)
            .setValue('#next-number-prefix', prefixP2)
            .click('#next-number')
            .waitForValue('#next-number-result', 5000)
            .getValue('#next-number-result').then(function (value) {
            assert.equal(1, value);
        })
            // newly
            .setValue('#next-number-dir', dirPath)
            .setValue('#next-number-prefix', prefixP3)
            .click('#next-number')
            .waitForValue('#next-number-result', 5000)
            .getValue('#next-number-result').then(function (value) {
            assert.equal(0, value);
        })
            // not exists
            .setValue('#next-number-dir', dirPath)
            .setValue('#next-number-prefix', prefixP4)
            .click('#next-number')
            .waitForValue('#next-number-result', 5000)
            .getValue('#next-number-result').then(function (value) {
            assert.equal(0, value);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
});
