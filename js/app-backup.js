'use strict';

var plangular = angular.module('plangular', []);
var clientID = '0d33361983f16d2527b01fbf6408b7d7';
SC.initialize({ client_id: clientID });
  
// plangular.factory('player', function($rootScope, audio) {
//     var player,
//         track,
//         currentTimePercentage = audio.currentTime;   
//     player = {
//       track: track,
//       playing: false,
//       paused: false,
//       play: function(track) {
//         console.log('clicked play ' + track);
//         if (!player.paused) {
//           audio.src = track + '?client_id=' + clientID;
//         };
//         audio.play();
//         player.playing = true;
//         player.paused = false;
//       },
//       pause: function(track) {
//         if (player.playing) {
//           audio.pause();
//           player.playing = false;
//           player.paused = true;
//         }
//       }
//     };
//     audio.addEventListener('ended', function() {
//       $rootScope.$apply(player.pause());
//     }, false);
//     return player;
//   });
   
// plangular.factory('audio', function($document, $rootScope) {
//     var audio = $document[0].createElement('audio');  
//     return audio;
//   });
  
  
// plangular.filter('playTime', function() {
//     return function(ms) {
//       var hours = Math.floor(ms / 36e5),
//           mins = '0' + Math.floor((ms % 36e5) / 6e4),
//           secs = '0' + Math.floor((ms % 6e4) / 1000);
//           mins = mins.substr(mins.length - 2);
//           secs = secs.substr(secs.length - 2);
//       if (hours){
//         return hours+':'+mins+':'+secs;  
//       } else {
//         return mins+':'+secs;  
//       }; 
//     };
//   });
  
  
plangular.controller('PlangularCtrl', ['$scope', 'player', 'audio', function($scope, player, audio) {

    // $scope.audio = audio;
    // $scope.player = player;
    // $scope.trackURL = 'http://soundcloud.com/jxnblk/california-extended';
    // $scope.getTrack = function($scope){
    //     SC.get('/resolve.json?url=' + $scope.trackURL , function(data){
    //      $scope.$apply(function () {
    //        $scope.track = data;
    //      });
    //     });
    //   }
    // $scope.getTrack($scope);
  }]);
  
// plangular.controller('ScrubberCtrl', ['$scope', 'audio', function($scope, audio){
      
//       function updateScrubber() {
//         $scope.$apply(function() {
//           $scope.currentBufferPercentage = ((audio.buffered.length && audio.buffered.end(0)) / audio.duration) * 100;
//           $scope.currentTimePercentage = (audio.currentTime / audio.duration) * 100;
//           $scope.currentTimeMS = (audio.currentTime * 1000).toFixed();
//           $scope.durationMS = (audio.duration * 1000).toFixed();
//         });
//       };
      
//       audio.addEventListener('timeupdate', updateScrubber, false);
    
//       $scope.seekTo = function($event){
//         var xpos = $event.offsetX / $event.target.offsetWidth;
//         audio.currentTime = (xpos * audio.duration);
//       };
//   }]);

plangular.directive('plangular', function ($document) {
    
    var audio = $document[0].createElement('audio');  

    var player,
        track,
        currentTimePercentage = audio.currentTime;   
    player = {
      track: track,
      playing: false,
      paused: false,
      play: function(track) {
        console.log('clicked play ' + track);
        if (!player.paused) {
          audio.src = track + '?client_id=' + clientID;
        };
        audio.play();
        player.playing = true;
        player.paused = false;
      },
      pause: function(track) {
        if (player.playing) {
          audio.pause();
          player.playing = false;
          player.paused = true;
        }
      }
    };
    audio.addEventListener('ended', function() {
      $rootScope.$apply(player.pause());
    }, false);

    return {
      restrict: 'A',
      // template: '<div class="plangular" id="{{src}}">{{track.user.username}} – {{track.title}}</div>'
      //   + '<a href="" class="plangular-play" ng-click="player.play({{track.stream_url}})" ng-hide="player.playing">Play</a>'
      //   + '<a href="" class="plangular-pause" ng-click="player.pause({{track.stream_url}})" ng-show="player.playing">Pause</a>'
      //   + '<pre>{{track}}</pre>',
      scope: {
        src: '='
      },
      link: function (scope, elem, attrs) {
        SC.get('/resolve.json?url=' + scope.src , function(data){
         scope.$apply(function () {
           scope.track = data;
         });
        });
        console.log("I N I T I A L I Z I N G   P L A N G U L A R : " + scope.src);
      },
      player: player
    }
  });
  
  
  

   
  


