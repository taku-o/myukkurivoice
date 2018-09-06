github-version-compare -- npm module to get, and to compare latest version and current version.
===========================================

## Description

compare package.json version (current app version), and 
GitHub latest release tag version (latest version).

## Install

```bash
npm install --save github-version-compare
````

## Usage

As a node module:

```js
const compare = require('github-version-compare');
const repository = 'taku-o/github-version-compare';

const packagejson = require('./package.json');

const version = new compare.Version(repository, packagejson);
version.pull().then(function(version) {
  if (version.hasLatestVersion()) {
    // this version is old.
    const latestVersion    = version.latestVersion;
    const currentVersion   = version.currentVersion;
    const publishedAt      = version.publishedAt;
    const latestReleaseUrl = version.latestReleaseUrl;

    // update application version

  } else {
    // this version is latest.
  }
})
.catch(function(err) {
  // error
  // for example internet connection error.
});

```

use module for electron version check dialog:

```js
const compare = require('github-version-compare');
const log = require("electron-log");

const packagejson = require('./package.json');
const repository = 'taku-o/github-version-compare';
const electron = require('electron');

function showVersionDialog() {
  const version = new compare.Version(repository, packagejson);
  version.pull().then(function(version) {
    const message = version.hasLatest()? 'new version is found.': 'current version is latest';
    const buttons = version.hasLatest()? ['CLOSE', 'Open Release Page']: ['OK'];

    const dialogOptions = {
      type: 'info',
      title: 'application version check.',
      message: message,
      buttons: buttons,
      defaultId: 0,
    };
    const btnId: number = dialog.showMessageBox(dialogOptions);
    if (btnId == 1) {
      // open release page.
      electron.shell.openExternal(version.latestUrl);
    }
  })
  .catch((err: Error) => {
    log.error(err);
  });
}
```

