var gulp = gulp || require('gulp');
const spawn = require('child_process').spawn;

// tasks
require('./gulpfile.notify');
require('./gulpfile.process');
require('./gulpfile.about');
require('./gulpfile.minify');
require('./gulpfile.webpack');
require('./gulpfile.less');
require('./gulpfile.format');
require('./gulpfile.lint');
require('./gulpfile.tsc');
require('./gulpfile.doc');
require('./gulpfile.package');
require('./gulpfile.sign');
require('./gulpfile.release');
require('./gulpfile.test');

// default task
gulp.task('default', (cb) => {
  /* eslint-disable-next-line no-console */
  console.log(`
usage:
    gulp --tasks-simple
    gulp tsc
    gulp tsc:debug
    gulp lint
    gulp lint:ts
    gulp lint:js
    gulp lint:q
    gulp lint:html
    gulp less
    gulp format
    gulp toc
    gulp doc
    gulp about
    gulp minify
    gulp minify:js
    gulp minify:css
    gulp minify:node_modules
    gulp webpack
    gulp webpack:production
    gulp webpack:develop
    gulp clean
    gulp test [--t=test/mainWindow.js]
    gulp test:rebuild [--t=test/mainWindow.js]
    gulp app
    gulp app:default
    gulp app:catalina
    gulp app:store
    gulp package
    gulp build
    gulp build:staging [--branch=develop]
    gulp build:release
    gulp build:store [--branch=develop]
  `);
  return cb();
});

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
    const run = spawn(__dirname + '/node_modules/.bin/electron', ['.'], {
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
gulp.task('app:default', gulp.series('app'));
gulp.task(
  'app:catalina',
  gulp.series((cb) => {
    const env = process.env;
    env.RUNTIME_ENV = 'catalina';
    cb();
  }, 'app')
);
gulp.task(
  'app:store',
  gulp.series((cb) => {
    const env = process.env;
    env.RUNTIME_ENV = 'store';
    cb();
  }, 'app')
);
