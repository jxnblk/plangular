// Docs App

var xhr = require('xhr');

var template = {};
var data = {};

Vue.directive('include', function(value) {
  var self = this;
  var data = self.vm.$root.$data;
  if (template[value]) {
    self.el.innerHTML = template[value];
    var vm = new Vue({ el: self.el, data: data });
  } else {
    xhr({ uri: value }, function(error, response) {
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
      template[value] = response.response;
      self.el.innerHTML = template[value];
    });
  }
});

Vue.component('basic', {
  template: '#basic'
});

data.currentView = 'basic';

data.examples = [
  { name: 'Basic', template: '_basic.html', code: '_basic-code.html' },
  { name: 'Time and Duration', template: '_time.html', code: '_time-code.html' },
  { name: 'Conditionals', template: '_conditionals.html', code: '_conditionals-code.html' },
  { name: 'Progress Bar', template: '_progress-bar.html', code: '_progress-bar-code.html' },
  { name: 'Icons', template: '_icons.html', code: '_icons-code.html' },
  { name: 'Global Player', template: '_global-player.html', code: '_global-player-code.html' },
  { name: 'Playlists', template: '_playlists.html', code: '_playlists-code.html' }
];

data.example = data.examples[0];

var view = new Vue({
  el: '#view',
  data: data
});

