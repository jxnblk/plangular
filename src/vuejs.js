/*
 * Plangular
 * Vuejs version
 * http://jxnblk.github.io/plangular
 */

var client_id = global.client_id || require('../config.json').client_id;
var api = '//api.soundcloud.com/resolve.json';

//var resolve = require('soundcloud-resolve');


var resolve = require('./lib/soundcloud-resolve-jsonp');


//var audio = require('./lib/audio');
var Player = require('./lib/player');
var Tracklist = require('./lib/tracklist');

var player = new Player();
var tracklist = new Tracklist();

module.exports = Vue.extend({
  data: {
    player: player,
    track: {},
  },
  computed: {
    src: function() {
      return this.track.stream_url + '?client_id=' + client_id;
    }
  },
  ready: function() {
  },
  methods: {
    play: function() {
      player.play(this.src);
    },
    pause: player.pause,
    playPause: function() {
      console.log(this.src);
      player.playPause(this.src);
    },
    next: function() {},
    previous: function() {},
  },
  directives: {
    src: function(value) {
      var self = this;
      self.vm.$parent.plangular = self.vm.$parent.plangular || { instances: 0 };
      var index = self.vm.$parent.plangular.instances;
      self.vm.index = index;
      self.vm.$parent.plangular.instances++;
      resolve(value, client_id, function(err, response) {
        if (err) {
          console.error(err);
        }
        //console.log(response);
        for (var key in response) {
          self.vm.$data[key] = response[key];
        }
        self.vm.track = response;
        tracklist.loadTrack(response, index);
      });
    }
  }
});

