var gulp = gulp || require('gulp');
const del = require('del');
const finclude = require('gulp-file-include');
const fs = require('fs');
const markdownPdf = require('gulp-markdown-pdf');
const markdownHtml = require('gulp-markdown');
const mkdirp = require('mkdirp');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const toc = require('gulp-markdown-toc');
const wrapper = require('gulp-wrapper');

const APP_VERSION = require('./package.json').version;

// table of contents
gulp.task('toc', () => {
  return gulp
    .src('docs/README.md')
    .pipe(toc())
    .pipe(gulp.dest('docs'));
});

// about
gulp.task('about', () => {
  return (
    gulp
      .src('docs/README.md')
      .pipe(replace('src="https://raw.githubusercontent.com/taku-o/myukkurivoice/master/images/', 'src="images/'))
      .pipe(
        toc({
          linkify: function(content) {
            return content;
          },
        })
      )
      .pipe(markdownHtml())
      .pipe(replace(/src="(.*?)\.png"/g, 'src="$1.webp"'))
      .pipe(
        replace(
          /<img (.*?) src="(.*?)\.gif" (.*?)>/g,
          '<video autoplay loop muted playsinline $1 $3><source src="$2.webm" type="video/webm"></video>'
        )
      )
      //.pipe(
      //  replace(
      //    /<a href="http:\/\/www.nicovideo.jp\/watch\/(.*?)">(.*?)<\/a>/g,
      //    '<iframe src="https://ext.nicovideo.jp/thumb_watch/$1?thumb_mode=html" style="border:none; width:400px; height:243px;" scrolling="no" frameborder="0" ng-if="ctrl.isOnline()"></iframe><a href="http://www.nicovideo.jp/watch/$1" ng-if="!ctrl.isOnline()"><img class="border" src="images/$1.webp" width="400" loading="lazy"></a>'
      //  )
      //)
      .pipe(
        replace(
          /<a href="(.*?)"(.*?)>(.*?)<\/a>/g,
          '<a ng-click="ctrl.browser(\'$1\')"$2>$3<span class="icon icon-popup"></span></a>'
        )
      )
      .pipe(
        wrapper({
          header: '<div class="content">',
          footer: '</div>',
        })
      )
      .pipe(
        rename({
          basename: 'about-app',
          extname: '.html',
        })
      )
      .pipe(gulp.dest('docs/_help'))
  );
});

// readme
gulp.task('_readme:html:css', () => {
  return gulp.src(['docs/assets/css/readme-html.css']).pipe(gulp.dest('MYukkuriVoice-darwin-x64/assets/css'));
});
gulp.task('_readme:html:images:assets', () => {
  return gulp.src(['docs/assets/images/*']).pipe(gulp.dest('MYukkuriVoice-darwin-x64/assets/images'));
});
gulp.task('_readme:html:images:app', () => {
  return gulp.src(['images/*.png', 'images/*.gif']).pipe(gulp.dest('MYukkuriVoice-darwin-x64/assets/images'));
});
gulp.task('_readme:pdf', () => {
  return gulp
    .src('docs/README.md')
    .pipe(replace('src="https://raw.githubusercontent.com/taku-o/myukkurivoice/master/images/', 'src="images/'))
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
gulp.task(
  '_readme:html',
  gulp.series(gulp.parallel('_readme:html:css', '_readme:html:images:assets', '_readme:html:images:app'), () => {
    return (
      gulp
        .src('docs/README.md')
        .pipe(
          replace('src="https://raw.githubusercontent.com/taku-o/myukkurivoice/master/images/', 'src="assets/images/')
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
        //.pipe(
        //  replace(
        //    /<a href="http:\/\/www.nicovideo.jp\/watch\/(.*?)">(.*?)<\/a>/g,
        //    '<iframe src="https://ext.nicovideo.jp/thumb_watch/$1?thumb_mode=html" style="border:none; width:400px; height:243px;" scrolling="no" frameborder="0"></iframe>'
        //  )
        //)
        .pipe(
          rename({
            basename: 'README',
            extname: '.html',
          })
        )
        .pipe(gulp.dest('MYukkuriVoice-darwin-x64'))
    );
  })
);
gulp.task('_readme', gulp.parallel('_readme:html'));

// manual
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
gulp.task(
  '_manual',
  gulp.parallel('_manual:html', '_manual:assets:docs', '_manual:assets:angular', '_manual:assets:photon')
);

// releaseslog
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
gulp.task('_releaseslog', gulp.parallel('_releaseslog:pdf'));

// version
gulp.task('_version', (cb) => {
  mkdirp('MYukkuriVoice-darwin-x64', (err) => {
    if (err) {
      gulp.task('_notifyError')();
      cb(err);
      return;
    }
    fs.writeFile('MYukkuriVoice-darwin-x64/version.txt', APP_VERSION, (err) => {
      if (err) {
        gulp.task('_notifyError')();
      }
      cb(err);
    });
  });
});

// _package-contents
gulp.task('_package-contents:cp', () => {
  return gulp
    .src(
      [
        'MYukkuriVoice-darwin-x64/LICENSE',
        'MYukkuriVoice-darwin-x64/LICENSES.chromium.html',
        'MYukkuriVoice-darwin-x64/version',
      ],
      {allowEmpty: true}
    )
    .pipe(gulp.dest('MYukkuriVoice-darwin-x64/licenses'));
});
gulp.task('_package-contents:rm', () => {
  return del(
    [
      'MYukkuriVoice-darwin-x64/LICENSE',
      'MYukkuriVoice-darwin-x64/LICENSES.chromium.html',
      'MYukkuriVoice-darwin-x64/version',
    ],
    {allowEmpty: true}
  );
});
gulp.task('_package-contents', gulp.series('_handleError', '_package-contents:cp', '_package-contents:rm'));

// doc
gulp.task('doc', gulp.parallel('_readme', '_manual', '_releaseslog', '_version', '_package-contents'));
