var gulp = gulp || require('gulp');
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
