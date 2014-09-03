// Gulp wrapper for pygmentize-bundled

var pygmentize = require('pygmentize-bundled');
var through = require('through2');

module.exports = function (options) {
  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }
    //if (file.isStream()) {
    //  //cb(new gutil.PluginError('gulp-markdown', 'Streaming not supported'));
    //  return;
    //}
    pygmentize({ lang: 'html', format: 'html' }, file.contents.toString(), function(err, result) {
      if (err) return;
      file.contents = new Buffer(result.toString());
      cb(null, file);
    });
  });
};

