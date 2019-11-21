var gulp = gulp || require('gulp');
const fs = require('fs');

// platform
// BUILD_PLATFORM
gulp.task('_platform:darwin', (cb) => {
  const env = process.env;
  env.BUILD_PLATFORM = 'darwin';
  cb();
});
gulp.task('_platform:mas', (cb) => {
  const env = process.env;
  env.BUILD_PLATFORM = 'mas';
  cb();
});

// target
// BUILD_TARGET
gulp.task('_target:release', (cb) => {
  const env = process.env;
  env.BUILD_TARGET = 'release';
  cb();
});
gulp.task('_target:staging', (cb) => {
  const env = process.env;
  env.BUILD_TARGET = 'staging';
  cb();
});
gulp.task('_target:store', (cb) => {
  const env = process.env;
  env.BUILD_TARGET = 'store';
  cb();
});
gulp.task('_target:debug', (cb) => {
  const env = process.env;
  env.BUILD_TARGET = 'debug';
  cb();
});

// runtime
// RUNTIME_ENV
gulp.task('_runtime:default', (cb) => {
  const env = process.env;
  env.RUNTIME_ENV = 'default';
  cb();
});
gulp.task('_runtime:catalina', (cb) => {
  const env = process.env;
  env.RUNTIME_ENV = 'catalina';
  cb();
});
gulp.task('_runtime:store', (cb) => {
  const env = process.env;
  env.RUNTIME_ENV = 'store';
  cb();
});

// runtime
gulp.task('runime', (cb) => {
  const platform = process.env.BUILD_PLATFORM? `'${process.env.BUILD_PLATFORM}'`: 'null';
  const target = process.env.BUILD_TARGET? `'${process.env.BUILD_TARGET}'`: 'null';
  const runtime = process.env.RUNTIME_ENV? `'${process.env.RUNTIME_ENV}'`: 'null';

  const content = `
process.env.BUILD_PLATFORM = ${platform};
process.env.BUILD_TARGET = ${target};
process.env.RUNTIME_ENV = ${runtime};
  `;
  fs.writeFile('runtime.js', content, (err) => {
    if (err) {
      gulp.task('_notifyError')();
    }
    cb(err);
  });
});

