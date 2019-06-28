const argv = require('yargs').argv;
const ehandler = require('gulp-task-err-handler');
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
gulp.task('test', ehandler(gulp.series('tsc-debug', _buildAppIfNotExist, '_test', '_notify', '_kill'),
  (err) => {
    gulp.task('_notifyError')();
  })
);
gulp.task(
  'test-rebuild',
  ehandler(gulp.series('tsc-debug', '_rm-package', '_package-debug', '_unpacked', '_test', '_notify', '_kill'),
  (err) => {
    gulp.task('_notifyError')();
  })
);
