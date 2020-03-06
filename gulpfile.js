var gulp = gulp || require('gulp');

// tasks
require('./build/gulp/gulpfile.process');
require('./build/gulp/gulpfile.minify');
require('./build/gulp/gulpfile.less');
require('./build/gulp/gulpfile.format');
require('./build/gulp/gulpfile.tsc');
require('./build/gulp/gulpfile.doc');
require('./build/gulp/gulpfile.package');
require('./build/gulp/gulpfile.sign');
require('./build/gulp/gulpfile.release');
require('./build/gulp/gulpfile.test');
require('./build/gulp/gulpfile.app');

// default task
gulp.task('default', (cb) => {
  /* eslint-disable-next-line no-console */
  console.log(`
usage:
    gulp --tasks-simple
    gulp tsc
    gulp tsc:debug
    gulp less
    gulp lint
    gulp lint:ts
    gulp lint:js
    gulp lint:q
    gulp lint:html
    gulp lint:yaml
    gulp format
    gulp toc
    gulp doc
    gulp about
    gulp minify
    gulp minify:js
    gulp minify:json
    gulp minify:css
    gulp minify:node_modules
    gulp clean
    gulp test [--t=test/mainWindow.js]
    gulp test:rebuild [--t=test/mainWindow.js]
    gulp verify:release
    gulp verify:mas
    gulp app
    gulp app:default
    gulp app:catalina
    gulp app:mas
    gulp package
    gulp build
    gulp build:staging [--branch=develop]
    gulp build:pr [--pull_request=pull/999/merge]
    gulp build:release
    gulp build:deploy
    gulp build:mas [--branch=develop]
  `);
  return cb();
});
