const argv = require('yargs').argv;
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const gulp = require('gulp');
const runSequence = require('run-sequence');

const MAS_APP_PACKAGE_NAME = 'MYukkuriVoice-mas-x64';

const DEVELOPER_INSTALLER_3RD_KEY = require('./mas/MacAppleStore.json').DEVELOPER_INSTALLER_3RD_KEY;
const DEVELOPER_APPLICATION_3RD_KEY = require('./mas/MacAppleStore.json').DEVELOPER_APPLICATION_3RD_KEY;

// store
gulp.task('store', (cb) => {
  //if (argv && argv.branch) {
  //  cb('branch is selected');
  //  return;
  //}
  if (!(argv && argv.branch)) {
    argv.branch = execSync('/usr/bin/git symbolic-ref --short HEAD')
      .toString()
      .trim();
  }
  runSequence(
//    '_rm-workdir',
//    '_mk-workdir',
    '_ch-workdir',
//    '_git-clone',
    '_ch-repodir',
//    '_git-submodule',
//    '_npm-install',
//    'tsc',
//    '_rm-package',
//    '_package-release:store',
//    '_unpacked:store',
    '_codesign:store',
    '_open-appdir:store',
    '_notify',
    '_kill',
    (err) => {
      if (err) {
        gulp.start('_notifyError');
      }
      cb(err);
    }
  );
});

// codesign
gulp.task('_codesign:store', (cb) => {
  const platform = 'mas';
  const APP_PATH = `MYukkuriVoice-${platform}-x64/MYukkuriVoice.app`;
  const RESULT_PATH = `MYukkuriVoice-${platform}-x64/MYukkuriVoice.pkg`;
  const FRAMEWORKS_PATH=`${APP_PATH}/Contents/Frameworks`
  const APP="MYukkuriVoice"
  const CHILD_PLIST="mas/child.plist"
  const PARENT_PLIST="mas/parent.plist"
  const LOGINHELPER_PLIST="mas/loginhelper.plist"

  execSync(`/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${FRAMEWORKS_PATH}/Electron Framework.framework/Versions/A/Electron Framework"`);
  execSync(`/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${FRAMEWORKS_PATH}/Electron Framework.framework/Versions/A/Libraries/libffmpeg.dylib"`);
  execSync(`/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${FRAMEWORKS_PATH}/Electron Framework.framework/Versions/A/Libraries/libnode.dylib"`);
  execSync(`/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${FRAMEWORKS_PATH}/Electron Framework.framework"`);
  execSync(`/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${FRAMEWORKS_PATH}/${APP} Helper.app/Contents/MacOS/${APP} Helper"`);
  execSync(`/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${FRAMEWORKS_PATH}/${APP} Helper.app/"`);
  execSync(`/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${LOGINHELPER_PLIST}" "${APP_PATH}/Contents/Library/LoginItems/${APP} Login Helper.app/Contents/MacOS/${APP} Login Helper"`);
  execSync(`/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${LOGINHELPER_PLIST}" "${APP_PATH}/Contents/Library/LoginItems/${APP} Login Helper.app/"`);
  execSync(`/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${APP_PATH}/Contents/MacOS/${APP}"`);
  execSync(`/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${PARENT_PLIST}" "${APP_PATH}"`);
  execSync(`/usr/bin/productbuild --component "${APP_PATH}" /Applications --sign "${DEVELOPER_INSTALLER_3RD_KEY}" "${RESULT_PATH}"`);
  cb();
});

// open
gulp.task('_open-appdir:store', (cb) => {
  exec('open ' + MAS_APP_PACKAGE_NAME, (err, stdout, stderr) => {
    cb(err);
  });
});
