// Tracklist
//
// Accepts track objects as input
// and manages playlist state

module.exports = function() {

  var self = this;

  this.index = 0;
  this.tracks = [];
  //this.currentTrack = null;

  this.loadTrack: function(track) {
    this.tracks.push(track);
  };

  this.loadTracks: function(tracks) {
    tracks.forEach(function(track) {
      self.loadTrack(track);
    });
  };

  this.removeTrack: function(i) {
    this.tracks.splice(i, 1);
  };

  this.next: function() {
    if (this.index < this.tracks.length - 1) {
      this.index++;
    }
  };

  this.previous: function() {
    if (this.index > 0) {
      index--;
    }
  };

  // Todo:
  // - Check for nested tracks
  // - get function for audio src (i.e. return stream_url)

  return this;

};

