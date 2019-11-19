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

