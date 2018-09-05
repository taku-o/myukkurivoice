'use strict';
exports.__esModule = true;
var https = require("https");
var semver = require('semver');
var packagejson = require('./package.json');
var Version = /** @class */ (function () {
    function Version() {
        this.currentVersion = packagejson.version;
        this.latestUrl = 'https://github.com/taku-o/myukkurivoice/releases/latest';
    }
    Version.prototype.hasLatest = function () {
        return semver.gt(this.latestVersion, this.currentVersion);
    };
    Version.prototype.get = function () {
        var that = this;
        var options = {
            protocol: 'https:',
            host: 'api.github.com',
            path: '/repos/taku-o/myukkurivoice/releases/latest',
            method: 'GET',
            headers: { 'User-Agent': 'Mozilla/5.0' }
        };
        var promise = new Promise(function (resolve, reject) {
            https.request(options, function (response) {
                // read api response
                response.setEncoding('utf8');
                var body = '';
                response.on('data', function (chunk) {
                    body += chunk;
                });
                // parse response
                response.on('end', function (response) {
                    response = JSON.parse(body);
                    that.latestVersion = response.tag_name;
                    that.publishedAt = response.published_at;
                    resolve(that);
                });
            }).on('error', function (e) {
                reject(e);
            }).end();
        });
        return promise;
    };
    return Version;
}());
exports.Version = Version;
