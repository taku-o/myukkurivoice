const argv = require('yargs').argv;
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const git = require('gulp-git');
const gulp = require('gulp');
const install = require('gulp-install');
const mkdirp = require('mkdirp');
const path = require('path');
const rimraf = require('rimraf');
const runSequence = require('run-sequence');

const WORK_DIR = path.join(__dirname, './release');
const WORK_REPO_DIR = path.join(__dirname, './release/myukkurivoice');
const APP_PACKAGE_NAME = 'MYukkuriVoice-darwin-x64';
const MAS_APP_PACKAGE_NAME = 'MYukkuriVoice-mas-x64';

const DEVELOPER_ID_APPLICATION_KEY = require('./keys/MacAppleStore.json').version;

// release
gulp.task('release', (cb) => {
  if (argv && argv.branch) {
    cb('branch is selected');
    return;
  }
  runSequence(
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
    '_kill',
    (err) => {
      if (err) {
        gulp.start('_notifyError');
      }
      cb(err);
    }
  );
});

// staging
gulp.task('staging', (cb) => {
  if (!(argv && argv.branch)) {
    argv.branch = execSync('/usr/bin/git symbolic-ref --short HEAD')
      .toString()
      .trim();
  }
  runSequence(
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
    '_kill',
    (err) => {
      if (err) {
        gulp.start('_notifyError');
      }
      cb(err);
    }
  );
});

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
    '_kill',
    (err) => {
      if (err) {
        gulp.start('_notifyError');
      }
      cb(err);
    }
  );
});

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
gulp.task('_ch-workdir', () => {
  process.chdir(WORK_DIR);
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
gulp.task('_ch-repodir', () => {
  process.chdir(WORK_REPO_DIR);
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

