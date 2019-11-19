var gulp = gulp || require('gulp');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');

// minify:js
gulp.task('minify:js', () => {
  return gulp
    .src(['electron*.js', 'js/*.js'], {base: '.'})
    .pipe(terser())
    .pipe(gulp.dest('.'));
});
gulp.task('minify:js:nowebpack', () => {
  return gulp
    .src(['js/apps.main.preload.js', 'js/service.aques.js', 'js/service.aqusrdic.js'], {base: '.'})
    .pipe(terser())
    .pipe(gulp.dest('.'));
});

// minify:css
gulp.task('minify:css', () => {
  return gulp
    .src(['css/*.css'], {base: '.'})
    .pipe(cleanCSS())
    .pipe(gulp.dest('.'));
});

// minify:node_modules
function minify_js_dir(target) {
  return gulp
    .src([`node_modules/${target}/**/*.js`], {base: '.'})
    .pipe(terser())
    .pipe(gulp.dest('.'));
}
gulp.task('_minify:node_modules:js', () => {
  var list = [
    'angular',
    'angular-input-highlight',
    'angular-ui-grid',
    'async',
    'balanced-match',
    //'bindings',
    'brace-expansion',
    'concat-map',
    'conf',
    'cryptico.js',
    'csv-parse',
    'csv-stringify',
    'debug',
    'dot-prop',
    'electron-is-accelerator',
    'electron-json-storage',
    'electron-localshortcut',
    'electron-log',
    'electron-path',
    'electron-store',
    'env-paths',
    'exists-file',
    'fcpx-audio-role-encoder',
    'ffi-napi',
    'file-uri-to-path',
    'fs.realpath',
    'get-symbol-from-current-process-h',
    'get-uv-event-loop-napi-h',
    'github-version-compare',
    'glob',
    'graceful-fs',
    'imurmurhash',
    'inflight',
    'inherits',
    'intro.js',
    'is-obj',
    'locate-path',
    'lodash',
    'lodash.get',
    'lru-cache',
    'make-dir',
    'minimatch',
    'minimist',
    //'mkdirp',
    'ms',
    'myukkurivoice-about-window',
    'nan',
    'node-addon-api',
    'once',
    'os-tmpdir',
    'p-limit',
    'p-locate',
    'p-try',
    'path-is-absolute',
    'photon',
    'pkg-up',
    'ref-napi',
    'ref-struct-di',
    'rimraf',
    'semver',
    'signal-exit',
    'temp',
    'uniqid',
    'wait-until',
    'wav-audio-length',
    'wav-encoder',
    'wrappy',
    'write-file-atomic',
    'yallist',
  ];

  var promises = [];
  for (var i = 0; i < list.length; i++) {
    promises.push(minify_js_dir(list[i]));
  }
  return Promise.all(promises);
});
gulp.task('_minify:node_modules:css', () => {
  return gulp
    .src(['node_modules/**/*.css'], {base: '.'})
    .pipe(cleanCSS())
    .pipe(gulp.dest('.'));
});
gulp.task('minify:node_modules', gulp.parallel('_minify:node_modules:js', '_minify:node_modules:css'));

gulp.task('minify', gulp.parallel('minify:js', 'minify:css', 'minify:node_modules'));

