var gulp = gulp || require('gulp');
var __root = require('path').join(__dirname, '../../');
const argv = require('yargs').argv;
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const git = require('gulp-git');
const install = require('gulp-install');
const mkdirp = require('mkdirp');
const path = require('path');
const rimraf = require('rimraf');

const WORK_DIR = path.join(__root, './release');
const WORK_REPO_DIR = path.join(__root, './release/myukkurivoice');
const APP_PACKAGE_NAME = 'MYukkuriVoice-darwin-x64';
const MAS_APP_PACKAGE_NAME = 'MYukkuriVoice-mas-x64';

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
gulp.task('_rm:workdir', (cb) => {
  rimraf(WORK_DIR, (err) => {
    cb(err);
  });
});
gulp.task('_mk:workdir', (cb) => {
  mkdirp(WORK_DIR, (err) => {
    cb(err);
  });
});
gulp.task('_ch:workdir', (cb) => {
  process.chdir(WORK_DIR);
  return cb();
});

// git
gulp.task('_git-clone', (cb) => {
  const opts = argv && argv.branch ? {args: '-b ' + argv.branch} : {args: '-b master'};
  git.clone(
    'https://github.com/taku-o/myukkurivoice.git' /* git@github.com:taku-o/myukkurivoice.git */,
    opts,
    (err) => {
      cb(err);
    }
  );
});
gulp.task('_git-submodule', (cb) => {
  git.updateSubmodule({args: '--init'}, cb);
});
gulp.task('_git-pull-pr', (cb) => {
  if (!argv || !argv.pull_request) {
    throw new Error('pull request is selected');
  }
  git.pull('origin', argv.pull_request, {args: '--rebase'}, (err) => {
    cb(err);
  });
});

// repodir
gulp.task('_ch:repodir', (cb) => {
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
gulp.task('_open:appdir', (cb) => {
  if (!process.env.BUILD_PLATFORM) {
    throw new Error('BUILD_PLATFORM not set.');
  }
  const packageName = process.env.BUILD_PLATFORM == 'darwin' ? APP_PACKAGE_NAME : MAS_APP_PACKAGE_NAME;
  exec('open ' + packageName, (err, stdout, stderr) => {
    cb(err);
  });
});

// build:release
gulp.task(
  'build:release',
  gulp.series(
    '_handleError',
    '_platform:darwin',
    '_target:release',
    //_mustMasterBranch,
    _detectBranch,
    '_rm:workdir',
    '_mk:workdir',
    '_ch:workdir',
    '_git-clone',
    '_ch:repodir',
    '_git-submodule',
    '_npm-install',
    'tsc',
    'minify',
    '_rm:package',
    '_update:packagejson',
    '_package:release',
    '_unpacked',
    'doc',
    '_zip-app',
    //'_sign:developer',
    '_sign:developer:direct',
    '_notarize',
    '_zip-app-signed',
    '_open:appdir',
    '_notify',
    '_kill'
  )
);

// build:staging
gulp.task(
  'build:staging',
  gulp.series(
    '_handleError',
    '_platform:darwin',
    '_target:staging',
    _detectBranch,
    '_rm:workdir',
    '_mk:workdir',
    '_ch:workdir',
    '_git-clone',
    '_ch:repodir',
    '_git-submodule',
    '_npm-install',
    'tsc',
    'minify',
    '_rm:package',
    '_update:packagejson',
    '_package:release',
    '_unpacked',
    'doc',
    '_zip-app',
    //'_sign:developer',
    //'_zip-app-signed',
    '_open:appdir',
    '_notify',
    '_kill'
  )
);

// build:pr
gulp.task(
  'build:pr',
  gulp.series(
    '_handleError',
    '_platform:darwin',
    '_target:staging',
    _mustMasterBranch,
    '_rm:workdir',
    '_mk:workdir',
    '_ch:workdir',
    '_git-clone',
    '_git-pull-pr',
    '_ch:repodir',
    '_git-submodule',
    '_npm-install',
    'tsc',
    'minify',
    '_rm:package',
    '_update:packagejson',
    '_package:release',
    '_unpacked',
    'doc',
    '_zip-app',
    //'_sign:developer',
    //'_zip-app-signed',
    '_open:appdir',
    '_notify',
    '_kill'
  )
);

// build:store
gulp.task(
  'build:store',
  gulp.series(
    '_handleError',
    '_platform:mas',
    '_target:store',
    //_mustMasterBranch,
    _detectBranch,
    '_rm:workdir',
    '_mk:workdir',
    '_ch:workdir',
    '_git-clone',
    '_ch:repodir',
    '_git-submodule',
    '_npm-install',
    'tsc',
    'minify',
    '_rm:package',
    '_update:packagejson',
    '_package:release',
    '_unpacked',
    //'_sign:distribution',
    '_sign:distribution:direct',
    '_flat:distribution',
    '_open:appdir',
    '_notify',
    '_kill'
  )
);

// build
gulp.task('build', gulp.series('build:staging'));