/*

        PLANGULAR
        A Highly Customizable SoundCloud Player

        Angular Version

        http://jxnblk.github.io/Plangular

 */

(function() {

'use strict';

var plangular = angular.module('plangular', []);

plangular.directive('plangular', ['$http', 'plangularConfig', function ($http, plangularConfig) {
  var clientId = plangularConfig.clientId;

  var audio = document.createElement('audio');

  var player = {
 
    currentTrack: false,
    playing: false,
    tracks: [],
    i: 0,
    playlistIndex: 0,
    data: {},
    currentTime: 0,
    duration: 0,

    load: function(track, index) {
      this.tracks[index] = track;
      if (!this.playing && !this.i && index == 0) {
        this.currentTrack = this.tracks[0];
      }
    },

    play: function(index, playlistIndex) {
      this.i = index || 0;
      var track = this.tracks[this.i];
      if (track.tracks) {
        this.playlistIndex = playlistIndex || 0;
        this.playing = track.tracks[this.playlistIndex];
        var src = track.tracks[this.playlistIndex].stream_url + '?client_id=' + clientId;
      } else {
        this.playing = track;
        var src = track.stream_url + '?client_id=' + clientId;
      }
      this.currentTrack = this.playing;
      if (src != audio.src) audio.src = src;
      audio.play();
    },

    pause: function() {
      audio.pause();
      this.playing = false;
    },

    playPause: function(i, playlistIndex) {
      var track = this.tracks[i];
      if (track.tracks && this.playing != track.tracks[playlistIndex]) {
        this.play(i, playlistIndex);
      } else if (!track.tracks && this.playing != track) {
        this.play(i);
      } else {
        this.pause();
      }
    },

    next: function() {
      var playlist = this.tracks[this.i].tracks || null;
      if (playlist && this.playlistIndex < playlist.length - 1) {
        this.playlistIndex++;
        this.play(this.i, this.playlistIndex);
      } else if (this.i < this.tracks.length - 1) {
        this.i++;
        // Handle advancing to new playlist
        if (this.tracks[this.i].tracks) {
          var playlist = this.tracks[this.i].tracks || null;
          this.playlistIndex = 0;
          this.play(this.i, this.playlistIndex);
        } else {
          this.play(this.i);
        }
      } else if (this.i >= this.tracks.length -1) {
        this.pause();
      }
    },

    previous: function() {
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
    },

    seek: function(e) {
      if (!audio.readyState) return false;
      var xpos = e.offsetX / e.target.offsetWidth;
      audio.currentTime = (xpos * audio.duration);
    }

  };

  audio.addEventListener('timeupdate', function() {
    player.currentTime = audio.currentTime;
    player.duration = audio.duration;
  }, false);

  audio.addEventListener('ended', function() {
    if (player.tracks.length > 0) player.next();
    else player.pause();
  }, false);

  var index = 0;

  return {

    restrict: 'A',
    scope: true,

    link: function (scope, elem, attrs) {

      var src = attrs.plangular;
      var params = { url: src, client_id: clientId, callback: 'JSON_CALLBACK' }

      scope.player = player;
      scope.audio = audio;
      scope.currentTime = 0;
      scope.duration = 0;
      if (src) {
        scope.index = index;
        index++;
      }

      function addKeys(track) {
        for (var key in track) {
          scope[key] = track[key];
        }
      }

      if (!src) {
        //console.log('no src');
      } else if (player.data[src]) {
        scope.track = player.data[src];
        addKeys(scope.track);
      } else {
        $http.jsonp('//api.soundcloud.com/resolve.json', { params: params }).success(function(data){
          scope.track = data;
          addKeys(scope.track);
          player.data[src] = data;
          player.load(data, scope.index);
        });
      }

      scope.play = function(playlistIndex) {
        player.play(scope.index, playlistIndex);
      };

      scope.pause = function() {
        player.pause();
      };

      scope.playPause = function(playlistIndex) {
        player.playPause(scope.index, playlistIndex);
      };

      scope.next = function() {
        player.next();
      };

      scope.previous = function() {
        player.previous();
      };

      audio.addEventListener('timeupdate', function() {
        if (scope.track == player.tracks[player.i]){
          scope.$apply(function() {
            scope.currentTime = player.currentTime;
            scope.duration = player.duration;
          });  
        };
      }, false);
      
      scope.seek = function(e){
        if (player.tracks[player.i] == scope.track) {
          player.seek(e);
        }
      };

    }

  }

}]);


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
    heart: 'M0 10 C0 6, 3 2, 8 2 C12 2, 15 5, 16 6 C17 5, 20 2, 24 2 C30 2, 32 6, 32 10 C32 18, 18 29, 16 30 C14 29, 0 18, 0 10'
  };

  return {

    restrict: 'A',
    scope: true,
    link: function (scope, elem, attrs) {

      var el = elem[0],
          id = attrs.plangularIcon,
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

      el.classList.add('plangular-icon', 'plangular-icon-'+id);
      el.setAttribute('viewBox', '0 0 32 32');
      el.setAttribute('style', 'max-height:100%');
      el.setAttribute('fill', 'currentColor');
      path.setAttribute('d', sprite[id]);
      el.appendChild(path);
 
    }

  }

});


// Filter to convert milliseconds to hours, minutes, seconds
plangular.filter('prettyTime', function() {
  return function(value) {
    var hours = Math.floor(value / 3600),
        mins = '0' + Math.floor((value % 3600) / 60),
        secs = '0' + Math.floor((value % 60));
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

plangular.provider('plangularConfig', function() {
  this.clientId = '0d33361983f16d2527b01fbf6408b7d7';
  var _this = this;
  this.$get = function() {
    return {
      clientId: _this.clientId
    };
  };
});


})();


