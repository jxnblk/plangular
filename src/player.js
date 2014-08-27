// Audio player

'use strict';


var audio = require('./audio');

var Player = function() {

  var player = {};
  player.i = 0;
  player.playing = false;
  player.tracks = [];
  player.playlist = []; // Deprecate? Playlist for single tracks
  player.currentTrack = {};
  player.currentTime = 0;
  player.duration = 0;

  player.play = function(i) {
    if (i == null) console.log('i cant be null anymore');
    var track = this.tracks[i] || this.tracks[0];
    this.i = i || 0;
    this.currentTrack = this.tracks[this.i]; // consider removing this?
    if (track.tracks) {
      console.log('its a playlist so we need to handle this');
    }
    var src = track.stream_url + '?client_id=' + plangular.clientID;
    if (src != audio.src) audio.src = src;
    audio.play();
    this.playing = track;
  };

  player.pause = function() {
    audio.pause();
    this.playing = false;
  };

  player.playPause = function(i) {
    var track = this.tracks[i];
    if (track.tracks && this.playing != track.tracks[i]) {
      console.log('its a playlist and its not playing so play it player');
      this.play(i);
    } else if (this.playing != track) {
      console.log('we could be playing this but you playing');
      this.play(i);
    } else {
      this.pause();
    }
  };

  player.next = function() {
    console.log(this, this.playlist);
    // Need to handle soundcloud playlists
    if (this.i < this.tracks.length - 1) {
      this.i++;
      this.play(this.i);
    }
  };

  player.previous = function() {
    if (this.i > 0) {
      this.i--;
      this.play(this.i);
    }
  };

  player.load = function(track, index) {
    this.tracks[index] = track;
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

var player = player || new Player();

module.exports = player;

