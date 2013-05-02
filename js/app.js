'use strict';

var plangular = angular.module('plangular', []).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/plangular.html'});
  }]);

// Replace this with Plangular SoundCloud API Client ID
var clientID = '66828e9e2042e682190d1fde4b02e265';

plangular.factory('soundcloud', function() {
     
    SC.initialize({
      client_id: clientID,
      redirect_uri: 'http:/jxnblk.com/plangular'
    });
    
    return {
      clientID: clientID,
    
      getTracks:  function($scope){                
                    SC.get($scope.scget, {limit: 1, offset: 0}, function(data){
                      $scope.$apply(function () {
                        $scope.tracks = data;
                        $scope.tracksLoading = false;
                      });      
                    });
      },   
      
      getTrack:   function($scope){
                    SC.get('/resolve.json?url=' + $scope.trackURL , function(data){
                     $scope.$apply(function () {
                       $scope.track = data;
                       $scope.tracksLoading = false;
                     });
                    });
      },
      
      resolve:    function($scope, params){
                    SC.get('/resolve.json?url=http://soundcloud.com' + $scope.urlPath , function(data){
                     $scope.$apply(function () {
                       $scope.resolveData = data;
                     });
                    });
      }
      
    };
    
  });
  
  
plangular.factory('player', function($rootScope, audio, soundcloud) {
    var player,
        track,
        //paused = false,
        currentTimePercentage = audio.currentTime;
        
    player = {

      track: track,
      playing: false,
      paused: false,

      play: function(track) {
        if (!player.paused) {
          audio.src = track.stream_url + '?client_id=' + clientID;
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
      },
      
      stop: function(track) {
        audio.pause();
        player.playing = false;
        player.paused = false;
      }
      
    };
    
    audio.addEventListener('ended', function() {
      $rootScope.$apply(player.stop());
    }, false);

    return player;
  });
   
plangular.factory('audio', function($document, $rootScope) {
    var audio = $document[0].createElement('audio');  
    return audio;
  });
  
  
plangular.filter('playTime', function() {
    return function(ms) {
      var hours = Math.floor(ms / 36e5),
          mins = '0' + Math.floor((ms % 36e5) / 6e4),
          secs = '0' + Math.floor((ms % 6e4) / 1000);
            mins = mins.substr(mins.length - 2);
            secs = secs.substr(secs.length - 2);
      if (hours){
        return hours+':'+mins+':'+secs;  
      } else {
        return mins+':'+secs;  
      }; 
    };
  });
  
  
plangular.controller('PlangularCtrl', ['$scope', 'soundcloud', 'player', 'audio', function($scope, soundcloud, player, audio) {

    $scope.audio = audio;
    $scope.player = player;
    $scope.trackURL = 'http://soundcloud.com/j_faraday/easy';
    soundcloud.getTrack($scope);
    
    $scope.updateTrack = function(trackURL){
      $scope.trackURL = trackURL;
      player.stop();
      soundcloud.getTrack($scope);
    };
      
  }]);
  
plangular.controller('ScrubberCtrl', ['$scope', 'audio', function($scope, audio){
      
      function updateScrubber() {
        $scope.$apply(function() {
          $scope.currentBufferPercentage = ((audio.buffered.length && audio.buffered.end(0)) / audio.duration) * 100;
          $scope.currentTimePercentage = (audio.currentTime / audio.duration) * 100;
          $scope.currentTimeMS = (audio.currentTime * 1000).toFixed();
          $scope.durationMS = (audio.duration * 1000).toFixed();
        });
      };
      
      audio.addEventListener('timeupdate', updateScrubber, false);
    
      $scope.seekTo = function($event){
        var xpos = $event.offsetX / $event.target.offsetWidth;
        audio.currentTime = (xpos * audio.duration);
      };
  }]);
  
  
  

   
  


