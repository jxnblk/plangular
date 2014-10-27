/*

        PLANGULAR
        A Highly Customizable SoundCloud Player

        Vuejs Version

        http://jxnblk.github.io/Plangular

 */

'use strict';

var plangular = {};
plangular.clientID = '0d33361983f16d2527b01fbf6408b7d7';
plangular.api = '//api.soundcloud.com/resolve.json';
plangular.data = {};

module.exports = plangular;

var jsonp = require('jsonp');
  // Try npm http instead


// TO DO: Move Vue wrappers to top level

// Vue component
require('./v-soundcloud');

require('./v-icons');
require('./v-pretty-time');
//require('./v-waveform');

