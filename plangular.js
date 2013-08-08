/*

        PLANGULAR
        A Highly Customizable SoundCloud Player

        http://jxnblk.github.io/Plangular

 */


'use strict';

var plangular = angular.module('plangular', []);
var clientID = '0d33361983f16d2527b01fbf6408b7d7';
SC.initialize({ client_id: clientID });

plangular.directive('plangular', function ($document, $rootScope) {
    // Define the audio engine
    var audio = $document[0].createElement('audio');
    // Define the player object
    var player = {
      track: false,
      playing: false,
      paused: false,
      tracks: null,
      i: null,
      play: function(tracks, i) {
        console.log('play $index: ' + i);
        if (i == null) {
          tracks = new Array(tracks);
          i = 0;
        };
        player.tracks = tracks;
        player.track = tracks[i];
        player.i = i;
        if (player.paused != player.track) audio.src = player.track.stream_url + '?client_id=' + clientID;
        audio.play();
        player.playing = player.track;
        player.paused = false;
      },
      pause: function() {
        audio.pause();
        if (player.playing) {
          player.paused = player.playing;
          player.playing = false;  
        };
      },
      // Functions for playlists (i.e. sets)
      playPlaylist: function(playlist) {
        if (player.tracks == playlist.tracks && player.paused) player.play(player.tracks, player.i);
        else player.play(playlist.tracks, 0);
      },
      next: function(playlist) {
        if (playlist.tracks == player.tracks && player.i + 1 < playlist.tracks.length) {
          player.i++;
          player.play(playlist.tracks, player.i);
        };
      },
      previous: function(playlist) {
        if (playlist.tracks == player.tracks && player.i > 0) {
          player.i = player.i - 1;
          player.play(playlist.tracks, player.i);
        };
      }
    };
    // Pause the player when the audio has ended
    audio.addEventListener('ended', function() {
      $rootScope.$apply(player.pause());
    }, false);
    // Returns the player, audio, track, and other objects
    return {
      restrict: 'A',
      scope: { src: '=' },
      link: function (scope, elem, attrs) {
        SC.get('/resolve.json?url=' + scope.src , function(data){
         scope.$apply(function () {
            // Handle playlists (i.e. sets)
            if (data.tracks) scope.playlist = data;
            // Handle single track
            else if (data.kind == 'track') scope.track = data;
            // Handle all other data
            else scope.data = data;
         });
        });
        scope.player = player;
        scope.audio = audio;
        scope.currentTime = 0;
        scope.duration = 0;
        // Updates the currentTime and duration for the audio
        audio.addEventListener('timeupdate', function() {
          if (scope.track == player.track){
            scope.$apply(function() {
              scope.currentTime = (audio.currentTime * 1000).toFixed();
              scope.duration = (audio.duration * 1000).toFixed();
            });  
          };
        }, false);
        // Handle click events for seeking
        scope.seekTo = function($event){
          var xpos = $event.offsetX / $event.target.offsetWidth;
          audio.currentTime = (xpos * audio.duration);
        };
      }
    }
  });

// Filter to convert milliseconds to hours, minutes, seconds
plangular.filter('playTime', function() {
    return function(ms) {
      var hours = Math.floor(ms / 36e5),
          mins = '0' + Math.floor((ms % 36e5) / 6e4),
          secs = '0' + Math.floor((ms % 6e4) / 1000);
          mins = mins.substr(mins.length - 2);
          secs = secs.substr(secs.length - 2);
      if(!isNaN(secs)){
        if (hours){
          return hours+':'+mins+':'+secs;  
        } else {
          return mins+':'+secs;  
        };
      } else {
        return '00:00';
      };
    };
  });

