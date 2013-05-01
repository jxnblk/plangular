'use strict';

var plangular = angular.module('plangular', []).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/plangular.html'});
  }]);

plangular.factory('soundcloud', function() {
    // Replace Client ID with your plangular ID
    var clientID = '66828e9e2042e682190d1fde4b02e265';
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
                       //console.log('resolved data');
                       //console.log(data);
                       $scope.resolveData = data;
                     });
                    });
      }
      
    };
    
  });
  
  
plangular.factory('player', function($rootScope, audio, soundcloud) {
    var player,
        track,
        //playing = null,
        paused = false,
          // Check where this is defined
          clientID = soundcloud.clientID,
        currentTimePercentage = audio.currentTime;
        
    player = {

      track: track,
      playing: false,
      //paused: paused,

      play: function(track) {
      
        if (!paused) {
          audio.src = track.stream_url + '?client_id=' + clientID;
        };
        audio.play();
        player.playing = true;
        paused = false;
      },

      pause: function(track) {
        if (player.playing) {
          audio.pause();
          player.playing = false;
          paused = true;
        }
      },
      
      seek: function(time) {
        audio.currentTime = time;
      },
      
    };

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

    // Do I need these?
    $scope.player = player;
    $scope.isPlaying = player.playing;
    $scope.audio = audio;
    
    $scope.clientID = soundcloud.clientID;
    
    $scope.trackURL = 'http://soundcloud.com/j_faraday/easy';
    
    soundcloud.getTrack($scope);
      
  }]);
  
plangular.controller('ScrubberCtrl', ['$scope', 'player', 'audio', function($scope, player, audio){
      function updateView() {
        $scope.$apply(function() {
          $scope.currentBufferPercentage = ((audio.buffered.length && audio.buffered.end(0)) / audio.duration) * 100;
          $scope.currentTimePercentage = (audio.currentTime / audio.duration) * 100;
          $scope.currentTimeMS = (audio.currentTime * 1000).toFixed();
          $scope.durationMS = (audio.duration * 1000).toFixed();
        });
      };
      
      audio.addEventListener('timeupdate', updateView, false);
    
      $scope.seekTo = function($event){
        var xpos = $event.offsetX / $event.target.offsetWidth;
        player.seek(xpos * audio.duration);
      };
  }]);
  
  
  

   
  


