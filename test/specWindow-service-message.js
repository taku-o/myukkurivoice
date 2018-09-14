"use strict";
exports.__esModule = true;
var spectron_1 = require("spectron");
var assert = require("assert");
var temp = require("temp");
temp.track();
describe('specWindow-service-MessageService', function () {
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
    it('action', function () {
        return this.client
            .setValue('#message-service-post', '')
            .click('#action')
            .waitForValue('#message-service-post', 5000)
            .getValue('#message-service-post').then(function (value) {
            var parsed = JSON.parse(value);
            assert.ok(parsed.created);
            assert.equal('action message', parsed.body);
            assert.equal('action', parsed.type);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('record', function () {
        return this.client
            .setValue('#message-service-post', '')
            .setValue('#last-wav-file', '')
            .click('#record')
            // event on message
            .waitForValue('#message-service-post', 5000)
            .getValue('#message-service-post').then(function (value) {
            var parsed = JSON.parse(value);
            assert.ok(parsed.created);
            assert.equal('record message', parsed.body);
            assert.equal('record', parsed.type);
            assert.equal('/tmp/hoge.txt', parsed.wavFilePath);
            assert.equal('hoge.txt', parsed.wavFileName);
        })
            // event on wavGenerated
            .waitForValue('#last-wav-file', 5000)
            .getValue('#last-wav-file').then(function (value) {
            var parsed = JSON.parse(value);
            assert.ok(parsed.created);
            assert.equal('record message', parsed.body);
            assert.equal('record', parsed.type);
            assert.equal('/tmp/hoge.txt', parsed.wavFilePath);
            assert.equal('hoge.txt', parsed.wavFileName);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('info', function () {
        return this.client
            .setValue('#message-service-post', '')
            .click('#info')
            .waitForValue('#message-service-post', 5000)
            .getValue('#message-service-post').then(function (value) {
            var parsed = JSON.parse(value);
            assert.ok(parsed.created);
            assert.equal('info message', parsed.body);
            assert.equal('info', parsed.type);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('error', function () {
        return this.client
            // with error
            .setValue('#message-service-post', '')
            .click('#error')
            .waitForValue('#message-service-post', 5000)
            .getValue('#message-service-post').then(function (value) {
            var parsed = JSON.parse(value);
            assert.ok(parsed.created);
            assert.equal('error message' + 'err', parsed.body);
            assert.equal('error', parsed.type);
        })
            // with no error
            .setValue('#message-service-post', '')
            .click('#error-null')
            .waitForValue('#message-service-post', 5000)
            .getValue('#message-service-post').then(function (value) {
            var parsed = JSON.parse(value);
            assert.ok(parsed.created);
            assert.equal('error message', parsed.body);
            assert.equal('error', parsed.type);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('syserror', function () {
        return this.client
            // with error
            .setValue('#message-service-post', '')
            .click('#syserror')
            .waitForValue('#message-service-post', 5000)
            .getValue('#message-service-post').then(function (value) {
            var parsed = JSON.parse(value);
            assert.ok(parsed.created);
            assert.equal('syserror message' + 'err', parsed.body);
            assert.equal('syserror', parsed.type);
        })
            // with no error
            .setValue('#message-service-post', '')
            .click('#syserror-null')
            .waitForValue('#message-service-post', 5000)
            .getValue('#message-service-post').then(function (value) {
            var parsed = JSON.parse(value);
            assert.ok(parsed.created);
            assert.equal('syserror message', parsed.body);
            assert.equal('syserror', parsed.type);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
});
