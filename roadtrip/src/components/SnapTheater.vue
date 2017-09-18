<template>
  <div class="snap-theater">

    <div class="snap-theater-background"></div>

    <div class="player-container" :style="playerStyle">
      <div id="player"></div>
    </div>

    <div class="debug-data-container">
      <p>Current Track : {{currentTrackIndex}}</p>
      Tags <input ref="debugInput" @input="debugDataInput" @keyup.enter="debugInputEnter"></input>
      Location: {{locations[tracks[currentTrackIndex].location] ? locations[tracks[currentTrackIndex].location].name : ""}} <input ref="debugLocationInput" @keyup.enter="debugInputEnter"></input>
      <p>{{tracks}}</p>
      <hr />
      <p>{{locations}}</p>
    </div>

    <div class="controls-container">
      <h1>{{tracks[currentTrackIndex].location.name}} - Tags: <span v-for="tag in tracks[currentTrackIndex].tags">{{tag}} </span></h1>

      <div class="controls-buttons-container">
        <button @click="startFromBeginningHandler" class="seek-button"><img :src="images.rewind"></img></button>
        <button @click="seekBackwardHandler" class="seek-button seek-back"><img :src="images.arrow"></img></button>
        <button @click="seekForwardHandler" class="seek-button"><img :src="images.arrow"></img></button>

        <button @click="playPauseHandler" class="seek-button play" v-if="playerState !== 1">
          <img :src="images.play" ></img>
        </button>

        <button @click="playPauseHandler" class="seek-button" v-if="playerState === 1">
          <img :src="images.pause"></img>
        </button>

        <button class="tag-button" v-for="(tag, index) in tags" v-bind:class="{active: activeTags.indexOf(index) > -1}" @click="tagClickHandler(index)"><span>{{index}}</span></button>
      </div>
    </div>


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

export default {
  data () {
    return {
      images: {
        play,
        arrow,
        rewind,
        pause
      },
      player: {},
      playerReady: false,
      playerStyle: {},
      playerState: 2,
      currentTrackIndex: 0,
      message: "",
      tracks,
      locations,
      tags: {},
      activeTags: [],
      windowHeight: 0,
      windowWidth: 0,
      debugGeocoder: {},
      debugSearchBox: {}
    }
  },
  mounted() {

    // This will set initial window bounds
    this.handleResize();

    this.initTracks()
    this.initPlayer()

    // TODO: Debug, remove when done
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
  computed: {

  },
  methods: {
    globalKeydown(e) {
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
          lng: place.geometry.location.lat(),
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
        console.log("initial tracks: " , track);
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
      let height = this.windowHeight - 100
      let width = 16 / 9 * height;

      // The above will set the width for the player which is horizontal,
      // but we need to clip out the video that was shot vertically
      // TODO: Use SVG cuz fuck IE
      let third = width / 3;
      let clip = `inset(0 ${third}px)`

      // TODO: DEBUG remove when done adding debug data
      clip = "none"

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

      }, 250)
    },

    checkTime() {

      let time = this.player.getCurrentTime()
      let currentTrack = this.tracks[this.currentTrackIndex]

      // Need something better than linear search here?
      if (currentTrack.start <= time && currentTrack.end > time && tagCheck) {
        // Good to go, don't need to change anything
      } else {
        // Do a linear search to see which track we should be on
        let index = 0;
        let tagMatch = true;

        while (time > this.tracks[index].end && index < this.tracks.length - 1) {
          index++
        }

        // Set global current index to the one we found
        this.currentTrackIndex = index
      }

      // If tags don't match, seek til they do
      let tagCheck = helpers.arrayInArray(currentTrack.tags, this.activeTags) || this.activeTags.length === 0

      if (!tagCheck) {
        let index = this.currentTrackIndex;
        let innerTagCheck = false
        while (!innerTagCheck && index < this.tracks.length - 1) {
          index++
          if (helpers.arrayInArray(this.tracks[index].tags, this.activeTags) || this.activeTags.length === 0) {
            innerTagCheck = true;
          }
        }

        // Seek to new spot
        this.player.seekTo(this.tracks[index].start, true)

        this.currentTrackIndex = index;

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
    seekForward(timeToCheck) {

      if (this.currentTrackIndex < this.tracks.length - 1) {
        let tagMatch = false;
        // Make local variable so it doesnt mess with data bindings
        let currentIndex = this.currentTrackIndex
        while (!tagMatch && currentIndex !== this.tracks.length - 1) {

          currentIndex++
          // In loop
          if (helpers.arrayInArray(this.tracks[currentIndex].tags, this.activeTags) || this.activeTags.length === 0) {
            tagMatch = true;
          }
        }

        this.player.seekTo(this.tracks[currentIndex].start + 1, true)

        // Update our global variable
        this.currentTrackIndex = currentIndex
      }

    },
    startFromBeginningHandler() {
      this.player.seekTo(0, true)
    },
    seekBackwardHandler() {

      this.seekBackward()
    },
    seekBackward() {
      if (this.currentTrackIndex > 0) {
        let tagMatch = false;
        // Make local variable so it doesnt mess with data bindings
        let currentIndex = this.currentTrackIndex
        while (!tagMatch && currentIndex > 0) {
          currentIndex--

          // In loop
          if (helpers.arrayInArray(this.tracks[currentIndex].tags, this.activeTags) || this.activeTags.length === 0) {
            tagMatch = true;
          }
        }

        this.player.seekTo(this.tracks[currentIndex].start + 1, true)

        // Update our global variable
        this.currentTrackIndex = currentIndex
      }
    }
  },
  watch: {
    // TODO: DEBUG, remove when done adding data
    currentTrackIndex: function() {
      console.log("change");
      this.$refs.debugInput.value = this.tracks[this.currentTrackIndex].tags.join(" ")

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

// TODO: Change loader to not need asset prefix
@import "~../styles/colors";

// TODO: Remove when data complete
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
  border: 2px solid #000;

  background-color: $gray1;
  color: #fff;

  position: relative;
  vertical-align: top;

  margin: 0 10px;
  padding: 0;

  cursor: pointer;

  transition: transform .1s linear;

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

.tag-button {
  height: 40px;
  border-radius: 50%;
  border: 2px solid #000;

  background-color: $gray1;
  color: #000;

  margin: 0 5px;
  padding: 0 14px;

  cursor: pointer;
  transition: transform .1s linear;

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
