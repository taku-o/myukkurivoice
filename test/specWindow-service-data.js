"use strict";
exports.__esModule = true;
var spectron_1 = require("spectron");
var assert = require("assert");
var temp = require("temp");
temp.track();
var fs = require("fs");
describe('specWindow-service-DataService', function () {
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
    it('save', function () {
        return this.client
            .getValue('#save-data-result').then(function (value) {
            assert.equal('', value);
            var isExists = fs.existsSync(dirPath + "/data.json");
            assert.ok(!isExists);
        })
            .click('#save-data')
            .waitForValue('#save-data-result', 2000)
            .getValue('#save-data-result').then(function (value) {
            assert.equal('ok', value);
            var data = fs.readFileSync(dirPath + "/data.json");
            var parsed = JSON.parse(data.toString());
            assert.equal(parsed.length, 4);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
    it('clear', function () {
        return this.client
            // before test, save data
            .click('#save-data')
            .waitForValue('#save-data-result', 2000)
            .getValue('#save-data-result').then(function (value) {
            assert.equal('ok', value);
        })
            // test
            .getValue('#clear-result').then(function (value) {
            assert.equal('', value);
            var isExists = fs.existsSync(dirPath + "/data.json");
            assert.ok(isExists);
            var data = fs.readFileSync(dirPath + "/data.json");
            var parsed = JSON.parse(data.toString());
            assert.equal(parsed.length, 4);
        })
            .click('#clear')
            .waitForValue('#clear-result', 2000)
            .getValue('#clear-result').then(function (value) {
            assert.equal('ok', value);
            var isExists = fs.existsSync(dirPath + "/data.json");
            assert.ok(!isExists);
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
});
