var gulp = gulp || require('gulp');
var __root = require('path').join(__dirname, '../../');
const eslint = require('gulp-eslint');
const prettier = require('gulp-prettier');
const using = require('gulp-using');

// lint
gulp.task('lint:ts', () => {
  return gulp
    .src(['*.ts', 'js/*.ts', 'test/*.ts', 'docs/assets/js/*.ts', '!types.d.ts'])
    .pipe(eslint({useEslintrc: true}))
    .pipe(eslint.format());
});
gulp.task('lint:js', () => {
  return gulp
    .src(['gulpfile*.js'])
    .pipe(eslint({useEslintrc: true}))
    .pipe(eslint.format());
});
gulp.task('lint:q', () => {
  return gulp
    .src(['*.ts', 'js/*.ts', 'test/*.ts', 'docs/assets/js/*.ts', '!types.d.ts', 'gulpfile*.js'])
    .pipe(eslint({useEslintrc: true, quiet: true}))
    .pipe(eslint.format());
});
// lint:html
gulp.task('lint:html', () => {
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
// lint:yaml
gulp.task('lint:yaml', () => {
  return gulp
    .src(['.github/workflows/*.yml', 'build/github/workflows/*.yml'], {base: '.'})
    .pipe(using({}))
    .pipe(
      prettier({
        parser: 'yaml',
        proseWrap: 'preserve',
        tabWidth: 2,
        useTabs: false,
      })
    );
});
gulp.task('lint', gulp.parallel('lint:q', 'lint:html', 'lint:yaml'));

// format
// format:ts
gulp.task('_format:ts:eslint', () => {
  return gulp
    .src(['*.ts', 'js/*.ts', 'docs/assets/js/*.ts'], {base: '.'})
    .pipe(eslint({useEslintrc: true, fix: true}))
    .pipe(gulp.dest('.'));
});
gulp.task('_format:ts:test', () => {
  return gulp
    .src(['test/*.ts'], {base: '.'})
    .pipe(
      prettier({
        parser: 'typescript',
        arrowParens: 'always',
        bracketSpacing: false,
        insertPragma: false,
        printWidth: 120,
        proseWrap: 'preserve',
        requirePragma: false,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'all',
        useTabs: false,
      })
    )
    .pipe(gulp.dest('.'));
});
gulp.task('_format:ts', gulp.parallel('_format:ts:eslint', '_format:ts:test'));
// format:js
gulp.task('_format:js', () => {
  return gulp
    .src(['gulpfile.js', 'gulpfile.*.js'], {base: '.'})
    .pipe(
      prettier({
        arrowParens: 'always',
        bracketSpacing: false,
        insertPragma: false,
        printWidth: 120,
        proseWrap: 'preserve',
        requirePragma: false,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
        useTabs: false,
      })
    )
    .pipe(gulp.dest('.'));
});
// format:html
gulp.task('_format:html', () => {
  return gulp
    .src(['*.html', 'docs/*.html', 'docs/_help/*.html'], {base: '.'})
    .pipe(
      prettier({
        parser: 'angular',
        printWidth: 120,
        proseWrap: 'preserve',
        tabWidth: 2,
        useTabs: false,
      })
    )
    .pipe(gulp.dest('.'));
});
// format:yaml
gulp.task('_format:yaml', () => {
  return gulp
    .src(['.github/workflows/*.yml', 'build/github/workflows/*.yml'], {base: '.'})
    .pipe(
      prettier({
        parser: 'yaml',
        proseWrap: 'preserve',
        tabWidth: 2,
        useTabs: false,
      })
    )
    .pipe(gulp.dest('.'));
});
// format:json
gulp.task('_format:json', () => {
  return gulp
    .src(['.eslintrc.json', 'tsconfig.json'], {base: '.'})
    .pipe(
      prettier({
        parser: 'json',
        printWidth: 120,
        proseWrap: 'preserve',
        tabWidth: 2,
        useTabs: false,
      })
    )
    .pipe(gulp.dest('.'));
});
// format:less
gulp.task('_format:less', () => {
  return gulp
    .src(['css/*.less', 'docs/assets/css/*.less'], {base: '.'})
    .pipe(
      prettier({
        parser: 'less',
        printWidth: 120,
        proseWrap: 'preserve',
        tabWidth: 4,
        useTabs: false,
      })
    )
    .pipe(gulp.dest('.'));
});
// format:md
gulp.task('_format:md', () => {
  return gulp
    .src(['docs/*.md'], {base: '.'})
    .pipe(
      prettier({
        parser: 'markdown',
        proseWrap: 'preserve',
        tabWidth: 2,
        useTabs: false,
      })
    )
    .pipe(gulp.dest('.'));
});
gulp.task(
  'format',
  gulp.parallel('_format:json', '_format:js', '_format:ts', '_format:md', '_format:less', '_format:yaml')
);
