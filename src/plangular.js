
// Plangular
// AngularJS Version

'use strict';

var plangular = angular.module('plangular', []);
var resolve = require('soundcloud-resolve-jsonp');
var Player = require('audio-player');
var hhmmss = require('hhmmss');

plangular.directive('plangular', ['$timeout', 'plangularConfig', function($timeout, plangularConfig) {

  var client_id = plangularConfig.clientId;
  var player = new Player();

  return {

    restrict: 'A',
    scope: true,

    link: function(scope, elem, attr) {

      var src = attr.plangular;
      scope.player = player;
      scope.audio = player.audio;
      scope.currentTime = 0;
      scope.duration = 0;
      scope.loading = true;
      scope.track = {};
      scope.index = 0;
      scope.playlist;
      scope.tracks = [];

      function createSrc(track) {
        if (track.stream_url) {
          track.src = track.stream_url + '?client_id=' + client_id;
        }
        return track;
      }

      resolve({ url: src, client_id: client_id }, function(err, res) {
        if (err) { console.error(err); }
        scope.$apply(function() {
          scope.track = createSrc(res);
          if (typeof res === 'array') {
            scope.tracks = res.map(function(track) {
              return createSrc(track);
            });
          } else if (res.tracks) {
            scope.playlist = res;
            scope.tracks = res.tracks.map(function(track) {
              return createSrc(track);
            });
          }
          scope.loading = false;
        });
      });

      scope.play = function(i) {
        if (typeof i !== 'undefined' && scope.tracks) {
          scope.index = i;
          scope.track = scope.tracks[i];
        }
        player.play(scope.track.src);
      };

      scope.pause = function() {
        player.pause();
      };

      scope.playPause = function(i) {
        if (typeof i !== 'undefined' && scope.tracks.length) {
          scope.index = i;
          scope.track = scope.tracks[i];
        }
        player.playPause(scope.track.src);
      };

      scope.previous = function() {
        if (scope.tracks.length < 1) { return false }
        if (scope.index > 0) {
          scope.index--;
          scope.play(scope.index);
        }
      };

      scope.next = function() {
        if (scope.tracks.length < 1) { return false }
        if (scope.index < scope.tracks.length - 1) {
          scope.index++;
          scope.play(scope.index);
        }
      };

      player.audio.addEventListener('timeupdate', function() {
        if (!scope.$$phase && scope.track.src == player.audio.src) {
          $timeout(function() {
            scope.currentTime = player.audio.currentTime;
            scope.duration = player.audio.duration;
          });
        }
      });

      player.audio.addEventListener('ended', function() {
        scope.next();
      });

    }

  }

}]);

plangular.filter('hhmmss', function() {
  return hhmmss;
});

plangular.provider('plangularConfig', function() {
  // Remove this from source
  this.clientId = '0d33361983f16d2527b01fbf6408b7d7';
  var _this = this;
  this.$get = function() {
    return {
      clientId: _this.clientId
    };
  };
});


module.exports = 'plangular';

