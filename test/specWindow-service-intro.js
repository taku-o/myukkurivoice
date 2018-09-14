"use strict";
exports.__esModule = true;
var spectron_1 = require("spectron");
var assert = require("assert");
var temp = require("temp");
temp.track();
describe('specWindow-service-IntroService', function () {
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
    it('mainTutorial', function () {
        return this.client
            .click('#main-tutorial')
            .waitForVisible('.introjs-tooltip', 5000)
            .isVisible('.introjs-tooltip').then(function (isVisible) {
            assert.ok(isVisible);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('settingsTutorial', function () {
        return this.client
            .click('#settings-tutorial')
            .waitForVisible('.introjs-tooltip', 5000)
            .isVisible('.introjs-tooltip').then(function (isVisible) {
            assert.ok(isVisible);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('shortcut', function () {
        return this.client
            .click('#shortcut')
            .waitForVisible('.introjs-tooltip', 5000)
            .isVisible('.introjs-tooltip').then(function (isVisible) {
            assert.ok(isVisible);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
});
