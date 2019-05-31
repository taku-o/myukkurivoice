const gulp = require('gulp');
const markdownHtml = require('gulp-markdown');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
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
//gulp.task('_readme:html:css', () => {
//  return gulp.src(['docs/assets/css/readme-html.css']).pipe(gulp.dest('MYukkuriVoice-darwin-x64/assets/css'));
//});
//gulp.task('_readme:html:icns', () => {
//  return gulp
//    .src(['icns/myukkurivoice.iconset/icon_256x256.png'])
//    .pipe(gulp.dest('MYukkuriVoice-darwin-x64/assets/icns/myukkurivoice.iconset'));
//});

