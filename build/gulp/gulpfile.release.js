var gulp = gulp || require('gulp');
var config = require('./config');
const argv = require('yargs').argv;
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const git = require('gulp-git');
const install = require('gulp-install');
const mkdirp = require('mkdirp');
const path = require('path');
const rimraf = require('rimraf');

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
  rimraf(config.dir.workDir, (err) => {
    cb(err);
  });
});
gulp.task('_mk:workdir', (cb) => {
  mkdirp(config.dir.workDir, (err) => {
    cb(err);
  });
});
gulp.task('_ch:workdir', (cb) => {
  process.chdir(config.dir.workDir);
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
  process.chdir(config.dir.repoDir);
  return cb();
});

// npm
gulp.task('_npm-install', (cb) => {
  gulp
    .src([`${config.dir.repoDir}/package.json`])
    .pipe(gulp.dest(config.dir.repoDir))
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
  const platform = process.env.BUILD_PLATFORM;
  const signedType = process.env.SIGNED_TYPE;
  const packageName = `MYukkuriVoice-${platform}-x64`;
  const zipName =
    signedType == 'developer'? `${packageName}.zip`:
    signedType == 'none'? `${packageName}-nosigned.zip`:
    `${packageName}-unknown.zip`;
  exec(`ditto -c -k --sequesterRsrc --keepParent ${packageName} ${zipName}`, (err, stdout, stderr) => {
    cb(err);
  });
});

// open
gulp.task('_open:appdir', (cb) => {
  if (!process.env.BUILD_PLATFORM) {
    throw new Error('BUILD_PLATFORM not set.');
  }
  const platform = process.env.BUILD_PLATFORM;
  const packageName = `MYukkuriVoice-${platform}-x64`;
  exec(`open ${packageName}`, (err, stdout, stderr) => {
    cb(err);
  });
});

// build:deploy
gulp.task(
  'build:deploy',
  gulp.series(
    '_handleError',
    '_platform:darwin',
    '_target:release',
    //'_signed_type:developer',
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
    //
    // staging
    '_signed_type:none',
    '_rm:package',
    '_update:packagejson',
    '_package:release',
    '_unpacked',
    'doc',
    '_zip-app',
    //
    // release
    '_signed_type:developer',
    '_rm:package',
    '_update:packagejson',
    '_package:release',
    '_unpacked',
    'doc',
    '_sign:developer:direct',
    '_notarize',
    '_zip-app',
    //
    '_open:appdir',
    '_notify',
    '_kill'
  )
);

// build:release
gulp.task(
  'build:release',
  gulp.series(
    '_handleError',
    '_platform:darwin',
    '_target:release',
    '_signed_type:developer',
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
    //'_sign:developer',
    '_sign:developer:direct',
    '_notarize',
    '_zip-app',
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
    '_signed_type:none',
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
    //'_sign:developer',
    '_zip-app',
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
    '_signed_type:none',
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
    //'_sign:developer',
    '_zip-app',
    '_open:appdir',
    '_notify',
    '_kill'
  )
);

// build:mas
gulp.task(
  'build:mas',
  gulp.series(
    '_handleError',
    '_platform:mas',
    '_target:mas',
    '_signed_type:3rdparty',
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
