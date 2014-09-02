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
  { id: 'basic', name: 'Basic', template: 'basic.html', code: 'basic-code.html' },
  { id: 'time-duration', name: 'Time and Duration', template: '_time.html', code: '_time-code.html' },
  { id: 'conditionals', name: 'Conditionals', template: '_conditionals.html', code: '_conditionals-code.html' },
  { id: 'progress-bar', name: 'Progress Bar', template: '_progress-bar.html', code: '_progress-bar-code.html' },
  { id: 'icons', name: 'Icons', template: '_icons.html', code: '_icons-code.html' },
  { id: 'global-player', name: 'Global Player', template: '_global-player.html', code: '_global-player-code.html' },
  { id: 'playlists', name: 'Playlists', template: '_playlists.html', code: '_playlists-code.html' }
];

data.example = data.examples[0];

methods = {};

methods.hashupdate = function() {
  for (var i = 0; i < this.examples.length; i++) {
    if (this.examples[i].id == window.location.hash.split('#')[1]) {
      this.example = this.examples[i];
    }
  }
};

var view = new Vue({
  el: '#view',
  data: data,
  methods: methods,
  ready: function() {
    var self = this;
    if (window.location.hash) {
      self.hashupdate();
    }
    window.onhashchange = function() {
      console.log('hashchange');
      self.hashupdate();
    };
  }
});

