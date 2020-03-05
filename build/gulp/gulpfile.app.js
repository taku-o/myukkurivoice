var gulp = gulp || require('gulp');
var config = require('./config');
const spawn = require('child_process').spawn;

// clean
gulp.task('clean', gulp.parallel('_rm:js', '_rm:package', '_rm:workdir'));

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
    const run = spawn(config.cmd.electron, ['.'], {
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
gulp.task('app:mas', gulp.series('_runtime:mas', 'app'));
