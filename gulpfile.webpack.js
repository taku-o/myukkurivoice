var gulp = gulp || require('gulp');
const path = require('path');
const exec = require('child_process').exec;

const WEBPACK_CMD = path.join(__dirname, './node_modules/.bin/webpack');

// webpack
gulp.task('webpack', (cb) => {
  exec(WEBPACK_CMD,
    (err, stdout, stderr) => {
      cb(err);
    }
  );
});

