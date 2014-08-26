/*

        PLANGULAR
        A Highly Customizable SoundCloud Player

        Vuejs Version

        http://jxnblk.github.io/Plangular

 */


// To do:
// - player playlist for all tracks in vm
// - soundcloud playlists

'use strict';

var jsonp = require('jsonp');
require('./soundcloud');
require('./icons');
require('./duration-filter');

global.plangular = {};
plangular.clientID = '0d33361983f16d2527b01fbf6408b7d7';
plangular.api = 'http://api.soundcloud.com/resolve.json';
plangular.data = {};


