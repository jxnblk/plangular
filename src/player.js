// Audio player

'use strict';


var audio = require('./audio');

var Player = function() {

  var player = {};
  //player.audio = audio;
  player.i = null;
  player.playing = false;
  player.tracks = [];
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
    console.log(this);
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
    //console.log(e, e.layerX, e.srcElement.offsetWidth, e.layerX / e.srcElement.offsetWidth);
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

