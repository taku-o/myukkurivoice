var gulp = gulp || require('gulp');
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
// BUILD_TARGET (release, staging, store, debug)
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
gulp.task('_target:store', (cb) => {
  const env = process.env;
  env.BUILD_TARGET = 'store';
  cb();
});
gulp.task('_target:debug', (cb) => {
  const env = process.env;
  env.BUILD_TARGET = 'debug';
  cb();
});

// runtime
// RUNTIME_ENV (default, catalina, store)
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
gulp.task('_runtime:store', (cb) => {
  const env = process.env;
  env.RUNTIME_ENV = 'store';
  cb();
});

// _update:packagejson
gulp.task('_update:packagejson', (cb) => {
  const packagejson = require('./package.json');

  // process.env
  const env = process.env;
  packagejson.build_envs.platform = env.BUILD_PLATFORM;
  packagejson.build_envs.target = env.BUILD_TARGET;

  // git
  const branch = execSync('/usr/bin/git symbolic-ref --short HEAD')
    .toString()
    .trim();
  const hash = execSync('/usr/bin/git rev-parse HEAD')
    .toString()
    .trim();
  packagejson.build_envs.branch = branch ? branch : 'master';
  packagejson.build_envs.hash = hash;

  fs.writeFile('package.json', JSON.stringify(packagejson, null, '  '), (err) => {
    if (err) {
      gulp.task('_notifyError')();
    }
    cb(err);
  });
});
