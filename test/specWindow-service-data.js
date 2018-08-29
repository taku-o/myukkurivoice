"use strict";
var _this = this;
exports.__esModule = true;
var spectron_1 = require("spectron");
var assert = require("assert");
var temp = require("temp");
temp.track();
describe('specWindow-service-DataService', function () {
    _this.timeout(10000);
    before(function () {
        var fsprefix = '_myubo_test' + Date.now().toString(36);
        var dirPath = temp.mkdirSync(fsprefix);
        _this.app = new spectron_1.Application({
            path: 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/MacOS/MYukkuriVoice',
            env: { DEBUG: 1, NODE_ENV: 'test', userData: dirPath }
        });
        return _this.app.start();
    });
    after(function () {
        if (_this.app && _this.app.isRunning()) {
            return _this.app.stop();
        }
    });
    beforeEach(function () {
        _this.client = _this.app.client;
        return _this.client
            .click('#show-spec-window')
            .windowByIndex(1);
    });
    afterEach(function () {
        return _this.client.close();
    });
    it('DataService', function () {
        return _this.client
            // load
            .click('#load')
            .waitForValue('#load-result', 2000)
            .getValue('#load-result').then(function (value) {
            assert.ok(value);
        })
            .getValue('#load-err').then(function (value) {
            assert.ok(!value);
        })
            // initialData
            .click('#initial-data')
            .getValue('#initial-data-result').then(function (value) {
            assert.ok(value);
            var parsed = JSON.parse(value);
            assert.equal(parsed.length, 4);
        })
            // create
            .click('#create')
            .getValue('#create-result').then(function (value) {
            assert.ok(value);
            var parsed = JSON.parse(value);
            assert.ok(parsed.id);
        })
            // copy
            .click('#copy')
            .getValue('#copy-result').then(function (value) {
            assert.ok(value);
            var parsed = JSON.parse(value);
            assert.ok(parsed.id);
        });
    });
});
