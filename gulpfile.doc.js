const del = require('del');
const finclude = require('gulp-file-include');
const fs = require('fs');
const gulp = require('gulp');
const markdownPdf = require('gulp-markdown-pdf');
const markdownHtml = require('gulp-markdown');
const mkdirp = require('mkdirp');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const runSequence = require('run-sequence');
const toc = require('gulp-markdown-toc');
const wrapper = require('gulp-wrapper');

const APP_VERSION = require('./package.json').version;

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
    .pipe(
      replace(
        'src="https://raw.githubusercontent.com/taku-o/myukkurivoice/master/docs/assets/images/',
        'src="assets/images/'
      )
    )
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
  return gulp
    .src(['icns/myukkurivoice.iconset/icon_256x256.png'])
    .pipe(gulp.dest('MYukkuriVoice-darwin-x64/assets/icns/myukkurivoice.iconset'));
});
gulp.task('_readme:html:images', () => {
  return gulp.src(['docs/assets/images/*']).pipe(gulp.dest('MYukkuriVoice-darwin-x64/assets/images'));
});

// manual
gulp.task('_manual', ['_manual:html', '_manual:assets:docs', '_manual:assets:angular', '_manual:assets:photon']);
gulp.task('_manual:html', () => {
  return gulp
    .src(['docs/help.html'])
    .pipe(
      replace(
        'https://cdnjs.cloudflare.com/ajax/libs/photon/0.1.2-alpha/css/photon.css',
        'assets/photon/dist/css/photon.css'
      )
    )
    .pipe(
      replace('https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.8/angular.min.js', 'assets/angular/angular.min.js')
    )
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
  return gulp
    .src(['docs/assets/js/*.js', 'docs/assets/css/*.css'], {base: 'docs'})
    .pipe(gulp.dest('MYukkuriVoice-darwin-x64'));
});
gulp.task('_manual:assets:angular', () => {
  return gulp
    .src(['node_modules/angular/angular.min.js', 'node_modules/angular/angular.min.js.map'], {base: 'node_modules'})
    .pipe(gulp.dest('MYukkuriVoice-darwin-x64/assets'));
});
gulp.task('_manual:assets:photon', () => {
  return gulp
    .src(
      [
        'node_modules/photon/dist/css/photon.css',
        'node_modules/photon/dist/fonts/photon-entypo.woff',
        'node_modules/photon/dist/fonts/photon-entypo.ttf',
      ],
      {base: 'node_modules'}
    )
    .pipe(gulp.dest('MYukkuriVoice-darwin-x64/assets'));
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
      gulp.start('_notifyError');
      cb(err);
      return;
    }
    fs.writeFile('MYukkuriVoice-darwin-x64/version.txt', APP_VERSION, (err) => {
      if (err) {
        gulp.start('_notifyError');
      }
      cb(err);
    });
  });
});

// _package-contents
gulp.task('_package-contents', (cb) => {
  runSequence('_package-contents:cp', '_package-contents:rm', (err) => {
    if (err) {
      gulp.start('_notifyError');
    }
    cb(err);
  });
});
gulp.task('_package-contents:cp', () => {
  return gulp
    .src([
      'MYukkuriVoice-darwin-x64/LICENSE',
      'MYukkuriVoice-darwin-x64/LICENSES.chromium.html',
      'MYukkuriVoice-darwin-x64/version',
    ])
    .pipe(gulp.dest('MYukkuriVoice-darwin-x64/licenses'));
});
gulp.task('_package-contents:rm', () => {
  return del([
    'MYukkuriVoice-darwin-x64/LICENSE',
    'MYukkuriVoice-darwin-x64/LICENSES.chromium.html',
    'MYukkuriVoice-darwin-x64/version',
  ]);
});