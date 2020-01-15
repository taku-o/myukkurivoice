var gulp = gulp || require('gulp');
const execSync = require('child_process').execSync;
const flatAsync = require('electron-osx-sign').flatAsync;
const signAsync = require('electron-osx-sign').signAsync;

const ELECTRON_VERSION = require('./package.json').versions.electron;
const DEVELOPER_ID_APPLICATION_KEY = require('./build/mas/MacAppleStore.json').DEVELOPER_ID_APPLICATION_KEY;
const DEVELOPER_INSTALLER_3RD_KEY = require('./build/mas/MacAppleStore.json').DEVELOPER_INSTALLER_3RD_KEY;
const DEVELOPER_APPLICATION_3RD_KEY = require('./build/mas/MacAppleStore.json').DEVELOPER_APPLICATION_3RD_KEY;

// sign
gulp.task('_sign:developer', () => {
  const platform = process.env.BUILD_PLATFORM;
  const APP_PATH = `MYukkuriVoice-${platform}-x64/MYukkuriVoice.app`;
  const UNPACK_VENDOR_DIR = `${APP_PATH}/Contents/Resources/app.asar.unpacked/vendor`;

  return signAsync({
    app: APP_PATH,
    identity: DEVELOPER_ID_APPLICATION_KEY,
    binaries: [
      `${UNPACK_VENDOR_DIR}/AqKanji2Koe.framework/Versions/A/AqKanji2Koe`,
      `${UNPACK_VENDOR_DIR}/AqUsrDic.framework/Versions/A/AqUsrDic`,
      `${UNPACK_VENDOR_DIR}/AquesTalk10.framework/Versions/A/AquesTalk`,
      `${UNPACK_VENDOR_DIR}/AquesTalk2.framework/Versions/A/AquesTalk2`,
      `${UNPACK_VENDOR_DIR}/maquestalk1-ios`,
      `${UNPACK_VENDOR_DIR}/secret`,
      `${UNPACK_VENDOR_DIR}/AquesTalk.framework/Versions/A/AquesTalk`,
      `${UNPACK_VENDOR_DIR}/maquestalk1`,
    ],
    version: ELECTRON_VERSION,
    type: 'development',
    platform: platform,
  });
});

gulp.task('_sign:distribution', () => {
  const platform = process.env.BUILD_PLATFORM;
  const APP = 'MYukkuriVoice';
  const APP_PATH = `MYukkuriVoice-${platform}-x64/MYukkuriVoice.app`;
  const UNPACK_VENDOR_DIR = `${APP_PATH}/Contents/Resources/app.asar.unpacked/vendor`;

  return signAsync({
    app: APP_PATH,
    identity: DEVELOPER_APPLICATION_3RD_KEY,
    binaries: [
      `${APP_PATH}/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework`,
      `${APP_PATH}/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/libEGL.dylib`,
      `${APP_PATH}/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/libswiftshader_libEGL.dylib`,
      `${APP_PATH}/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/libGLESv2.dylib`,
      `${APP_PATH}/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/libswiftshader_libGLESv2.dylib`,
      `${APP_PATH}/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/libffmpeg.dylib`,
      `${APP_PATH}/Contents/Frameworks/Electron Framework.framework`,
      `${APP_PATH}/Contents/Frameworks/${APP} Helper (GPU).app/Contents/MacOS/${APP} Helper (GPU)`,
      `${APP_PATH}/Contents/Frameworks/${APP} Helper (GPU).app`,
      `${APP_PATH}/Contents/Frameworks/${APP} Helper (Plugin).app/Contents/MacOS/${APP} Helper (Plugin)`,
      `${APP_PATH}/Contents/Frameworks/${APP} Helper (Plugin).app`,
      `${APP_PATH}/Contents/Frameworks/${APP} Helper (Renderer).app/Contents/MacOS/${APP} Helper (Renderer)`,
      `${APP_PATH}/Contents/Frameworks/${APP} Helper (Renderer).app`,
      `${APP_PATH}/Contents/Frameworks/${APP} Helper.app/Contents/MacOS/${APP} Helper`,
      `${APP_PATH}/Contents/Frameworks/${APP} Helper.app`,
      `${UNPACK_VENDOR_DIR}/AqKanji2Koe.framework/Versions/A/AqKanji2Koe`,
      `${UNPACK_VENDOR_DIR}/AqKanji2Koe.framework`,
      `${UNPACK_VENDOR_DIR}/AqUsrDic.framework/Versions/A/AqUsrDic`,
      `${UNPACK_VENDOR_DIR}/AqUsrDic.framework`,
      `${UNPACK_VENDOR_DIR}/AquesTalk10.framework/Versions/A/AquesTalk`,
      `${UNPACK_VENDOR_DIR}/AquesTalk10.framework`,
      `${UNPACK_VENDOR_DIR}/AquesTalk2.framework/Versions/A/AquesTalk2`,
      `${UNPACK_VENDOR_DIR}/AquesTalk2.framework`,
      `${UNPACK_VENDOR_DIR}/maquestalk1-ios`,
      `${UNPACK_VENDOR_DIR}/secret`,
      //`${UNPACK_VENDOR_DIR}/AquesTalk.framework/Versions/A/AquesTalk`,
      //`${UNPACK_VENDOR_DIR}/AquesTalk.framework`,
      //`${UNPACK_VENDOR_DIR}/maquestalk1`,
    ],

    entitlements: 'build/mas/store.parent.plist',
    'entitlements-inherit': 'build/mas/store.child.plist',
    'gatekeeper-assess': false,
    version: ELECTRON_VERSION,
    type: 'distribution',
    platform: platform,
  });
});

// electron-osx-sign not using version.
gulp.task('_sign:distribution:direct', (cb) => {
  const platform = process.env.BUILD_PLATFORM;
  const APP_PATH = `MYukkuriVoice-${platform}-x64/MYukkuriVoice.app`;
  const FRAMEWORKS_PATH = `${APP_PATH}/Contents/Frameworks`;
  const UNPACK_VENDOR_DIR = `${APP_PATH}/Contents/Resources/app.asar.unpacked/vendor`;
  const APP = 'MYukkuriVoice';
  const CHILD_PLIST = 'build/mas/store.child.plist';
  const PARENT_PLIST = 'build/mas/store.parent.plist';
  const LOGINHELPER_PLIST = 'build/mas/store.loginhelper.plist';

  let child_list = [
    `${FRAMEWORKS_PATH}/Electron Framework.framework/Versions/A/Electron Framework`,
    `${FRAMEWORKS_PATH}/Electron Framework.framework/Versions/A/Libraries/libEGL.dylib`,
    `${FRAMEWORKS_PATH}/Electron Framework.framework/Versions/A/Libraries/libswiftshader_libEGL.dylib`,
    `${FRAMEWORKS_PATH}/Electron Framework.framework/Versions/A/Libraries/libGLESv2.dylib`,
    `${FRAMEWORKS_PATH}/Electron Framework.framework/Versions/A/Libraries/libswiftshader_libGLESv2.dylib`,
    `${FRAMEWORKS_PATH}/Electron Framework.framework/Versions/A/Libraries/libffmpeg.dylib`,
    `${FRAMEWORKS_PATH}/Electron Framework.framework`,
    `${FRAMEWORKS_PATH}/${APP} Helper (GPU).app/Contents/MacOS/${APP} Helper (GPU)`,
    `${FRAMEWORKS_PATH}/${APP} Helper (GPU).app`,
    `${FRAMEWORKS_PATH}/${APP} Helper (Plugin).app/Contents/MacOS/${APP} Helper (Plugin)`,
    `${FRAMEWORKS_PATH}/${APP} Helper (Plugin).app`,
    `${FRAMEWORKS_PATH}/${APP} Helper (Renderer).app/Contents/MacOS/${APP} Helper (Renderer)`,
    `${FRAMEWORKS_PATH}/${APP} Helper (Renderer).app`,
    `${FRAMEWORKS_PATH}/${APP} Helper.app/Contents/MacOS/${APP} Helper`,
    `${FRAMEWORKS_PATH}/${APP} Helper.app`,
    `${UNPACK_VENDOR_DIR}/AqKanji2Koe.framework/Versions/A/AqKanji2Koe`,
    `${UNPACK_VENDOR_DIR}/AqKanji2Koe.framework`,
    `${UNPACK_VENDOR_DIR}/AqUsrDic.framework/Versions/A/AqUsrDic`,
    `${UNPACK_VENDOR_DIR}/AqUsrDic.framework`,
    `${UNPACK_VENDOR_DIR}/AquesTalk10.framework/Versions/A/AquesTalk`,
    `${UNPACK_VENDOR_DIR}/AquesTalk10.framework`,
    `${UNPACK_VENDOR_DIR}/AquesTalk2.framework/Versions/A/AquesTalk2`,
    `${UNPACK_VENDOR_DIR}/AquesTalk2.framework`,
    `${UNPACK_VENDOR_DIR}/maquestalk1-ios`,
    `${UNPACK_VENDOR_DIR}/secret`,
    //`${UNPACK_VENDOR_DIR}/AquesTalk.framework/Versions/A/AquesTalk`,
    //`${UNPACK_VENDOR_DIR}/AquesTalk.framework`,
    //`${UNPACK_VENDOR_DIR}/maquestalk1`,
  ];
  let loginhelper_list = [
    `${APP_PATH}/Contents/Library/LoginItems/${APP} Login Helper.app/Contents/MacOS/${APP} Login Helper`,
    `${APP_PATH}/Contents/Library/LoginItems/${APP} Login Helper.app/`,
  ];
  let app_binary = `${APP_PATH}/Contents/MacOS/${APP}`;
  let app_top = `${APP_PATH}`;

  for (let i = 0; i < child_list.length; i++) {
    execSync(
      `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${child_list[i]}"`
    );
  }
  for (let i = 0; i < loginhelper_list.length; i++) {
    execSync(
      `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${LOGINHELPER_PLIST}" "${loginhelper_list[i]}"`
    );
  }
  execSync(
    `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${app_binary}"`
  );
  execSync(
    `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${PARENT_PLIST}" "${app_binary}"`
  );

  cb();
});

gulp.task('_flat:distribution', () => {
  const platform = process.env.BUILD_PLATFORM;
  const APP_PATH = `MYukkuriVoice-${platform}-x64/MYukkuriVoice.app`;
  const PKG_PATH = `MYukkuriVoice-${platform}-x64/MYukkuriVoice.pkg`;

  return flatAsync({
    app: APP_PATH,
    identity: DEVELOPER_INSTALLER_3RD_KEY,
    install: '/Applications',
    pkg: PKG_PATH,
    platform: platform,
  });
});
