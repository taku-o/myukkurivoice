"use strict";
var _this = this;
exports.__esModule = true;
var spectron_1 = require("spectron");
var assert = require("assert");
var temp = require("temp");
temp.track();
describe('specWindow-model-YPhontList', function () {
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
    it('YPhontList', function () {
        return _this.client
            .click('#getYPhontList')
            .getValue('#getYPhontList-result').then(function (value) {
            var parsed = JSON.parse(value);
            assert.equal(parsed.length, 26);
            for (var i = 0; i < parsed.length; i++) {
                var version = parsed[i].version;
                switch (version) {
                    case 'talk1':
                        assert.ok(parsed[i].id);
                        assert.ok(parsed[i].name);
                        assert.ok('idVoice' in parsed[i]);
                        break;
                    case 'talk2':
                        assert.ok(parsed[i].id);
                        assert.ok(parsed[i].name);
                        assert.ok(parsed[i].path);
                        break;
                    case 'talk10':
                        assert.ok(parsed[i].id);
                        assert.ok(parsed[i].name);
                        assert.ok('bas' in parsed[i].struct);
                        assert.ok('spd' in parsed[i].struct);
                        assert.ok('vol' in parsed[i].struct);
                        assert.ok('pit' in parsed[i].struct);
                        assert.ok('acc' in parsed[i].struct);
                        assert.ok('lmd' in parsed[i].struct);
                        assert.ok('fsc' in parsed[i].struct);
                        break;
                    default:
                        assert.fail('unknown version');
                }
            }
        });
    });
});
