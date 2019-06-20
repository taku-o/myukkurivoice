const argv = require('yargs').argv;
const fs = require('fs');
const gulp = require('gulp');
const mocha = require('gulp-mocha');

// test
gulp.task('test', (cb) => {
  fs.access('MYukkuriVoice-darwin-x64/MYukkuriVoice.app', (err) => {
    if (err) {
      return gulp.series('tsc-debug', '_rm-package', '_package-debug', '_unpacked', '_test', '_notify', '_kill', () => {
        return cb();
      })
      .catch((err) => {
        _notifyError();
        return cb(err);
      });
    } else {
      return gulp.series('tsc-debug', '_test', '_notify', '_kill', () => {
        return cb();
      })
      .catch((err) => {
        _notifyError();
        return cb(err);
      });
    }
  });
});
gulp.task('test-rebuild', () => {
  return gulp.series('tsc-debug', '_rm-package', '_package-debug', '_unpacked', '_test', '_notify', '_kill')
    .catch((err) => {
      return _notifyError();
    });
});
gulp.task('_test', () => {
  const targets = argv && argv.t ? argv.t : 'test/*.js';
  return gulp.src([targets], {read: false}).pipe(mocha({bail: true, reporter: 'tap'}));
});
