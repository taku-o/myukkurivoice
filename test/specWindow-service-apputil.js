"use strict";
exports.__esModule = true;
var spectron_1 = require("spectron");
var assert = require("assert");
var temp = require("temp");
temp.track();
describe('specWindow-service-AppUtilService', function () {
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
    it('disableRhythm', function () {
        return this.client
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
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('reportDuration', function () {
        return this.client
            .setValue('#duration', 340)
            .click('#report-duration')
            .waitForValue('#report-duration-result', 5000)
            .getValue('#report-duration-result').then(function (value) {
            assert.equal(340, value);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
});
