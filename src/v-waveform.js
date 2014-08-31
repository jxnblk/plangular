
// Vue directive for private SoundCloud waveform API
// Experimental

'use strict';

var xhr = require('xhr');

Vue.directive('waveform', function(value) {
  if (!value) return false;
  var self = this;
  var waveformUrl = 'http://' + value.replace(/^[^.]*/, 'wis');

  xhr({
    uri: waveformUrl
  }, function(error, response) {
    var data = JSON.parse(response.response);
    self.vm.$data.waveform = data;
  });

});

