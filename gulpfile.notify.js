const gulp = require('gulp');
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
function _notifyError() {
  return notifier.notify({
    title: 'gulp-task',
    message: 'error.',
    sound: 'Frog',
  });
}
gulp.task('_notifyCatchError', (cb) => {
  gulp.on('err', () => {
    _notifyError();
  });
  return cb();
});

// exports
exports._notifyError = _notifyError;
