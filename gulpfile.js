const argv = require('yargs').argv;
const del = require('del');
const eslint = require('gulp-eslint');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const fs = require('fs');
const git = require('gulp-git');
const gulp = require('gulp');
const install = require('gulp-install');
const less = require('gulp-less');
const markdownPdf = require('gulp-markdown-pdf');
const markdownHtml = require('gulp-markdown');
const mkdirp = require('mkdirp');
const mocha = require('gulp-mocha');
const notifier = require('node-notifier');
const rename = require("gulp-rename");
const replace = require('gulp-replace');
const rimraf = require('rimraf');
const runSequence = require('run-sequence');
const ts = require('gulp-typescript');
const wrapper = require('gulp-wrapper');

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
  /* eslint-disable-next-line no-console */
  console.log(`
usage:
    gulp --tasks-simple
    gulp tsc
    gulp lint
    gulp lint-js
    gulp lint-q
    gulp less
    gulp doc
    gulp clean
    gulp test [--t=test/mainWindow.js]
    gulp test-rebuild [--t=test/mainWindow.js]
    gulp app
    gulp package
    gulp release
    gulp staging [--branch=develop]
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

// doc
gulp.task('doc', ['_readme', '_manual', '_releaseslog', '_version', '_package-contents']);

// readme
gulp.task('_readme', ['_readme:html']);
gulp.task('_readme:pdf', () => {
  return gulp.src('docs/README.md')
    .pipe(replace('src="https://raw.github.com/taku-o/myukkurivoice/master/icns/', 'src="icns/'))
    .pipe(replace('src="https://raw.github.com/taku-o/myukkurivoice/master/docs/', 'src="docs/'))
    .pipe(markdownPdf({
      cssPath: 'docs/assets/css/readme-pdf.css'
    }))
    .pipe(rename({
      basename: 'README',
      extname: '.pdf'
    }))
    .pipe(gulp.dest('MYukkuriVoice-darwin-x64'));
});
gulp.task('_readme:html', ['_readme:html:css', '_readme:html:icns', '_readme:html:images'], () => {
  return gulp.src('docs/README.md')
    .pipe(replace('src="https://raw.github.com/taku-o/myukkurivoice/master/icns/', 'src="assets/icns/'))
    .pipe(replace('src="https://raw.github.com/taku-o/myukkurivoice/master/docs/images/', 'src="assets/images/'))
    .pipe(markdownHtml())
    .pipe(wrapper({
       header: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>MYukkuriVoice</title>
  <link rel="stylesheet" href="assets/css/readme-html.css">
</head>
<body>`,
       footer: '</body></html>',
    }))
    .pipe(rename({
      basename: 'README',
      extname: '.html'
    }))
    .pipe(gulp.dest('MYukkuriVoice-darwin-x64'));
});
gulp.task('_readme:html:css', () => {
  return gulp.src(['docs/assets/css/readme-html.css'])
    .pipe(gulp.dest('MYukkuriVoice-darwin-x64/assets/css'));
});
gulp.task('_readme:html:icns', () => {
  return gulp.src(['icns/myukkurivoice.iconset/icon_256x256.png'])
    .pipe(gulp.dest('MYukkuriVoice-darwin-x64/assets/icns/myukkurivoice.iconset'));
});
gulp.task('_readme:html:images', () => {
  return gulp.src(['docs/images/*'])
    .pipe(gulp.dest('MYukkuriVoice-darwin-x64/assets/images'));
});

// manual
gulp.task('_manual', ['_manual:html', '_manual:assets:docs', '_manual:assets:angular', '_manual:assets:photon']);
gulp.task('_manual:html', () => {
  return gulp.src(['docs/help.html'])
    .pipe(replace('https://cdnjs.cloudflare.com/ajax/libs/photon/0.1.2-alpha/css/photon.css', 'assets/photon/dist/css/photon.css'))
    .pipe(replace('https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.6/angular.min.js', 'assets/angular/angular.min.js'))
    //.pipe(replace('assets/css/help.css', 'docs/assets/css/help.css'))
    //.pipe(replace('assets/js/apps.help.js', 'docs/assets/js/apps.help.js'))
    .pipe(rename({
      basename: 'help',
      extname: '.html'
    }))
    .pipe(gulp.dest('MYukkuriVoice-darwin-x64'));
});
gulp.task('_manual:assets:docs', () => {
  return gulp.src(['docs/assets/js/apps.help.js', 'docs/assets/css/help.css'], { base: 'docs' })
    .pipe(gulp.dest('MYukkuriVoice-darwin-x64'));
});
gulp.task('_manual:assets:angular', () => {
  return gulp.src(['node_modules/angular/angular.min.js'], { base: 'node_modules' })
    .pipe(gulp.dest('MYukkuriVoice-darwin-x64/assets'));
});
gulp.task('_manual:assets:photon', () => {
  return gulp.src(['node_modules/photon/dist/css/photon.css', 'node_modules/photon/dist/fonts/photon-entypo.woff'], { base: 'node_modules' })
    .pipe(gulp.dest('MYukkuriVoice-darwin-x64/assets'));
});

// releaseslog
gulp.task('_releaseslog', ['_releaseslog:pdf']);
gulp.task('_releaseslog:pdf', () => {
  return gulp.src('docs/releases.md')
    .pipe(markdownPdf({
      cssPath: 'docs/assets/css/readme-pdf.css'
    }))
    .pipe(rename({
      basename: 'releases',
      extname: '.pdf'
    }))
    .pipe(gulp.dest('MYukkuriVoice-darwin-x64'));
});
gulp.task('_releaseslog:txt', () => {
  return gulp.src('docs/releases.md')
    .pipe(rename({
      basename: 'releases',
      extname: '.txt'
    }))
    .pipe(gulp.dest('MYukkuriVoice-darwin-x64'));
});

// version
gulp.task('_version', (cb) => {
  mkdirp('MYukkuriVoice-darwin-x64', (err) => {
    if (err) { _notifyError(); cb(err); return; }
    fs.writeFile('MYukkuriVoice-darwin-x64/version.txt', APP_VERSION, (err) => {
      if (err) { _notifyError(); }
      cb(err);
    });
  });
});

// _package-contents
gulp.task('_package-contents', (cb) => {
  runSequence('_package-contents:cp', '_package-contents:rm', (err) => {
    if (err) { _notifyError(); }
    cb(err);
  });
});
gulp.task('_package-contents:cp', () => {
  return gulp.src(['MYukkuriVoice-darwin-x64/LICENSE', 'MYukkuriVoice-darwin-x64/LICENSES.chromium.html', 'MYukkuriVoice-darwin-x64/version'])
    .pipe(gulp.dest('MYukkuriVoice-darwin-x64/licenses'));
});
gulp.task('_package-contents:rm', () => {
  return del(['MYukkuriVoice-darwin-x64/LICENSE', 'MYukkuriVoice-darwin-x64/LICENSES.chromium.html', 'MYukkuriVoice-darwin-x64/version']);
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
    '_rm-package', '_package-release', 'doc', '_zip-app', '_open-appdir', '_notify',
    (err) => {
      if (err) { _notifyError(); }
      cb(err);
    }
  );
});

// staging
gulp.task('staging', (cb) => {
  if (!(argv && argv.branch)) {
    argv.branch = execSync('/usr/bin/git symbolic-ref --short HEAD').toString().trim();
  }
  runSequence(
    '_rm-workdir', '_mk-workdir', '_ch-workdir',
    '_git-clone', '_ch-repodir', '_git-submodule', '_npm-install',
    '_rm-package', '_package-release', 'doc', '_zip-app', '_open-appdir', '_notify',
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
          --ignore="/node_modules/angular/angular-csp\\.css$" \
          --ignore="/node_modules/angular/angular\\.js$" \
          --ignore="/node_modules/angular/angular\\.min\\.js\\.gzip$" \
          --ignore="/node_modules/angular/index\\.js$" \
          --ignore="/node_modules/angular/package\\.json$" \
          --ignore="/docs/" \
          --ignore="/example/" \
          --ignore="/examples/" \
          --ignore="/man/" \
          --ignore="/sample/" \
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
          --ignore="/.+\\.tgz$" \
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
          --ignore="/\\.hound.yml$" \
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
          --ignore="/node_modules/angular/angular-csp\\.css$" \
          --ignore="/node_modules/angular/angular\\.js$" \
          --ignore="/node_modules/angular/angular\\.min\\.js\\.gzip$" \
          --ignore="/node_modules/angular/index\\.js$" \
          --ignore="/node_modules/angular/package\\.json$" \
          --ignore="/docs/" \
          --ignore="/example/" \
          --ignore="/examples/" \
          --ignore="/man/" \
          --ignore="/sample/" \
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
          --ignore="/.+\\.tgz$" \
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
          --ignore="/\\.hound.yml$" \
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

