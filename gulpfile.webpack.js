var gulp = gulp || require('gulp');
const path = require('path');
const spawn = require('child_process').spawn;

const WEBPACK_CMD = path.join(__dirname, './node_modules/.bin/webpack');

// webpack
gulp.task('webpack', (cb) => {
  const run = spawn(WEBPACK_CMD, ['--mode', 'production'], {});
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
gulp.task('webpack:debug', (cb) => {
  const run = spawn(WEBPACK_CMD, [], {});
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

