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

var xhr = require('xhr');


var template = {};

Vue.directive('include', function(value) {
  console.log(value);
  var self = this;
  var data = self.vm.$root.$data;
  //var data = {};
  if (template[value]) {
    self.el.innerHTML = template[value];
  } else {
    xhr({ uri: value }, function(error, response) {
      console.log(response);
      self.el.innerHTML = response.response;
      template[value] = response.response;
      var vm = new Vue({ el: self.el, data: data });
    });
  }
});

Vue.directive('include-code', function(value) {
  var self = this;
  var data = self.vm.$root.$data;
  if (template[value]) {
    self.el.innerHTML = template[value];
  } else {
    xhr({ uri: value }, function(error, response) {
      console.log(response);
      template[value] = '<div v-pre>' + response.response + '</div>';
      self.el.innerHTML = template[value];
      var vm = new Vue({ el: self.el, data: data });
    });
  }
});

