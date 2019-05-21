const eslint = require('gulp-eslint');
const gulp = require('gulp');
const prettier = require('gulp-prettier');
const using = require('gulp-using');

// lint
gulp.task('lint', ['lint-q', 'lint-html']);
gulp.task('lint-ts', () => {
  return gulp
    .src(['*.ts', 'js/*.ts', 'test/*.ts', 'docs/assets/js/*.ts', '!types.d.ts'])
    .pipe(eslint({useEslintrc: true}))
    .pipe(eslint.format());
});
gulp.task('lint-js', () => {
  return gulp
    .src(['*.js', 'js/*.js', 'test/*.js'])
    .pipe(eslint({useEslintrc: true}))
    .pipe(eslint.format());
});
gulp.task('lint-q', () => {
  return gulp
    .src([
      '*.ts',
      'js/*.ts',
      'test/*.ts',
      'docs/assets/js/*.ts',
      '!types.d.ts',
      '*.js',
      'js/*.js',
      'test/*.js',
      'docs/assets/js/*.js',
    ])
    .pipe(eslint({useEslintrc: true, quiet: true}))
    .pipe(eslint.format());
});
// lint-html
gulp.task('lint-html', () => {
  return gulp
    .src(['*.html', 'docs/*.html', 'docs/_help/*.html'], {base: '.'})
    .pipe(using({}))
    .pipe(
      prettier({
        parser: 'angular',
        printWidth: 120,
        proseWrap: 'preserve',
        tabWidth: 2,
        useTabs: false,
      })
    );
});