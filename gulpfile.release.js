const argv = require('yargs').argv;
const ehandler = require('gulp-task-err-handler');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const git = require('gulp-git');
const gulp = require('gulp');
const install = require('gulp-install');
const mkdirp = require('mkdirp');
const path = require('path');
const rimraf = require('rimraf');

const WORK_DIR = path.join(__dirname, './release');
const WORK_REPO_DIR = path.join(__dirname, './release/myukkurivoice');
const APP_PACKAGE_NAME = 'MYukkuriVoice-darwin-x64';
const MAS_APP_PACKAGE_NAME = 'MYukkuriVoice-mas-x64';

const DEVELOPER_ID_APPLICATION_KEY = require('./mas/MacAppleStore.json').DEVELOPER_ID_APPLICATION_KEY;
const DEVELOPER_INSTALLER_3RD_KEY = require('./mas/MacAppleStore.json').DEVELOPER_INSTALLER_3RD_KEY;
const DEVELOPER_APPLICATION_3RD_KEY = require('./mas/MacAppleStore.json').DEVELOPER_APPLICATION_3RD_KEY;

function _mustMasterBranch(cb) {
  if (argv && argv.branch) {
    throw new Error('branch is selected');
  }
  return cb();
}
function _detectBranch(cb) {
  if (!(argv && argv.branch)) {
    argv.branch = execSync('/usr/bin/git symbolic-ref --short HEAD')
      .toString()
      .trim();
  }
  return cb();
}

// workdir
gulp.task('_rm-workdir', (cb) => {
  rimraf(WORK_DIR, (err) => {
    cb(err);
  });
});
gulp.task('_mk-workdir', (cb) => {
  mkdirp(WORK_DIR, (err) => {
    cb(err);
  });
});
gulp.task('_ch-workdir', (cb) => {
  process.chdir(WORK_DIR);
  return cb();
});

// git
gulp.task('_git-clone', (cb) => {
  const opts = argv && argv.branch ? {args: '-b ' + argv.branch} : {args: '-b master'};
  git.clone('git@github.com:taku-o/myukkurivoice.git', opts, (err) => {
    cb(err);
  });
});
gulp.task('_git-submodule', (cb) => {
  git.updateSubmodule({args: '--init'}, cb);
});

// repodir
gulp.task('_ch-repodir', (cb) => {
  process.chdir(WORK_REPO_DIR);
  return cb();
});

// npm
gulp.task('_npm-install', (cb) => {
  gulp
    .src(['./package.json'])
    .pipe(gulp.dest('./'))
    .pipe(
      install(
        {
          npm: '--production',
        },
        cb
      )
    );
});

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
  const CHILD_PLIST = 'mas/child.plist';
  const PARENT_PLIST = 'mas/parent.plist';
  const LOGINHELPER_PLIST = 'mas/loginhelper.plist';

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
  execSync(
    `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${APP_PATH}/Contents/Resources/app.asar.unpacked/vendor/AquesTalk.framework/Versions/A/AquesTalk"`
  );
  execSync(
    `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${APP_PATH}/Contents/Resources/app.asar.unpacked/vendor/AquesTalk10.framework/Versions/A/AquesTalk"`
  );
  execSync(
    `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${APP_PATH}/Contents/Resources/app.asar.unpacked/vendor/AquesTalk2.framework/Versions/A/AquesTalk2"`
  );
  execSync(
    `/usr/bin/codesign -s "${DEVELOPER_APPLICATION_3RD_KEY}" -f --entitlements "${CHILD_PLIST}" "${APP_PATH}/Contents/Resources/app.asar.unpacked/vendor/maquestalk1"`
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

// zip
gulp.task('_zip-app', (cb) => {
  exec(
    'ditto -c -k --sequesterRsrc --keepParent ' + APP_PACKAGE_NAME + ' ' + APP_PACKAGE_NAME + '-nosigned.zip',
    (err, stdout, stderr) => {
      cb(err);
    }
  );
});
gulp.task('_zip-app-signed', (cb) => {
  exec(
    'ditto -c -k --sequesterRsrc --keepParent ' + APP_PACKAGE_NAME + ' ' + APP_PACKAGE_NAME + '.zip',
    (err, stdout, stderr) => {
      cb(err);
    }
  );
});

// open
gulp.task('_open-appdir', (cb) => {
  exec('open ' + APP_PACKAGE_NAME, (err, stdout, stderr) => {
    cb(err);
  });
});
gulp.task('_open-appdir:store', (cb) => {
  exec('open ' + MAS_APP_PACKAGE_NAME, (err, stdout, stderr) => {
    cb(err);
  });
});

// release
gulp.task(
  'release',
  ehandler(gulp.series(
    _mustMasterBranch,
    '_rm-workdir',
    '_mk-workdir',
    '_ch-workdir',
    '_git-clone',
    '_ch-repodir',
    '_git-submodule',
    '_npm-install',
    'tsc',
    '_rm-package',
    '_package-release',
    '_unpacked',
    'doc',
    '_zip-app',
    '_codesign',
    '_zip-app-signed',
    '_open-appdir',
    '_notify',
    '_kill'
  ),
  (err) => {
    gulp.task('_notifyError')();
  })
);

// staging
gulp.task(
  'staging',
  ehandler(gulp.series(
    _detectBranch,
    '_rm-workdir',
    '_mk-workdir',
    '_ch-workdir',
    '_git-clone',
    '_ch-repodir',
    '_git-submodule',
    '_npm-install',
    'tsc',
    '_rm-package',
    '_package-release',
    '_unpacked',
    'doc',
    '_zip-app',
    //'_codesign',
    //'_zip-app-signed',
    '_open-appdir',
    '_notify',
    '_kill'
  ),
  (err) => {
    gulp.task('_notifyError')();
  })
);

// store
gulp.task(
  'store',
  ehandler(gulp.series(
    _mustMasterBranch,
    '_rm-workdir',
    '_mk-workdir',
    '_ch-workdir',
    '_git-clone',
    '_ch-repodir',
    '_git-submodule',
    '_npm-install',
    'tsc',
    '_rm-package',
    '_package-release:store',
    '_unpacked:store',
    '_codesign:store',
    '_open-appdir:store',
    '_notify',
    '_kill'
  ),
  (err) => {
    gulp.task('_notifyError')();
  })
);
