/*

        PLANGULAR
        A Highly Customizable SoundCloud Player

        Angular Version

        http://jxnblk.github.io/Plangular

 */

(function() {

'use strict';

var plangular = angular.module('plangular', []),
    clientID = '0d33361983f16d2527b01fbf6408b7d7',
    iconUrl = 'icons/plangular-icons.svg';

plangular.directive('plangular', function ($document, $rootScope, $http) {
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
      if (!playlist){
        if (player.i+1 < player.tracks.length) {
          player.i++;
          player.play(player.tracks, player.i);
        } else {
          player.pause();
        };
      } else if (playlist && playlist.tracks == player.tracks) {
        if (player.i + 1 < player.tracks.length) {
          player.i++;
          player.play(playlist.tracks, player.i);
        } else {
          player.pause();
        };
      };
    },
    previous: function(playlist) {
      if (playlist.tracks == player.tracks && player.i > 0) {
        player.i = player.i - 1;
        player.play(playlist.tracks, player.i);
      };
    }
  };

  audio.addEventListener('ended', function() {
    $rootScope.$apply(function(){
      if (player.tracks.length > 0) player.next();
      else player.pause();
    });
    
  }, false);

  // Returns the player, audio, track, and other objects
  return {
    restrict: 'A',
    scope: true,
    link: function (scope, elem, attrs) {
      var src = attrs.plangular;
      var params = { url: src, client_id: clientID, callback: 'JSON_CALLBACK' }
      $http.jsonp('//api.soundcloud.com/resolve.json', { params: params }).success(function(data){
        // Handle playlists (i.e. sets)
        if (data.tracks) scope.playlist = data;
        // Handle single track
        else if (data.kind == 'track') scope.track = data;
        // Handle all other data
        else scope.data = data;
      });
      scope.player = player;
      scope.audio = audio;
      scope.currentTime = 0;
      scope.duration = 0;

      // Updates the currentTime and duration for the audio
      audio.addEventListener('timeupdate', function() {
        if (scope.track == player.track || (scope.playlist && scope.playlist.tracks == player.tracks)){
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

// Plangular Icons
plangular.directive('plangularIcon', function() {

  var sprite = {
    play: 'M0 0 L32 16 L0 32 z',
    pause: 'M0 0 H12 V32 H0 z M20 0 H32 V32 H20 z',
    previous: 'M0 0 H4 V14 L32 0 V32 L4 18 V32 H0 z',
    next: 'M0 0 L28 14 V0 H32 V32 H28 V18 L0 32 z',
    close: 'M4 8 L8 4 L16 12 L24 4 L28 8 L20 16 L28 24 L24 28 L16 20 L8 28 L4 24 L12 16 z',
    chevronRight: 'M12 1 L26 16 L12 31 L8 27 L18 16 L8 5 z',
    chevronLeft: 'M20 1 L24 5 L14 16 L24 27 L20 31 L6 16 z',
    heart: 'M0 10 C0 6, 3 2, 8 2 C12 2, 15 5, 16 6 C17 5, 20 2, 24 2 C30 2, 32 6, 32 10 C32 18, 18 29, 16 30 C14 29, 0 18, 0 10',
    download: 'M10 0 H22 V10 H28 L16 24 L4 10 H10 z M0 26 H32 V32 H0',
    check: 'M1 14 L5 10 L13 18 L27 4 L31 8 L13 26 z'
  };

  return {

    restrict: 'A',
    scope: true,
    link: function (scope, elem, attrs) {

      var el = elem[0],
          id = attrs.plangularIcon,
          svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
          path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

      if (!sprite[id]) {
        var availableIcons = '';
        for (var key in sprite) {
          availableIcons += key + ', ';
        };
        console.error(
          'No icon found for ' + id + '.\n\n' +
          'Icons available:\n'+
          availableIcons + '\n\n' +
          'More icons available from http://jxnblk.github.io/geomicons-open'
        );
        return false;
      }

      el.className += ' plangular-icon plangular-icon-' + id;
      svg.setAttribute('class', el.className);
      var vb = el.getAttribute('viewBox') || '0 0 32 32';
      svg.setAttribute('viewBox', vb);
      path.setAttribute('d', sprite[id]);
      svg.appendChild(path);
      el.parentNode.replaceChild(svg, el);
 
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

})();

