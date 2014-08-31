
var gulp = require('gulp');

var browserify = require('gulp-browserify');
var connect = require('gulp-connect');
var prefix = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglifyjs');
var watch = require('gulp-watch');

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


gulp.task('sass', function() {
  gulp.src('./docs/autobass.scss')
    .pipe(sass({ options: { outputStyle: 'compressed' } }))
    .pipe(prefix())
    .pipe(gulp.dest('./docs'));
});


gulp.task('server', function() {
  connect.server({});
});


gulp.task('default', ['compilejs', 'sass', 'server'], function() {
  gulp.watch(['./src/**/*', './docs/**/*'], ['compilejs', 'sass']);
});


