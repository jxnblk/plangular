
/*

        PLANGULAR
        A Highly Customizable SoundCloud Player

        Vuejs Version

        http://jxnblk.github.io/Plangular

 */


// To do:
// - player playlist for all tracks in vm

'use strict';

// global.Vue = require('vue');

var plangular = {};
var jsonp = require('jsonp');

plangular.clientID = '0d33361983f16d2527b01fbf6408b7d7';
plangular.api = '//api.soundcloud.com/resolve.json';
plangular.data = {};


var Player = function() {

  var player = {};
  var audio = document.createElement('audio');
  player.i = null;
  player.playing = false;
  player.tracks = [];
  // Load playlist if track is not a set?
  // player.playlist = [];
  player.currentTrack = {};
  player.currentTime = 0;
  player.duration = 0;

  player.play = function(tracks, i) {
    if (i == null) {
      tracks = new Array(tracks);
    }
    this.i = i || 0;
    this.tracks = tracks;
    this.currentTrack = tracks[this.i];
    var track = this.tracks[this.i];
    var src = track.stream_url + '?client_id=' + plangular.clientID;
    if (src != audio.src) audio.src = src;
    audio.play();
    this.playing = track;
  };

  player.pause = function() {
    audio.pause();
    this.playing = false;
  };

  player.playPause = function(tracks, i) {
    if (!tracks) return false;
    if (tracks.length && this.playing != tracks[i]) {
      this.play(tracks, i);
    } else if (!tracks.length && this.playing != tracks) {
      this.play(tracks);
    } else {
      this.pause();
    }
  };

  player.next = function() {
    if (this.i < this.tracks.length - 1) {
      this.i++;
      this.play(this.tracks, this.i);
    }
  };

  player.previous = function() {
    if (this.i > 0) {
      this.i--;
      this.play(this.tracks, this.i);
    }
  };

  player.seek = function(e) {
    if (!audio.seekable) return false;
    var percent = e.layerX / e.srcElement.offsetWidth;
    var time = percent * audio.duration;
    audio.currentTime = time;
  };

  audio.addEventListener('timeupdate', function() {
    player.currentTime = audio.currentTime;
    player.duration = audio.duration;
  });

  audio.addEventListener('ended', function(){
    player.next();
  });

  return player;

};

plangular.player = plangular.player || new Player();



var Soundcloud = Vue.extend({

  data: {

    player: plangular.player,

    play: function(i) {
      var url = this.$data.value;
      var track = plangular.data[url]; // Also sends full playlist for player to handle
      var tracks;
      if (track.tracks) tracks = track.tracks;
      else tracks = track;
      plangular.player.play(tracks, i);
    },

    pause: function() {
      plangular.player.pause();
    },

    playPause: function(i) {
      var url = this.$data.value;
      var track = plangular.data[url];
      var tracks;
      if (track.tracks) tracks = track.tracks;
      else tracks = track;
      plangular.player.playPause(tracks, i);
    }

  },

  directives: {

    'src': function(value) {

      var self = this;
      var player = plangular.player;

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


Vue.component('soundcloud', Soundcloud);


// Duration filter
Vue.filter('duration', function(value) {

  var hours = Math.floor(value/3600),
      minutes = '0' + Math.floor((value % 3600) / 60),
      seconds = '0' + Math.floor((value % 60));

  minutes = minutes.substr(minutes.length - 2);
  seconds = seconds.substr(seconds.length - 2);

  if (!isNaN(seconds)) {
    if (hours) {
      return hours + ':' + minutes + ':' + seconds;
    } else {
      return minutes + ':' + seconds;
    }
  } else {
    return '00:00';
  }

});


