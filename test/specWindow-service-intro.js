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
    it('IntroService', function () {
        return this.client
            // mainTutorial
            .click('#mainTutorial')
            .waitForVisible('.introjs-tooltip', 5000)
            .isVisible('.introjs-tooltip').then(function (isVisible) {
            assert.ok(isVisible);
        })
            // reset (ESC)
            .pressKeycode('\uE00C')
            // settingsTutorial
            .click('#settingsTutorial')
            .waitForVisible('.introjs-tooltip', 5000)
            .isVisible('.introjs-tooltip').then(function (isVisible) {
            assert.ok(isVisible);
        })
            // reset (ESC)
            .pressKeycode('\uE00C')
            // shortcut
            .click('#shortcut')
            .waitForVisible('.introjs-tooltip', 5000)
            .isVisible('.introjs-tooltip').then(function (isVisible) {
            assert.ok(isVisible);
        })
            // reset (ESC)
            .pressKeycode('\uE00C')["catch"](function (err) {
            assert.fail(err.message);
        });
    });
});
