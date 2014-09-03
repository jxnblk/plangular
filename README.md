# Plangular

Create custom SoundCloud players with HTML and CSS.

http://jxnblk.github.io/plangular

[Examples](http://jxnblk.github.io/plangular/docs/vuejs)

---


Table of Contents:
- [Getting Started](#getting-started)
- [Plangular API](#plangular-api)
- [SoundCloud API](#soundcloud-api)
- [Changes from Version 1.0](#changes-from-version-1.0)


---


## Getting Started
Plangular comes in **two versions**.
One built with [AngularJS](https://angularjs.org/) and the other with [Vuejs](http://vuejs.org/).
If you're not currently using one of these frameworks,
the Vuejs version's total javascript should be smaller when considering the size of the libraries,
and might be more performant.

_Note: this has not been tested yet._

The Plangular properties and methods are roughly the same for both versions,
with minor difference in syntax between Angular and Vuejs.
Examples are provided for both versions.

---

### Include JS Files

**Vuejs**

Download `v-plangular.min.js` and include it in your project along with Vuejs:

```html
<script src="//cdnjs.cloudflare.com/ajax/libs/vue/0.10.6/vue.min.js"></script>
<script src="js/v-plangular.min.js"></script>
```

**Angular**

Download the `ng-plangular.min.js` file and include it in your project along with Angular:
```html
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.23/angular.min.js"></script>
<script src="js/ng-plangular.min.js"></script>
```

Alternatively, you may link to the CDN hosted versions:

```html
<!-- Vuejs version -->
<script src="http://d2v52k3cl9vedd.cloudfront.net/plangular/2.0-beta-1/v-plangular.min.js"></script>

<!-- Angular version -->
<script src="http://d2v52k3cl9vedd.cloudfront.net/plangular/2.0-beta-1/ng-plangular.min.js"></script>
```

### Initialize the App
Bootstrap the Vuejs or Angular app.

**Vuejs**
Create a new Vue instance on any parent element.

```html
<body id="vm">
  <script> var vm = new Vue({ el: '#vm' }) </script>
</body>
```

**Angular**

Use the `ng-app` attribute on any parent element.
For standalone applications, you can pass `plangular` as the app.

```html
<body ng-app="plangular"></body>
```

Or for use within a larger Angular app, include the dependency in your app definition.

```js
var myApp = angular.module('myApp', ['plangular']);
```

### Create the Player
Create a new player instance using the SoundCloud URL for your track.
This will return data from the SoundCloud API and other properties and methods to control playback.

**Vuejs**
```html
<div v-component="plangular" v-src="'http://soundcloud.com/jxnblk/plangular'"></div>
```

**Angular**
```html
<div plangular="http://soundcloud.com/jxnblk/plangular"></div>
```

### Include the Track Info
Use template bindings to include information about the track. You can use any data from the SoundCloud API response.

```html
<p>{{ user.username }}</p>
<h1>{{ title }}</h1>
<!-- or in the track object -->
<p>{{ track.user.username }}</p>
<h1>{{ track.title }}</h1>
```

### Add Play/Pause Controls
Use the `play()`, `pause()`, or `playPause()` methods to play the track.
Use template conditionals to show and hide controls based on the player state.

**Vuejs**
```html
<button v-on="click: playPause()">Play/Pause</button>
<!-- or -->
<button v-on="click: play()" v-if="player.playing != track">Play</button>
<button v-on="click: pause()" v-if="player.playing == track">Pause</button>
```

**Angular**
```html
<button ng-click="playPause()">Play/Pause</button>
<!-- or -->
<button ng-click="play()" ng-if="player.playing != track">Play</button>
<button ng-click="pause()" ng-if="player.playing == track">Pause</button>
```

### Next/Previous Controls
Plangular will cycle through all instances in a view and through tracks in a SoundCloud playlist.
Use the `previous()` and `next()` methods to skip between tracks.

**Vuejs**
```html
<button v-on="click: previous()">Previous</button>
<button v-on="click: next()">Next</button>
```

**Angular**
```html
<button ng-click="previous()">Previous</button>
<button ng-click="next()">Next</button>
```

### Show Current Time and Duration
Plangular includes basic variables to display the sound's time and duration.
The `prettyTime` filter will convert milliseconds to hh:mm:ss format.

```html
<progress value="{{ currentTime / duration || 0 }}">{{ currentTime / duration }}</progress>
<small>{{ currentTime | prettyTime }} | {{ duration | prettyTime }}</small>
```

### Add a Scrubber Control
Add the `seek()` method to add scrubbing.

**Vuejs**
```html
<progress value="{{ currentTime / duration || 0 }}" v-on="click: seek($event)">{{ currentTime / duration }}</progress>
```

**Angular**
```html
<progress value="{{ currentTime / duration || 0 }}" ng-click="seek($event)">{{ currentTime / duration }}</progress>
```

### Add Images and Links
To use images and links in the track object, use Angular's or Vuejs's custom attributes.

**Vuejs**
```html
<img v-attr="src: track.artwork_url" alt="{{ track.title }}" />
<img v-attr="src: track.waveform_url" alt="waveform" />
```

**Angular**
```html
<a ng-href="{{ track.permalink_url }}">View on SoundCloud</a>
<img ng-src="{{ track.artwork_url  }}" alt="{{ track.title }}" />
<img ng-src="{{ track.waveform_url }}" alt="waveform" />
```

Note: The waveform image that the SoundCloud API provides is a 1200 x 280px PNG with a light gray frame and transparent middle. To show progress use absolute positioning with the waveform in front. The light gray color is `#efefef`.


### Icons
Use the `plangular-icon` directive to inject icons into your player.
This directive must be used on an `svg` element.

**Vuejs**
```html
<svg v-plangular-icon="'play'"></svg>
```

**Angular**
```html
<svg plangular-icon="play"></svg>
```

The included icons are a subset of [Geomicons Open](http://jxnblk.github.io/geomicons-open):
- play
- pause
- previous
- next
- close
- chevronRight
- chevronLeft
- heart

### Loading States
Use template conditionals to show a loading state.

**Vuejs**
```html
<span v-if="!track">Loading...</span>
<div v-if="track"><!-- Player --></div>
```

**Angular**
```html
<span ng-if="!track">Loading...</span>
<div ng-if="track"><!-- Player --></div>
```

<!--
### Creating a Global Player
`TK`
 
### SoundCloud Playlists
`TK`
--> 


---


## Plangular API

- `plangular` - The Angular directive or Vuejs component
- `v-src` - **Vuejs Only** The Vuejs directive used to pass the SoundCloud source URL
- `track` - The object returned from the SoundCloud API
- `player` - The global player object

#### Properties
- `currentTime` - Current time in milliseconds.
- `duration` - Duration of the track in milliseconds
- `prettyTime` - Filter to convert milliseconds to hh:mm:ss format

#### Methods
- `play()` - Method for playing the track
- `pause()` - Method for pausing
- `playPause()` - Method for toggling playback of the track
- `seek($event)` - Method for scrubbing


---


## SoundCloud API

Example JSON object:
    
```json
{
  "kind": "track",
  "id": 104286869,
  "created_at": "2013/08/06 18:40:58 +0000",
  "user_id": 1561,
  "duration": 10058,
  "commentable": true,
  "state": "finished",
  "original_content_size": 1764044,
  "sharing": "public",
  "tag_list": "Vocal",
  "permalink": "plangular",
  "streamable": true,
  "embeddable_by": "all",
  "downloadable": false,
  "purchase_url": null,
  "label_id": null,
  "purchase_title": null,
  "genre": "FX",
  "title": "Plangular",
  "description": "",
  "label_name": null,
  "release": null,
  "track_type": null,
  "key_signature": null,
  "isrc": null,
  "video_url": null,
  "bpm": null,
  "release_year": null,
  "release_month": null,
  "release_day": null,
  "original_format": "wav",
  "license": "all-rights-reserved",
  "uri": "http://api.soundcloud.com/tracks/104286869",
  "user": {
    "id": 1561,
    "kind": "user",
    "permalink": "jxnblk",
    "username": "Jxnblk",
    "uri": "http://api.soundcloud.com/users/1561",
    "permalink_url": "http://soundcloud.com/jxnblk",
    "avatar_url": "http://i1.sndcdn.com/avatars-000022806518-7o90vj-large.jpg?5ffe3cd"
  },
  "permalink_url": "http://soundcloud.com/jxnblk/plangular",
  "artwork_url": null,
  "waveform_url": "http://w1.sndcdn.com/2t0q2x8lbAVJ_m.png",
  "stream_url": "http://api.soundcloud.com/tracks/104286869/stream",
  "playback_count": 51,
  "download_count": 0,
  "favoritings_count": 1,
  "comment_count": 0,
  "attachments_uri": "http://api.soundcloud.com/tracks/104286869/attachments"
}
```

See http://developers.soundcloud.com/docs/api/reference#users for more details

### Using the SoundCloud API

According to the SoundCloud API terms you must:
- Credit the user as the creator of the content
- Credit SoundCloud as the source
- Include a link to the sound on SoundCloud (i.e. a link using `track.permalink_url`)

Read more here: http://developers.soundcloud.com/docs/api/terms-of-use#branding

### Troubleshooting

SoundCloud provides an option for users to prevent streaming to third-party apps.
If your sound isn't playing check the `track.streamable` variable.
If it's set to false, there is no way to play that sound with the API.


---


## Changes from Version 1.0

- New Vuejs version
- Simpler player methods
- **Angular Version:** Tracks are now passed through the plangular attribute, instead of `data-src`.
  E.g. `<div plangular="http://soundcloud.com/jxnblk/plangular"></div>`
- The `playTime` filter is now called `prettyTime`.
- `next()` and `previous()` methods now work for all tracks on a page.
- Cleaned up player object
- `currentTime` and `duration` for track or globally on the player object
- `plangular-icon` must be used on an svg element


---


[MIT License](http://opensource.org/licenses/MIT)


