"use strict";
exports.__esModule = true;
var spectron_1 = require("spectron");
var assert = require("assert");
var temp = require("temp");
temp.track();
describe('specWindow-service-DataService', function () {
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
    it('load', function () {
        return this.client
            .click('#load')
            .waitForValue('#load-result', 2000)
            .getValue('#load-result').then(function (value) {
            assert.ok(value);
        })
            .getValue('#load-err').then(function (value) {
            assert.ok(!value);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('initialData', function () {
        return this.client
            .click('#initial-data')
            .getValue('#initial-data-result').then(function (value) {
            assert.ok(value);
            var parsed = JSON.parse(value);
            assert.equal(parsed.length, 4);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('create', function () {
        return this.client
            .click('#create')
            .getValue('#create-result').then(function (value) {
            assert.ok(value);
            var parsed = JSON.parse(value);
            assert.ok(parsed.id);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('copy', function () {
        return this.client
            .click('#copy')
            .getValue('#copy-result').then(function (value) {
            assert.ok(value);
            var parsed = JSON.parse(value);
            assert.ok(parsed.id);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    // TODO  save(dataList: yubo.YVoice[]): void;
    it('save', function () {
        return this.client
            .click('#copy')["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    // TODO  clear(): ng.IPromise<boolean>;
    it('clear', function () {
        return this.client
            .click('#copy')["catch"](function (err) {
            assert.fail(err.message);
        });
    });
});
