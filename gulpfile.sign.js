var gulp = gulp || require('gulp');
const signAsync = require('electron-osx-sign').signAsync;
const ELECTRON_VERSION = require('./package.json').versions.electron;

// sign
gulp.task('sign:developer', () => {
  const platform = 'darwin';
  const APP_PATH = `MYukkuriVoice-${platform}-x64/MYukkuriVoice.app`;

  return signAsync({
    app: APP_PATH,
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

gulp.task('sign:distribution', () => {
  const platform = 'mas';
  const APP_PATH = `MYukkuriVoice-${platform}-x64/MYukkuriVoice.app`;
  const UNPACK_VENDOR_DIR = `${APP_PATH}/Contents/Resources/app.asar.unpacked/vendor`;

  return signAsync({
    app: APP_PATH,
    binaries: [
      `${UNPACK_VENDOR_DIR}/AqKanji2Koe.framework/Versions/A/AqKanji2Koe`,
      `${UNPACK_VENDOR_DIR}/AqUsrDic.framework/Versions/A/AqUsrDic`,
      `${UNPACK_VENDOR_DIR}/AquesTalk10.framework/Versions/A/AquesTalk`,
      `${UNPACK_VENDOR_DIR}/AquesTalk2.framework/Versions/A/AquesTalk2`,
      `${UNPACK_VENDOR_DIR}/maquestalk1-ios`,
      `${UNPACK_VENDOR_DIR}/secret`,
      //`${UNPACK_VENDOR_DIR}/AquesTalk.framework/Versions/A/AquesTalk`,
      //`${UNPACK_VENDOR_DIR}/maquestalk1`,
    ],
    entitlements: 'build/mas/store.parent.plist',
    'entitlements-inherit': 'build/mas/store.child.plist',
    version: ELECTRON_VERSION,
    type: 'distribution',
    platform: platform,
  });
});













const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

const DEVELOPER_ID_APPLICATION_KEY = require('./build/mas/MacAppleStore.json').DEVELOPER_ID_APPLICATION_KEY;
const DEVELOPER_INSTALLER_3RD_KEY = require('./build/mas/MacAppleStore.json').DEVELOPER_INSTALLER_3RD_KEY;
const DEVELOPER_APPLICATION_3RD_KEY = require('./build/mas/MacAppleStore.json').DEVELOPER_APPLICATION_3RD_KEY;

// codesign
gulp.task('_codesign', (cb) => {
  const platform = 'darwin';
  const APP_PATH = `MYukkuriVoice-${platform}-x64/MYukkuriVoice.app`;
  exec(
    '/usr/bin/codesign' +
      ` -s "${DEVELOPER_ID_APPLICATION_KEY}" \
        --deep \
        --keychain "/Users/${process.env.USER}/Library/Keychains/login.keychain" \
        ${APP_PATH}`,
    (err, stdout, stderr) => {
      cb(err);
    }
  );
});

gulp.task('_codesign:store', (cb) => {
  const platform = 'mas';
  const APP_PATH = `MYukkuriVoice-${platform}-x64/MYukkuriVoice.app`;
  const RESULT_PATH = `MYukkuriVoice-${platform}-x64/MYukkuriVoice.pkg`;
  const FRAMEWORKS_PATH = `${APP_PATH}/Contents/Frameworks`;
  const UNPACK_VENDOR_DIR = `${APP_PATH}/Contents/Resources/app.asar.unpacked/vendor`;
  const APP = 'MYukkuriVoice';
  const CHILD_PLIST = 'build/mas/store.child.plist';
  const PARENT_PLIST = 'build/mas/store.parent.plist';
  const LOGINHELPER_PLIST = 'build/mas/store.loginhelper.plist';

  execSync(
    `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${FRAMEWORKS_PATH}/Electron Framework.framework/Versions/A/Electron Framework"`
  );
  execSync(
    `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${FRAMEWORKS_PATH}/Electron Framework.framework/Versions/A/Libraries/libffmpeg.dylib"`
  );
  execSync(
    `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${FRAMEWORKS_PATH}/Electron Framework.framework/Versions/A/Libraries/libnode.dylib"`
  );
  execSync(
    `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${FRAMEWORKS_PATH}/Electron Framework.framework"`
  );
  execSync(
    `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${FRAMEWORKS_PATH}/${APP} Helper.app/Contents/MacOS/${APP} Helper"`
  );
  execSync(
    `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${FRAMEWORKS_PATH}/${APP} Helper.app/"`
  );

  execSync(
    `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${UNPACK_VENDOR_DIR}/AqKanji2Koe.framework/Versions/A/AqKanji2Koe"`
  );
  execSync(
    `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${UNPACK_VENDOR_DIR}/AqUsrDic.framework/Versions/A/AqUsrDic"`
  );
  //execSync(
  //  `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${UNPACK_VENDOR_DIR}/AquesTalk.framework/Versions/A/AquesTalk"`
  //);
  execSync(
    `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${UNPACK_VENDOR_DIR}/AquesTalk10.framework/Versions/A/AquesTalk"`
  );
  execSync(
    `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${UNPACK_VENDOR_DIR}/AquesTalk2.framework/Versions/A/AquesTalk2"`
  );
  //execSync(
  //  `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${UNPACK_VENDOR_DIR}/maquestalk1"`
  //);
  execSync(
    `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${UNPACK_VENDOR_DIR}/maquestalk1-ios"`
  );
  execSync(
    `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${UNPACK_VENDOR_DIR}/secret"`
  );

  execSync(
    `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${LOGINHELPER_PLIST}" "${APP_PATH}/Contents/Library/LoginItems/${APP} Login Helper.app/Contents/MacOS/${APP} Login Helper"`
  );
  execSync(
    `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${LOGINHELPER_PLIST}" "${APP_PATH}/Contents/Library/LoginItems/${APP} Login Helper.app/"`
  );
  execSync(
    `/usr/bin/codesign --deep -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${APP_PATH}/Contents/MacOS/${APP}"`
  );
  execSync(`/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${PARENT_PLIST}" "${APP_PATH}"`);

  execSync(
    `/usr/bin/productbuild --component "${APP_PATH}" /Applications --sign "${DEVELOPER_INSTALLER_3RD_KEY}" "${RESULT_PATH}"`
  );
  cb();
});
