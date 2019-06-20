const del = require('del');
const exec = require('child_process').exec;
const fse = require('fs-extra');
const gulp = require('gulp');
const mkdirp = require('mkdirp');
const path = require('path');

const PACKAGER_CMD = path.join(__dirname, './node_modules/.bin/electron-packager');
const ELECTRON_VERSION = require('./package.json').versions.electron;
const APP_VERSION = require('./package.json').version;

// package
gulp.task('package', () => {
  return gulp.series('tsc-debug', '_rm-package', '_package-debug', '_unpacked', '_notify', '_kill')
    .catch((err) => {
      return _notifyError();
    });
});

// app.asar.unpacked
function mkdirUnpacked(platform, cb) {
  const UNPACK_DIR = `MYukkuriVoice-${platform}-x64/MYukkuriVoice.app/Contents/Resources/app.asar.unpacked`;
  mkdirp(`${UNPACK_DIR}/vendor`, (err) => {
    cb(err);
  });
}
function copyUnpackedResources(platform, cb) {
  const UNPACK_DIR = `MYukkuriVoice-${platform}-x64/MYukkuriVoice.app/Contents/Resources/app.asar.unpacked`;
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
}
gulp.task('_unpacked', () => {
  return gulp.series('_unpacked:mkdir', '_unpacked:cp')
    .catch((err) => {
      return _notifyError();
    });
});
gulp.task('_unpacked:store', () => {
  return gulp.series('_unpacked:mkdir:store', '_unpacked:cp:store')
    .catch((err) => {
      return _notifyError();
    });
});
gulp.task('_unpacked:mkdir', (cb) => {
  mkdirUnpacked('darwin', cb);
});
gulp.task('_unpacked:mkdir:store', (cb) => {
  mkdirUnpacked('mas', cb);
});
gulp.task('_unpacked:cp', (cb) => {
  copyUnpackedResources('darwin', cb);
});
gulp.task('_unpacked:cp:store', (cb) => {
  copyUnpackedResources('mas', cb);
});

// package
gulp.task('_rm-package', () => {
  return del(['MYukkuriVoice-darwin-x64', 'MYukkuriVoice-mas-x64']);
});

function getIgnoreFiles(forDebug) {
  let ignores = ` \
    --ignore="^/vendor" \
    --ignore="^/MYukkuriVoice-darwin-x64" \
    --ignore="^/MYukkuriVoice-mas-x64" \
    --ignore="^/docs" \
    --ignore="^/extend.plist$" \
    --ignore="^/gulpfile\\.js$" \
    --ignore="^/gulpfile\\..+\\.js$" \
    --ignore="^/icns" \
    --ignore="^/keys" \
    --ignore="^/release" \
    --ignore="^/test" \
    --ignore="^/vendor/aqk2k_mac" \
    --ignore="^/vendor/aqtk1-mac" \
    --ignore="^/vendor/aqtk10-mac" \
    --ignore="^/vendor/aqtk2-mac" \
    --ignore="/ffi/deps/" \
    --ignore="/node_modules/@types" \
    --ignore="/node_modules/angular-ui-grid/css" \
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
    --ignore="/.+\\.o$" \
    --ignore="/.+\\.py$" \
    --ignore="/.+\\.scss$" \
    --ignore="/.+\\.swp$" \
    --ignore="/.+\\.target\\.mk$" \
    --ignore="/.+\\.tsbuildinfo$" \
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
    --ignore="/yarn\\.lock$" `;

  if (!forDebug) {
    ignores += ` \
        --ignore="^/js/apps.spec.js$" \
        --ignore="^/contents-spec.html$" `;
  }
  return ignores;
}
gulp.task('_package-release', (cb) => {
  const platform = 'darwin';
  exec(
    PACKAGER_CMD +
      ` . MYukkuriVoice \
      --platform=${platform} --arch=x64 \
      --app-version=${APP_VERSION} \
      --electron-version=${ELECTRON_VERSION} \
      --app-bundle-id=jp.nanasi.myukkurivoice \
      --icon=icns/myukkurivoice.icns --overwrite --asar \
      --protocol-name=myukkurivoice --protocol=myukkurivoice \
      --extend-info=extend.plist \
      --no-prune ` +
      getIgnoreFiles(false),
    (err, stdout, stderr) => {
      cb(err);
    }
  );
});
gulp.task('_package-release:store', (cb) => {
  const platform = 'mas';
  exec(
    PACKAGER_CMD +
      ` . MYukkuriVoice \
      --platform=${platform} --arch=x64 \
      --app-version=${APP_VERSION} \
      --electron-version=${ELECTRON_VERSION} \
      --app-bundle-id=jp.nanasi.myukkurivoice \
      --icon=icns/myukkurivoice.icns --overwrite --asar \
      --protocol-name=myukkurivoice --protocol=myukkurivoice \
      --extend-info=extend.plist \
      --no-prune ` +
      getIgnoreFiles(false),
    (err, stdout, stderr) => {
      cb(err);
    }
  );
});
gulp.task('_package-debug', (cb) => {
  const platform = 'darwin';
  exec(
    PACKAGER_CMD +
      ` . MYukkuriVoice \
      --platform=${platform} --arch=x64 \
      --app-version=${APP_VERSION} \
      --electron-version=${ELECTRON_VERSION} \
      --app-bundle-id=jp.nanasi.myukkurivoice \
      --icon=icns/myukkurivoice.icns --overwrite --asar \
      --protocol-name=myukkurivoice --protocol=myukkurivoice \
      --extend-info=extend.plist \
      --no-prune ` +
      getIgnoreFiles(true),
    (err, stdout, stderr) => {
      cb(err);
    }
  );
});
