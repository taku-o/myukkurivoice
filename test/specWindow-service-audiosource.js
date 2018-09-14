"use strict";
exports.__esModule = true;
var spectron_1 = require("spectron");
var assert = require("assert");
var temp = require("temp");
temp.track();
describe('specWindow-service-AudioSourceService', function () {
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
    it('sourceFname', function () {
        return this.client
            // sourceFname
            .setValue('#wav-file-path', '/tmp/_myukkurivoice_hogehoge.wav')
            .click('#source-fname')
            .getValue('#source-fname-result').then(function (value) {
            assert.equal(value, '/tmp/_myukkurivoice_hogehoge.txt');
        })["catch"](function (err) {
            assert.fail(err.message);
        });
        // TODO tmp file
        // TODO file exists
        // TODO file content
    });
    // TODO save(filePath: string, sourceText: string): ng.IPromise<string>;
    it('save', function () {
        return this.client
            // save
            .setValue('#file-path', '/tmp/_myukkurivoice_hogehoge.txt')["catch"](function (err) {
            assert.fail(err.message);
        });
        // TODO tmp file
        // TODO file exists
        // TODO file content
    });
});
