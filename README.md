# Plangular

Angular directive for custom SoundCloud players

http://jxnblk.github.io/plangular

## Getting Started

```bash
bower install plangular
```

## Angular App

Include a link to plangular after Angular.

```js
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script>
<script src="js/plangular.min.js"></script>
```

`CDN link`

## Initialize the app

```html
<body ng-app="plangular">
</body>
```

Or include as a dependency in another app:

```js
var app = angular.module('app', ['plangular']);
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

```html
<small>{{ currentTime }} | {{ duration }}</small>
```

## Add a scrubber control

## Add images

## Loading states

## Playlists

## Previous/Next controls

### Configuration

---

### Using the SoundCloud API

According to the SoundCloud API terms you must:
- Credit the user as the creator of the content
- Credit SoundCloud as the source
- Include a link to the sound on SoundCloud (i.e. a link using `track.permalink_url`)

Read more here: http://developers.soundcloud.com/docs/api/terms-of-use

### Troubleshooting

SoundCloud provides an option for users to prevent streaming to third-party apps.
If your sound isn't playing check the `track.streamable` variable.
If it's set to false, there is no way to play that sound with the API.


