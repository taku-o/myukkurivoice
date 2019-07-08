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
