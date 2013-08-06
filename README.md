Plangular
=========

A Highly Customizable SoundCloud Player –  Built with AngularJS

[http://jxnblk.github.io/Plangular]

---

## Usage
Plangular is very customizable. If you're not comfortable with basic AngularJS, the player templates might be an easier place to start.

### Include JS Files
Download the plangular.js file and add it to your project, then add the following script tags to your HTML:

    <script src="//connect.soundcloud.com/sdk.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.1.4/angular.min.js"></script>
    <script src="js/plangular.js"></script>

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


