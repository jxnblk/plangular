// Audio player

'use strict';


var audio = require('./audio');

var Player = function() {

  var player = {};
  player.i = 0;
  player.setIndex = 0;
  player.playing = false;
  player.tracks = [];
  player.currentTrack = {};
  player.currentTime = 0;
  player.duration = 0;

  player.play = function(i, setIndex) {
    if (i == null) console.log('i cant be null no more');
    var track = this.tracks[i] || this.tracks[0];
    console.log(track, track.tracks);
    this.i = i || 0;
    this.currentTrack = this.tracks[this.i]; // consider removing this?
    if (track.tracks) {
      //console.log('its a playlist so we need to handle this');
      this.playing = track.tracks[setIndex];
      var src = track.tracks[setIndex].stream_url + '?client_id=' + plangular.clientID;
    } else {
      this.playing = track;
      var src = track.stream_url + '?client_id=' + plangular.clientID;
    }
    if (src != audio.src) audio.src = src;
    audio.play();
  };

  player.pause = function() {
    audio.pause();
    this.playing = false;
  };

  player.playPause = function(i, setIndex) {
    var track = this.tracks[i];
    if (track.tracks && this.playing != track.tracks[setIndex]) {
      console.log('its a playlist and its not playing so play it player');
      this.play(i, setIndex);
    } else if (!track.tracks && this.playing != track) {
      console.log('we could be playing this but you playing');
      this.play(i);
    } else {
      this.pause();
    }
  };

  player.next = function() {
    console.log(this, this.playlist);
    // Need to handle soundcloud playlists
    if (this.tracks[this.i].tracks) {
      console.log('handle playlists dude');
    }
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

