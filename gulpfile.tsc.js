var gulp = gulp || require('gulp');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('./tsconfig.json');

// terser
gulp.task('_minify:js', () => {
  return gulp
    .src(['electron*.js', 'js/*.js', 'docs/assets/js/*.js'], {base: '.'})
    .pipe(terser({
      keep_fnames: true,
    }))
    .pipe(gulp.dest('.'));
});

// tsc
gulp.task('_tsc', () => {
  return gulp
    .src(['*.ts', 'js/*.ts', 'test/*.ts', 'docs/assets/js/*.ts'], {base: '.'})
    .pipe(tsProject())
    .js.pipe(gulp.dest('.'));
});
gulp.task('tsc:debug', () => {
  return gulp
    .src(['*.ts', 'js/*.ts', 'test/*.ts'], {base: '.'})
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .js.pipe(sourcemaps.write())
    .pipe(gulp.dest('.'));
});
gulp.task(
  'tsc',
  gulp.series('_tsc', '_minify:js', () => {
    return gulp
      .src([
        'js/ctrl.help.js',
        'js/directive.include.js',
        'js/events.help.js',
        'js/reducers.help.js',
        'js/stores.help.js',
      ])
      .pipe(gulp.dest('docs/assets/js'));
  })
);

gulp.task('_rm:js', () => {
  return del(['*.js', 'js/*.js', 'test/*.js', '!gulpfile.js', '!gulpfile.*.js', '*.tsbuildinfo']);
});
