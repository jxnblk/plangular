// Build docs page

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var blkmark = require('blkmark');

var data = require('../package.json');
var readmeSrc = fs.readFileSync(path.join(__dirname, '../README.md'), 'utf8');
var readme = blkmark(readmeSrc);
var tpl = _.template(fs.readFileSync(path.join(__dirname, './template.html'), 'utf8'));

// Format data
data.title = _.capitalize(data.name);
data.stylesheets = [
  'http://d2v52k3cl9vedd.cloudfront.net/bassdock/1.2.1/bassdock.min.css'
];
data.javascripts = [
  'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.15/angular.min.js',
  'dist/plangular.js'
];
data.toc = readme.toc;
data.content = readme.parts.body;


var html = tpl(data);

fs.writeFileSync(path.join(__dirname, '../index.html'), html);
console.log('index.html written');

