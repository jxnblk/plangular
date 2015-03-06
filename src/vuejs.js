/*
 * Plangular
 * Vuejs version
 * http://jxnblk.github.io/plangular
 */

var soundcloudResolve = require('soundcloud-resolve');

//var audio = require('./lib/audio');
var Player = require('./lib/player');
var Tracklist = require('./lib/tracklist');

var player = new Player();
var tracklist = new Tracklist();

module.exports = Vue.extend({
  data: {
    player: player,
    track: {}
  },
  ready: function() {
  },
  methods: {
    play: function() {},
    pause: function() {},
    playPause: function() {},
    next: function() {},
    previous: function() {},
  },
  directives: {
    src: function(value) {
      console.log('src value', value);
    }
  }
});

