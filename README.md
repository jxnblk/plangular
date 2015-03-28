# Plangular

Angular directive for custom SoundCloud players

http://jxnblk.github.io/plangular

## Getting Started

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


---

[MIT License](http://opensource.org/licenses/MIT)

