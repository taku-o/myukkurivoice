var gulp = gulp || require('gulp');
var __root = require('path').join(__dirname, '../../');
const less = require('gulp-less');

// less
gulp.task('_less', () => {
  return gulp
    .src(['css/*.less', 'docs/assets/css/*.less'], {base: '.'})
    .pipe(less())
    .pipe(gulp.dest('.'));
});
gulp.task('less', gulp.series('_less'));
