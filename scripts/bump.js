
var fs = require('fs');
var path = require('path');
var pkg = require('../package.json');
var bower = require('../bower.json');

bower.version = pkg.version;

fs.writeFileSync(path.join(__dirname, '../bower.json'), JSON.stringify(bower));

