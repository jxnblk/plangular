
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

Vue.filter('waveform-path', function(value) {
  // 900 x 200 viewBox
  if (!value) return false;
  var d = 'M0 100 ';
  var avg = 0;
  var half;
  var resolution = 8;
  for (var i = 0; i < value.length; i++){
    avg += value[i];
    if (i%resolution == 0) {
      half = avg / resolution / 2;
      avg = 0;
      d += 'V' + (100 - half) + ' h2 ' + 'V' + (100 + half) + ' h-2 V100 m4 0 ';
    }
  }
  return d;
});


