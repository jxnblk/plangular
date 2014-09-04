(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Module dependencies
 */

var debug = require('debug')('jsonp');

/**
 * Module exports.
 */

module.exports = jsonp;

/**
 * Callback index.
 */

var count = 0;

/**
 * Noop function.
 */

function noop(){}

/**
 * JSONP handler
 *
 * Options:
 *  - param {String} qs parameter (`callback`)
 *  - timeout {Number} how long after a timeout error is emitted (`60000`)
 *
 * @param {String} url
 * @param {Object|Function} optional options / callback
 * @param {Function} optional callback
 */

function jsonp(url, opts, fn){
  if ('function' == typeof opts) {
    fn = opts;
    opts = {};
  }
  if (!opts) opts = {};

  var prefix = opts.prefix || '__jp';
  var param = opts.param || 'callback';
  var timeout = null != opts.timeout ? opts.timeout : 60000;
  var enc = encodeURIComponent;
  var target = document.getElementsByTagName('script')[0] || document.head;
  var script;
  var timer;

  // generate a unique id for this request
  var id = prefix + (count++);

  if (timeout) {
    timer = setTimeout(function(){
      cleanup();
      if (fn) fn(new Error('Timeout'));
    }, timeout);
  }

  function cleanup(){
    script.parentNode.removeChild(script);
    window[id] = noop;
  }

  window[id] = function(data){
    debug('jsonp got', data);
    if (timer) clearTimeout(timer);
    cleanup();
    if (fn) fn(null, data);
  };

  // add qs component
  url += (~url.indexOf('?') ? '&' : '?') + param + '=' + enc(id);
  url = url.replace('?&', '?');

  debug('jsonp req "%s"', url);

  // create script
  script = document.createElement('script');
  script.src = url;
  target.parentNode.insertBefore(script, target);
}

},{"debug":2}],2:[function(require,module,exports){

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = require('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  return ('WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // This hackery is required for IE8,
  // where the `console.log` function doesn't have 'apply'
  return 'object' == typeof console
    && 'function' == typeof console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      localStorage.removeItem('debug');
    } else {
      localStorage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = localStorage.debug;
  } catch(e) {}
  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

},{"./debug":3}],3:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":4}],4:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  var match = /^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 's':
      return n * s;
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}

},{}],5:[function(require,module,exports){
(function (global){
// Audio element

'use strict';

var audio = global.audio || document.createElement('audio');

module.exports = audio;


}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
/*

        PLANGULAR
        A Highly Customizable SoundCloud Player

        Vuejs Version

        http://jxnblk.github.io/Plangular

 */

'use strict';

var plangular = {};
plangular.clientID = '0d33361983f16d2527b01fbf6408b7d7';
plangular.api = 'http://api.soundcloud.com/resolve.json';
plangular.data = {};

module.exports = plangular;

var jsonp = require('jsonp');
  // Try npm http instead


// TO DO: Move Vue wrappers to top level

// Vue component
require('./v-soundcloud');

require('./v-icons');
require('./v-pretty-time');
//require('./v-waveform');


},{"./v-icons":8,"./v-pretty-time":10,"./v-soundcloud":11,"jsonp":1}],7:[function(require,module,exports){
// Audio player

'use strict';


var audio = require('./audio');
var plangular = require('./v-plangular');

var Player = function() {

  var player = {};
  player.i = 0;
  player.playlistIndex = 0;
  player.playing = false;
  player.tracks = [];
  player.currentTrack = null;
  player.currentTime = 0;
  player.duration = 0;

  player.play = function(i, playlistIndex) {
    this.i = i || 0;
    var track = this.tracks[this.i];
    if (track.tracks) {
      this.playlistIndex = playlistIndex;
      this.playing = track.tracks[playlistIndex];
      var src = track.tracks[playlistIndex].stream_url + '?client_id=' + plangular.clientID;
    } else {
      this.playing = track;
      var src = track.stream_url + '?client_id=' + plangular.clientID;
    }
    this.currentTrack = this.playing;
    if (src != audio.src) audio.src = src;
    audio.play();
  };

  player.pause = function() {
    audio.pause();
    this.playing = false;
  };

  player.playPause = function(i, playlistIndex) {
    var track = this.tracks[i];
    if (track.tracks && this.playing != track.tracks[playlistIndex]) {
      if (!playlistIndex) playlistIndex = 0;
      this.play(i, playlistIndex);
    } else if (!track.tracks && this.playing != track) {
      this.play(i);
    } else {
      this.pause();
    }
  };

  player.next = function() {
    var playlist = this.tracks[this.i].tracks || null;
    if (playlist && this.playlistIndex < playlist.length - 1) {
      this.playlistIndex++;
      this.play(this.i, this.playlistIndex);
    } else if (this.i < this.tracks.length - 1) {
      this.i++;
      // Handle advancing to new playlist
      var playlist = this.tracks[this.i].tracks || null;
      if (this.tracks[this.i].tracks) {
        this.playlistIndex = 0;
        this.play(this.i, this.playlistIndex);
      } else {
        this.play(this.i);
      }
    }
  };

  player.previous = function() {
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
  };

  player.load = function(track, index) {
    this.tracks[index] = track;
    if (!this.playing && !this.i && index == 0) {
      this.currentTrack = this.tracks[0];
    }
  };

  player.seek = function(e) {
    if (!audio.readyState) return false;
    var percent = e.offsetX / e.target.offsetWidth || (e.layerX - e.target.offsetLeft) / e.target.offsetWidth;
    var time = percent * audio.duration || 0;
    audio.currentTime = time;
  };

  audio.addEventListener('timeupdate', function() {
    player.currentTime = audio.currentTime;
    player.duration = audio.duration;
  });

  audio.addEventListener('ended', function(){
    player.next();
  });

  return player;

};

var player = player || new Player();

module.exports = player;


},{"./audio":5,"./v-plangular":9}],8:[function(require,module,exports){
/*

  Vue Icons directive
 
  Icons from Geomicons Open http://jxnblk.github.io/geomicons-open
 
  Usage:

    <svg v-icon="'play'"></svg>

*/

'use strict';


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

Vue.directive('plangular-icon', function(value) {
  var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', sprite[value]);
  this.el.appendChild(path);
    //var vb = this.el.getAttribute('viewBox') || '0 0 32 32';
  this.el.setAttribute('viewBox', '0 0 32 32');
  this.el.setAttribute('style', 'max-height:100%');
  this.el.setAttribute('fill', 'currentColor');
  this.el.classList.add('plangular-icon', 'plangular-icon-' + value);
});


},{}],9:[function(require,module,exports){
module.exports=require(6)
},{"./v-icons":8,"./v-pretty-time":10,"./v-soundcloud":11,"jsonp":1}],10:[function(require,module,exports){
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


},{}],11:[function(require,module,exports){
// Vue Plangular component

'use strict';


var jsonp = require('jsonp');
var audio = require('./audio');
var player = require('./player');
var plangular = require('./v-plangular');

var Plangular = Vue.extend({

  data: {
    player: player,
    index: null,
    value: null,
    track: null,
    currentTime: 0,
    duration: 0
  },

  ready: function() {
    var self = this;
    audio.addEventListener('timeupdate', function() {
      // TO DO: handle multiple views
      if (player.tracks[player.i] == self.track) {
        self.currentTime = audio.currentTime;
        self.duration = audio.duration;
      }
    });
  },

  methods: {

    play: function(playlistIndex) {
      player.play(this.index, playlistIndex);
    },

    pause: function() {
      player.pause();
    },

    playPause: function(playlistIndex) {
      player.playPause(this.index, playlistIndex);
    },

    seek: function(e) {
      if (player.tracks[player.i] == this.track) {
        player.seek(e);
      }
    },

    previous: function() { player.previous() },

    next: function() { player.next() }

  },

  directives: {

    'src': function(value) {

      var self = this;
      self.vm.value = value;

      var elements = document.querySelectorAll('[v-src]');
      for (var i = 0; i < elements.length; i++) {
        if (this.el == elements[i]) {
          self.vm.index = i;
        }
      }

      var apiUrl = plangular.api + '?url=' + value + '&client_id=' + plangular.clientID;

      if (plangular.data[value]) {
        for (var key in plangular.data[value]) {
          self.vm.$data[key] = plangular.data[value][key];
        }
        self.vm.duration = plangular.data[value].duration / 1000;
        self.vm.track = plangular.data[value];
        player.load(plangular.data[value], self.vm.index);
      } else {
        jsonp(apiUrl, function(error, response) {
          plangular.data[value] = response;
          for (var key in response) {
            self.vm.$data[key] = response[key];
          }
          self.vm.duration = response.duration / 1000;
          self.vm.track = plangular.data[value];
          player.load(plangular.data[value], self.vm.index);
        });
      }

    }

  }

});

Vue.component('plangular', Plangular);


},{"./audio":5,"./player":7,"./v-plangular":9,"jsonp":1}]},{},[6])