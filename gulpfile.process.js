var gulp = gulp || require('gulp');

// handle error
gulp.task('_handleError', (cb) => {
  gulp.once('error', (err) => {
    gulp.task('_notifyError')();
  });
  return cb();
});

// kill
// for fast exit
gulp.task('_kill', (cb) => {
  //gulp.on('stop', () => {
  //  process.exit(0);
  //});
  //gulp.on('err', () => {
  //  process.exit(1);
  //});
  return cb();
});
