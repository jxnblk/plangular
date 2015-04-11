(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.plangular = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var audio = require('./lib/audio');

module.exports = function() {

  this.playing = false;

  this.audio = audio;
  //this.currentTime = audio.currentTime;
  //this.duration = audio.duration;
  
  this.play = function(src) {
    if (src != audio.src) { audio.src = src; }
    audio.play();
    this.playing = src;
  }

  this.pause = function() {
    audio.pause();
    this.playing = false;
  }

  this.playPause = function(src) {
    if (src != this.playing) {
      this.play(src);
    } else {
      this.pause();
    }
  }

    this.seek = function(e) {
      if (!audio.readyState) return false;

      var xpos;
      //if FF
      if (e.offsetX === undefined) {

        //calc offset for FF
        var target = e.target || e.srcElement,
          rect = target.getBoundingClientRect(),
          offsetX = e.clientX - rect.left;

        xpos = offsetX / e.originalEvent.target.offsetWidth;
        audio.currentTime = (xpos * audio.duration);

      } else {
        xpos = e.offsetX / e.target.offsetWidth;
        audio.currentTime = (xpos * audio.duration);
      }
    };

  this.init = function() {
    // Potentially add audio event listeners
    return this;
  }

  return this.init();

};


},{"./lib/audio":2}],2:[function(require,module,exports){
(function (global){
// Audio element

var audio = global.audio || document.createElement('audio');

module.exports = audio;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
function corslite(url, callback, cors) {
    var sent = false;

    if (typeof window.XMLHttpRequest === 'undefined') {
        return callback(Error('Browser not supported'));
    }

    if (typeof cors === 'undefined') {
        var m = url.match(/^\s*https?:\/\/[^\/]*/);
        cors = m && (m[0] !== location.protocol + '//' + location.domain +
                (location.port ? ':' + location.port : ''));
    }

    var x = new window.XMLHttpRequest();

    function isSuccessful(status) {
        return status >= 200 && status < 300 || status === 304;
    }

    if (cors && !('withCredentials' in x)) {
        // IE8-9
        x = new window.XDomainRequest();

        // Ensure callback is never called synchronously, i.e., before
        // x.send() returns (this has been observed in the wild).
        // See https://github.com/mapbox/mapbox.js/issues/472
        var original = callback;
        callback = function() {
            if (sent) {
                original.apply(this, arguments);
            } else {
                var that = this, args = arguments;
                setTimeout(function() {
                    original.apply(that, args);
                }, 0);
            }
        }
    }

    function loaded() {
        if (
            // XDomainRequest
            x.status === undefined ||
            // modern browsers
            isSuccessful(x.status)) callback.call(x, null, x);
        else callback.call(x, x, null);
    }

    // Both `onreadystatechange` and `onload` can fire. `onreadystatechange`
    // has [been supported for longer](http://stackoverflow.com/a/9181508/229001).
    if ('onload' in x) {
        x.onload = loaded;
    } else {
        x.onreadystatechange = function readystate() {
            if (x.readyState === 4) {
                loaded();
            }
        };
    }

    // Call the callback with the XMLHttpRequest object as an error and prevent
    // it from ever being called again by reassigning it to `noop`
    x.onerror = function error(evt) {
        // XDomainRequest provides no evt parameter
        callback.call(this, evt || true, null);
        callback = function() { };
    };

    // IE9 must have onprogress be set to a unique function.
    x.onprogress = function() { };

    x.ontimeout = function(evt) {
        callback.call(this, evt, null);
        callback = function() { };
    };

    x.onabort = function(evt) {
        callback.call(this, evt, null);
        callback = function() { };
    };

    // GET is the only supported HTTP Verb by XDomainRequest and is the
    // only one supported here.
    x.open('GET', url, true);

    // Send the request. Sending data is not supported.
    x.send(null);
    sent = true;

    return x;
}

if (typeof module !== 'undefined') module.exports = corslite;

},{}],4:[function(require,module,exports){

module.exports = function(n, options) {

  var options = options || {};

  var hours = Math.floor(n / 3600),
    mins = '0' + Math.floor((n % 3600) / 60),
    secs = '0' + Math.floor((n % 60));

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


},{}],5:[function(require,module,exports){
/*!
	query-string
	Parse and stringify URL query strings
	https://github.com/sindresorhus/query-string
	by Sindre Sorhus
	MIT License
*/
(function () {
	'use strict';
	var queryString = {};

	queryString.parse = function (str) {
		if (typeof str !== 'string') {
			return {};
		}

		str = str.trim().replace(/^(\?|#)/, '');

		if (!str) {
			return {};
		}

		return str.trim().split('&').reduce(function (ret, param) {
			var parts = param.replace(/\+/g, ' ').split('=');
			var key = parts[0];
			var val = parts[1];

			key = decodeURIComponent(key);
			// missing `=` should be `null`:
			// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
			val = val === undefined ? null : decodeURIComponent(val);

			if (!ret.hasOwnProperty(key)) {
				ret[key] = val;
			} else if (Array.isArray(ret[key])) {
				ret[key].push(val);
			} else {
				ret[key] = [ret[key], val];
			}

			return ret;
		}, {});
	};

	queryString.stringify = function (obj) {
		return obj ? Object.keys(obj).map(function (key) {
			var val = obj[key];

			if (Array.isArray(val)) {
				return val.map(function (val2) {
					return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
				}).join('&');
			}

			return encodeURIComponent(key) + '=' + encodeURIComponent(val);
		}).join('&') : '';
	};

	if (typeof define === 'function' && define.amd) {
		define(function() { return queryString; });
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = queryString;
	} else {
		window.queryString = queryString;
	}
})();

},{}],6:[function(require,module,exports){

var qs = require('query-string');
var corslite = require('corslite');
var jsonp = require('browser-jsonp');


//var endpoint = 'https://api.soundcloud.com/resolve.json';
var endpoint = '//api.soundcloud.com/resolve.json';

module.exports = function(params) {

  var params = params || {};
  var options;
  var callback;

  if (typeof arguments[1] === 'object') {
    options = arguments[1];
    callback = arguments[2];
  } else {
    options = {};
    callback = arguments[1];
  }

  var url = endpoint + '?' + qs.stringify(params);

  corslite(url, function(err, res) {
    try {
      if (err) throw err;
      if (!err) {
        res = JSON.parse(res.response) || res;
        callback(err, res);
      }
    } catch(e) {
      jsonp({
        url: url,
        error: function(err) {
          callback(err);
        },
        success: function(res) {
          callback(null, res);
        }
      });
    }
  }, true);

};


},{"browser-jsonp":7,"corslite":3,"query-string":5}],7:[function(require,module,exports){
(function() {
  var JSONP, computedUrl, createElement, encode, noop, objectToURI, random, randomString;

  createElement = function(tag) {
    return window.document.createElement(tag);
  };

  encode = window.encodeURIComponent;

  random = Math.random;

  JSONP = function(options) {
    var callback, done, head, params, script;
    options = options ? options : {};
    params = {
      data: options.data || {},
      error: options.error || noop,
      success: options.success || noop,
      beforeSend: options.beforeSend || noop,
      complete: options.complete || noop,
      url: options.url || ''
    };
    params.computedUrl = computedUrl(params);
    if (params.url.length === 0) {
      throw new Error('MissingUrl');
    }
    done = false;
    if (params.beforeSend({}, params) !== false) {
      callback = params.data[options.callbackName || 'callback'] = 'jsonp_' + randomString(15);
      window[callback] = function(data) {
        params.success(data, params);
        params.complete(data, params);
        try {
          return delete window[callback];
        } catch (_error) {
          window[callback] = void 0;
          return void 0;
        }
      };
      script = createElement('script');
      script.src = computedUrl(params);
      script.async = true;
      script.onerror = function(evt) {
        params.error({
          url: script.src,
          event: evt
        });
        return params.complete({
          url: script.src,
          event: evt
        }, params);
      };
      script.onload = script.onreadystatechange = function() {
        if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
          done = true;
          script.onload = script.onreadystatechange = null;
          if (script && script.parentNode) {
            script.parentNode.removeChild(script);
          }
          return script = null;
        }
      };
      head = head || window.document.getElementsByTagName('head')[0] || window.document.documentElement;
      return head.insertBefore(script, head.firstChild);
    }
  };

  noop = function() {
    return void 0;
  };

  computedUrl = function(params) {
    var url;
    url = params.url;
    url += params.url.indexOf('?') < 0 ? '?' : '&';
    url += objectToURI(params.data);
    return url;
  };

  randomString = function(length) {
    var str;
    str = '';
    while (str.length < length) {
      str += random().toString(36)[2];
    }
    return str;
  };

  objectToURI = function(obj) {
    var data, key, value;
    data = [];
    for (key in obj) {
      value = obj[key];
      data.push(encode(key) + '=' + encode(value));
    }
    return data.join('&');
  };

  if ((typeof define !== "undefined" && define !== null) && define.amd) {
    define(function() {
      return JSONP;
    });
  } else if ((typeof module !== "undefined" && module !== null) && module.exports) {
    module.exports = JSONP;
  } else {
    this.JSONP = JSONP;
  }

}).call(this);

},{}],8:[function(require,module,exports){
module.exports={
  "client_id": "0d33361983f16d2527b01fbf6408b7d7"
}

},{}],9:[function(require,module,exports){

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
      scope.track = false;
      scope.index = 0;
      scope.playlist;
      scope.tracks = [];

      function createSrc(track) {
        if (track.stream_url) {
          track.src = track.stream_url + '?client_id=' + client_id;
        }
        return track;
      }

      if (src) {
        resolve({ url: src, client_id: client_id }, function(err, res) {
          if (err) { console.error(err); }
          scope.$apply(function() {
            scope.track = createSrc(res);
            if (Array.isArray(res)) {
              scope.tracks = res.map(function(track) {
                return createSrc(track);
              });
            } else if (res.tracks) {
              scope.playlist = res;
              scope.tracks = res.tracks.map(function(track) {
                return createSrc(track);
              });
            }
          });
        });
      }

      scope.play = function(i) {
        if (typeof i !== 'undefined' && scope.tracks.length) {
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
        } else {
          scope.pause();
        }
      };

      scope.seek = function(e) {
        if (scope.track.src === player.audio.src) {
          scope.player.seek(e);
        }
      };

      player.audio.addEventListener('timeupdate', function() {
        if (!scope.$$phase && scope.track.src === player.audio.src) {
          $timeout(function() {
            scope.currentTime = player.audio.currentTime;
            scope.duration = player.audio.duration;
          });
        }
      });

      player.audio.addEventListener('ended', function() {
        if (scope.track.src === player.audio.src) {
          scope.next();
        }
      });

    }

  }

}]);

plangular.filter('hhmmss', function() {
  return hhmmss;
});

plangular.provider('plangularConfig', function() {
  this.clientId = require('./config.json').client_id;
  var _this = this;
  this.$get = function() {
    return {
      clientId: _this.clientId
    };
  };
});


module.exports = 'plangular';


},{"./config.json":8,"audio-player":1,"hhmmss":4,"soundcloud-resolve-jsonp":6}]},{},[9])(9)
});
