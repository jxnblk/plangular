// Angular docs app

var app = angular.module('app', ['plangular']);

app.controller('ExamplesCtrl', ['$scope', '$location', function($scope, $location) {

  $scope.examples = [
    { id: 'basic', name: 'Basic', template: 'basic.html', code: 'basic-code.html' },
    { id: 'time-duration', name: 'Time and Duration', template: 'time.html', code: 'time-code.html' },
    //{ id: 'conditionals', name: 'Conditionals', template: 'conditionals.html', code: 'conditionals-code.html' },
    { id: 'progress-bar', name: 'Progress Bar', template: 'progress-bar.html', code: 'progress-bar-code.html' },
    { id: 'icons', name: 'Icons', template: 'icons.html', code: 'icons-code.html' },
    { id: 'global-player', name: 'Global Player', template: 'global-player.html', code: 'global-player-code.html' },
    { id: 'playlists', name: 'Playlists', template: 'playlists.html', code: 'playlists-code.html' }
  ];

  function updateHash() {
    $scope.hash = $location.path().split('/')[1];
    for (var i = 0; i < $scope.examples.length; i++) {
      if ($scope.examples[i].id == $scope.hash) {
        $scope.example = $scope.examples[i];
      }
    };
  };

  $scope.example = $scope.examples[0];

  if ($location.path()) updateHash();

  $scope.$on('$locationChangeSuccess', function() {
    updateHash();
  });

}]);

