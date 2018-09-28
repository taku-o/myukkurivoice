var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var eslint = require("gulp-eslint");
var exec = require('child_process').exec;
var del = require('del');
var git = require('gulp-git');
var argv = require('yargs').argv;

//    "test": "sh bin/test.sh",
//    "test_rebuild": "sh bin/test_rebuild.sh",
//    "rtest": "sh bin/test_rebuild.sh",
//    "release": "sh bin/release.sh",
//    "staging": "sh bin/staging.sh",
//    "log": "less `echo $HOME`/Library/Logs/MYukkuriVoice/log.log"




gulp.task("default", () => {
});

// tsc
gulp.task("tsc", () => {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest("."));
});

// lint
gulp.task('lint', () => {
  return gulp.src(['*.ts','js/*.ts','test/*.ts'])
    .pipe(eslint({ useEslintrc: true }))
    .pipe(eslint.format());
});
gulp.task('lint-js', () => {
  return gulp.src(['*.js','js/*.js','test/*.js'])
    .pipe(eslint({ useEslintrc: true }))
    .pipe(eslint.format());
});
gulp.task('lint-q', () => {
  return gulp.src(['*.ts','js/*.ts','test/*.ts','*.js','js/*.js','test/*.js'])
    .pipe(eslint({ useEslintrc: true, quiet: true }))
    .pipe(eslint.format());
});

// run app
gulp.task('app', (cb) => {
  exec('DEBUG=1 node_modules/.bin/electron .', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
})

// package
gulp.task('package', ['tsc'], (cb) => {
  del(['MYukkuriVoice-darwin-x64']).then(() => {
    exec(`node_modules/.bin/electron-packager . MYukkuriVoice \
            --platform=darwin --arch=x64 --electronVersion=1.7.9 \
            --icon=icns/myukkurivoice.icns --overwrite --asar.unpackDir=vendor \
            --ignore="^/MYukkuriVoice-darwin-x64" \
            --ignore="^/README.md" \
            --ignore="^/\.git" \
            --ignore="^/\.gitignore" \
            --ignore="^/\.gitmodules" \
            --ignore="^/bin" \
            --ignore="^/docs" \
            --ignore="^/icns" \
            --ignore="^/test" \
            --ignore="^/vendor/.gitignore" \
            --ignore="^/vendor/aqk2k_mac" \
            --ignore="^/vendor/aqtk1-mac" \
            --ignore="^/vendor/aqtk10-mac" \
            --ignore="^/vendor/aqtk2-mac" \
            --ignore="^/package-lock.json" \
            --ignore="^/tsconfig.json" \
            --ignore="^/.+\.ts" \
            --ignore="^/js/.+\.ts" \
            --ignore="^/Gemfile" \
            --ignore="^/Gemfile.lock" \
            --ignore="^/gulpfile.js" \
            --ignore=".DS_Store" \
            --ignore=".babelrc" \
            --ignore=".editorconfig" \
            --ignore=".eslintrc" \
            --ignore=".eslintrc.json" \
            --ignore=".jshintrc" \
            --ignore=".npmignore" \
            --ignore=".prettierrc.json" \
            --ignore=".stylelintrc.json" \
            --ignore=".travis.yml" \
            --ignore="^/node_modules/about-window/LICENSE.txt" \
            --ignore="^/node_modules/about-window/README.md" \
            --ignore="^/node_modules/angular-input-highlight/README.md" \
            --ignore="^/node_modules/angular-input-highlight/test" \
            --ignore="^/node_modules/angular/LICENSE.md" \
            --ignore="^/node_modules/angular/README.md" \
            --ignore="^/node_modules/async/CHANGELOG.md" \
            --ignore="^/node_modules/async/LICENSE" \
            --ignore="^/node_modules/async/README.md" \
            --ignore="^/node_modules/audio-buffer-stream/README.md" \
            --ignore="^/node_modules/audio-buffer-stream/test" \
            --ignore="^/node_modules/balanced-match/LICENSE.md" \
            --ignore="^/node_modules/balanced-match/README.md" \
            --ignore="^/node_modules/bindings/README.md" \
            --ignore="^/node_modules/brace-expansion/README.md" \
            --ignore="^/node_modules/concat-map/LICENSE" \
            --ignore="^/node_modules/concat-map/README.markdown" \
            --ignore="^/node_modules/concat-map/example" \
            --ignore="^/node_modules/concat-map/test" \
            --ignore="^/node_modules/conf/license" \
            --ignore="^/node_modules/conf/readme.md" \
            --ignore="^/node_modules/core-util-is/LICENSE" \
            --ignore="^/node_modules/core-util-is/README.md" \
            --ignore="^/node_modules/core-util-is/test.js" \
            --ignore="^/node_modules/cryptico.js/README.md" \
            --ignore="^/node_modules/cryptico.js/sample" \
            --ignore="^/node_modules/debug/CHANGELOG.md" \
            --ignore="^/node_modules/debug/LICENSE" \
            --ignore="^/node_modules/debug/Makefile" \
            --ignore="^/node_modules/debug/README.md" \
            --ignore="^/node_modules/dot-prop/license" \
            --ignore="^/node_modules/dot-prop/readme.md" \
            --ignore="^/node_modules/electron-config/license" \
            --ignore="^/node_modules/electron-config/readme.md" \
            --ignore="^/node_modules/electron-is-accelerator/LICENSE" \
            --ignore="^/node_modules/electron-is-accelerator/README.md" \
            --ignore="^/node_modules/electron-is-accelerator/test.js" \
            --ignore="^/node_modules/electron-json-storage/CHANGELOG.md" \
            --ignore="^/node_modules/electron-json-storage/README.md" \
            --ignore="^/node_modules/electron-json-storage/doc" \
            --ignore="^/node_modules/electron-json-storage/tests" \
            --ignore="^/node_modules/electron-localshortcut/license" \
            --ignore="^/node_modules/electron-localshortcut/readme.md" \
            --ignore="^/node_modules/electron-log/LICENSE" \
            --ignore="^/node_modules/electron-log/README.md" \
            --ignore="^/node_modules/env-paths/license" \
            --ignore="^/node_modules/env-paths/readme.md" \
            --ignore="^/node_modules/exists-file/CHANGELOG.md" \
            --ignore="^/node_modules/exists-file/LICENSE.md" \
            --ignore="^/node_modules/ffi/CHANGELOG.md" \
            --ignore="^/node_modules/ffi/LICENSE" \
            --ignore="^/node_modules/ffi/README.md" \
            --ignore="^/node_modules/ffi/deps" \
            --ignore="^/node_modules/ffi/example" \
            --ignore="^/node_modules/ffi/src" \
            --ignore="^/node_modules/ffi/test" \
            --ignore="^/node_modules/find-up/license" \
            --ignore="^/node_modules/find-up/readme.md" \
            --ignore="^/node_modules/fs.realpath/LICENSE" \
            --ignore="^/node_modules/fs.realpath/README.md" \
            --ignore="^/node_modules/glob/LICENSE" \
            --ignore="^/node_modules/glob/README.md" \
            --ignore="^/node_modules/glob/changelog.md" \
            --ignore="^/node_modules/inflight/LICENSE" \
            --ignore="^/node_modules/inflight/README.md" \
            --ignore="^/node_modules/inherits/LICENSE" \
            --ignore="^/node_modules/inherits/README.md" \
            --ignore="^/node_modules/intro.js/CODE_OF_CONDUCT.md" \
            --ignore="^/node_modules/intro.js/CONTRIBUTING.md" \
            --ignore="^/node_modules/intro.js/Makefile" \
            --ignore="^/node_modules/intro.js/README.md" \
            --ignore="^/node_modules/intro.js/changelog.md" \
            --ignore="^/node_modules/intro.js/docs" \
            --ignore="^/node_modules/intro.js/example" \
            --ignore="^/node_modules/intro.js/license.md" \
            --ignore="^/node_modules/is-obj/license" \
            --ignore="^/node_modules/is-obj/readme.md" \
            --ignore="^/node_modules/isarray/README.md" \
            --ignore="^/node_modules/lodash/LICENSE" \
            --ignore="^/node_modules/lodash/README.md" \
            --ignore="^/node_modules/minimatch/LICENSE" \
            --ignore="^/node_modules/minimatch/README.md" \
            --ignore="^/node_modules/minimist/LICENSE" \
            --ignore="^/node_modules/minimist/example" \
            --ignore="^/node_modules/minimist/readme.markdown" \
            --ignore="^/node_modules/minimist/test" \
            --ignore="^/node_modules/mkdirp/LICENSE" \
            --ignore="^/node_modules/mkdirp/bin/usage.txt" \
            --ignore="^/node_modules/mkdirp/examples" \
            --ignore="^/node_modules/mkdirp/readme.markdown" \
            --ignore="^/node_modules/mkdirp/test" \
            --ignore="^/node_modules/ms/LICENSE.md" \
            --ignore="^/node_modules/ms/README.md" \
            --ignore="^/node_modules/nan/CHANGELOG.md" \
            --ignore="^/node_modules/nan/LICENSE.md" \
            --ignore="^/node_modules/nan/README.md" \
            --ignore="^/node_modules/nan/doc" \
            --ignore="^/node_modules/nan/nan.h" \
            --ignore="^/node_modules/nan/nan_callbacks.h" \
            --ignore="^/node_modules/nan/nan_callbacks_12_inl.h" \
            --ignore="^/node_modules/nan/nan_callbacks_pre_12_inl.h" \
            --ignore="^/node_modules/nan/nan_converters.h" \
            --ignore="^/node_modules/nan/nan_converters_43_inl.h" \
            --ignore="^/node_modules/nan/nan_converters_pre_43_inl.h" \
            --ignore="^/node_modules/nan/nan_implementation_12_inl.h" \
            --ignore="^/node_modules/nan/nan_implementation_pre_12_inl.h" \
            --ignore="^/node_modules/nan/nan_maybe_43_inl.h" \
            --ignore="^/node_modules/nan/nan_maybe_pre_43_inl.h" \
            --ignore="^/node_modules/nan/nan_new.h" \
            --ignore="^/node_modules/nan/nan_object_wrap.h" \
            --ignore="^/node_modules/nan/nan_persistent_12_inl.h" \
            --ignore="^/node_modules/nan/nan_persistent_pre_12_inl.h" \
            --ignore="^/node_modules/nan/nan_string_bytes.h" \
            --ignore="^/node_modules/nan/nan_typedarray_contents.h" \
            --ignore="^/node_modules/nan/nan_weak.h" \
            --ignore="^/node_modules/nan/tools/README.md" \
            --ignore="^/node_modules/once/LICENSE" \
            --ignore="^/node_modules/once/README.md" \
            --ignore="^/node_modules/os-tmpdir/license" \
            --ignore="^/node_modules/os-tmpdir/readme.md" \
            --ignore="^/node_modules/path-exists/license" \
            --ignore="^/node_modules/path-exists/readme.md" \
            --ignore="^/node_modules/path-is-absolute/license" \
            --ignore="^/node_modules/path-is-absolute/readme.md" \
            --ignore="^/node_modules/photon/CNAME" \
            --ignore="^/node_modules/photon/CONTRIBUTING.md" \
            --ignore="^/node_modules/photon/LICENSE" \
            --ignore="^/node_modules/photon/README.md" \
            --ignore="^/node_modules/photon/docs" \
            --ignore="^/node_modules/photon/sass" \
            --ignore="^/node_modules/pinkie-promise/license" \
            --ignore="^/node_modules/pinkie-promise/readme.md" \
            --ignore="^/node_modules/pinkie/license" \
            --ignore="^/node_modules/pinkie/readme.md" \
            --ignore="^/node_modules/pkg-up/license" \
            --ignore="^/node_modules/pkg-up/readme.md" \
            --ignore="^/node_modules/readable-stream/LICENSE" \
            --ignore="^/node_modules/readable-stream/README.md" \
            --ignore="^/node_modules/ref-struct/History.md" \
            --ignore="^/node_modules/ref-struct/README.md" \
            --ignore="^/node_modules/ref/CHANGELOG.md" \
            --ignore="^/node_modules/ref/README.md" \
            --ignore="^/node_modules/ref/build/Makefile" \
            --ignore="^/node_modules/ref/build/Release/.deps/Release/obj.target/binding/src" \
            --ignore="^/node_modules/ref/build/Release/obj.target/binding/src" \
            --ignore="^/node_modules/ref/build/binding.Makefile" \
            --ignore="^/node_modules/ref/build/binding.target.mk" \
            --ignore="^/node_modules/ref/docs" \
            --ignore="^/node_modules/ref/src" \
            --ignore="^/node_modules/ref/test" \
            --ignore="^/node_modules/rimraf/LICENSE" \
            --ignore="^/node_modules/rimraf/README.md" \
            --ignore="^/node_modules/stream-parser/History.md" \
            --ignore="^/node_modules/stream-parser/LICENSE" \
            --ignore="^/node_modules/stream-parser/README.md" \
            --ignore="^/node_modules/stream-parser/node_modules/debug/.npmignore" \
            --ignore="^/node_modules/stream-parser/node_modules/debug/History.md" \
            --ignore="^/node_modules/stream-parser/node_modules/debug/Makefile" \
            --ignore="^/node_modules/stream-parser/node_modules/debug/Readme.md" \
            --ignore="^/node_modules/stream-parser/node_modules/ms/license.md" \
            --ignore="^/node_modules/stream-parser/node_modules/ms/README.md" \
            --ignore="^/node_modules/stream-parser/test" \
            --ignore="^/node_modules/string_decoder/LICENSE" \
            --ignore="^/node_modules/string_decoder/README.md" \
            --ignore="^/node_modules/temp/LICENSE" \
            --ignore="^/node_modules/temp/README.md" \
            --ignore="^/node_modules/temp/examples" \
            --ignore="^/node_modules/temp/node_modules/rimraf/AUTHORS" \
            --ignore="^/node_modules/temp/node_modules/rimraf/LICENSE" \
            --ignore="^/node_modules/temp/node_modules/rimraf/README.md" \
            --ignore="^/node_modules/temp/node_modules/rimraf/test" \
            --ignore="^/node_modules/temp/test" \
            --ignore="^/node_modules/tunajs/CONTRIBUTE.md" \
            --ignore="^/node_modules/tunajs/README.md" \
            --ignore="^/node_modules/tunajs/tests" \
            --ignore="^/node_modules/wav/History.md" \
            --ignore="^/node_modules/wav/README.md" \
            --ignore="^/node_modules/wav/examples" \
            --ignore="^/node_modules/wav/test" \
            --ignore="^/node_modules/wave-recorder/README.md" \
            --ignore="^/node_modules/wave-recorder/example.js" \
            --ignore="^/node_modules/wrappy/LICENSE" \
            --ignore="^/node_modules/wrappy/README.md" \
            --ignore="^/node_modules/xtend/LICENCE" \
            --ignore="^/node_modules/xtend/Makefile" \
            --ignore="^/node_modules/xtend/README.md" \
            --ignore="^/node_modules/xtend/test.js"`
          , (err, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            cb(err);
          }
    );
  });
});

gulp.task('release', ['tsc'], (cb) => {
  process.chdir('./bin/release');
});

gulp.task('clone', (cb) => {
  var opts = (argv && argv.branch)? {args: '-b '+argv.branch}: {args: '-b master'};
  git.clone('git@github.com:taku-o/myukkurivoice.git', opts, (err) => {
    if (err) {
      cb(err);
    }
  });
});
gulp.task('submodule', () => {
  git.updateSubmodule({ args: '--init' });
});


