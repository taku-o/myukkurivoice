'use strict';
import * as https from 'https';
const semver = require('semver');
var packagejson = require('./package.json');

export class Version implements yubo.IVersion {
  latestVersion: string;
  publishedAt: Date;
  currentVersion: string = packagejson.version;
  latestUrl: string = 'https://github.com/taku-o/myukkurivoice/releases/latest';

  hasLatest(): boolean {
    return semver.gt(this.latestVersion, this.currentVersion);
  }

  get() {
    var that = this;
    const options = {
      protocol: 'https:',
      host: 'api.github.com',
      path: '/repos/taku-o/myukkurivoice/releases/latest',
      method: 'GET',
      headers: {'User-Agent':'Mozilla/5.0'},
    };

    const promise = new Promise((resolve, reject) => {
      https.request(options, (response) => {
        // read api response
        response.setEncoding('utf8');
        let body = '';
        response.on('data', (chunk) => {
          body += chunk;
        });
      
        // parse response
        response.on('end', (response) => {
          response = JSON.parse(body);
          that.latestVersion = response.tag_name;
          that.publishedAt = response.published_at;
          resolve(that);
        });
      }).on('error', (e) => {
        reject(e);
      }).end();
    });
    return promise;
  }
}

declare var Promise: any;
