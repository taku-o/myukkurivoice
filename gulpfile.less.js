var gulp = gulp || require('gulp');
const less = require('gulp-less');
const cleanCSS = require('gulp-clean-css');

// clean-css
gulp.task('_minify:css', () => {
  return gulp
    .src(['css/*.css', 'docs/assets/css/*.css'], {base: '.'})
    .pipe(cleanCSS())
    .pipe(gulp.dest('.'));
});

// less
gulp.task('_less', () => {
  return gulp
    .src(['css/*.less', 'docs/assets/css/*.less'], {base: '.'})
    .pipe(less())
    .pipe(gulp.dest('.'));
});
gulp.task('less', gulp.series('_less', '_minify:css'));
