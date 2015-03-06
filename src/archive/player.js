// Audio player

'use strict';


var audio = require('./audio');
var plangular = require('./v-plangular');

var Player = function() {

  var player = {};
  player.i = 0;
  player.playlistIndex = 0;
  player.playing = false;
  player.tracks = [];
  player.currentTrack = null;
  player.currentTime = 0;
  player.duration = 0;

  player.play = function(i, playlistIndex) {
    this.i = i || 0;
    var track = this.tracks[this.i];
    if (track.tracks) {
      this.playlistIndex = playlistIndex;
      this.playing = track.tracks[playlistIndex];
      var src = track.tracks[playlistIndex].stream_url + '?client_id=' + plangular.clientID;
    } else {
      this.playing = track;
      var src = track.stream_url + '?client_id=' + plangular.clientID;
    }
    this.currentTrack = this.playing;
    if (src != audio.src) audio.src = src;
    audio.play();
  };

  player.pause = function() {
    audio.pause();
    this.playing = false;
  };

  player.playPause = function(i, playlistIndex) {
    var track = this.tracks[i];
    if (track.tracks && this.playing != track.tracks[playlistIndex]) {
      if (!playlistIndex) playlistIndex = 0;
      this.play(i, playlistIndex);
    } else if (!track.tracks && this.playing != track) {
      this.play(i);
    } else {
      this.pause();
    }
  };

  player.next = function() {
    var playlist = this.tracks[this.i].tracks || null;
    if (playlist && this.playlistIndex < playlist.length - 1) {
      this.playlistIndex++;
      this.play(this.i, this.playlistIndex);
    } else if (this.i < this.tracks.length - 1) {
      this.i++;
      // Handle advancing to new playlist
      var playlist = this.tracks[this.i].tracks || null;
      if (this.tracks[this.i].tracks) {
        this.playlistIndex = 0;
        this.play(this.i, this.playlistIndex);
      } else {
        this.play(this.i);
      }
    }
  };

  player.previous = function() {
    var playlist = this.tracks[this.i].tracks || null;
    if (playlist && this.playlistIndex > 0) {
      this.playlistIndex--;
      this.play(this.i, this.playlistIndex);
    } else if (this.i > 0) {
      this.i--;
      if (this.tracks[this.i].tracks) {
        this.playlistIndex = this.tracks[this.i].tracks.length - 1;
        this.play(this.i, this.playlistIndex);
      } else {
        this.play(this.i);
      }
    }
  };

  player.load = function(track, index) {
    this.tracks[index] = track;
    if (!this.playing && !this.i && index == 0) {
      this.currentTrack = this.tracks[0];
    }
  };

  player.seek = function(e) {
    if (!audio.readyState) return false;
    var percent = e.offsetX / e.target.offsetWidth || (e.layerX - e.target.offsetLeft) / e.target.offsetWidth;
    var time = percent * audio.duration || 0;
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

