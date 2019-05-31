const gulp = require('gulp');
const notifier = require('node-notifier');

// notify
gulp.task('_notify', () => {
  return notifier.notify({
    title: 'gulp-task',
    message: 'finished.',
    sound: 'Glass',
  });
});
gulp.task('_notifyError', () => {
  return notifier.notify({
    title: 'gulp-task',
    message: 'error.',
    sound: 'Frog',
  });
});
