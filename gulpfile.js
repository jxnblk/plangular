
var gulp = require('gulp');

var browserify = require('gulp-browserify');
var connect = require('gulp-connect');
var prefix = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglifyjs');
var watch = require('gulp-watch');
//var exec = require('child_process').exec;

var markdown = require('gulp-markdown');
var marked = require('marked');
var pygmentize = require('pygmentize-bundled');
var through = require('through2');
//var source = require('vinyl-source-stream');

var pyg = function (options) {
  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }
    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-markdown', 'Streaming not supported'));
      return;
    }
    pygmentize({ lang: 'html', format: 'html' }, file.contents.toString(), function(err, result) {
      if (err) return;
      file.contents = new Buffer(result.toString());
      cb(null, file);
    });
    /*
    marked(file.contents.toString(), options, function (err, data) {
      if (err) {
        cb(new gutil.PluginError('gulp-markdown', err, {fileName: file.path}));
        return;
      }

      file.contents = new Buffer(data);
      file.path = gutil.replaceExtension(file.path, '.html');

      cb(null, file);
    });
    */
  });
};

gulp.task('pygmentize', function() {
  gulp.src('./docs/examples/vuejs/partials/*.html')
    .pipe(pyg())
    .pipe(rename(function(path) { path.basename += '-template', path.extname = '.html' }))
    .pipe(gulp.dest('./docs/examples/vuejs/'));
});


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

gulp.task('docs', function() {
  var renderer = new marked.Renderer();
  renderer.code = function(code, lang) {
    return code;
  };
  var options = {
    highlight: function (code, lang, callback) {
      pygmentize({ lang: lang, format: 'html' }, code, function(err, result) {
        callback(err, result.toString());
      });
    },
    renderer: renderer
  };
  gulp.src('./docs/examples/**/*.md')
    .pipe(markdown(options))
    .pipe(gulp.dest('./docs/examples'));
});

gulp.task('docsjs', function() {
  gulp.src('./docs/v-app.js')
    .pipe(browserify())
    .pipe(uglify())
    .pipe(rename('app.js'))
    .pipe(gulp.dest('./docs'));
});


gulp.task('server', function() {
  connect.server();
});


gulp.task('default', ['compilejs', 'sass', 'docs', 'server'], function() {
  gulp.watch(['./src/**/*', './docs/**/*', '!./_site/**/*'], ['compilejs', 'sass', 'docs']);
});


