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
gulp.task('_notifyError', (cb) => {
  notifier.notify({
    title: 'gulp-task',
    message: 'error.',
    sound: 'Frog',
  });
  return cb();
});
gulp.task('_handleError', (cb) => {
  //gulp.on('err', () => {
  //  _notifyError();
  //});
  return cb();
});

