const __root = require('path').join(__dirname, '../../');

module.exports = {
  packageJson: require(`${__root}/package.json`),
  cmd: {
    electron: `${__root}/node_modules/.bin/electron`,
    electronPackager: `${__root}/node_modules/.bin/electron-packager`,
  },
  dir: {
    rootDir: __root,
    workDir: `${__root}/release`,
    repoDir: `${__root}/release/myukkurivoice`,
  },
  mas: {
    DEVELOPER_ID_APPLICATION_KEY: require(`${__root}/build/mas/MacAppleStore.json`).DEVELOPER_ID_APPLICATION_KEY,
    DEVELOPER_INSTALLER_3RD_KEY: require(`${__root}/build/mas/MacAppleStore.json`).DEVELOPER_INSTALLER_3RD_KEY,
    DEVELOPER_APPLICATION_3RD_KEY: require(`${__root}/build/mas/MacAppleStore.json`).DEVELOPER_APPLICATION_3RD_KEY,
    DEVELOPER_APPLE_ID: require(`${__root}/build/mas/MacAppleStore.json`).DEVELOPER_APPLE_ID,
  },
};
