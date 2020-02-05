var gulp = gulp || require('gulp');
const execSync = require('child_process').execSync;
const flatAsync = require('electron-osx-sign').flatAsync;
const keychain = require('keychain');
const notarize = require('electron-notarize').notarize;
const signAsync = require('electron-osx-sign').signAsync;

const ELECTRON_VERSION = require('./package.json').versions.electron;
const DEVELOPER_ID_APPLICATION_KEY = require('./build/mas/MacAppleStore.json').DEVELOPER_ID_APPLICATION_KEY;
const DEVELOPER_INSTALLER_3RD_KEY = require('./build/mas/MacAppleStore.json').DEVELOPER_INSTALLER_3RD_KEY;
const DEVELOPER_APPLICATION_3RD_KEY = require('./build/mas/MacAppleStore.json').DEVELOPER_APPLICATION_3RD_KEY;
const DEVELOPER_APPLE_ID = require('./build/mas/MacAppleStore.json').DEVELOPER_APPLE_ID;

// sign
//gulp.task('_sign:developer', () => {
//  const platform = process.env.BUILD_PLATFORM;
//  const APP_PATH = `MYukkuriVoice-${platform}-x64/MYukkuriVoice.app`;
//  const UNPACK_VENDOR_DIR = `${APP_PATH}/Contents/Resources/app.asar.unpacked/vendor`;
//
//  return signAsync({
//    app: APP_PATH,
//    identity: DEVELOPER_ID_APPLICATION_KEY,
//    binaries: [
//      `${UNPACK_VENDOR_DIR}/AqKanji2Koe.framework/Versions/A/AqKanji2Koe`,
//      `${UNPACK_VENDOR_DIR}/AqUsrDic.framework/Versions/A/AqUsrDic`,
//      `${UNPACK_VENDOR_DIR}/AquesTalk10.framework/Versions/A/AquesTalk`,
//      `${UNPACK_VENDOR_DIR}/AquesTalk2.framework/Versions/A/AquesTalk2`,
//      `${UNPACK_VENDOR_DIR}/maquestalk1-ios`,
//      `${UNPACK_VENDOR_DIR}/secret`,
//      `${UNPACK_VENDOR_DIR}/AquesTalk.framework/Versions/A/AquesTalk`,
//      `${UNPACK_VENDOR_DIR}/maquestalk1`,
//    ],
//    version: ELECTRON_VERSION,
//    type: 'development',
//    platform: platform,
//  });
//});
gulp.task('_sign:developer:direct', (cb) => {
  const platform = process.env.BUILD_PLATFORM;
  const APP_PATH = `MYukkuriVoice-${platform}-x64/MYukkuriVoice.app`;
  const FRAMEWORKS_PATH = `${APP_PATH}/Contents/Frameworks`;
  const UNPACK_VENDOR_DIR = `${APP_PATH}/Contents/Resources/app.asar.unpacked/vendor`;
  const APP = 'MYukkuriVoice';
  const CHILD_PLIST = 'build/mas/darwin.app-child.plist';
  const PARENT_PLIST = 'build/mas/darwin.app.plist';
  const identity = DEVELOPER_ID_APPLICATION_KEY;

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
  ];
  let opt_framework_list = [
    `${FRAMEWORKS_PATH}/Mantle.framework/Mantle`,
    `${FRAMEWORKS_PATH}/Mantle.framework/Versions/A`,
    `${FRAMEWORKS_PATH}/ReactiveCocoa.framework/ReactiveCocoa`,
    `${FRAMEWORKS_PATH}/ReactiveCocoa.framework/Versions/A`,
    `${FRAMEWORKS_PATH}/Squirrel.framework/Squirrel`,
    `${FRAMEWORKS_PATH}/Squirrel.framework/Versions/A`,
  ];
  let exe_list = [
    `${UNPACK_VENDOR_DIR}/maquestalk1-ios`,
    `${UNPACK_VENDOR_DIR}/secret`,
    `${UNPACK_VENDOR_DIR}/maquestalk1`,
  ];
  let exe_child_list = [
    `${UNPACK_VENDOR_DIR}/AquesTalk.framework/Versions/A/AquesTalk`,
    `${UNPACK_VENDOR_DIR}/AquesTalk.framework`,
  ];
  let app_binary = `${APP_PATH}/Contents/MacOS/${APP}`;
  let app_top = `${APP_PATH}`;

  for (let i = 0; i < child_list.length; i++) {
    execSync(
      `/usr/bin/codesign --options runtime --timestamp -s "${identity}" -f --entitlements "${CHILD_PLIST}" "${child_list[i]}"`
    );
  }
  for (let i = 0; i < opt_framework_list.length; i++) {
    execSync(
      `/usr/bin/codesign --deep --options runtime --timestamp -s "${identity}" -f --entitlements "${CHILD_PLIST}" "${opt_framework_list[i]}"`
    );
  }
  for (let i = 0; i < exe_child_list.length; i++) {
    execSync(`/usr/bin/codesign --options runtime --timestamp -s "${identity}" -f "${exe_child_list[i]}"`);
  }
  for (let i = 0; i < exe_list.length; i++) {
    execSync(`/usr/bin/codesign --options runtime --timestamp -s "${identity}" -f "${exe_list[i]}"`);
  }
  execSync(
    `/usr/bin/codesign --options runtime --timestamp -s "${identity}" -f --entitlements "${CHILD_PLIST}" "${app_binary}"`
  );
  execSync(
    `/usr/bin/codesign --options runtime --timestamp -s "${identity}" -f --entitlements "${PARENT_PLIST}" "${app_binary}"`
  );

  cb();
});

gulp.task('_sign:distribution:direct', (cb) => {
  const platform = process.env.BUILD_PLATFORM;
  const APP_PATH = `MYukkuriVoice-${platform}-x64/MYukkuriVoice.app`;
  const FRAMEWORKS_PATH = `${APP_PATH}/Contents/Frameworks`;
  const UNPACK_VENDOR_DIR = `${APP_PATH}/Contents/Resources/app.asar.unpacked/vendor`;
  const APP = 'MYukkuriVoice';
  const APP_PLIST = 'build/mas/store.app.plist';
  const APP_CHILD_PLIST = 'build/mas/store.app-child.plist';
  const EXE_PLIST = 'build/mas/store.exe.plist';
  const LOGINHELPER_PLIST = 'build/mas/store.loginhelper.plist';
  const identity = DEVELOPER_APPLICATION_3RD_KEY;

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
  ];
  let exe_list = [
    `${UNPACK_VENDOR_DIR}/maquestalk1-ios`,
    `${UNPACK_VENDOR_DIR}/secret`,
    //`${UNPACK_VENDOR_DIR}/maquestalk1`,
    //`${UNPACK_VENDOR_DIR}/AquesTalk.framework/Versions/A/AquesTalk`,
    //`${UNPACK_VENDOR_DIR}/AquesTalk.framework`,
  ];
  let loginhelper_list = [
    `${APP_PATH}/Contents/Library/LoginItems/${APP} Login Helper.app/Contents/MacOS/${APP} Login Helper`,
    `${APP_PATH}/Contents/Library/LoginItems/${APP} Login Helper.app/`,
  ];
  let app_binary = `${APP_PATH}/Contents/MacOS/${APP}`;
  let app_top = `${APP_PATH}`;

  for (let i = 0; i < child_list.length; i++) {
    execSync(`/usr/bin/codesign -s "${identity}" -f --entitlements "${APP_CHILD_PLIST}" "${child_list[i]}"`);
  }
  for (let i = 0; i < exe_list.length; i++) {
    execSync(`/usr/bin/codesign -s "${identity}" -f --entitlements "${EXE_PLIST}" "${exe_list[i]}"`);
  }
  for (let i = 0; i < loginhelper_list.length; i++) {
    execSync(`/usr/bin/codesign -s "${identity}" -f --entitlements "${LOGINHELPER_PLIST}" "${loginhelper_list[i]}"`);
  }
  execSync(`/usr/bin/codesign -s "${identity}" -f --entitlements "${APP_CHILD_PLIST}" "${app_binary}"`);
  execSync(`/usr/bin/codesign -s "${identity}" -f --entitlements "${APP_PLIST}" "${app_binary}"`);

  cb();
});

gulp.task('_flat:distribution', () => {
  const platform = process.env.BUILD_PLATFORM;
  const APP_PATH = `MYukkuriVoice-${platform}-x64/MYukkuriVoice.app`;
  const PKG_PATH = `MYukkuriVoice-${platform}-x64/MYukkuriVoice.pkg`;
  const identity = DEVELOPER_INSTALLER_3RD_KEY;

  return flatAsync({
    app: APP_PATH,
    identity: identity,
    install: '/Applications',
    pkg: PKG_PATH,
    platform: platform,
  });
});

// notarize
gulp.task('_appleIdPass', (cb) => {
  const appleId = DEVELOPER_APPLE_ID;
  const keychainEntry = 'jp.nanasi.myukkurivoice.mac-app-store';

  keychain.getPassword({account: appleId, service: keychainEntry}, (err, pass) => {
    if (err) {
      cb(err);
      return;
    }
    const env = process.env;
    env.AC_PASSWORD = pass;
    cb();
  });
});
gulp.task(
  '_notarize',
  gulp.series('_appleIdPass', () => {
    const platform = process.env.BUILD_PLATFORM;
    const APP_PATH = `MYukkuriVoice-${platform}-x64/MYukkuriVoice.app`;
    const bundleId = 'jp.nanasi.myukkurivoice';
    const teamId = '52QJ97GWTE';

    const appleId = DEVELOPER_APPLE_ID;
    const env = process.env;
    const password = env.AC_PASSWORD;

    return notarize({
      appBundleId: bundleId,
      appPath: APP_PATH,
      appleId: appleId,
      appleIdPassword: password,
      ascProvider: teamId,
    });
  })
);

// verify sign
gulp.task('_verify:sign', (cb) => {
  const platform = process.env.BUILD_PLATFORM;
  const APP_PATH = `release/myukkurivoice/MYukkuriVoice-${platform}-x64/MYukkuriVoice.app`;
  execSync(`/usr/bin/codesign -vvvv -d "${APP_PATH}"`);
  execSync(`/usr/sbin/spctl --assess -vvvv "${APP_PATH}"`);
  cb();
});
gulp.task('verify:release', gulp.series('_handleError', '_platform:darwin', '_target:release', '_verify:sign'));
gulp.task('verify:store', gulp.series('_handleError', '_platform:mas', '_target:store', '_verify:sign'));
