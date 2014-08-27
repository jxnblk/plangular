// Vue Plangular component

'use strict';


var jsonp = require('jsonp');
var player = require('./player');

var Plangular = Vue.extend({

  data: {
    
    player: player,

    play: function(setIndex) {
      player.play(this.index, setIndex);
    },

    pause: function() {
      player.pause();
    },

    playPause: function(setIndex) {
      player.playPause(this.index, setIndex);
    }

  },

  directives: {

    'src': function(value) {

      var self = this;
      self.vm.$data.value = value;

      var elements = document.querySelectorAll('[v-src]');
      for (var i = 0; i < elements.length; i++) {
        if (this.el == elements[i]) {
          self.vm.$data.index = i;
        }
      }

      var apiUrl = plangular.api + '?url=' + value + '&client_id=' + plangular.clientID;

      if (plangular.data[value]) {
        for (var key in plangular.data[value]) {
          self.vm.$data[key] = plangular.data[value][key];
        }
        player.load(plangular.data[value], self.vm.index);
      } else {
        jsonp(apiUrl, function(error, response) {
          plangular.data[value] = response;
          for (var key in response) {
            self.vm.$data[key] = response[key];
          }
          player.load(plangular.data[value], self.vm.index);
        });
      }

    }

  }

});

Vue.component('plangular', Plangular);

