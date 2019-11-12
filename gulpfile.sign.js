var gulp = gulp || require('gulp');
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
    `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${APP_PATH}/Contents/Resources/app.asar.unpacked/vendor/AqKanji2Koe.framework/Versions/A/AqKanji2Koe"`
  );
  execSync(
    `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${APP_PATH}/Contents/Resources/app.asar.unpacked/vendor/AqUsrDic.framework/Versions/A/AqUsrDic"`
  );
  //execSync(
  //  `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${APP_PATH}/Contents/Resources/app.asar.unpacked/vendor/AquesTalk.framework/Versions/A/AquesTalk"`
  //);
  execSync(
    `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${APP_PATH}/Contents/Resources/app.asar.unpacked/vendor/AquesTalk10.framework/Versions/A/AquesTalk"`
  );
  execSync(
    `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${APP_PATH}/Contents/Resources/app.asar.unpacked/vendor/AquesTalk2.framework/Versions/A/AquesTalk2"`
  );
  //execSync(
  //  `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${APP_PATH}/Contents/Resources/app.asar.unpacked/vendor/maquestalk1"`
  //);
  execSync(
    `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${APP_PATH}/Contents/Resources/app.asar.unpacked/vendor/maquestalk1-ios"`
  );
  execSync(
    `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${APP_PATH}/Contents/Resources/app.asar.unpacked/vendor/secret"`
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
