var gulp = gulp || require('gulp');
var config = require('./config');
const del = require('del');
const exec = require('child_process').exec;
const fse = require('fs-extra');
const mkdirp = require('mkdirp');
const path = require('path');

// app.asar.unpacked
gulp.task('_unpacked:mkdir', (cb) => {
  const platform = process.env.BUILD_PLATFORM;
  if (!platform) {
    throw new Error('BUILD_PLATFORM not set.');
  }
  const UNPACK_VENDOR_DIR = `MYukkuriVoice-${platform}-x64/MYukkuriVoice.app/Contents/Resources/app.asar.unpacked/vendor`;
  mkdirp(`${UNPACK_VENDOR_DIR}`, (err) => {
    cb(err);
  });
});
gulp.task('_unpacked:cp', (cb) => {
  const platform = process.env.BUILD_PLATFORM;
  if (!platform) {
    throw new Error('BUILD_PLATFORM not set.');
  }
  const VENDOR_DIR = 'vendor';
  const UNPACK_VENDOR_DIR = `MYukkuriVoice-${platform}-x64/MYukkuriVoice.app/Contents/Resources/app.asar.unpacked/vendor`;
  Promise.all([
    fse.copy(`${VENDOR_DIR}/AqKanji2Koe.framework`, `${UNPACK_VENDOR_DIR}/AqKanji2Koe.framework`),
    fse.copy(`${VENDOR_DIR}/AqUsrDic.framework`, `${UNPACK_VENDOR_DIR}/AqUsrDic.framework`),
    fse.copy(`${VENDOR_DIR}/AquesTalk2.framework`, `${UNPACK_VENDOR_DIR}/AquesTalk2.framework`),
    fse.copy(`${VENDOR_DIR}/AquesTalk10.framework`, `${UNPACK_VENDOR_DIR}/AquesTalk10.framework`),
    fse.copy(`${VENDOR_DIR}/aq_dic_large`, `${UNPACK_VENDOR_DIR}/aq_dic_large`),
    fse.copy(`${VENDOR_DIR}/phont`, `${UNPACK_VENDOR_DIR}/phont`),
    fse.copy(`${VENDOR_DIR}/maquestalk1-ios`, `${UNPACK_VENDOR_DIR}/maquestalk1-ios`),
    fse.copy(`${VENDOR_DIR}/secret`, `${UNPACK_VENDOR_DIR}/secret`),
  ])
    .then(() => {
      if (platform == 'darwin') {
        return Promise.all([
          fse.copy(`${VENDOR_DIR}/AquesTalk.framework`, `${UNPACK_VENDOR_DIR}/AquesTalk.framework`),
          fse.copy(`${VENDOR_DIR}/maquestalk1`, `${UNPACK_VENDOR_DIR}/maquestalk1`),
        ]);
      } else {
        return Promise.resolve();
      }
    })
    .then(() => {
      cb();
    })
    .catch((err) => {
      cb(err);
    });
});
gulp.task('_unpacked', gulp.series('_handleError', '_unpacked:mkdir', '_unpacked:cp'));

// package
gulp.task('_rm:package', () => {
  return del(['MYukkuriVoice-darwin-x64', 'MYukkuriVoice-mas-x64']);
});

function getIgnoreFiles(forDebug) {
  let ignores = ` \
    --ignore="^/MYukkuriVoice-darwin-x64" \
    --ignore="^/MYukkuriVoice-mas-x64" \
    --ignore="^/build" \
    --ignore="^/docs" \
    --ignore="^/gulpfile\\.js$" \
    --ignore="^/images/sm.+.png$" \
    --ignore="^/images/readme-.+.png$" \
    --ignore="^/images/icon_256x256.png$" \
    --ignore="^/images/.+.gif$" \
    --ignore="^/release" \
    --ignore="^/test" \
    --ignore="^/vendor" \
    --ignore="/node_modules/@types" \
    --ignore="/node_modules/angular-input-highlight/index.html$" \
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
    --ignore="/node_modules/cryptico.js/dist/cryptico.min.js$" \
    --ignore="/node_modules/cryptico.js/src/" \
    --ignore="/node_modules/ffi-napi/build/Release/.deps/Release/obj.target/ffi/deps/libffi/src/" \
    --ignore="/node_modules/ffi-napi/build/Release/.deps/Release/obj.target/ffi_bindings/src/" \
    --ignore="/node_modules/ffi-napi/build/Release/.deps/Release/obj.target/node-addon-api/src/" \
    --ignore="/node_modules/ffi-napi/deps/libffi/" \
    --ignore="/node_modules/intro\\.js/intro\\.js$" \
    --ignore="/node_modules/intro\\.js/introjs-rtl\\.css$" \
    --ignore="/node_modules/intro\\.js/introjs\\.css$" \
    --ignore="/node_modules/intro\\.js/minified/introjs-rtl\\.min\\.css$" \
    --ignore="/node_modules/intro\\.js/themes" \
    --ignore="/node_modules/photon/CNAME$" \
    --ignore="/node_modules/photon/_config\\.yml$" \
    --ignore="/node_modules/photon/dist/template-app/" \
    --ignore="/node_modules/photon/fonts/" \
    --ignore="/node_modules/ref-napi/build/Release/.deps/Release/obj.target/binding/src/" \
    --ignore="/node_modules/ref-napi/build/Release/.deps/Release/obj.target/nothing/node_modules/node-addon-api/src/" \
    --ignore="/node_modules/ref-struct-di/.nyc_output/" \
    --ignore="/docs/" \
    --ignore="/example/" \
    --ignore="/examples/" \
    --ignore="/man/" \
    --ignore="/sample/" \
    --ignore="/samples/" \
    --ignore="/test/" \
    --ignore="/tests/" \
    --ignore="/.+\\.Makefile$" \
    --ignore="/.+\\.c$" \
    --ignore="/.+\\.cc$" \
    --ignore="/.+\\.coffee$" \
    --ignore="/.+\\.coveralls.yml$" \
    --ignore="/.+\\.cpp$" \
    --ignore="/.+\\.gyp$" \
    --ignore="/.+\\.h$" \
    --ignore="/.+\\.hpp$" \
    --ignore="/.+\\.js\\.gzip$" \
    --ignore="/.+\\.js\\.map$" \
    --ignore="/.+\\.jst$" \
    --ignore="/.+\\.less$" \
    --ignore="/.+\\.m$" \
    --ignore="/.+\\.markdown$" \
    --ignore="/.+\\.md$" \
    --ignore="/.+\\.mm$" \
    --ignore="/.+\\.o$" \
    --ignore="/.+\\.obj$" \
    --ignore="/.+\\.py$" \
    --ignore="/.+\\.scss$" \
    --ignore="/.+\\.swp$" \
    --ignore="/.+\\.target\\.mk$" \
    --ignore="/.+\\.tgz$" \
    --ignore="/.+\\.ts$" \
    --ignore="/.+\\.tsbuildinfo$" \
    --ignore="/AUTHORS$" \
    --ignore="/CHANGELOG$" \
    --ignore="/CHANGES$" \
    --ignore="/CONTRIBUTE$" \
    --ignore="/CONTRIBUTING$" \
    --ignore="/ChangeLog$" \
    --ignore="/Doxyfile$" \
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
    --ignore="/\\.forge-meta$" \
    --ignore="/\\.git$" \
    --ignore="/\\.github$" \
    --ignore="/\\.gitignore$" \
    --ignore="/\\.gitmodules$" \
    --ignore="/\\.hound.yml$" \
    --ignore="/\\.jshintrc$" \
    --ignore="/\\.keep$" \
    --ignore="/\\.npmignore$" \
    --ignore="/\\.npmrc$" \
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
    --ignore="/webpack\\..+\\.js$" \
    --ignore="/yarn\\.lock$" `;

  if (!forDebug) {
    ignores += ` \
        --ignore="^/js/apps.spec.js$" \
        --ignore="^/contents-spec.html$" `;
  }
  return ignores;
}
gulp.task('_package:release', (cb) => {
  const platform = process.env.BUILD_PLATFORM;
  if (!platform) {
    throw new Error('BUILD_PLATFORM not set.');
  }
  exec(
    config.cmd.electronPackager +
      ` . MYukkuriVoice \
      --platform=${platform} --arch=x64 \
      --app-version=${config.packageJson.version} \
      --electron-version=${config.packageJson.versions.electron} \
      --app-bundle-id=jp.nanasi.myukkurivoice \
      --icon=build/icns/myukkurivoice.icns --overwrite --asar \
      --protocol-name=myukkurivoice --protocol=myukkurivoice \
      --extend-info=build/extend.plist \
      --no-prune ` +
      getIgnoreFiles(false),
    (err, stdout, stderr) => {
      cb(err);
    }
  );
});
gulp.task('_package:debug', (cb) => {
  const platform = process.env.BUILD_PLATFORM;
  exec(
    config.cmd.electronPackager +
      ` . MYukkuriVoice \
      --platform=${platform} --arch=x64 \
      --app-version=${config.packageJson.version} \
      --electron-version=${config.packageJson.versions.electron} \
      --app-bundle-id=jp.nanasi.myukkurivoice \
      --icon=build/icns/myukkurivoice.icns --overwrite --asar \
      --protocol-name=myukkurivoice --protocol=myukkurivoice \
      --extend-info=build/extend.plist \
      --no-prune ` +
      getIgnoreFiles(true),
    (err, stdout, stderr) => {
      cb(err);
    }
  );
});

// package
gulp.task(
  'package',
  gulp.series(
    '_handleError',
    '_platform:darwin',
    '_target:debug',
    'tsc:debug',
    '_rm:package',
    '_package:debug',
    '_unpacked',
    '_notify',
    '_kill'
  )
);
