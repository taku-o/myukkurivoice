"use strict";
exports.__esModule = true;
var spectron_1 = require("spectron");
var assert = require("assert");
var temp = require("temp");
temp.track();
describe('specWindow-service-SeqFNameService', function () {
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
    // TODO splitFname(filePath: string): any;
    it('splitFname', function () {
        return this.client
            // nextFname
            .setValue('#prefix', 'foo')
            .setValue('#num', '200')
            .click('#next-fname')
            .getValue('#next-fname-result').then(function (value) {
            assert.equal(value, 'foo0200.wav');
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    // TODO nextNumber(dir: string, prefix: string): ng.IPromise<number>;
    it('nextNumber', function () {
        return this.client
            // nextFname
            .setValue('#prefix', 'foo')
            .setValue('#num', '200')
            .click('#next-fname')
            .getValue('#next-fname-result').then(function (value) {
            assert.equal(value, 'foo0200.wav');
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
});
