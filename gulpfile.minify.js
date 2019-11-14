var gulp = gulp || require('gulp');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');

// minify:js
gulp.task('minify:js', () => {
  return gulp
    .src(['electron*.js', 'js/*.js', 'docs/assets/js/*.js'], {base: '.'})
    .pipe(terser())
    .pipe(gulp.dest('.'));
});

// minify:css
gulp.task('minify:css', () => {
  return gulp
    .src(['css/*.css', 'docs/assets/css/*.css'], {base: '.'})
    .pipe(cleanCSS())
    .pipe(gulp.dest('.'));
});

// minify:node_modules
gulp.task('_minify:node_modules:js', () => {
  return gulp
    .src(['node_modules/**/*.js'], {base: '.'})
    .pipe(terser())
    .pipe(gulp.dest('.'));
});
gulp.task('_minify:node_modules:css', () => {
  return gulp
    .src(['node_modules/**/*.css'], {base: '.'})
    .pipe(cleanCSS())
    .pipe(gulp.dest('.'));
});
gulp.task('minify:node_modules', gulp.series('_minify:node_modules:js', '_minify:node_modules:css'));

