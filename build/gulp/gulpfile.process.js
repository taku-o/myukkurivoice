var gulp = gulp || require('gulp');
var config = require('./config');
const execSync = require('child_process').execSync;
const fs = require('fs');
const notifier = require('node-notifier');

// notify
gulp.task('_notify', (cb) => {
  notifier.notify({
    title: 'gulp-task',
    message: 'finished.',
    sound: 'Glass',
  });
  return cb();
});
gulp.task('_notifyError', () => {
  return new Promise((resolve, reject) => {
    notifier.notify({
      title: 'gulp-task',
      message: 'error.',
      sound: 'Frog',
    });
    resolve();
  });
});

// handle error
function _handleError(err) {
  gulp.task('_notifyError')();
}
gulp.task('_handleError', (cb) => {
  gulp.once('error', _handleError);
  return cb();
});

// kill
// for fast exit
gulp.task('_kill', (cb) => {
  gulp.removeListener('error', _handleError);
  gulp.on('stop', () => {
    //process.exit(0);
  });
  gulp.on('err', () => {
    //process.exit(1);
  });
  return cb();
});

// platform
// BUILD_PLATFORM (darwin, mas)
gulp.task('_platform:darwin', (cb) => {
  const env = process.env;
  env.BUILD_PLATFORM = 'darwin';
  cb();
});
gulp.task('_platform:mas', (cb) => {
  const env = process.env;
  env.BUILD_PLATFORM = 'mas';
  cb();
});

// target
// BUILD_TARGET (release, staging, mas, debug)
gulp.task('_target:release', (cb) => {
  const env = process.env;
  env.BUILD_TARGET = 'release';
  cb();
});
gulp.task('_target:staging', (cb) => {
  const env = process.env;
  env.BUILD_TARGET = 'staging';
  cb();
});
gulp.task('_target:mas', (cb) => {
  const env = process.env;
  env.BUILD_TARGET = 'mas';
  cb();
});
gulp.task('_target:debug', (cb) => {
  const env = process.env;
  env.BUILD_TARGET = 'debug';
  cb();
});

// runtime
// RUNTIME_ENV (default, catalina, mas)
gulp.task('_runtime:default', (cb) => {
  const env = process.env;
  env.RUNTIME_ENV = 'default';
  cb();
});
gulp.task('_runtime:catalina', (cb) => {
  const env = process.env;
  env.RUNTIME_ENV = 'catalina';
  cb();
});
gulp.task('_runtime:mas', (cb) => {
  const env = process.env;
  env.RUNTIME_ENV = 'mas';
  cb();
});

// signed_type
// SIGNED_TYPE (none, signed, mas)
gulp.task('_signed_type:none', (cb) => {
  const env = process.env;
  env.SIGNED_TYPE = 'none';
  cb();
});
gulp.task('_signed_type:developer', (cb) => {
  const env = process.env;
  env.SIGNED_TYPE = 'developer';
  cb();
});
gulp.task('_signed_type:3rdparty', (cb) => {
  const env = process.env;
  env.SIGNED_TYPE = '3rdparty';
  cb();
});

// _update:packagejson
gulp.task('_update:packagejson', (cb) => {
  const packageJson = config.packageJson;

  // process.env
  const env = process.env;
  packageJson.build_status.platform = env.BUILD_PLATFORM;
  packageJson.build_status.target = env.BUILD_TARGET;
  packageJson.build_status.signed = env.SIGNED_TYPE;

  // git
  const branch = execSync('/usr/bin/git symbolic-ref --short HEAD')
    .toString()
    .trim();
  const hash = execSync('/usr/bin/git rev-parse HEAD')
    .toString()
    .trim();
  packageJson.build_status.branch = branch ? branch : 'master';
  packageJson.build_status.hash = hash;

  fs.writeFile('package.json', JSON.stringify(packageJson, null, '  '), (err) => {
    if (err) {
      gulp.task('_notifyError')();
    }
    cb(err);
  });
});
