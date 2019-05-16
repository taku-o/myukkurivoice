const gulp = require('gulp');
const less = require('gulp-less');

// less
gulp.task('less', () => {
  return gulp
    .src(['css/*.less', 'docs/assets/css/*.less'], {base: '.'})
    .pipe(less())
    .pipe(gulp.dest('.'));
});

