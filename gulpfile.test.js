const argv = require('yargs').argv;
const fs = require('fs');
const gulp = require('gulp');
const mocha = require('gulp-mocha');

function _buildAppIfNotExist(cb) {
  fs.access('MYukkuriVoice-darwin-x64/MYukkuriVoice.app', (err) => {
    if (err) {
      gulp.series('_rm-package', '_package-debug', '_unpacked', (done) => {
        done();
        return cb();
      })();
    } else {
      return cb();
    }
  });
}

// test
gulp.task('_test', () => {
  const targets = argv && argv.t ? argv.t : 'test/*.js';
  return gulp.src([targets], {read: false}).pipe(mocha({bail: true, reporter: 'tap'}));
});
gulp.task('test', gulp.series('_handleError', 'tsc-debug', _buildAppIfNotExist, '_test', '_notify', '_kill'));
gulp.task(
  'test-rebuild',
  gulp.series('_handleError', 'tsc-debug', '_rm-package', '_package-debug', '_unpacked', '_test', '_notify', '_kill')
);
