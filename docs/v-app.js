// Docs App

require('../src/v-waveform');

Vue.filter('logowave', function(value) {
  if (!value) return 0;
  // Value in is currentTime
  // Returns opacity level
  // Plangular sound is 10 seconds
  var ops = [0, 1, .8, .3, 0];
  if (0 < value < .2) return ops[0];
  else if (value < 1) return ops[1];
  else if (value < 2) return ops[2];
  else if (value < 5) return ops[3];
  else return 0;
});

// Herro

