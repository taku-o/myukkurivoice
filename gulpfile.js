const argv = require('yargs').argv;
const del = require('del');
const eslint = require('gulp-eslint');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const finclude = require('gulp-file-include');
const fs = require('fs');
const fse = require('fs-extra');
const git = require('gulp-git');
const gulp = require('gulp');
const install = require('gulp-install');
const less = require('gulp-less');
const markdownPdf = require('gulp-markdown-pdf');
const markdownHtml = require('gulp-markdown');
const mkdirp = require('mkdirp');
const mocha = require('gulp-mocha');
const notifier = require('node-notifier');
const prettier = require('gulp-prettier');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const rimraf = require('rimraf');
const runSequence = require('run-sequence');
const sourcemaps = require('gulp-sourcemaps');
const spawn = require('child_process').spawn;
const toc = require('gulp-markdown-toc');
const ts = require('gulp-typescript');
const using = require('gulp-using');
const wrapper = require('gulp-wrapper');

const tsProject = ts.createProject('tsconfig.json');

const PACKAGER_CMD = __dirname + '/node_modules/.bin/electron-packager';
const WORK_DIR = __dirname + '/release';
const WORK_REPO_DIR = __dirname + '/release/myukkurivoice';
const APP_PACKAGE_NAME = 'MYukkuriVoice-darwin-x64';

const ELECTRON_VERSION = '3.1.1';
const APP_VERSION = require('./package.json').version;

// default task
gulp.task('default', () => {
  /* eslint-disable-next-line no-console */
  console.log(`
usage:
    gulp --tasks-simple
    gulp all
    gulp tsc
    gulp tsc-debug
    gulp tsc-doc
    gulp lint
    gulp lint-ts
    gulp lint-js
    gulp lint-q
    gulp lint-html
    gulp less
    gulp format
    gulp toc
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

// all
gulp.task('all', (cb) => {
  runSequence('format', 'less', 'tsc', 'tsc-doc', 'lint', 'test', 'staging', (err) => {
    if (err) {
      _notifyError();
    }
    cb(err);
  });
});

// tsc
gulp.task('tsc', () => {
  return gulp
    .src(['*.ts', 'js/*.ts', 'test/*.ts', 'docs/assets/js/*.ts'], {base: '.'})
    .pipe(tsProject())
    .js.pipe(gulp.dest('.'));
});
gulp.task('tsc-debug', () => {
  return gulp
    .src(['*.ts', 'js/*.ts', 'test/*.ts'], {base: '.'})
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .js.pipe(sourcemaps.write())
    .pipe(gulp.dest('.'));
});
gulp.task('_rm-js', () => {
  return del(['*.js', 'js/*.js', 'test/*.js', '!gulpfile.js']);
});
// tsc-doc
gulp.task('tsc-doc', ['tsc'], () => {
  return gulp.src(['js/ctrl.help.js', 'js/directive.include.js', 'js/reducers.help.js']).pipe(gulp.dest('docs/assets/js'));
});

// lint
gulp.task('lint', ['lint-q', 'lint-html']);
gulp.task('lint-ts', () => {
  return gulp
    .src(['*.ts', 'js/*.ts', 'test/*.ts', 'docs/assets/js/*.ts'])
    .pipe(eslint({useEslintrc: true}))
    .pipe(eslint.format());
});
gulp.task('lint-js', () => {
  return gulp
    .src(['*.js', 'js/*.js', 'test/*.js'])
    .pipe(eslint({useEslintrc: true}))
    .pipe(eslint.format());
});
gulp.task('lint-q', () => {
  return gulp
    .src(['*.ts', 'js/*.ts', 'test/*.ts', 'docs/assets/js/*.ts', '*.js', 'js/*.js', 'test/*.js', 'docs/assets/js/*.js'])
    .pipe(eslint({useEslintrc: true, quiet: true}))
    .pipe(eslint.format());
});
// lint-html
gulp.task('lint-html', () => {
  return gulp
    .src(['*.html', 'docs/*.html', 'docs/_help/*.html'], {base: '.'})
    .pipe(using({}))
    .pipe(
      prettier({
        parser: 'angular',
        printWidth: 300,
        proseWrap: 'preserve',
        tabWidth: 2,
        useTabs: false,
      })
    );
});

// less
gulp.task('less', () => {
  return gulp
    .src(['css/*.less', 'docs/assets/css/*.less'], {base: '.'})
    .pipe(less())
    .pipe(gulp.dest('.'));
});

// format
gulp.task('format', ['_format-json', '_format-js', '_format-ts', '_format-md', '_format-less']);
// format-ts
gulp.task('_format-ts', ['_format-ts-eslint', '_format-ts-test']);
gulp.task('_format-ts-eslint', () => {
  return gulp
    .src(['*.ts', 'js/*.ts', 'docs/assets/js/*.ts'], {base: '.'})
    .pipe(eslint({useEslintrc: true, fix: true}))
    .pipe(gulp.dest('.'));
});
gulp.task('_format-ts-test', () => {
  return gulp
    .src(['test/*.ts'], {base: '.'})
    .pipe(
      prettier({
        parser: 'typescript',
        arrowParens: 'always',
        bracketSpacing: false,
        insertPragma: false,
        printWidth: 300,
        proseWrap: 'preserve',
        requirePragma: false,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'all',
        useTabs: false,
      })
    )
    .pipe(gulp.dest('.'));
});
// format-js
gulp.task('_format-js', () => {
  return gulp
    .src(['gulpfile.js'], {base: '.'})
    .pipe(
      prettier({
        arrowParens: 'always',
        bracketSpacing: false,
        insertPragma: false,
        printWidth: 300,
        proseWrap: 'preserve',
        requirePragma: false,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
        useTabs: false,
      })
    )
    .pipe(gulp.dest('.'));
});
// format-html
gulp.task('_format-html', () => {
  return gulp
    .src(['*.html', 'docs/*.html', 'docs/_help/*.html'], {base: '.'})
    .pipe(
      prettier({
        parser: 'angular',
        printWidth: 300,
        proseWrap: 'preserve',
        tabWidth: 2,
        useTabs: false,
      })
    )
    .pipe(gulp.dest('.'));
});
// format-json
gulp.task('_format-json', () => {
  return gulp
    .src(['.eslintrc.json', 'tsconfig.json'], {base: '.'})
    .pipe(
      prettier({
        parser: 'json',
        printWidth: 300,
        proseWrap: 'preserve',
        tabWidth: 2,
        useTabs: false,
      })
    )
    .pipe(gulp.dest('.'));
});
// format-less
gulp.task('_format-less', () => {
  return gulp
    .src(['css/*.less', 'docs/assets/css/*.less'], {base: '.'})
    .pipe(
      prettier({
        parser: 'less',
        printWidth: 300,
        proseWrap: 'preserve',
        tabWidth: 4,
        useTabs: false,
      })
    )
    .pipe(gulp.dest('.'));
});
// format-md
gulp.task('_format-md', () => {
  return gulp
    .src(['docs/*.md'], {base: '.'})
    .pipe(
      prettier({
        parser: 'markdown',
        proseWrap: 'preserve',
        tabWidth: 2,
        useTabs: false,
      })
    )
    .pipe(gulp.dest('.'));
});

// table of contents
gulp.task('toc', () => {
  return gulp
    .src('docs/README.md')
    .pipe(toc())
    .pipe(gulp.dest('docs'));
});

// doc
gulp.task('doc', ['_readme', '_manual', '_releaseslog', '_version', '_package-contents']);

// readme
gulp.task('_readme', ['_readme:html']);
gulp.task('_readme:pdf', () => {
  return gulp
    .src('docs/README.md')
    .pipe(replace('src="https://raw.githubusercontent.com/taku-o/myukkurivoice/master/icns/', 'src="icns/'))
    .pipe(replace('src="https://raw.githubusercontent.com/taku-o/myukkurivoice/master/docs/', 'src="docs/'))
    .pipe(
      toc({
        linkify: function(content) {
          return content;
        },
      })
    )
    .pipe(
      markdownPdf({
        cssPath: 'docs/assets/css/readme-pdf.css',
      })
    )
    .pipe(
      rename({
        basename: 'README',
        extname: '.pdf',
      })
    )
    .pipe(gulp.dest('MYukkuriVoice-darwin-x64'));
});
gulp.task('_readme:html', ['_readme:html:css', '_readme:html:icns', '_readme:html:images'], () => {
  return gulp
    .src('docs/README.md')
    .pipe(replace('src="https://raw.githubusercontent.com/taku-o/myukkurivoice/master/icns/', 'src="assets/icns/'))
    .pipe(replace('src="https://raw.githubusercontent.com/taku-o/myukkurivoice/master/docs/assets/images/', 'src="assets/images/'))
    .pipe(markdownHtml())
    .pipe(
      wrapper({
        header: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>MYukkuriVoice</title>
  <link rel="stylesheet" href="assets/css/readme-html.css">
</head>
<body>`,
        footer: '</body></html>',
      })
    )
    .pipe(
      rename({
        basename: 'README',
        extname: '.html',
      })
    )
    .pipe(gulp.dest('MYukkuriVoice-darwin-x64'));
});
gulp.task('_readme:html:css', () => {
  return gulp.src(['docs/assets/css/readme-html.css']).pipe(gulp.dest('MYukkuriVoice-darwin-x64/assets/css'));
});
gulp.task('_readme:html:icns', () => {
  return gulp.src(['icns/myukkurivoice.iconset/icon_256x256.png']).pipe(gulp.dest('MYukkuriVoice-darwin-x64/assets/icns/myukkurivoice.iconset'));
});
gulp.task('_readme:html:images', () => {
  return gulp.src(['docs/assets/images/*']).pipe(gulp.dest('MYukkuriVoice-darwin-x64/assets/images'));
});

// manual
gulp.task('_manual', ['_manual:html', '_manual:assets:docs', '_manual:assets:angular', '_manual:assets:photon']);
gulp.task('_manual:html', () => {
  return gulp
    .src(['docs/help.html'])
    .pipe(replace('https://cdnjs.cloudflare.com/ajax/libs/photon/0.1.2-alpha/css/photon.css', 'assets/photon/dist/css/photon.css'))
    .pipe(replace('https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.6/angular.min.js', 'assets/angular/angular.min.js'))
    .pipe(replace(/(static-include template-path="(.*?)"(.*>))<\/div>/g, '$3@@include("$2")</div>'))
    .pipe(finclude())
    .pipe(
      rename({
        basename: 'help',
        extname: '.html',
      })
    )
    .pipe(gulp.dest('MYukkuriVoice-darwin-x64'));
});
gulp.task('_manual:assets:docs', () => {
  return gulp.src(['docs/assets/js/*.js', 'docs/assets/css/*.css'], {base: 'docs'}).pipe(gulp.dest('MYukkuriVoice-darwin-x64'));
});
gulp.task('_manual:assets:angular', () => {
  return gulp.src(['node_modules/angular/angular.min.js', 'node_modules/angular/angular.min.js.map'], {base: 'node_modules'}).pipe(gulp.dest('MYukkuriVoice-darwin-x64/assets'));
});
gulp.task('_manual:assets:photon', () => {
  return gulp.src(['node_modules/photon/dist/css/photon.css', 'node_modules/photon/dist/fonts/photon-entypo.woff', 'node_modules/photon/dist/fonts/photon-entypo.ttf'], {base: 'node_modules'}).pipe(gulp.dest('MYukkuriVoice-darwin-x64/assets'));
});

// releaseslog
gulp.task('_releaseslog', ['_releaseslog:pdf']);
gulp.task('_releaseslog:pdf', () => {
  return gulp
    .src('docs/releases.md')
    .pipe(
      markdownPdf({
        cssPath: 'docs/assets/css/readme-pdf.css',
      })
    )
    .pipe(
      rename({
        basename: 'releases',
        extname: '.pdf',
      })
    )
    .pipe(gulp.dest('MYukkuriVoice-darwin-x64'));
});
gulp.task('_releaseslog:txt', () => {
  return gulp
    .src('docs/releases.md')
    .pipe(
      rename({
        basename: 'releases',
        extname: '.txt',
      })
    )
    .pipe(gulp.dest('MYukkuriVoice-darwin-x64'));
});

// version
gulp.task('_version', (cb) => {
  mkdirp('MYukkuriVoice-darwin-x64', (err) => {
    if (err) {
      _notifyError();
      cb(err);
      return;
    }
    fs.writeFile('MYukkuriVoice-darwin-x64/version.txt', APP_VERSION, (err) => {
      if (err) {
        _notifyError();
      }
      cb(err);
    });
  });
});

// _package-contents
gulp.task('_package-contents', (cb) => {
  runSequence('_package-contents:cp', '_package-contents:rm', (err) => {
    if (err) {
      _notifyError();
    }
    cb(err);
  });
});
gulp.task('_package-contents:cp', () => {
  return gulp.src(['MYukkuriVoice-darwin-x64/LICENSE', 'MYukkuriVoice-darwin-x64/LICENSES.chromium.html', 'MYukkuriVoice-darwin-x64/version']).pipe(gulp.dest('MYukkuriVoice-darwin-x64/licenses'));
});
gulp.task('_package-contents:rm', () => {
  return del(['MYukkuriVoice-darwin-x64/LICENSE', 'MYukkuriVoice-darwin-x64/LICENSES.chromium.html', 'MYukkuriVoice-darwin-x64/version']);
});

// clean
gulp.task('clean', ['_rm-js', '_rm-package', '_rm-workdir']);

// test
gulp.task('test', (cb) => {
  fs.access('MYukkuriVoice-darwin-x64/MYukkuriVoice.app', (err) => {
    if (err) {
      runSequence('tsc-debug', '_rm-package', '_package-debug', '_unpacked', '_test', '_notify', (err) => {
        if (err) {
          _notifyError();
        }
        cb(err);
      });
    } else {
      runSequence('tsc-debug', '_test', '_notify', (err) => {
        if (err) {
          _notifyError();
        }
        cb(err);
      });
    }
  });
});
gulp.task('test-rebuild', (cb) => {
  runSequence('tsc-debug', '_rm-package', '_package-debug', '_unpacked', '_test', '_notify', (err) => {
    if (err) {
      _notifyError();
    }
    cb(err);
  });
});
gulp.task('_test', () => {
  const targets = argv && argv.t ? argv.t : 'test/*.js';
  return gulp.src([targets], {read: false}).pipe(mocha({bail: true}));
});

// run app
gulp.task('app', ['tsc-debug'], (cb) => {
  const env = process.env;
  env.DEBUG = 1;
  env.MONITOR = 1;
  env.CONSOLELOG = 1;
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
});

// package
gulp.task('package', (cb) => {
  runSequence('tsc-debug', '_rm-package', '_package-debug', '_unpacked', '_notify', (err) => {
    if (err) {
      _notifyError();
    }
    cb(err);
  });
});

// release
gulp.task('release', (cb) => {
  if (argv && argv.branch) {
    cb('branch is selected');
    return;
  }
  runSequence('_rm-workdir', '_mk-workdir', '_ch-workdir', '_git-clone', '_ch-repodir', '_git-submodule', '_npm-install', 'tsc', 'tsc-doc', '_rm-package', '_package-release', '_unpacked', 'doc', '_zip-app', '_open-appdir', '_notify', (err) => {
    if (err) {
      _notifyError();
    }
    cb(err);
  });
});

// staging
gulp.task('staging', (cb) => {
  if (!(argv && argv.branch)) {
    argv.branch = execSync('/usr/bin/git symbolic-ref --short HEAD')
      .toString()
      .trim();
  }
  runSequence('_rm-workdir', '_mk-workdir', '_ch-workdir', '_git-clone', '_ch-repodir', '_git-submodule', '_npm-install', 'tsc', 'tsc-doc', '_rm-package', '_package-release', '_unpacked', 'doc', '_zip-app', '_open-appdir', '_notify', (err) => {
    if (err) {
      _notifyError();
    }
    cb(err);
  });
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

// app.asar.unpacked
gulp.task('_unpacked', (cb) => {
  runSequence('_unpacked:mkdir', '_unpacked:cp', (err) => {
    if (err) {
      _notifyError();
    }
    cb(err);
  });
});
gulp.task('_unpacked:mkdir', (cb) => {
  const UNPACK_DIR = 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/Resources/app.asar.unpacked';
  mkdirp(`${UNPACK_DIR}/vendor`, (err) => {
    cb(err);
  });
});
gulp.task('_unpacked:cp', (cb) => {
  const UNPACK_DIR = 'MYukkuriVoice-darwin-x64/MYukkuriVoice.app/Contents/Resources/app.asar.unpacked';
  Promise.all([
    fse.copy('vendor/AqKanji2Koe.framework', `${UNPACK_DIR}/vendor/AqKanji2Koe.framework`),
    fse.copy('vendor/AqUsrDic.framework', `${UNPACK_DIR}/vendor/AqUsrDic.framework`),
    fse.copy('vendor/AquesTalk.framework', `${UNPACK_DIR}/vendor/AquesTalk.framework`),
    fse.copy('vendor/AquesTalk2.framework', `${UNPACK_DIR}/vendor/AquesTalk2.framework`),
    fse.copy('vendor/AquesTalk10.framework', `${UNPACK_DIR}/vendor/AquesTalk10.framework`),
    fse.copy('vendor/aq_dic_large', `${UNPACK_DIR}/vendor/aq_dic_large`),
    fse.copy('vendor/phont', `${UNPACK_DIR}/vendor/phont`),
    fse.copy('vendor/maquestalk1', `${UNPACK_DIR}/vendor/maquestalk1`),
    fse.copy('vendor/secret', `${UNPACK_DIR}/vendor/secret`),
  ])
    .then(() => {
      cb();
    })
    .catch((err) => {
      cb(err);
    });
});

// git
gulp.task('_git-clone', (cb) => {
  const opts = argv && argv.branch ? {args: '-b ' + argv.branch} : {args: '-b master'};
  git.clone('git@github.com:taku-o/myukkurivoice.git', opts, (err) => {
    cb(err);
  });
});
gulp.task('_git-submodule', (cb) => {
  git.updateSubmodule({args: '--init'}, cb);
});

// repodir
gulp.task('_ch-repodir', () => {
  process.chdir(WORK_REPO_DIR);
});

// npm
gulp.task('_npm-install', (cb) => {
  gulp
    .src(['./package.json'])
    .pipe(gulp.dest('./'))
    .pipe(
      install(
        {
          npm: '--production',
        },
        cb
      )
    );
});

// zip
gulp.task('_zip-app', (cb) => {
  exec('ditto -c -k --sequesterRsrc --keepParent ' + APP_PACKAGE_NAME + ' ' + APP_PACKAGE_NAME + '.zip', (err, stdout, stderr) => {
    cb(err);
  });
});

// open
gulp.task('_open-appdir', (cb) => {
  exec('open ' + APP_PACKAGE_NAME, (err, stdout, stderr) => {
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
  exec(
    PACKAGER_CMD +
      ` . MYukkuriVoice \
          --platform=darwin --arch=x64 \
          --app-version=${APP_VERSION} \
          --electron-version=${ELECTRON_VERSION} \
          --icon=icns/myukkurivoice.icns --overwrite --asar \
          --protocol-name=myukkurivoice --protocol=myukkurivoice \
          --extend-info=extend.plist \
          --no-prune \
          --ignore="^/js/apps.spec.js" \
          --ignore="^/contents-spec.html" \
          --ignore="^/vendor" \
          --ignore="^/MYukkuriVoice-darwin-x64" \
          --ignore="^/docs" \
          --ignore="^/extend.plist" \
          --ignore="^/icns" \
          --ignore="^/release" \
          --ignore="^/test" \
          --ignore="^/vendor/aqk2k_mac" \
          --ignore="^/vendor/aqtk1-mac" \
          --ignore="^/vendor/aqtk10-mac" \
          --ignore="^/vendor/aqtk2-mac" \
          --ignore="/ffi/deps/" \
          --ignore="/node_modules/@types" \
          --ignore="/node_modules/angular-ui-grid/i18n" \
          --ignore="/node_modules/angular-ui-grid/index.js$" \
          --ignore="/node_modules/angular-ui-grid/less" \
          --ignore="/node_modules/angular-ui-grid/package.json$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.auto-resize.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.auto-resize.min.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.cellnav.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.core.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.css$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.edit.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.empty-base-layer.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.empty-base-layer.min.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.expandable.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.expandable.min.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.exporter.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.exporter.min.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.grouping.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.grouping.min.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.importer.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.importer.min.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.infinite-scroll.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.infinite-scroll.min.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.min.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.move-columns.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.pagination.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.pagination.min.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.pinning.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.pinning.min.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.resize-columns.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.row-edit.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.saveState.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.saveState.min.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.selection.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.tree-base.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.tree-base.min.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.tree-view.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.tree-view.min.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.validate.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.validate.min.js$" \
          --ignore="/node_modules/angular/angular-csp\\.css$" \
          --ignore="/node_modules/angular/angular\\.js$" \
          --ignore="/node_modules/angular/angular\\.min\\.js\\.gzip$" \
          --ignore="/node_modules/angular/index\\.js$" \
          --ignore="/node_modules/angular/package\\.json$" \
          --ignore="/node_modules/intro\\.js/intro\\.js$" \
          --ignore="/node_modules/intro\\.js/introjs-rtl\\.css$" \
          --ignore="/node_modules/intro\\.js/introjs\\.css$" \
          --ignore="/node_modules/intro\\.js/minified/introjs-rtl\\.min\\.css$" \
          --ignore="/node_modules/intro\\.js/themes" \
          --ignore="/node_modules/photon/CNAME$" \
          --ignore="/node_modules/photon/_config\\.yml$" \
          --ignore="/node_modules/photon/dist/template-app/" \
          --ignore="/node_modules/photon/fonts/" \
          --ignore="/docs/" \
          --ignore="/example/" \
          --ignore="/examples/" \
          --ignore="/man/" \
          --ignore="/sample/" \
          --ignore="/samples/" \
          --ignore="/test/" \
          --ignore="/tests/" \
          --ignore="/.+\\.Makefile$" \
          --ignore="/.+\\.cc$" \
          --ignore="/.+\\.coffee$" \
          --ignore="/.+\\.coveralls.yml$" \
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
          --ignore="/Gruntfile\\.js$" \
          --ignore="/HISTORY$" \
          --ignore="/History$" \
          --ignore="/LICENCE$" \
          --ignore="/LICENSE$" \
          --ignore="/LICENSE-MIT\\.txt$" \
          --ignore="/LICENSE-jsbn$" \
          --ignore="/LICENSES\\.chromium\\.html$" \
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
          --ignore="/component\\.json$" \
          --ignore="/example\\.html$" \
          --ignore="/example\\.js$" \
          --ignore="/favicon\\.ico$" \
          --ignore="/gulpfile\\.js$" \
          --ignore="/karma\\.conf\\.js$" \
          --ignore="/license$" \
          --ignore="/license\\.txt$" \
          --ignore="/package-lock\\.json$" \
          --ignore="/project\\.pbxproj$" \
          --ignore="/test\\.js$" \
          --ignore="/tsconfig\\.json$" \
          --ignore="/usage\\.txt$" \
          --ignore="/yarn\\.lock$"`,
    (err, stdout, stderr) => {
      cb(err);
    }
  );
});

gulp.task('_package-debug', (cb) => {
  exec(
    PACKAGER_CMD +
      ` . MYukkuriVoice \
          --platform=darwin --arch=x64 \
          --app-version=${APP_VERSION} \
          --electron-version=${ELECTRON_VERSION} \
          --icon=icns/myukkurivoice.icns --overwrite --asar \
          --protocol-name=myukkurivoice --protocol=myukkurivoice \
          --extend-info=extend.plist \
          --no-prune \
          --ignore="^/vendor" \
          --ignore="^/MYukkuriVoice-darwin-x64" \
          --ignore="^/docs" \
          --ignore="^/extend.plist" \
          --ignore="^/icns" \
          --ignore="^/release" \
          --ignore="^/test" \
          --ignore="^/vendor/aqk2k_mac" \
          --ignore="^/vendor/aqtk1-mac" \
          --ignore="^/vendor/aqtk10-mac" \
          --ignore="^/vendor/aqtk2-mac" \
          --ignore="/ffi/deps/" \
          --ignore="/node_modules/@types" \
          --ignore="/node_modules/angular-ui-grid/i18n" \
          --ignore="/node_modules/angular-ui-grid/index.js$" \
          --ignore="/node_modules/angular-ui-grid/less" \
          --ignore="/node_modules/angular-ui-grid/package.json$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.auto-resize.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.auto-resize.min.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.cellnav.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.core.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.css$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.edit.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.empty-base-layer.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.empty-base-layer.min.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.expandable.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.expandable.min.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.exporter.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.exporter.min.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.grouping.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.grouping.min.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.importer.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.importer.min.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.infinite-scroll.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.infinite-scroll.min.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.min.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.move-columns.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.pagination.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.pagination.min.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.pinning.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.pinning.min.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.resize-columns.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.row-edit.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.saveState.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.saveState.min.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.selection.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.tree-base.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.tree-base.min.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.tree-view.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.tree-view.min.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.validate.js$" \
          --ignore="/node_modules/angular-ui-grid/ui-grid.validate.min.js$" \
          --ignore="/node_modules/angular/angular-csp\\.css$" \
          --ignore="/node_modules/angular/angular\\.js$" \
          --ignore="/node_modules/angular/angular\\.min\\.js\\.gzip$" \
          --ignore="/node_modules/angular/index\\.js$" \
          --ignore="/node_modules/angular/package\\.json$" \
          --ignore="/node_modules/intro\\.js/intro\\.js$" \
          --ignore="/node_modules/intro\\.js/introjs-rtl\\.css$" \
          --ignore="/node_modules/intro\\.js/introjs\\.css$" \
          --ignore="/node_modules/intro\\.js/minified/introjs-rtl\\.min\\.css$" \
          --ignore="/node_modules/intro\\.js/themes/" \
          --ignore="/node_modules/photon/CNAME$" \
          --ignore="/node_modules/photon/_config\\.yml$" \
          --ignore="/node_modules/photon/dist/template-app/" \
          --ignore="/node_modules/photon/fonts/" \
          --ignore="/docs/" \
          --ignore="/example/" \
          --ignore="/examples/" \
          --ignore="/man/" \
          --ignore="/sample/" \
          --ignore="/samples/" \
          --ignore="/test/" \
          --ignore="/tests/" \
          --ignore="/.+\\.Makefile$" \
          --ignore="/.+\\.cc$" \
          --ignore="/.+\\.coffee$" \
          --ignore="/.+\\.coveralls.yml$" \
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
          --ignore="/Gruntfile\\.js$" \
          --ignore="/HISTORY$" \
          --ignore="/History$" \
          --ignore="/LICENCE$" \
          --ignore="/LICENSE$" \
          --ignore="/LICENSE-MIT\\.txt$" \
          --ignore="/LICENSE-jsbn$" \
          --ignore="/LICENSES\\.chromium\\.html$" \
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
          --ignore="/component\\.json$" \
          --ignore="/example\\.html$" \
          --ignore="/example\\.js$" \
          --ignore="/favicon\\.ico$" \
          --ignore="/gulpfile\\.js$" \
          --ignore="/karma\\.conf\\.js$" \
          --ignore="/license$" \
          --ignore="/license\\.txt$" \
          --ignore="/package-lock\\.json$" \
          --ignore="/project\\.pbxproj$" \
          --ignore="/test\\.js$" \
          --ignore="/tsconfig\\.json$" \
          --ignore="/usage\\.txt$" \
          --ignore="/yarn\\.lock$"`,
    (err, stdout, stderr) => {
      cb(err);
    }
  );
});
