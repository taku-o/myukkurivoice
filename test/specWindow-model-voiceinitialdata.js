"use strict";
exports.__esModule = true;
var spectron_1 = require("spectron");
var assert = require("assert");
var temp = require("temp");
temp.track();
describe('specWindow-model-YVoiceInitialData', function () {
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
    it('YVoiceInitialData', function () {
        return this.client
            .click('#get-yvoice-initial-data')
            .getValue('#get-yvoice-initial-data-result').then(function (value) {
            var parsed = JSON.parse(value);
            assert.equal(parsed.length, 4);
            for (var i = 0; i < parsed.length; i++) {
                assert.ok('id' in parsed[i]);
                assert.ok('name' in parsed[i]);
                assert.ok('phont' in parsed[i]);
                assert.ok('version' in parsed[i]);
                assert.ok('speed' in parsed[i]);
                assert.ok('playbackRate' in parsed[i]);
                assert.ok('detune' in parsed[i]);
                assert.ok('volume' in parsed[i]);
                assert.ok('rhythmOn' in parsed[i]);
                assert.ok('writeMarginMs' in parsed[i]);
                assert.ok('sourceWrite' in parsed[i]);
                assert.ok('seqWrite' in parsed[i]);
                assert.equal('', parsed[i].seqWriteOptions.dir);
                assert.equal('', parsed[i].seqWriteOptions.prefix);
                var version = parsed[i].version;
                switch (version) {
                    case 'talk1':
                    case 'talk2':
                        break;
                    case 'talk10':
                        assert.ok('bas' in parsed[i]);
                        assert.ok('spd' in parsed[i]);
                        assert.ok('vol' in parsed[i]);
                        assert.ok('pit' in parsed[i]);
                        assert.ok('acc' in parsed[i]);
                        assert.ok('lmd' in parsed[i]);
                        assert.ok('fsc' in parsed[i]);
                        break;
                    default:
                        assert.fail('unknown version');
                }
            }
        })["catch"](function (err) {
            assert.fail(err.message);
        });
    });
});
