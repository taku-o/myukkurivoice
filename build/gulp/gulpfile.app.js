var gulp = gulp || require('gulp');
var __root = require('path').join(__dirname, '../../');
const spawn = require('child_process').spawn;

// run app
gulp.task(
  'app',
  gulp.series('tsc:debug', (cb) => {
    const env = process.env;
    env.DEBUG = 1;
    env.MONITOR = 1;
    env.CONSOLELOG = 1;
    if (!env.RUNTIME_ENV) {
      env.RUNTIME_ENV = 'default';
    }
    const run = spawn(`${__root}/node_modules/.bin/electron`, ['.'], {
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
  })
);
gulp.task('app:default', gulp.series('_runtime:default', 'app'));
gulp.task('app:catalina', gulp.series('_runtime:catalina', 'app'));
gulp.task('app:store', gulp.series('_runtime:store', 'app'));
