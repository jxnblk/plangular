Plangular
=========

A Highly Customizable SoundCloud Player –  Built with AngularJS

See examples and more here:
http://jxnblk.github.io/Plangular

---

## Usage
Plangular is very customizable. If you're not comfortable with basic AngularJS, the player templates below might be an easier place to start.

### Include JS Files
Download the plangular.js file and add it to your project, then add the following script tags to your HTML:

    <script src="//connect.soundcloud.com/sdk.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.1.4/angular.min.js"></script>
    <script src="js/plangular.js"></script>

### Initialize the Angular App
Include the `ng-app` attribute in a containing element.

    <body ng-app="plangular">
      ...
    </body>

### Create the Player
Use any HTML element and add the `plangular` and `data-src` attributes, with the SoundCloud URL for the sound you would like to use.

    <div plangular data-src="'http://soundcloud.com/jxnblk/plangular'"></div>

### Include the Track Info
Use Angular bindings to include information about the track. You can use any of the data from the SoundCloud JSON Object.

    <p>{{ track.user.username }}</p>
    <h1>{{ track.title }}</h1>

### Use Plangular Variables
Add Play/Pause controls. Use `ng-hide` and `ng-show` to conditionally show and hide the controls when the track is playing.

    <a href="" ng-click="player.play(track)" ng-hide="player.playing == track">Play</a>
    <a href="" ng-click="player.pause()" ng-show="player.playing == track">Pause</a>

Plangular includes basic variables to display the sound's time and duration. The playTime filter will convert milliseconds to hh:mm:ss format.

    <progress value="{{ currentTime / duration }}">{{ currentTime / duration }}</progress>
    <small>{{ currentTime | playTime }} | {{ duration | playTime }}</small>

Add the seekTo() function to add scrubbing.

    <progress value="{{ currentTime / duration }}" ng-click="seekTo($event)">{{ currentTime / duration }}</progress>

### Add Images and Links
To use images and links in the track object, use Angular's `ng-src` and `ng-href` attributes.

    <a ng-href="{{ track.permalink_url }}">View on SoundCloud</a>
    <img ng-src="{{ track.artwork_url  }}" alt="{{ track.title }}" />
    <img ng-src="{{ track.waveform_url }}" alt="waveform" />

Note: The waveform image that the SoundCloud API provides is a 1200 x 280px PNG with a light gray frame and transparent middle. To show progress use absolute positioning with the waveform in front. The light gray color is #efefef.

### Additional Options

To add a loading state while Plangular is getting data from SoundCloud, you can use `ng-show` and `ng-hide` to display different states.
    
    <span ng-hide="track">Loading...</span>
    <div ng-show="track"><!-- Player --></div>
    

### Style with CSS
Add classes, custom images, and whatever else your heart desires. Have fun!

---

## Example Templates
Use these examples to get started quickly

### Bare Bones
    
    <div plangular data-src="'http://soundcloud.com/jxnblk/plangular'">
      <a href="" ng-click="player.play(track)" ng-hide="player.playing == track">Play</a>
      <a href="" ng-click="player.pause()" ng-show="player.playing == track">Pause</a>
      <h1>{{ track.user.username }} - {{ track.title }}</h1>
    </div>

### Progress Bar

    <div plangular data-src="'http://soundcloud.com/jxnblk/plangular'" class="media">
      <a href="" ng-click="player.play(track)" ng-hide="player.playing == track" class="img">Play</a>
      <a href="" ng-click="player.pause()" ng-show="player.playing == track" class="img">Pause</a>
      <div class="bd">
        <p>{{ track.user.username }}</p>
        <h1><a ng-href="{{ track.permalink_url }}">{{ track.title }}</a></h1>
        <progress value="{{ currentTime / duration }}" ng-click="seekTo($event)">{{ currentTime / duration }}</progress>
        <small>{{ currentTime | playTime }} | {{ duration | playTime }}</small>
      </div>
    </div>

### Artwork and Waveform

    <div plangular data-src="'http://soundcloud.com/jxnblk/plangular'" class="media">
      <img ng-src="{{ track.artwork_url }}" class="img" />
      <div class="bd">
        <div class="media">
          <a href="" ng-click="player.play(track)" ng-hide="player.playing == track" class="img">Play</a>
          <a href="" ng-click="player.pause()" ng-show="player.playing == track" class="img">Pause</a>
          <div class="bd">
            <p>{{ track.user.username }}</p>
            <h1><a ng-href="{{ track.permalink_url }}">{{ track.title }}</a></h1>
          </div>
        </div>
        <div ng-click="seekTo($event)">
          <progress value="{{ currentTime / duration }}">{{ currentTime / duration }}</progress>
          <img ng-src="{{ track.waveform_url }}" />
        </div>
        <small>{{ currentTime | playTime }} | {{ duration | playTime }}</small>
      </div>
    </div>

---

## Note About SoundCloud API

According to the SoundCloud API terms you must:
- Credit the user as the creator of the content
- Credit SoundCloud as the source
- Include a link to the sound on SoundCloud (i.e. a link using `track.permalink_url`)

Read more here: http://developers.soundcloud.com/docs/api/terms-of-use#branding

---

## Troubleshooting

Don't ask me why, but SoundCloud provides an option for users to prevent streaming to third-party apps. If your sound isn't play or has stopped playing check the `track.streamable` variable. If it's set to false, there's no way to play that sound with the API.

---

## Reference

### Plangular

- `plangular` - The Angular directive for Plangular
- `data-src` - The data attribute to set the SoundCloud link
- `track` - The object returned from the SoundCloud API
- `player.play(track)` - Function for playing the track
- `player.pause()` - Function for pausing
- `currentTime` - Current time in milliseconds for the currently playing track
- `duration` - Duration of the track in milliseconds
- `playTime` - Angular filter to convert milliseconds to hh:mm:ss format
- `seekTo($event)` - Click function for scrubbing

### SoundCloud API

Example JSON object:
    
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

See http://developers.soundcloud.com/docs/api/reference#users for more details


