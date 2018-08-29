"use strict";
var _this = this;
exports.__esModule = true;
var spectron_1 = require("spectron");
var assert = require("assert");
var temp = require("temp");
temp.track();
describe('mainWindow', function () {
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
    it('open mainWindow at startup', function () {
        return _this.app.client
            .getWindowCount().then(function (count) {
            assert.equal(count, 1);
        })
            .isVisible('#main-pane').then(function (isVisible) {
            assert.ok(isVisible);
        })
            .isVisible('#settings-pane').then(function (isVisible) {
            assert.ok(!isVisible);
        })
            .getTitle().then(function (title) {
            assert.equal(title, 'MYukkuriVoice');
        })
            // error check
            .isExisting('tr.message-item.error').then(function (error) {
            assert.ok(!error);
        })
            .isExisting('tr.message-item.syserror').then(function (error) {
            assert.ok(!error);
        });
    });
    // TODO multivoice
    it('mainWindow input', function () {
        return _this.app.client
            // encode
            .setValue('#source', 'test')
            .click('#encode')
            .getValue('#encoded').then(function (encoded) {
            assert.equal(encoded, "テ'_スト");
        })
            // clear
            .click('#clear')
            .getValue('#source').then(function (source) {
            assert.equal(source, '');
        })
            .getValue('#encoded').then(function (encoded) {
            assert.equal(encoded, '');
        })
            // play and record is enabled
            .isEnabled('#play').then(function (isEnabled) {
            assert.ok(!isEnabled);
        })
            .setValue('#source', 'test')
            .isEnabled('#play').then(function (isEnabled) {
            assert.ok(isEnabled);
        })
            .click('#clear')
            .isEnabled('#play').then(function (isEnabled) {
            assert.ok(!isEnabled);
        })
            .setValue('#encoded', "テ'_スト")
            .isEnabled('#play').then(function (isEnabled) {
            assert.ok(isEnabled);
        })
            // error check
            .isExisting('tr.message-item.error').then(function (error) {
            assert.ok(!error);
        })
            .isExisting('tr.message-item.syserror').then(function (error) {
            assert.ok(!error);
        });
    });
    it('mainWindow phont selection', function () {
        return _this.app.client
            .elements('#phont option').then(function (response) {
            assert.equal(response.value.length, 26);
        });
    });
    // TODO initial
    // TODO save config
    // TODO delete config
    // TODO copy config
    // TODO filter
    it('mainWindow voice config', function () {
        var voiceConfigLength = 999;
        return _this.app.client
            // filter
            .elements('.voice-config-item').then(function (response) {
            assert.ok(response.value.length > 0);
        })
            .setValue('#filter-text', 'xxxxxxxxxxxxxxxxxx')
            .elements('.voice-config-item').then(function (response) {
            assert.equal(response.value.length, 0);
        })
            .setValue('#filter-text', '')
            .elements('.voice-config-item').then(function (response) {
            assert.ok(response.value.length > 0);
        })
            // add config
            .elements('.voice-config-item').then(function (response) {
            voiceConfigLength = response.value.length;
        })
            .click('#plus')
            .elements('.voice-config-item').then(function (response) {
            assert.equal(response.value.length, voiceConfigLength + 1);
        })
            // error check
            .isExisting('tr.message-item.error').then(function (error) {
            assert.ok(!error);
        })
            .isExisting('tr.message-item.syserror').then(function (error) {
            assert.ok(!error);
        });
    });
    // TODO multivoice
    it('mainWindow play', function () {
        return _this.app.client
            .setValue('#encoded', "テ'_スト")
            .click('#play')
            .waitForText('#duration', 2000)
            .getValue('#duration').then(function (duration) {
            assert.ok(duration != '');
        })
            .click('#stop')
            // error check
            .isExisting('tr.message-item.error').then(function (error) {
            assert.ok(!error);
        })
            .isExisting('tr.message-item.syserror').then(function (error) {
            assert.ok(!error);
        });
    });
    // TODO record
    //it('mainWindow play', () => {
    //});
    it('mainWindow alwaysOnTop', function () {
        var app = _this.app;
        return _this.app.client
            .getAttribute('#always-on-top-btn span.icon', 'class').then(function (classes) {
            assert.ok(!classes.includes('active'));
            app.browserWindow.isAlwaysOnTop().then(function (isAlwaysOnTop) {
                assert.ok(!isAlwaysOnTop);
            });
        })
            .click('#always-on-top-btn')
            .getAttribute('#always-on-top-btn span.icon', 'class').then(function (classes) {
            assert.ok(classes.includes('active'));
            app.browserWindow.isAlwaysOnTop().then(function (isAlwaysOnTop) {
                assert.ok(isAlwaysOnTop);
            });
        })
            .click('#always-on-top-btn')
            .getAttribute('#always-on-top-btn span.icon', 'class').then(function (classes) {
            assert.ok(!classes.includes('active'));
            app.browserWindow.isAlwaysOnTop().then(function (isAlwaysOnTop) {
                assert.ok(!isAlwaysOnTop);
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
    it('mainWindow help', function () {
        return _this.app.client
            .click('#help')
            .getWindowCount().then(function (count) {
            assert.equal(count, 2);
        })
            .windowByIndex(1)
            .getTitle().then(function (title) {
            assert.equal(title, 'MYukkuriVoice Help');
        })
            // error check
            .windowByIndex(0)
            .isExisting('tr.message-item.error').then(function (error) {
            assert.ok(!error);
        })
            .isExisting('tr.message-item.syserror').then(function (error) {
            assert.ok(!error);
        });
    });
    it('mainWindow shortcut intro', function () {
        return _this.app.client
            .isVisible('.introjs-tooltip').then(function (isVisible) {
            assert.ok(!isVisible);
        })
            .click('#shortcut')
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
    it('mainWindow tutorial intro', function () {
        return _this.app.client
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
    it('mainWindow switchSettingsView', function () {
        return _this.app.client
            .click('#switch-settings-view')
            .isVisible('#main-pane').then(function (isVisible) {
            assert.ok(!isVisible);
        })
            .isVisible('#settings-pane').then(function (isVisible) {
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
