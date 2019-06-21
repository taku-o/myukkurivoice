const gulp = require('gulp');

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
