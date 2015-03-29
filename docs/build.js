// Build docs page

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var marked = require('marked');
var toc = require('markdown-toc');
var highlight = require('highlight.js');

var data = require('../package.json');
var readme = fs.readFileSync(path.join(__dirname, '../README.md'), 'utf8');
var tpl = _.template(fs.readFileSync(path.join(__dirname, './template.html'), 'utf8'));

// Marked options
var renderer = new marked.Renderer();
renderer.code = function(code, lang) {
  return '<pre>' + highlight.highlightAuto(code, [lang]).value + '</pre>';
};
renderer.heading = function (text, level) {
  var name = _.kebabCase(text);
  var result;
  if (level < 4) {
    result =
      '<h' + level + ' id="' + name + '">'+
      '<a href="#' + name + '">'+ text + '</a>'+
      '</h' + level + '>';
  } else {
    result = '<h' + level + '>' + text + '</h' + level + '>';
  }
  return result;
}


// Format data
//data.title = _.capitalize(data.name);
data.title = 'Plangular';
data.stylesheets = [
  'http://d2v52k3cl9vedd.cloudfront.net/bassdock/1.2.1/bassdock.min.css',
  'http://d2v52k3cl9vedd.cloudfront.net/vhs/0.1.0/vhs.min.css'
];
data.javascripts = [
  'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.15/angular.min.js',
  'dist/plangular.min.js'
];
data.toc = toc(readme).json;
data.content = marked(readme, { renderer: renderer });

data.examples = [
  fs.readFileSync(path.join(__dirname, './examples/basic.html'), 'utf8'),
  fs.readFileSync(path.join(__dirname, './examples/progress.html'), 'utf8'),
  fs.readFileSync(path.join(__dirname, './examples/playlist.html'), 'utf8'),
  fs.readFileSync(path.join(__dirname, './examples/user.html'), 'utf8'),
  fs.readFileSync(path.join(__dirname, './examples/likes.html'), 'utf8'),
];

data.more_examples = [
  //fs.readFileSync(path.join(__dirname, './examples/unstyled.html'), 'utf8'),
  fs.readFileSync(path.join(__dirname, './examples/compact.html'), 'utf8'),
  fs.readFileSync(path.join(__dirname, './examples/inline-progress.html'), 'utf8'),
  fs.readFileSync(path.join(__dirname, './examples/compact-progress.html'), 'utf8'),
  fs.readFileSync(path.join(__dirname, './examples/artwork.html'), 'utf8'),
  fs.readFileSync(path.join(__dirname, './examples/waveform.html'), 'utf8'),
  fs.readFileSync(path.join(__dirname, './examples/custom-image.html'), 'utf8'),
];


var html = tpl(data);

fs.writeFileSync(path.join(__dirname, '../index.html'), html);
console.log('index.html written');

