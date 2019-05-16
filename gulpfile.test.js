const argv = require('yargs').argv;
const fs = require('fs');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const runSequence = require('run-sequence');

// test
gulp.task('test', (cb) => {
  fs.access('MYukkuriVoice-darwin-x64/MYukkuriVoice.app', (err) => {
    if (err) {
      runSequence('tsc-debug', '_rm-package', '_package-debug', '_unpacked', '_test', '_notify', (err) => {
        if (err) {
          global._notifyError();
        }
        cb(err);
      });
    } else {
      runSequence('tsc-debug', '_test', '_notify', (err) => {
        if (err) {
          global._notifyError();
        }
        cb(err);
      });
    }
  });
});
gulp.task('test-rebuild', (cb) => {
  runSequence('tsc-debug', '_rm-package', '_package-debug', '_unpacked', '_test', '_notify', (err) => {
    if (err) {
      global._notifyError();
    }
    cb(err);
  });
});
gulp.task('_test', () => {
  const targets = argv && argv.t ? argv.t : 'test/*.js';
  return gulp.src([targets], {read: false}).pipe(mocha({bail: true, reporter: 'tap'}));
});

