// Options for gulp markdown

var marked = require('marked');
var pygmentize = require('pygmentize-bundled');

var renderer = new marked.Renderer();

renderer.code = function(code, lang) { return code; };

module.exports = {
  highlight: function (code, lang, callback) {
    pygmentize({ lang: lang, format: 'html' }, code, function(err, result) {
      callback(err, result.toString());
    });
  },
  renderer: renderer
};

