<div class="display-none">
  <h1>Plangular</h1>
  <p>
    Angular directive for custom SoundCloud players
    <a href="http://jxnblk.com/plangular">jxnblk.com/plangular</a>
  </p>
</div>

## Getting Started

```bash
npm install plangular-3
```

Or install with Bower:

```bash
bower install plangular
```

Or use the CDN:

```html
<script src="http://d2v52k3cl9vedd.cloudfront.net/plangular/3.1.0/plangular.min.js"></script>
```

## Angular app

Include a link to plangular after including Angular.

```js
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script>
<script src="bower_components/plangular/dist/plangular.min.js"></script>
```

## Initialize the app

Configure Plangular with your own `client_id`.
For new SoundCloud apps, you can register at https://developers.soundcloud.com/

```html
<body ng-app="app">

  <script>
    var app = angular.module('app', ['plangular'])
      .config(function(plangularConfigProvider){
        plangularConfigProvider.clientId = '[YOUR-CLIENT-ID]';
      });
  </script>
</body>
```

## Create a plangular directive instance

```html
<div plangular="http://soundcloud.com/jxnblk/plangular">
</div>
```

## Include track info

```html
<div plangular="http://soundcloud.com/jxnblk/plangular">
  <h3>{{track.user.username}} - {{track.title}}</h3>
  <a ng-href="{{track.permalink_url}}">View on SoundCloud</a>
</div>
```

## Add player controls

```html
<button ng-click="playPause()">Play/Pause</button>
```

Or with separate play/pause controls:

```html
<button ng-click="play()">Play</button>
<button ng-click="pause()">Pause</button>
```

## Show current time and duration

Use the `hhmmss` filter to format seconds as `hh:mm:ss` strings.

```html
<small>{{ currentTime | hhmmss }} | {{ duration | hhmmss }}</small>
```

## Progress bar

```html
<progress ng-value="currentTime / duration || 0">
  {{ currentTime / duration || 0 }}
</progress>
```

## Add scrubber functionality

```html
<progress
  ng-click="seek($event)"
  ng-value="currentTime / duration">
  {{ currentTime / duration }}
</progress>
```

## Add images

```html
<img ng-src="{{ track.artwork_url  }}" alt="{{ track.title }}" />
<img ng-src="{{ track.waveform_url }}" alt="waveform" />
```

Note: The waveform image that the SoundCloud API provides is a 1200 x 280px PNG with a light gray frame and transparent middle. To show progress use absolute positioning with the waveform in front. The light gray color is `#efefef`.

## Loading states

Use the `ng-if` directive to show and hide content based on whether the track has loaded.

```html
<div ng-if="!track"><!-- Loading state --></div>
<div ng-if="track"><!-- Player --></div>
```

## Playlists

Use the `tracks` array and `ng-repeat` when using a SoundCloud playlist. Pass the `$index` to the `playPause()` method to trigger playback on a per-track basis. Determine which track is currently playing with `player.playing === track.src`.

```html
<ul>
  <li ng-repeat="track in tracks">
    <button
      ng-click="playPause($index)"
      ng-class="{'active': player.playing === track.src}">
      {{track.user.username}} - {{track.title}}
    </button>
  </li>
</ul>
```

## User tracks

To load the most recent tracks from a given user, use the tracks endpoint. Use `ng-repeat` to iterate over the `tracks` array.

```html
<div plangular="http://soundcloud.com/jxnblk/tracks">
</div>
```

## User likes

To load the most recent likes from a given user, use the likes endpoint.

```html
<div plangular="http://soundcloud.com/jxnblk/likes">
</div>
```

## Previous/next controls

To skip to the next and previous track in a playlist or array of tracks, use the `previous()` and `next()` methods.

```html
<button ng-click="previous()">Previous</button>
<button ng-click="next()">Next</button>
```


## Example templates
See more examples and starter templates in
[docs/examples](docs/examples)

---

## API

### `track` 
Object returned from the SoundCloud API

### `tracks`
An array of track objects if the instance is a playlist or list of tracks

### `player`
Audio player object

### `audio`
The HTML5 `<audio>` element used by the player, exposed for access to media events.

### `currentTime`
Angular-friendly `currentTime` from the audio element

### `duration`
Angular-friendly `duration` from the audio element. Note: you can also access duration in milliseconds from the SoundCloud track object.

### `index`
Currently playing track index in a playlist or other array of tracks.

### `playlist`
Cloned object of `track` if `track.tracks` exists. This is useful for displaying the title of the playlist.

### `play(i)`
Plays the track. Optionally pass an index when handling playlists.

### `pause()`
Pauses the player.

### `playPause(i)`
Toggles playback. Optionally pass an index when handling playlists.

### `previous()`
Skip to previous track when handling playlists

### `next()`
Skip to next track when handling playlists

### `seek($event)`
Sets the audio element’s `currentTime` property based on a pointer event.

---

## Using the SoundCloud API

### Track object
For more details on the SoundCloud track object, see https://developers.soundcloud.com/docs/api/reference#tracks

### Terms

According to the SoundCloud API terms you must:
- Credit the user as the creator of the content
- Credit SoundCloud as the source
- Include a link to the sound on SoundCloud (i.e. a link using `track.permalink_url`)

Read more here: http://developers.soundcloud.com/docs/api/terms-of-use

### Troubleshooting

SoundCloud provides an option for users to prevent streaming to third-party apps.
If your sound isn't playing check the `track.streamable` variable.
If it's set to false, there is no way to play that sound with the API.


