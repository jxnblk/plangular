
var jsonp = require('jsonp');
var qs = require('qs');
var api = '//api.soundcloud.com/resolve.json';

module.exports = function(url, client_id, callback) {

  var endpoint = api + '?' + qs.stringify({ url: url, client_id: client_id });

  jsonp(endpoint, callback);

};
