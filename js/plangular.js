'use strict';

var plangular = angular.module('plangular', []);
var clientID = '0d33361983f16d2527b01fbf6408b7d7';
SC.initialize({ client_id: clientID });

plangular.directive('plangular', function ($document, $rootScope) {
    var audio = $document[0].createElement('audio');
    var player = {
      track: false,
      playing: false,
      paused: false,
      play: function(track) {
        player.track = track;
        if (player.paused != track) audio.src = track.stream_url + '?client_id=' + clientID;
        audio.play();
        player.playing = track;
        player.paused = false;
      },
      pause: function() {
        audio.pause();
        if (player.playing) {
          player.paused = player.playing;
          player.playing = false;  
        };
      }
    };
    audio.addEventListener('ended', function() {
      $rootScope.$apply(player.pause());
    }, false);

    return {
      restrict: 'A',
      scope: { src: '=' },
      link: function (scope, elem, attrs) {
        SC.get('/resolve.json?url=' + scope.src , function(data){
         scope.$apply(function () {
           scope.track = data;
         });
        });
        scope.player = player;
        scope.audio = audio;
        scope.currentTime = 0;
        scope.duration = 0;
        console.log("P L A N G U L I Z I N G : " + scope.src);
        audio.addEventListener('timeupdate', function() {
          if (scope.track == player.track){
            scope.$apply(function() {
              scope.currentTime = (audio.currentTime * 1000).toFixed();
              scope.duration = (audio.duration * 1000).toFixed();
            });  
          };
        }, false);
        scope.seekTo = function($event){
          var xpos = $event.offsetX / $event.target.offsetWidth;
          audio.currentTime = (xpos * audio.duration);
        };
      }
    }
  });


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
