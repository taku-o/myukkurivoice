'use strict';
exports.__esModule = true;
var https = require("https");
var semver = require('semver');
var Version = /** @class */ (function () {
    function Version(repository, packagejson) {
        this.userAgent = 'Mozilla/5.0';
        this.isInitialized = false;
        this.currentVersion = packagejson.version;
        this.repository = repository;
        this.latestReleaseUrl = "https://github.com/" + repository + "/releases/latest";
    }
    Version.prototype.hasLatestVersion = function () {
        return semver.gt(this.latestVersion, this.currentVersion);
    };
    Version.prototype.pull = function () {
        var _this = this;
        //const that = this;
        var options = {
            protocol: 'https:',
            host: 'api.github.com',
            path: "/repos/" + this.repository + "/releases/latest",
            method: 'GET',
            headers: { 'User-Agent': this.userAgent }
        };
        var promise = new Promise(function (resolve, reject) {
            https.request(options, function (response) {
                // read api response
                var body = '';
                response.setEncoding('utf8');
                response.on('data', function (chunk) {
                    body += chunk;
                });
                // parse response
                response.once('end', function () {
                    var parsed = JSON.parse(body);
                    _this.latestVersion = parsed.tag_name;
                    _this.publishedAt = parsed.published_at;
                    _this.isInitialized = true;
                    resolve(_this);
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
