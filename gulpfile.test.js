const argv = require('yargs').argv;
const fs = require('fs');
const gulp = require('gulp');
const mocha = require('gulp-mocha');

// test
gulp.task('_test', () => {
  const targets = argv && argv.t ? argv.t : 'test/*.js';
  return gulp.src([targets], {read: false}).pipe(mocha({bail: true, reporter: 'tap'}));
});
gulp.task('test', (cb) => {
  fs.access('MYukkuriVoice-darwin-x64/MYukkuriVoice.app', (err) => {
    if (err) {
      return gulp.series('_notifyCatchError', 'tsc-debug', '_rm-package', '_package-debug', '_unpacked', '_test', '_notify', '_kill', () => {
        return cb();
      })();
    } else {
      return gulp.series('_notifyCatchError', 'tsc-debug', '_test', '_notify', '_kill', () => {
        return cb();
      })();
    }
  });
});
gulp.task('test-rebuild', gulp.series('_notifyCatchError', 'tsc-debug', '_rm-package', '_package-debug', '_unpacked', '_test', '_notify', '_kill'));
