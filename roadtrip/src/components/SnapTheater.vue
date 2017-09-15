<template>
  <div class="snap-theater">

    <div class="snap-theater-background"></div>

    <div class="player-container" :style="playerStyle">
      <div id="player"></div>
    </div>

    <div class="debug-data-container">
      <input @input="debugDataInput"></input>
      <p>{{tracks}}</p>
    </div>

    <div class="controls-container">
      <h1>{{message}} - Tags: <span v-for="tag in tracks[currentTrackIndex].tags">{{tag}}</span></h1>

      <div class="controls-buttons-container">
        <button @click="seekBackwardHandler" class="seek-button"><-</button>
        <button @click="seekForwardHandler" class="seek-button">-></button>

        <button @click="playPauseHandler" class="seek-button">Play</button>

        <button class="tag-button" v-for="(tag, index) in tags" v-bind:class="{active: activeTags.indexOf(index) > -1}" @click="tagClickHandler(index)">{{index}}</button>
      </div>
    </div>


  </div>
</template>

<script>

import tracks from "../data/snapchat-tracks.js"
import helpers from "../helpers/helpers.js"

export default {
  data () {
    return {
      player: {},
      playerReady: false,
      playerStyle: {},
      currentTrackIndex: 0,
      message: "",
      tracks,
      tags: {},
      activeTags: [],
      windowHeight: 0,
      windowWidth: 0
    }
  },
  mounted() {

    // This will set initial window bounds
    this.handleResize();

    this.initTracks()
    this.initPlayer()

  },
  // TODO: Implement resize functions if we don't like normal youtube resizing
  beforeMount() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  },
  computed: {

  },
  methods: {
    debugDataInput(d) {
      console.log("data " , d);
      console.log("val " , d.target.value);

      this.tracks[this.currentTrackIndex].tags = d.target.value.split(" ")
    },
    handleResize() {
      console.log("size " , window);
      this.windowHeight = window.innerHeight
      this.windowWidth = window.innerWidth

      if (this.playerReady) {
        this.resizePlayer()
      }

    },
    // Process tracks and tags
    initTracks() {

      let trackIndex = 0;
      for (let track of this.tracks) {
        console.log("lel " , track);
        if (track.tags) {
          for (let tag of track.tags) {

            // Add track index to our tag dictionary, or create the array if there isn't one yet
            if (!this.tags[tag]) {
              this.tags[tag] = [trackIndex]
            } else {
              this.tags[tag].push(trackIndex)
            }

          }
        }

        trackIndex++
      }

      console.log("tags " , this.tags);

    },
    initPlayer() {

      // Using YouTube iFrame tomfoolery to add stuff to global space.
      // When we init, we add this global function, so check its existence to see if we need to set everything up the fist time
      if (!window.onYouTubeIframeAPIReady) {
        var tag = document.createElement('script');

        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        var player;
        window.onYouTubeIframeAPIReady = () => {
           this.createPlayer()
         }
      } else {
        console.log("already loaded");
        this.createPlayer()
      }

    },
    createPlayer() {
      this.player = new YT.Player('player', {
        height: "100%",
        width: "100%",
        videoId: 'VOam-Y9a-p0',
        events: {
          'onReady': this.onPlayerReady,
          'onStateChange': this.onPlayerStateChange
        },
        playerVars: {
          controls: 1,
          fs: 0,
          iv_load_policy: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,

        }

      });

      // After creating, set size
      this.resizePlayer();

    },

    resizePlayer() {
      // TODO: Implement if we don't want to keep normal youtube sizing
      let height = this.windowHeight - 100
      let width = 16 / 9 * height;

      // The above will set the width for the player which is horizontal,
      // but we need to clip out the video that was shot vertically
      // TODO: Use SVG cuz fuck IE
      let third = width / 3;
      let clip = `inset(0 ${third}px)`

      this.playerStyle = {
        height: `${height}px`,
        width: `${width}px`,
        'clip-path': clip
      }
    },

    // 4. The API will call this function when the video player is ready.
    onPlayerReady(event) {

      this.playerReady = true;

      event.target.playVideo();

      console.log("tracks " , this.tracks);

      setInterval(() => {
        this.checkTime()

      }, 250)
    },

    checkTime() {

      // Every tick, check if our track name/number has changed. Also check tags.

      let getDataForCurrentTrack = (trackTime) => {

        // We can recursively call this, so take argument for time over
        // player API time since we might be seeking through
        let time = trackTime || this.player.getCurrentTime()
        let currentTrack = this.tracks[this.currentTrackIndex]

        // TODO: Figure out bug when activating tags if there aren't
        // any going forward


        if (currentTrack.start <= time && currentTrack.end >= time) {

          // If the we're at the time for the correct track, display its title. If we're at the right time but tags don't match, iterate forward
          if (helpers.arrayInArray(currentTrack.tags, this.activeTags) || this.activeTags.length === 0) {
            this.message = currentTrack.title
          } else {
            this.currentTrackIndex = this.currentTrackIndex + 1
            // TODO: Make sure api doesn't blow up if we need to seek a ton
            console.log("seeking for tags " , this.currentTrackIndex);

            // If we still have tracks to seek through, recursively call this function with time of next track
            if (this.currentTrackIndex !== this.tracks.length - 1) {
              this.player.seekTo(this.tracks[this.currentTrackIndex].start, true)

              // Need to wait for seekTo to finish, wish there was a promise we could attach to...
              getDataForCurrentTrack(this.tracks[this.currentTrackIndex].start)
            }

          }
        } else if (currentTrack.start > time) {
          // Go back
          console.log("go back");
          this.currentTrackIndex = this.currentTrackIndex - 1
          getDataForCurrentTrack()
        } else if (currentTrack.end < time && this.currentTrackIndex !== this.tracks.length - 1) {
          // Go Forward
          console.log("go forward");
          this.currentTrackIndex = this.currentTrackIndex + 1
          getDataForCurrentTrack()

        } else {
          // No conditions met, end movie or show alert
          // console.log("no conditions met when seeking, movie should be at end");
        }
      }


      getDataForCurrentTrack()


    },

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    onPlayerStateChange(event) {
    },
    stopVideo() {
      this.player.stopVideo();
    },
    tagClickHandler(tag) {
      console.log("tag " , tag);
      let index = this.activeTags.indexOf(tag)

      if (index === -1) {
        this.activeTags.push(tag)
      } else {
        console.log("remove");
        this.activeTags.splice(index, 1);
      }

      console.log("active " , this.activeTags);
    },
    playPauseHandler() {
      let state = this.player.getPlayerState()

      if (state === 1) {
        this.player.pauseVideo()
      } else {
        this.player.playVideo()
      }
    },
    seekForwardHandler() {

      // Go to the next track
      let seekForward = () => {
        if (this.currentTrackIndex !== this.tracks.length - 1) {
          this.currentTrackIndex = this.currentTrackIndex + 1

          // Check if next track is in our tag list. If not, keep going
          if (!helpers.arrayInArray(this.tracks[this.currentTrackIndex].tags, this.activeTags) && this.activeTags.length > 0) {
            seekForward()
          } else {
            this.player.seekTo(this.tracks[this.currentTrackIndex].start, true)

            setTimeout(() => {
              this.checkTime()
            })
          }
        }
      }

      seekForward()

    },
    seekBackwardHandler() {

      let seekBackward = () => {
        if (this.currentTrackIndex > 0) {

            this.currentTrackIndex = this.currentTrackIndex - 1

            if (!helpers.arrayInArray(this.tracks[this.currentTrackIndex].tags, this.activeTags) && this.activeTags.length > 0) {
              seekBackward()
            } else {
            this.player.seekTo(this.tracks[this.currentTrackIndex].start, true)

            setTimeout(() => {
              this.checkTime()
            })
          }
        }
      }

      seekBackward()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

// TODO: Remove when data complete
.debug-data-container {
  position: absolute;
  right: 0;
  top: 0;

  width: 200px;
  height: 75%;
  overflow: auto;
  background: #fff;
}

.snap-theater {
  width: 100%;
  height: 100%;
  position: relative;

  overflow-x: hidden;
}

.snap-theater-background {
  background: url("../assets/landscape.jpg") no-repeat center center fixed;
  background-size: cover;
  filter: brightness(40%) contrast(130%);
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

.player-container {

  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.controls-container {
  height: 100px;
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 0;
}

.controls-buttons-container {
  text-align: center;
  height: 50px;
}

h1 {
  color: #fff;
  height: 50px;
}
h2 {
  color: #fff;
}

.seek-button {
  width: 40px;
  height: 40px;
  border-radius: 100%;
  border: 0;

  background-color: #a9a9a9;
  color: #fff;

  margin: 0 10px;
  cursor: pointer;

  transition: all .25s linear;

  &:hover {
    transform: scale(1.2)
  }

  &:focus {
    outline: 0
  }
}

.tag-button {
  height: 40px;
  border-radius: 50%;
  border: 0;

  background-color: #fff;
  color: purple;

  margin: 0 5px;
  padding: 0 14px;

  cursor: pointer;
  transition: transform .25s linear;

  &.active {
    box-shadow: inset 0 0 10px #00f;
  }

  &:hover {
    transform: scale(1.2)
  }

  &:focus {
    outline: 0
  }
}


</style>
