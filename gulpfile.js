const argv = require('yargs').argv;
const del = require('del');
const eslint = require('gulp-eslint');
const exec = require('child_process').exec;
const fs = require('fs');
const git = require('gulp-git');
const gulp = require('gulp');
const install = require('gulp-install');
const less = require('gulp-less');
const markdown = require('gulp-markdown-pdf');
const mkdirp = require('mkdirp');
const mocha = require('gulp-mocha');
const notifier = require('node-notifier');
const rename = require("gulp-rename");
const rimraf = require('rimraf');
const runSequence = require('run-sequence');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');

const ELECTRON_CMD = 'DEBUG=1 '+ __dirname+ '/node_modules/.bin/electron';
const PACKAGER_CMD = __dirname+ '/node_modules/.bin/electron-packager';
const WORK_DIR = __dirname+ '/release';
const WORK_REPO_DIR = __dirname+ '/release/myukkurivoice';
const APP_PACKAGE_NAME = 'MYukkuriVoice-darwin-x64';

const ELECTRON_VERSION = '1.8.8';
const APP_VERSION = require('./package.json').version;

// default task
gulp.task('default', () => {
  console.log(`
usage:
    gulp --tasks-simple
    gulp tsc
    gulp lint
    gulp lint-js
    gulp lint-q
    gulp less
    gulp readme
    gulp clean
    gulp test [--t=test/mainWindow.js]
    gulp test-rebuild [--t=test/mainWindow.js]
    gulp app
    gulp package
    gulp release
    gulp staging --branch=develop
  `);
});

// tsc
gulp.task('tsc', () => {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest('.'));
});

// lint
gulp.task('lint', () => {
  return gulp.src(['*.ts','js/*.ts','test/*.ts', 'docs/assets/js/*.ts'])
    .pipe(eslint({ useEslintrc: true }))
    .pipe(eslint.format());
});
gulp.task('lint-js', ['tsc'], () => {
  return gulp.src(['*.js','js/*.js','test/*.js'])
    .pipe(eslint({ useEslintrc: true }))
    .pipe(eslint.format());
});
gulp.task('lint-q', ['tsc'], () => {
  return gulp.src(['*.ts','js/*.ts','test/*.ts', 'docs/assets/js/*.ts','*.js','js/*.js','test/*.js', 'docs/assets/js/*.js'])
    .pipe(eslint({ useEslintrc: true, quiet: true }))
    .pipe(eslint.format());
});

// less
gulp.task('less', () => {
  return gulp.src(['css/*.less', 'docs/assets/css/*.less'], { base: '.' })
    .pipe(less())
    .pipe(gulp.dest('.'));
});

// readme
gulp.task('readme', ['less'], () => {
  return gulp.src('docs/README.md')
    .pipe(markdown({
      cssPath: 'docs/assets/css/pdf.css'
    }))
    .pipe(rename({
      extname: '.pdf'
    }))
    .pipe(gulp.dest('MYukkuriVoice-darwin-x64'));
});

// version
gulp.task('_version', (cb) => {
  fs.writeFile('MYukkuriVoice-darwin-x64/version', APP_VERSION, (err) => {
    if (err) { _notifyError(); }
    cb(err);
  });
});

// clean
gulp.task('clean', ['_rm-package', '_rm-workdir']);

// test
gulp.task('test', ['tsc'], (cb) => {
  fs.access('MYukkuriVoice-darwin-x64/MYukkuriVoice.app', (err) => {
    if (err) {
      runSequence('_rm-package', '_package-debug', '_test', '_notify', (err) => {
        if (err) { _notifyError(); }
        cb(err);
      });
    } else {
      runSequence('_test', '_notify', (err) => {
        if (err) { _notifyError(); }
        cb(err);
      });
    }
  });
});
gulp.task('test-rebuild', ['tsc'], (cb) => {
  runSequence('_rm-package', '_package-debug', '_test', '_notify', (err) => {
    if (err) { _notifyError(); }
    cb(err);
  });
});
gulp.task('_test', () => {
  const targets = (argv && argv.t)? argv.t: 'test/*.js';
  return gulp.src([targets], {read: false})
    .pipe(mocha({bail: true}));
});

// run app
gulp.task('app', ['tsc'], (cb) => {
  exec(ELECTRON_CMD+ ' .', (err, stdout, stderr) => {
    cb(err);
  });
});

// package
gulp.task('package', (cb) => {
  runSequence(
    'tsc', '_rm-package', '_package-debug', '_notify',
    (err) => {
      if (err) { _notifyError(); }
      cb(err);
    }
  );
});

// release
gulp.task('release', (cb) => {
  if (argv && argv.branch) {
    cb('branch is selected'); return;
  }
  runSequence(
    '_rm-workdir', '_mk-workdir', '_ch-workdir',
    '_git-clone', '_ch-repodir', '_git-submodule', '_npm-install',
    '_rm-package', '_package-release', 'readme', '_version', '_zip-app', '_open-appdir', '_notify',
    (err) => {
      if (err) { _notifyError(); }
      cb(err);
    }
  );
});

// staging
gulp.task('staging', (cb) => {
  if (!(argv && argv.branch)) {
    cb('branch is not selected'); return;
  }
  runSequence(
    '_rm-workdir', '_mk-workdir', '_ch-workdir',
    '_git-clone', '_ch-repodir', '_git-submodule', '_npm-install',
    '_rm-package', '_package-release', 'readme', '_version', '_zip-app', '_open-appdir', '_notify',
    (err) => {
      if (err) { _notifyError(); }
      cb(err);
    }
  );
});

// workdir
gulp.task('_rm-workdir', (cb) => {
  rimraf(WORK_DIR, (err) => {
    cb(err);
  });
});
gulp.task('_mk-workdir', (cb) => {
  mkdirp(WORK_DIR, (err) => {
    cb(err);
  });
});
gulp.task('_ch-workdir', () => {
  process.chdir(WORK_DIR);
});

// git
gulp.task('_git-clone', (cb) => {
  const opts = (argv && argv.branch)? {args: '-b '+argv.branch}: {args: '-b master'};
  git.clone('git@github.com:taku-o/myukkurivoice.git', opts, (err) => {
    cb(err);
  });
});
gulp.task('_git-submodule', (cb) => {
  git.updateSubmodule({ args: '--init' }, cb);
});
gulp.task('_ch-repodir', () => {
  process.chdir(WORK_REPO_DIR);
});

// npm
gulp.task('_npm-install', (cb) => {
  gulp.src(['./package.json'])
  .pipe(gulp.dest('./'))
  .pipe(install({
    npm: '--production'
  }, cb));
});

// zip
gulp.task('_zip-app', (cb) => {
  exec('ditto -c -k --sequesterRsrc --keepParent '+ APP_PACKAGE_NAME+ ' '+ APP_PACKAGE_NAME+ '.zip', (err, stdout, stderr) => {
    cb(err);
  });
});

// open
gulp.task('_open-appdir', (cb) => {
  exec('open '+ APP_PACKAGE_NAME, (err, stdout, stderr) => {
    cb(err);
  });
});

// notify
gulp.task('_notify', () => {
  return notifier.notify({
    title: 'gulp-task',
    message: 'finished.',
    sound: 'Glass',
  });
});
function _notifyError() {
  return notifier.notify({
    title: 'gulp-task',
    message: 'error.',
    sound: 'Frog',
  });
}

// package
gulp.task('_rm-package', () => {
  return del(['MYukkuriVoice-darwin-x64']);
});

gulp.task('_package-release', (cb) => {
  exec(PACKAGER_CMD+ ` . MYukkuriVoice \
          --platform=darwin --arch=x64 \
          --app-version=${APP_VERSION} \
          --electron-version=${ELECTRON_VERSION} \
          --icon=icns/myukkurivoice.icns --overwrite --asar.unpackDir=vendor \
          --ignore="^/js/apps.spec.js" \
          --ignore="^/contents-spec.html" \
          --ignore="^/MYukkuriVoice-darwin-x64" \
          --ignore="^/docs" \
          --ignore="^/icns" \
          --ignore="^/test" \
          --ignore="^/vendor/aqk2k_mac" \
          --ignore="^/vendor/aqtk1-mac" \
          --ignore="^/vendor/aqtk10-mac" \
          --ignore="^/vendor/aqtk2-mac" \
          --ignore="/ffi/deps/" \
          --ignore="/docs/" \
          --ignore="/example/" \
          --ignore="/examples/" \
          --ignore="/man/" \
          --ignore="/sample/" \
          --ignore="/src/" \
          --ignore="/test/" \
          --ignore="/tests/" \
          --ignore="/.+\\.Makefile$" \
          --ignore="/.+\\.cc$" \
          --ignore="/.+\\.coffee$" \
          --ignore="/.+\\.gyp$" \
          --ignore="/.+\\.h$" \
          --ignore="/.+\\.js\\.gzip$" \
          --ignore="/.+\\.js\\.map$" \
          --ignore="/.+\\.jst$" \
          --ignore="/.+\\.less$" \
          --ignore="/.+\\.markdown$" \
          --ignore="/.+\\.md$" \
          --ignore="/.+\\.py$" \
          --ignore="/.+\\.scss$" \
          --ignore="/.+\\.swp$" \
          --ignore="/.+\\.target\\.mk$" \
          --ignore="/.+\\.ts$" \
          --ignore="/AUTHORS$" \
          --ignore="/CHANGELOG$" \
          --ignore="/CHANGES$" \
          --ignore="/CONTRIBUTE$" \
          --ignore="/CONTRIBUTING$" \
          --ignore="/ChangeLog$" \
          --ignore="/HISTORY$" \
          --ignore="/History$" \
          --ignore="/LICENCE$" \
          --ignore="/LICENSE$" \
          --ignore="/LICENSE-MIT\\.txt$" \
          --ignore="/LICENSE-jsbn$" \
          --ignore="/LICENSE\\.APACHE2$" \
          --ignore="/LICENSE\\.BSD$" \
          --ignore="/LICENSE\\.MIT$" \
          --ignore="/LICENSE\\.html$" \
          --ignore="/LICENSE\\.txt$" \
          --ignore="/License$" \
          --ignore="/MAKEFILE$" \
          --ignore="/Makefile$" \
          --ignore="/OWNERS$" \
          --ignore="/README$" \
          --ignore="/README\\.hbs$" \
          --ignore="/README\\.html$" \
          --ignore="/Readme$" \
          --ignore="/\\.DS_Store$" \
          --ignore="/\\.babelrc$" \
          --ignore="/\\.cache/$" \
          --ignore="/\\.editorconfig$" \
          --ignore="/\\.eslintignore$" \
          --ignore="/\\.eslintrc$" \
          --ignore="/\\.eslintrc\\.json$" \
          --ignore="/\\.eslintrc\\.yml$" \
          --ignore="/\\.git$" \
          --ignore="/\\.gitignore$" \
          --ignore="/\\.gitmodules$" \
          --ignore="/\\.jshintrc$" \
          --ignore="/\\.keep$" \
          --ignore="/\\.npmignore$" \
          --ignore="/\\.npmignore$" \
          --ignore="/\\.prettierrc$" \
          --ignore="/\\.prettierrc\\.json$" \
          --ignore="/\\.prettierrc\\.yaml$" \
          --ignore="/\\.python-version$" \
          --ignore="/\\.stylelintrc$" \
          --ignore="/\\.stylelintrc\\.json$" \
          --ignore="/\\.travis\\.yml$" \
          --ignore="/appveyor\\.yml$" \
          --ignore="/bower\\.json$" \
          --ignore="/example\\.js$" \
          --ignore="/favicon\\.ico$" \
          --ignore="/gulpfile\\.js$" \
          --ignore="/license$" \
          --ignore="/package-lock\\.json$" \
          --ignore="/project\\.pbxproj$" \
          --ignore="/test\\.js$" \
          --ignore="/tsconfig\\.json$" \
          --ignore="/usage\\.txt$" \
          --ignore="/yarn\\.lock$"`
        , (err, stdout, stderr) => {
          cb(err);
        }
  );
});

gulp.task('_package-debug', (cb) => {
  exec(PACKAGER_CMD+ ` . MYukkuriVoice \
          --platform=darwin --arch=x64 \
          --app-version=${APP_VERSION} \
          --electron-version=${ELECTRON_VERSION} \
          --icon=icns/myukkurivoice.icns --overwrite --asar.unpackDir=vendor \
          --ignore="^/MYukkuriVoice-darwin-x64" \
          --ignore="^/docs" \
          --ignore="^/icns" \
          --ignore="^/test" \
          --ignore="^/vendor/aqk2k_mac" \
          --ignore="^/vendor/aqtk1-mac" \
          --ignore="^/vendor/aqtk10-mac" \
          --ignore="^/vendor/aqtk2-mac" \
          --ignore="/ffi/deps/" \
          --ignore="/docs/" \
          --ignore="/example/" \
          --ignore="/examples/" \
          --ignore="/man/" \
          --ignore="/sample/" \
          --ignore="/src/" \
          --ignore="/test/" \
          --ignore="/tests/" \
          --ignore="/.+\\.Makefile$" \
          --ignore="/.+\\.cc$" \
          --ignore="/.+\\.coffee$" \
          --ignore="/.+\\.gyp$" \
          --ignore="/.+\\.h$" \
          --ignore="/.+\\.js\\.gzip$" \
          --ignore="/.+\\.js\\.map$" \
          --ignore="/.+\\.jst$" \
          --ignore="/.+\\.less$" \
          --ignore="/.+\\.markdown$" \
          --ignore="/.+\\.md$" \
          --ignore="/.+\\.py$" \
          --ignore="/.+\\.scss$" \
          --ignore="/.+\\.swp$" \
          --ignore="/.+\\.target\\.mk$" \
          --ignore="/.+\\.ts$" \
          --ignore="/AUTHORS$" \
          --ignore="/CHANGELOG$" \
          --ignore="/CHANGES$" \
          --ignore="/CONTRIBUTE$" \
          --ignore="/CONTRIBUTING$" \
          --ignore="/ChangeLog$" \
          --ignore="/HISTORY$" \
          --ignore="/History$" \
          --ignore="/LICENCE$" \
          --ignore="/LICENSE$" \
          --ignore="/LICENSE-MIT\\.txt$" \
          --ignore="/LICENSE-jsbn$" \
          --ignore="/LICENSE\\.APACHE2$" \
          --ignore="/LICENSE\\.BSD$" \
          --ignore="/LICENSE\\.MIT$" \
          --ignore="/LICENSE\\.html$" \
          --ignore="/LICENSE\\.txt$" \
          --ignore="/License$" \
          --ignore="/MAKEFILE$" \
          --ignore="/Makefile$" \
          --ignore="/OWNERS$" \
          --ignore="/README$" \
          --ignore="/README\\.hbs$" \
          --ignore="/README\\.html$" \
          --ignore="/Readme$" \
          --ignore="/\\.DS_Store$" \
          --ignore="/\\.babelrc$" \
          --ignore="/\\.cache/$" \
          --ignore="/\\.editorconfig$" \
          --ignore="/\\.eslintignore$" \
          --ignore="/\\.eslintrc$" \
          --ignore="/\\.eslintrc\\.json$" \
          --ignore="/\\.eslintrc\\.yml$" \
          --ignore="/\\.git$" \
          --ignore="/\\.gitignore$" \
          --ignore="/\\.gitmodules$" \
          --ignore="/\\.jshintrc$" \
          --ignore="/\\.keep$" \
          --ignore="/\\.npmignore$" \
          --ignore="/\\.npmignore$" \
          --ignore="/\\.prettierrc$" \
          --ignore="/\\.prettierrc\\.json$" \
          --ignore="/\\.prettierrc\\.yaml$" \
          --ignore="/\\.python-version$" \
          --ignore="/\\.stylelintrc$" \
          --ignore="/\\.stylelintrc\\.json$" \
          --ignore="/\\.travis\\.yml$" \
          --ignore="/appveyor\\.yml$" \
          --ignore="/bower\\.json$" \
          --ignore="/example\\.js$" \
          --ignore="/favicon\\.ico$" \
          --ignore="/gulpfile\\.js$" \
          --ignore="/license$" \
          --ignore="/package-lock\\.json$" \
          --ignore="/project\\.pbxproj$" \
          --ignore="/test\\.js$" \
          --ignore="/tsconfig\\.json$" \
          --ignore="/usage\\.txt$" \
          --ignore="/yarn\\.lock$"`
        , (err, stdout, stderr) => {
          cb(err);
        }
  );
});

