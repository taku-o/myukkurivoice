var gulp = gulp || require('gulp');
const less = require('gulp-less');

// less
gulp.task('_less', () => {
  return gulp
    .src(['css/*.less', 'docs/assets/css/*.less'], {base: '.'})
    .pipe(less())
    .pipe(gulp.dest('.'));
});
gulp.task('less', gulp.series('_less', 'minify:css'));
