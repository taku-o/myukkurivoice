var gulp = gulp || require('gulp');
var config = require('./config');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');

const tsProject = ts.createProject(`${config.dir.rootDir}/tsconfig.json`);

// tsc
gulp.task('_tsc', () => {
  return gulp
    .src(['*.ts', 'js/*.ts', 'test/*.ts', 'docs/assets/js/*.ts'], {base: '.'})
    .pipe(tsProject())
    .js.pipe(gulp.dest('.'));
});
gulp.task('_tsc:debug', () => {
  return gulp
    .src(['*.ts', 'js/*.ts', 'test/*.ts'], {base: '.'})
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .js.pipe(sourcemaps.write())
    .pipe(gulp.dest('.'));
});

gulp.task('tsc:debug', gulp.series('_tsc:debug'));
gulp.task(
  'tsc',
  gulp.series('_tsc', () => {
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
  return del(['*.js', 'js/*.js', 'test/*.js', '!gulpfile.js', '*.tsbuildinfo']);
});
