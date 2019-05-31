const gulp = require('gulp');
const markdownHtml = require('gulp-markdown');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const replaceStr = require('gulp-replace-string');
const toc = require('gulp-markdown-toc');
const wrapper = require('gulp-wrapper');

// about
gulp.task('about', [], () => {
  return gulp
    .src('docs/README.md')
    .pipe(
      replace(
        'src="https://raw.githubusercontent.com/taku-o/myukkurivoice/master/images/',
        'src="images/'
      )
    )
    .pipe(
      replaceStr(
        new RegExp('<a href="(.*?)"', 'g'),
        '[[$1]]'
        //'<a ng-click="ctrl.browser(\'$1\'>$2</a>'
      )
    )
    .pipe(
      toc({
        linkify: function(content) {
          return content;
        },
      })
    )
    .pipe(markdownHtml())
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
    .pipe(gulp.dest('docs/_help'));
});

