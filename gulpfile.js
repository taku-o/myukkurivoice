const gulp = require('gulp');
const notifier = require('node-notifier');
const runSequence = require('run-sequence');
const spawn = require('child_process').spawn;
const toc = require('gulp-markdown-toc');

require('./gulpfile.doc');
require('./gulpfile.format');
require('./gulpfile.less');
require('./gulpfile.lint');
require('./gulpfile.package');
require('./gulpfile.test');
require('./gulpfile.tsc');

// for fast exit
//gulp.on('stop', () => {
//  process.exit(0);
//});
//gulp.on('err', () => {
//  process.exit(1);
//});

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
    gulp clean
    gulp test [--t=test/mainWindow.js]
    gulp test-rebuild [--t=test/mainWindow.js]
    gulp app
    gulp package
    gulp release
    gulp staging [--branch=develop]
  `);
});

// all
gulp.task('all', (cb) => {
  runSequence('format', 'less', 'tsc', 'lint', 'test', 'staging', (err) => {
    if (err) {
      global._notifyError();
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

// notify
gulp.task('_notify', () => {
  return notifier.notify({
    title: 'gulp-task',
    message: 'finished.',
    sound: 'Glass',
  });
});
global._notifyError = () => {
  return notifier.notify({
    title: 'gulp-task',
    message: 'error.',
    sound: 'Frog',
  });
};
