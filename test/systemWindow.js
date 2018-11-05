"use strict";
exports.__esModule = true;
var spectron_1 = require("spectron");
var assert = require("assert");
var temp = require("temp");
temp.track();
describe('systemWindow', function () {
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
            .click('#show-system-window')
            .windowByIndex(1);
    });
    afterEach(function () {
        return this.client.close();
    });
    it('initial settings', function () {
        return this.client
            .getValue('#main-width').then(function (value) {
            assert.equal(value, 800);
        })
            .getValue('#main-height').then(function (value) {
            assert.equal(value, 665);
        })
            .isSelected('#audio-serv-ver-html5audio').then(function (selected) {
            assert.ok(!selected);
        })
            .isSelected('#audio-serv-ver-webaudioapi').then(function (selected) {
            assert.ok(selected);
        })
            .isSelected('#show-msg-pane').then(function (selected) {
            assert.ok(selected);
        })
            .isSelected('#accept-first-mouse').then(function (selected) {
            assert.ok(selected);
        })
            .getValue('#aq10-use-key').then(function (value) {
            assert.ok(!value);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    // TODO [CAN NOT TEST] update system config test
    // TODO [CAN NOT TEST] reset system config test
});
