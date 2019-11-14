var gulp = gulp || require('gulp');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');

// terser
gulp.task('minify:js', () => {
  return gulp
    .src(['electron*.js', 'js/*.js', 'docs/assets/js/*.js'], {base: '.'})
    .pipe(terser())
    .pipe(gulp.dest('.'));
});

// clean-css
gulp.task('minify:css', () => {
  return gulp
    .src(['css/*.css', 'docs/assets/css/*.css'], {base: '.'})
    .pipe(cleanCSS())
    .pipe(gulp.dest('.'));
});


