// Vue Soundcloud component

'use strict';


var jsonp = require('jsonp');
var player = require('./player');

var Soundcloud = Vue.extend({
  data: {
    
    player: player,

    play: function(i) {
      var url = this.$data.value;
      var track = plangular.data[url]; // Also sends full playlist for player to handle
      var tracks;
      if (track.tracks) tracks = track.tracks;
      else tracks = track;
      player.play(tracks, i);
    },
    pause: function() {
      player.pause();
    },
    playPause: function(i) {
      var url = this.$data.value;
      var track = plangular.data[url];
      var tracks;
      if (track.tracks) tracks = track.tracks;
      else tracks = track;
      player.playPause(tracks, i);
    }
  },
  directives: {
    'src': function(value) {
      var self = this;
      self.vm.$data.value = value;
      var preloadPlayer = function(track) {
        if (player.tracks.length > 0) return false;
        player.tracks = track.tracks || new Array(track);
        player.i = 0;
        player.currentTrack = player.tracks[player.i];
      };
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
        preloadPlayer(plangular.data[value]);
      } else {
        jsonp(apiUrl, function(error, response) {
          plangular.data[value] = response;
          for (var key in response) {
            self.vm.$data[key] = response[key];
          }
          preloadPlayer(plangular.data[value]);
        });
      }
    }
  }
});

//module.exports = Vue.component('soundcloud', Soundcloud);
Vue.component('soundcloud', Soundcloud);

