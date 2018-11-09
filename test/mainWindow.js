"use strict";
exports.__esModule = true;
var spectron_1 = require("spectron");
var assert = require("assert");
var rimraf = require("rimraf");
var path = require("path");
var fs = require("fs");
var temp = require("temp");
temp.track();
describe('mainWindow', function () {
    this.timeout(10000);
    var dirPath = null;
    beforeEach(function () {
        var fsprefix = "_myubo_test" + Date.now().toString(36);
        dirPath = temp.mkdirSync(fsprefix);
        this.app = new spectron_1.Application({
            path: 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/MacOS/MYukkuriVoice',
            env: { DEBUG: 1, NODE_ENV: 'test', userData: dirPath }
        });
        return this.app.start();
    });
    afterEach(function () {
        if (this.app && this.app.isRunning()) {
            return this.app.stop();
        }
    });
    it('open mainWindow at startup', function () {
        return this.app.client
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
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    // TODO multivoice
    it('input', function () {
        return this.app.client
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
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('play with embed dictionary word:1', function (done) {
        this.timeout(3000);
        return this.app.client
            .setValue('#source', '百名山')
            .isEnabled('#play').then(function (isEnabled) {
            assert.ok(isEnabled);
        })
            .then(function () {
            done();
        })
            // error check
            .isExisting('tr.message-item.error').then(function (error) {
            assert.ok(!error);
        })
            .isExisting('tr.message-item.syserror').then(function (error) {
            assert.ok(!error);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('play with embed dictionary word:2', function (done) {
        this.timeout(3000);
        return this.app.client
            .setValue('#source', '旨味')
            .isEnabled('#play').then(function (isEnabled) {
            assert.ok(isEnabled);
        })
            .then(function () {
            done();
        })
            // error check
            .isExisting('tr.message-item.error').then(function (error) {
            assert.ok(!error);
        })
            .isExisting('tr.message-item.syserror').then(function (error) {
            assert.ok(!error);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('play with embed dictionary word:3', function (done) {
        this.timeout(3000);
        return this.app.client
            .setValue('#source', '味方さん')
            .isEnabled('#play').then(function (isEnabled) {
            assert.ok(isEnabled);
        })
            .then(function () {
            done();
        })
            // error check
            .isExisting('tr.message-item.error').then(function (error) {
            assert.ok(!error);
        })
            .isExisting('tr.message-item.syserror').then(function (error) {
            assert.ok(!error);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('play with custom dictionary word:1', function (done) {
        fs.mkdirSync(dirPath + "/userdict");
        var customDictPath = path.dirname(__dirname) + "/vendor/test/aq_dic_large";
        fs.writeFileSync(dirPath + "/userdict/aqdic.bin", fs.readFileSync(customDictPath + "/aqdic.bin"));
        fs.writeFileSync(dirPath + "/userdict/aq_user.dic", fs.readFileSync(customDictPath + "/aq_user.dic"));
        this.timeout(3000);
        return this.app.client
            .setValue('#source', '百名山')
            .isEnabled('#play').then(function (isEnabled) {
            assert.ok(isEnabled);
        })
            .then(function () {
            rimraf(dirPath + "/userdict", function (err) {
                done(err);
            });
        })
            // error check
            .isExisting('tr.message-item.error').then(function (error) {
            assert.ok(!error);
        })
            .isExisting('tr.message-item.syserror').then(function (error) {
            assert.ok(!error);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('play with custom dictionary word:2', function (done) {
        fs.mkdirSync(dirPath + "/userdict");
        var customDictPath = path.dirname(__dirname) + "/vendor/test/aq_dic_large";
        fs.writeFileSync(dirPath + "/userdict/aqdic.bin", fs.readFileSync(customDictPath + "/aqdic.bin"));
        fs.writeFileSync(dirPath + "/userdict/aq_user.dic", fs.readFileSync(customDictPath + "/aq_user.dic"));
        this.timeout(3000);
        return this.app.client
            .setValue('#source', '旨味')
            .isEnabled('#play').then(function (isEnabled) {
            assert.ok(isEnabled);
        })
            .then(function () {
            rimraf(dirPath + "/userdict", function (err) {
                done(err);
            });
        })
            // error check
            .isExisting('tr.message-item.error').then(function (error) {
            assert.ok(!error);
        })
            .isExisting('tr.message-item.syserror').then(function (error) {
            assert.ok(!error);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('play with custom dictionary word:3', function (done) {
        fs.mkdirSync(dirPath + "/userdict");
        var customDictPath = path.dirname(__dirname) + "/vendor/test/aq_dic_large";
        fs.writeFileSync(dirPath + "/userdict/aqdic.bin", fs.readFileSync(customDictPath + "/aqdic.bin"));
        fs.writeFileSync(dirPath + "/userdict/aq_user.dic", fs.readFileSync(customDictPath + "/aq_user.dic"));
        this.timeout(3000);
        return this.app.client
            .setValue('#source', '味方さん')
            .isEnabled('#play').then(function (isEnabled) {
            assert.ok(isEnabled);
        })
            .then(function () {
            rimraf(dirPath + "/userdict", function (err) {
                done(err);
            });
        })
            // error check
            .isExisting('tr.message-item.error').then(function (error) {
            assert.ok(!error);
        })
            .isExisting('tr.message-item.syserror').then(function (error) {
            assert.ok(!error);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('phont selection', function () {
        return this.app.client
            .elements('#phont option').then(function (response) {
            assert.equal(response.value.length, 26);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    // TODO initial
    // TODO save config
    // TODO delete config
    // TODO copy config
    // TODO filter
    it('voice config', function () {
        var voiceConfigLength = 999;
        return this.app.client
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
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    // TODO multivoice
    it('play', function () {
        return this.app.client
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
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    // TODO record
    //it('mainWindow play', () => {
    //});
    it('alwaysOnTop', function () {
        var app = this.app;
        return this.app.client
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
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('open help', function () {
        return this.app.client
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
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('open dictionary', function () {
        return this.app.client
            .click('#dictionary')
            .getWindowCount().then(function (count) {
            assert.equal(count, 2);
        })
            .windowByIndex(1)
            .getTitle().then(function (title) {
            assert.equal(title, 'MYukkuriVoice Dictionary Editor');
        })
            // error check
            .windowByIndex(0)
            .isExisting('tr.message-item.error').then(function (error) {
            assert.ok(!error);
        })
            .isExisting('tr.message-item.syserror').then(function (error) {
            assert.ok(!error);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('shortcut intro', function () {
        return this.app.client
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
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('tutorial intro', function () {
        return this.app.client
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
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('switchSettingsView', function () {
        return this.app.client
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
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
});
