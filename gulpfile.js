
var gulp = require('gulp');

var browserify = require('gulp-browserify');
var cheerio = require('gulp-cheerio');
var connect = require('gulp-connect');
var prefix = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglifyjs');
var watch = require('gulp-watch');

var markdown = require('gulp-markdown');

var pygmentize = require('./docs/gulp/pygments');

gulp.task('compilejs', function() {
  gulp.src('./src/v-plangular.js')
    .pipe(browserify())
    .pipe(gulp.dest('./'))
    .pipe(uglify())
    .pipe(rename('v-plangular.min.js'))
    .pipe(gulp.dest('./'));
  gulp.src('./src/ng-plangular.js')
    .pipe(gulp.dest('./'))
    .pipe(uglify())
    .pipe(rename('ng-plangular.min.js'))
    .pipe(gulp.dest('./'));
});


gulp.task('docs-pygmentize', function() {
  gulp.src('./docs/vuejs/src/*.html')
    .pipe(gulp.dest('./docs/vuejs/partials'))
    .pipe(pygmentize())
    .pipe(rename(function(path) { path.basename += '-code', path.extname = '.html' }))
    .pipe(gulp.dest('./docs/vuejs/partials'));
  gulp.src('./docs/angular/src/*.html')
    .pipe(gulp.dest('./docs/angular/partials'))
    .pipe(pygmentize())
    .pipe(cheerio(function($) {
      $('.highlight').attr('ng-non-bindable', '');
    }))
    .pipe(rename(function(path) { path.basename += '-code', path.extname = '.html' }))
    .pipe(gulp.dest('./docs/angular/partials'));
});

gulp.task('docs-sass', function() {
  gulp.src('./docs/src/autobass.scss')
    .pipe(sass({ options: { outputStyle: 'compressed' } }))
    .pipe(prefix())
    .pipe(gulp.dest('./docs'));
});

// Currently unused
//gulp.task('docs-md', function() {
//  var options = require('./docs/gulp/md-options');
//  gulp.src('./docs/examples/**/*.md')
//    .pipe(markdown(options))
//    .pipe(gulp.dest('./docs/examples'));
//});

gulp.task('docs-js', function() {
  gulp.src('./docs/vuejs/src/*.js')
    .pipe(browserify())
    .pipe(uglify())
    .pipe(gulp.dest('./docs/vuejs'));
  gulp.src('./docs/angular/src/*.js')
    .pipe(browserify())
    .pipe(uglify())
    .pipe(gulp.dest('./docs/angular'));
});

gulp.task('server', function() {
  connect.server();
});

gulp.task('default', ['compilejs', 'docs-sass', 'docs-js', 'docs-pygmentize', 'server'], function() {
  gulp.watch(
    ['./src/**/*', './docs/src/**/*', './docs/vuejs/src/**/*', './docs/angular/src/**/*'],
    ['compilejs', 'docs-sass', 'docs-js', 'docs-pygmentize']
  );
});


