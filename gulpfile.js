const gulp = require('gulp');
const runSequence = require('run-sequence');
const spawn = require('child_process').spawn;
const toc = require('gulp-markdown-toc');

// tasks
require('./gulpfile.about');
require('./gulpfile.doc');
require('./gulpfile.format');
require('./gulpfile.less');
require('./gulpfile.lint');
require('./gulpfile.notify');
require('./gulpfile.package');
require('./gulpfile.release');
require('./gulpfile.store');
require('./gulpfile.test');
require('./gulpfile.tsc');

// default task
gulp.task('default', () => {
  /* eslint-disable-next-line no-console */
  console.log(`
usage:
    gulp --tasks-simple
    gulp all
    gulp tsc
    gulp tsc-debug
    gulp lint
    gulp lint-ts
    gulp lint-js
    gulp lint-q
    gulp lint-html
    gulp less
    gulp format
    gulp toc
    gulp doc
    gulp about
    gulp clean
    gulp test [--t=test/mainWindow.js]
    gulp test-rebuild [--t=test/mainWindow.js]
    gulp app
    gulp package
    gulp release
    gulp staging [--branch=develop]
    gulp store [--branch=develop]
  `);
});

// all
gulp.task('all', (cb) => {
  runSequence('format', 'less', 'tsc', 'lint', 'test', 'staging', '_kill', (err) => {
    if (err) {
      gulp.start('_notifyError');
    }
    cb(err);
  });
});

// table of contents
gulp.task('toc', () => {
  return gulp
    .src('docs/README.md')
    .pipe(toc())
    .pipe(gulp.dest('docs'));
});

// clean
gulp.task('clean', ['_rm-js', '_rm-package', '_rm-workdir']);

// kill
// for fast exit
gulp.task('_kill', () => {
  //gulp.on('stop', () => {
  //  process.exit(0);
  //});
  //gulp.on('err', () => {
  //  process.exit(1);
  //});
  return true;
});

// run app
gulp.task('app', ['tsc-debug'], (cb) => {
  const env = process.env;
  env.DEBUG = 1;
  env.MONITOR = 1;
  env.CONSOLELOG = 1;
  const run = spawn(__dirname + '/node_modules/.bin/electron', ['.'], {
    env: env,
  });
  run.stdout.on('data', (data) => {
    process.stdout.write(data.toString('utf-8'));
  });
  run.stderr.on('data', (data) => {
    process.stderr.write(data.toString('utf-8'));
  });
  run.on('close', (code) => {
    cb();
  });
});
