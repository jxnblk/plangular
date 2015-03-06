// Vue filter to turn milliseconds into mm:ss

'use strict';


Vue.filter('prettyTime', function(value) {

  var hours = Math.floor(value/3600),
      minutes = '0' + Math.floor((value % 3600) / 60),
      seconds = '0' + Math.floor((value % 60));

  minutes = minutes.substr(minutes.length - 2);
  seconds = seconds.substr(seconds.length - 2);

  if (!isNaN(seconds)) {
    if (hours) {
      return hours + ':' + minutes + ':' + seconds;
    } else {
      return minutes + ':' + seconds;
    }
  } else {
    return '00:00';
  }

});

