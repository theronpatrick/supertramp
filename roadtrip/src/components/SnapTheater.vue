<template>
  <div class="snap-theater">

    <div class="snap-theater-background"></div>

    <div class="player-container" :style="playerStyle">
      <div id="player"></div>
    </div>

    <div class="debug-data-container" v-if="debug">
      <p>Current Track : {{currentTrackIndex}}</p>
      Tags <input ref="debugInput" @input="debugDataInput" @keyup.enter="debugInputEnter"></input>
      Location: {{locations[tracks[currentTrackIndex].location] ? locations[tracks[currentTrackIndex].location].name : ""}} <input ref="debugLocationInput" @keyup.enter="debugInputEnter"></input>
      <p>{{tracks}}</p>
      <hr />
      <p>{{locations}}</p>
    </div>

    <div class="controls-container">
      <h1 v-if="debug">{{tracks[currentTrackIndex].location.name}} - Tags: <span v-for="(tag, index) in tracks[currentTrackIndex].tags">{{tag}}{{index === tracks[currentTrackIndex].length - 1 ? '' : ' '}}</span></h1>

      <div class="controls-buttons-container">
        <button @click="startFromBeginningHandler" class="seek-button" title="Rewind To Beginning"><img :src="images.rewind"></img></button>
        <button @click="seekBackwardHandler" class="seek-button seek-back" title="Previous Snap"><img :src="images.arrow"></img></button>
        <button @click="seekForwardHandler" class="seek-button" title="Next Snap"><img :src="images.arrow"></img></button>

        <button @click="playPauseHandler" class="seek-button play" v-if="playerState !== 1" title="Play">
          <img :src="images.play"></img>
        </button>

        <button @click="playPauseHandler" class="seek-button" v-if="playerState === 1" title="Pause">
          <img :src="images.pause"></img>
        </button>

        <div class="tag-toggle-container">
          <button @click="toggleTags" class="seek-button" title="Tag Menu"><img :src="images.tag"></img></button>
        </div>

        <div class="tag-toggle-container">
          <button @click="toggleInfo" class="seek-button" title="Info Menu">
            <span class="">i</span>
          </button>
        </div>

      </div>
    </div>

    <!-- Toggle containers for tags/info -->
    <transition name="tag-animation">
      <div v-if="tagsVisible" class="info-container" key="tag-container">
        <img v-if="tagsVisible" :src="images.close" class="info-close-button" role="button" key="close-button" @click="infoCloseClickHandler" title="Close"></img>
        <h1>Tags</h1>
        <p class="tag-info"><span v-for="tag in activeTags">{{tag}} </span></p>
        <div class="tag-button-container">
          <button class="tag-button " v-for="(tag, index) in orderedTags" :key="tag" v-bind:class="{active: activeTags.indexOf(tag) > -1}" @click="tagClickHandler(tag)">
            <span class="">{{tag}} ({{tags[tag].length}})</span>
          </button>
        </div>
      </div>
    </transition>

    <transition name="tag-animation">
      <div v-show="infoVisible" class="info-container" key="info-container">
        <img v-show="infoVisible" :src="images.close" class="info-close-button" role="button" key="close-button" @click="infoCloseClickHandler" title="Close"></img>
        <h1>Info</h1>
        <p class="map-info-1">{{locations[tracks[currentTrackIndex].location] ? locations[tracks[currentTrackIndex].location].name : ""}}</span></p>
        <p class="map-info-2"><span v-for="tag in tracks[currentTrackIndex].tags">{{tag}} </span></p>
        <p class="map-info-3">Snap {{currentTrackIndex + 1}} of {{tracks.length}}</p>
        <div ref="googleMap" class="google-map "></div>
      </div>
    </transition>


  </div>
</template>

<script>

import tracks from "../data/snapchat-tracks.js"
import locations from "../data/snapchat-locations.js"
import helpers from "../helpers/helpers.js"

import play from "../assets/play.svg"
import pause from "../assets/pause.svg"
import arrow from "../assets/arrow.svg"
import rewind from "../assets/rewind.svg"
import tag from "../assets/tag.svg"
import close from "../assets/close.svg"


export default {
  data() {
    return {
      debug: false,
      images: {
        play,
        arrow,
        rewind,
        pause,
        tag,
        close
      },
      player: {},
      playerReady: false,
      playerStyle: {},
      playerState: 2,
      currentTrackIndex: 0,
      trackIndexForTime: 0,
      message: "",
      tracks,
      locations,
      tags: {},
      tagsVisible: false,
      infoVisible: true,
      activeTags: [],
      seekDirection: "forward",
      windowHeight: 0,
      windowWidth: 0,
      infoMap: {},
      debugGeocoder: {},
      debugSearchBox: {}
    }
  },
  computed: {
    orderedTags() {
      return Object.keys(this.tags).sort()
    }
  },
  mounted() {

    // Set debug mode on or off. Should be OFF for production
    this.debug = false;

    // This will set initial window bounds
    this.handleResize();

    this.initTracks()
    this.initPlayer()

    // TODO: Tie to actual onload event from google
    // TODO: Keep building out map feature
    setTimeout(() => {
      this.infoMap = new google.maps.Map(this.$refs.googleMap, {
        center: new google.maps.LatLng(this.locations['ChIJ_87aSGzctEwRtGtUNnSJTSY'].lat, this.locations['ChIJ_87aSGzctEwRtGtUNnSJTSY'].lng),
        zoom: 4
      });
    }, 1000)


    if (this.debug) {

      setTimeout(() => {
        this.debugGeocoder = new google.maps.Geocoder;

        var searchBox = new google.maps.places.SearchBox(this.$refs.debugLocationInput);

        this.debugSearchBox = searchBox;

        searchBox.addListener('places_changed', () => {
          let places = searchBox.getPlaces()

          console.log("places " , places);

          places.forEach((place) => {

            let location = {
              name: place.name,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lat(),
              placeId: place.place_id
            }

            this.tracks[this.currentTrackIndex].location = place.place_id;

            // Add to our hash
            if (!this.locations[place.place_id]) {
              this.locations[place.place_id] = {
                name: place.name,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lat()
              }
            }
          })
        })

      }, 1000)
    }

  },
  beforeMount() {
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('keydown', (e) => {
      this.globalKeydown(e)
    });
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('keydown', (e) => {
      this.globalKeydown(e)
    });
  },
  methods: {
    globalKeydown(e) {
      // TODO: Block youtube default controls
      if (e.code === "ArrowRight") {
        this.seekForward()
      } else if (e.code === "ArrowLeft") {
        this.seekBackward()
      }
    },
    debugDataInput(d) {
      console.log("data " , d);
      console.log("val " , d.target.value);

      this.tracks[this.currentTrackIndex].tags = d.target.value.split(" ")
    },
    debugInputEnter(d) {

      let places = this.debugSearchBox.getPlaces()

      console.log("places " , places);

      places.forEach((place) => {
        console.log("name? " , place.name);

        console.log("plac" , place);

        let location = {
          name: place.name,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          placeId: place.place_id
        }

        this.tracks[this.currentTrackIndex].location = place.place_id;
      })

    },
    handleResize() {
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

      console.log("all tags: " , this.tags);

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
          controls: this.debug ? 1 : 0,
          fs: 0,
          iv_load_policy: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          disablekb: 1
        }

      });

      // After creating, set size
      this.resizePlayer();

    },

    resizePlayer() {
      let height = this.windowHeight - 100
      let width = 16 / 9 * height;

      // The above will set the width for the player which is horizontal,
      // but we need to clip out the video that was shot vertically
      // TODO: Use SVG cuz fuck IE
      let third = width / 3;
      let clip = this.debug ? "none" : `inset(0 ${third}px)`

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

      setInterval(() => {
        this.checkTime()

      }, 150)
    },

    // TODO: Refactor this so we have a local currentIndex variable,
    // and if it changes based on our time in an interval we handle things like seeking/tag checking
    // Also TODO: Handle 'skip' tag
    // Also TODO: when getting to end of movie, go back, show check mark or some indication there's none left
    checkTime() {

      let time = this.player.getCurrentTime()

      // Find clip in our tracks array that matches our time
      // TODO: Optimize linear search if it goes too slow
      let i = 0;
      for (let track of this.tracks) {
        if (track.end > time) {
          this.trackIndexForTime = i;
          break;
        } else {
          i++
        }
      }



    },

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    onPlayerStateChange(event) {
      this.playerState = event.data;
    },
    stopVideo() {
      this.player.stopVideo();
    },
    theaterKeyupHandler(e) {
      console.log("key " , e);
    },
    infoCloseClickHandler() {
      this.tagsVisible = false;
      this.infoVisible = false;
    },
    toggleTags() {
      this.tagsVisible = !this.tagsVisible
      this.infoVisible = false;
    },
    toggleInfo() {
      this.infoVisible = !this.infoVisible
      this.tagsVisible = false;

      // Map loads in at 0 by 0 px cause it's hidden, so resize here
      setTimeout(() => {
        console.log("welp");
        google.maps.event.trigger(this.infoMap, 'resize')
      })
    },
    tagClickHandler(tag) {
      let index = this.activeTags.indexOf(tag)

      if (index === -1) {
        this.activeTags.push(tag)
      } else {
        this.activeTags.splice(index, 1);
      }

    },
    playPauseHandler() {

      if (this.playerState === 1) {
        this.player.pauseVideo()
      } else {
        this.player.playVideo()
      }
    },
    seekForwardHandler() {

      this.seekForward()

    },
    seekForward(trackToSeekTo) {

      // Do nothing on last track
      // TODO: Disable button
      if (this.trackIndexForTime === this.tracks.length - 1) {
        return
      }

      let nextTrack = trackToSeekTo || this.tracks[this.trackIndexForTime + 1]
      this.player.seekTo(nextTrack.start, true)

    },
    startFromBeginningHandler() {
      this.player.seekTo(0, true)
      this.currentTrackIndex = 0;
    },
    seekBackwardHandler() {
      this.seekBackward()
    },
    seekBackward() {
      // Do nothing on last track
      // TODO: Disable button
      if (this.trackIndexForTime === 0) {
        return
      }

      // Set seek direction for watcher
      this.seekDirection = "backward"
      let nextTrack = this.tracks[this.trackIndexForTime - 1]
      this.player.seekTo(nextTrack.start, true)
    }
  },
  watch: {
    currentTrackIndex: function() {
      console.log("change");
      // TODO: DEBUG, remove when done adding data
      if (this.debug) {
        this.$refs.debugInput.value = this.tracks[this.currentTrackIndex].tags.join(" ")
      }

      // If current track index changes and we're not in the right time for video, seek there
      let currentTrack = this.tracks[this.currentTrackIndex]

      let inRange = currentTrack.start >= this.player.getCurrentTime() && currentTrack.end < this.player.getCurrentTime()
      if (!inRange) {
        // Since track splitting was less than precise, add in buffer zone in case our current movie time
        // is close but not exactly the same as clip we should go to
        let dif = currentTrack.start - this.player.getCurrentTime();
        if (Math.abs(dif) >= 1) {
          console.log("seeking");
          this.player.seekTo(currentTrack.start)
        }

      }

      // Center on google map
      if (currentTrack.location) {
        let location = this.locations[currentTrack.location]
        this.infoMap.setCenter({
          lat: location.lat,
          lng: location.lng
        })
      }

    },
    trackIndexForTime: function(oldVal, newVal) {
      console.log("track index change " , newVal);

      // When timing track index changes, make sure it matches our tag. If it does, set our new index.
      // If not, seek forward til we find one that does.
      let trackToCheck = this.tracks[this.trackIndexForTime]

      let tagMatch = helpers.arrayInArray(trackToCheck.tags, this.activeTags) || this.activeTags.length === 0

      let loopIndex = this.trackIndexForTime;
      let foundMatch = false;

      if (!tagMatch && this.seekDirection === "forward") {
        while (loopIndex < this.tracks.length - 1) {
          let trackInLoop = this.tracks[loopIndex]
          if (helpers.arrayInArray(trackInLoop.tags, this.activeTags) || this.activeTags.length === 0) {
            foundMatch = true;
            break;
          } else {
            loopIndex++;
          }
        }
        console.log("tag mismatch, changing current track index to " , loopIndex);
        this.currentTrackIndex = loopIndex;

      } if (!tagMatch) {

        if (this.seekDirection === "forward") {
          console.log("seeking forward for tag mismatch");
          while (loopIndex < this.tracks.length - 1) {
            let trackInLoop = this.tracks[loopIndex]
            if (helpers.arrayInArray(trackInLoop.tags, this.activeTags) || this.activeTags.length === 0) {
              foundMatch = true;
              break;
            } else {
              loopIndex++;
            }
          }
        } else if (this.seekDirection === "backward") {
          console.log("seeking backward for tag mismatch");
          while (loopIndex > -1) {
            let trackInLoop = this.tracks[loopIndex]
            if (helpers.arrayInArray(trackInLoop.tags, this.activeTags) || this.activeTags.length === 0) {
              foundMatch = true;
              break;
            } else {
              loopIndex--;
            }
          }
          // Reset direction after seeking
          this.seekDirection = "forward"
        } else {
          // Aint supposed to be here!
          console.error("Invalid seek direction");
        }

        console.log("setting current track " , loopIndex);
        this.currentTrackIndex = loopIndex;

      } else {
        console.log("tagmatch " , this.trackIndexForTime);
        this.currentTrackIndex = this.trackIndexForTime
      }

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

// TODO: Change loader to not need asset prefix
@import "~../styles/colors";
@import "~../styles/variables";

// Just for debugging
.debug-data-container {
  position: absolute;
  right: 0;
  top: 0;

  width: 400px;
  height: 75%;
  overflow: auto;
  background: #fff;

  input {
    display: block;
    width: 100%;
  }
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

  margin-top: 12px;
}

h1 {
  color: #fff;
  height: 50px;
}
h2 {
  color: #fff;
}

.seek-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid #000;

  background-color: $gray1;
  color: #000;

  // TODO: Get a font that has a good lookin info 'I'?
  font-size: 30px;
  font-family: "serif";

  position: relative;
  vertical-align: top;

  margin: 0 10px;
  padding: 0;

  cursor: pointer;
  transition: transform .1s linear;

  @include mobile {
    width: 40px;
    height: 40px;
    margin: 0 4px;
  }

  img {
    width: 24px;
    height: 24px;
    display: block;
    margin: 0 auto;
  }

  // Button-specific styles
  &.seek-back {
    img {
      transform: scaleX(-1)
    }
  }
  &.play {
    padding-left: 4px;
  }

  &:hover {
    transform: scale(1.2);
  }

  &:focus {
    outline: 0
  }
}

// Tag animation
.tag-animation-enter-active, .tag-animation-leave-active {
  right: 0px !important;
  opacity: 1;
}
.tag-animation-enter, .tag-animation-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  right: -336px !important;
}

.tag-toggle-container {
  display: inline-block;
  vertical-align: top;
}

  // TODO: Clean up styles/positioning
  position: absolute;

  border: 2px solid #000;
  border-radius: 5px;



  overflow-y: auto;
  overflow-x: hidden;

  -webkit-overflow-scrolling: touch;

  text-align: center;

  @include mobile {
    bottom: 40px;
  }
}

  position: absolute;


  z-index: 1;

  cursor: pointer;

  &:hover {
    transform: scale(1.2);
  }
}

.tag-button {
  display: block;
  height: 30px;
  border: 1px solid #000;

  border-radius: 4px;

  background-color: $gray1;
  color: #000;

  margin: 8px auto;
  padding: 0 14px;

  cursor: pointer;
  transition: all .1s linear;

  &.active {
    // box-shadow: inset 0 0 10px $orange;
    transform: scale(1.2);
    border: 3px solid #000;
    font-weight: bold;
  }

  &:hover {
    transform: scale(1.2)
  }

  &:focus {
    outline: 0
  }
}

.google-map {

  * {
    overflow: visible;
  }
}


</style>
