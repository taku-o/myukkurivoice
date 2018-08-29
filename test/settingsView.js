"use strict";
var _this = this;
exports.__esModule = true;
var spectron_1 = require("spectron");
var assert = require("assert");
var temp = require("temp");
temp.track();
describe('settingsView', function () {
    _this.timeout(10000);
    beforeEach(function () {
        var fsprefix = '_myubo_test' + Date.now().toString(36);
        var dirPath = temp.mkdirSync(fsprefix);
        _this.app = new spectron_1.Application({
            path: 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/MacOS/MYukkuriVoice',
            env: { DEBUG: 1, NODE_ENV: 'test', userData: dirPath }
        });
        return _this.app.start();
    });
    afterEach(function () {
        if (_this.app && _this.app.isRunning()) {
            return _this.app.stop();
        }
    });
    it('settingsView seq-write-box option', function () {
        var client = _this.app.client;
        return _this.app.client
            .click('#switch-settings-view')
            .isSelected('#seq-write-box .checkbox input').then(function (isSelected) {
            client.isVisible('#seq-write-box .form-group').then(function (isVisible) {
                assert.equal(isVisible, isSelected);
            });
        })
            // error check
            .isExisting('tr.message-item.error').then(function (error) {
            assert.ok(!error);
        })
            .isExisting('tr.message-item.syserror').then(function (error) {
            assert.ok(!error);
        });
    });
    it('settingsView tutorial intro', function () {
        return _this.app.client
            .click('#switch-settings-view')
            .isVisible('.introjs-tooltip').then(function (isVisible) {
            assert.ok(!isVisible);
        })
            .click('#tutorial')
            .isVisible('.introjs-tooltip').then(function (isVisible) {
            assert.ok(isVisible);
        })
            // error check
            .isExisting('tr.message-item.error').then(function (error) {
            assert.ok(!error);
        })
            .isExisting('tr.message-item.syserror').then(function (error) {
            assert.ok(!error);
        });
    });
});
