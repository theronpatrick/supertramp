<template>
  <div class="snap-theater">

    <div class="notification-container" :class="{visible: notification}">{{notification}}</div>

    <tour :tourHighlightElement="tourHighlightElementCallback" ref="tour"></tour>

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

      <div class="slider-container">
        <slider
          ref="slider"
          class="tour-highlightable"
          :tourHighlighted="tourHighlightedElement === 'slider'"
          :min="0"
          :max="tracks.length - 1"
          :onChange="sliderChangeHandler"
          :onClick="sliderClickHandler"
          :value="currentTrackIndex"
        ></slider>
      </div>

      <div class="controls-buttons-container">
        <button
          @click="startFromBeginningHandler"
          class="seek-button tour-highlightable"
          :class="{'tour-highlighted' : tourHighlightedElement === 'startFromBeginning'}"
          title="Rewind To Beginning"
          ref="startFromBeginningButton">
            <img :src="images.rewind"></img>
        </button>
        <button
          ref="seekBackwardButton"
          @click="seekBackwardHandler"
          class="seek-button seek-back tour-highlightable"
          :class="{'tour-highlighted' : tourHighlightedElement === 'seekBackward'}"
          title="Previous Snap">
            <img :src="images.arrow"></img>
        </button>
        <button
          ref="seekForwardButton"
          @click="seekForwardHandler"
          class="seek-button tour-highlightable"
          :class="{'tour-highlighted' : tourHighlightedElement === 'seekForward'}"
          title="Next Snap">
          <img :src="images.arrow"></img>
        </button>

        <button
          ref="playButton"
          @click="playPauseHandler"
          class="seek-button play tour-highlightable"
          :class="{'tour-highlighted' : tourHighlightedElement === 'playPause'}"
          v-if="playerState !== 1"
          title="Play">
            <img :src="images.play"></img>
        </button>

        <button @click="playPauseHandler"
          ref="pauseButton"
          class="seek-button tour-highlightable"
          :class="{'tour-highlighted' : tourHighlightedElement === 'playPause'}"
          v-if="playerState === 1"
          title="Pause">
            <img :src="images.pause"></img>
        </button>

        <div class="tag-toggle-container">
          <button
            ref="tagButton"
            @click="toggleTags"
            class="seek-button tour-highlightable"
            :class="{'tour-highlighted' : tourHighlightedElement === 'tagButton', 'active': tagsVisible}"
            title="Filter Menu">
            <img :src="images.filter"></img>
          </button>
        </div>

        <div class="tag-toggle-container">
          <button
            ref="infoButton"
            @click="toggleInfo"
            class="seek-button tour-highlightable"
            :class="{'tour-highlighted' : tourHighlightedElement === 'infoButton', 'active': infoVisible}"
             title="Info Menu">
            <span class="">i</span>
          </button>
        </div>

      </div>
    </div>

    <!-- Toggle containers for tags (filters)/info -->
    <transition name="tag-menu-animation">
      <div v-if="tagsVisible" class="info-container" key="tag-container" ref="tagInfoContainer">
        <img
          v-if="tagsVisible"
          :src="images.close"
          class="info-close-button"
          role="button"
          key="close-button"
          @click="infoCloseClickHandler"
          title="Close">
        </img>

        <span
          v-show="tagsVisible"
          :src="images.reload"
          class="info-action-button"
          role="button"
          key="reload-tags-button"
          @click="clearTagsHandler"
          title="Clear Tags"
        >Clear Filters</span>

        <h1>Filters</h1>
        <p class="tag-info">
          <transition-group name="active-tag-animation">
            <span v-for="tag in activeTags" key="tag" class="active-tag">{{tag}} </span>
          </transition-group>
        </p>
        <div class="tag-button-container">
          <button class="tag-button " v-for="(tag, index) in orderedTags" :key="tag" v-bind:class="{active: activeTags.indexOf(tag) > -1}" @click="tagClickHandler(tag)">
            <span class="">{{tag}} ({{tags[tag].length}})</span>
          </button>
        </div>
      </div>
    </transition>

    <transition name="tag-menu-animation">
      <div v-show="infoVisible" class="info-container" key="info-container" ref="infoContainer">
        <img
          v-show="infoVisible"
          :src="images.close"
          class="info-close-button"
          role="button"
          key="close-button"
          @click="infoCloseClickHandler"
          title="Close">
        </img>
        <span
          v-show="infoVisible"
          :src="images.question"
          class="info-action-button"
          role="button"
          key="tour-button"
          @click="infoTourClickHandler"
          title="Show Tour"
        >Show Tour</span>

        <h1>Info</h1>
        <div class="map-info">
          <p>{{locations[tracks[currentTrackIndex].location] ? `${locations[tracks[currentTrackIndex].location].name}, ${locations[tracks[currentTrackIndex].location].state}` : ""}}</span></p>
          <p><span v-for="tag in tracks[currentTrackIndex].tags">{{tag}} </span></p>
          <p>Snap {{currentTrackIndex + 1}} of {{tracks.length}}</p>
        </div>
        <div ref="googleMap" class="google-map "></div>
      </div>
    </transition>


  </div>
</template>

<script>

/***
Developer Notes:
Throughout the app, 'tags' refer to metadata on clips, but they've been renamed to 'filters' in the UI

***/

import tracks from "../data/snapchat-tracks.js"
import locations from "../data/snapchat-locations.js"
import helpers from "../helpers/helpers.js"

import play from "../assets/play.svg"
import pause from "../assets/pause.svg"
import arrow from "../assets/arrow.svg"
import rewind from "../assets/rewind.svg"
import filter from "../assets/filter.svg"
import close from "../assets/close.svg"
import question from "../assets/question.svg"
import reload from "../assets/reload.svg"

import slider from "./Slider.vue"
import tour from "./Tour.vue"

import GoogleMapsLoader  from "google-maps"


export default {
  components: {
    slider,
    tour
  },
  data() {
    return {
      debug: false, // Set debug mode. Should be OFF for production
      images: {
        play,
        arrow,
        rewind,
        pause,
        filter,
        close,
        question,
        reload
      },
      tourHighlightedElement: "",
      notification: "",
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
      infoVisible: false,
      activeTags: [],
      seekDirection: "forward",
      sliderTimeout: {},
      windowHeight: 0,
      windowWidth: 0,
      infoMap: {},
      infoMapMarker: {},
      googleMapAPILoaded: false,
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

    // This will set initial window bounds
    this.handleResize();

    this.initTracks()
    this.initPlayer()


    if (this.debug) {

      setTimeout(() => {
        this.debugGeocoder = new google.maps.Geocoder;

        var searchBox = new google.maps.places.SearchBox(this.$refs.debugLocationInput);

        this.debugSearchBox = searchBox;

        searchBox.addListener('places_changed', () => {
          let places = searchBox.getPlaces()

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

        // For reference if we need to loop through places
        /***
          let i = 0;
          for (let location of Object.keys(this.locations)) {

            console.log("in loc " , location);

            setTimeout(() => {
              this.debugGeocoder.geocode({'placeId': location}, (results, status) => {
                if (status === 'OK') {
                  if (results[0]) {
                    console.log("location: " , results[0]);

                    let returned = results[0]
                    for (let part of returned["address_components"]) {
                      if (part.types) {
                        for (let type of part.types) {
                          if (type === "administrative_area_level_1") {
                            console.log("state " , part.short_name);
                            this.locations[location].state = part.short_name
                          }
                        }
                      }
                    }

                  } else {
                    console.error('No results found');
                  }
                } else {
                  console.error('Geocoder failed due to: ' + status);
                }
              });
            }, i * 1000)

            i++

          }

          ***/


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
      let code = e.code.toLowerCase()

      if (code === "arrowright") {
        this.seekForward()
      } else if (code === "arrowleft") {
        this.seekBackward()
      } else if (code === "space") {
        // Pains be to turn off accessibility controls, but need to hijack space bar for play/pause
        e.preventDefault()
        this.playPauseHandler()
      }
    },
    debugDataInput(d) {
      this.tracks[this.currentTrackIndex].tags = d.target.value.split(" ")
    },
    debugInputEnter(d) {

      let places = this.debugSearchBox.getPlaces()

      places.forEach((place) => {

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
    tourHighlightElementCallback(element) {
      this.tourHighlightedElement = element
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

      // Delete our "skip" tag
      delete this.tags['skip']

    },
    initGoogleMap() {

      GoogleMapsLoader.KEY = "AIzaSyDY-HfeAAaeqRYsu4qQPYxhnYM4XUKb6m4"

      GoogleMapsLoader.load((google) => {

          this.googleMapAPILoaded = true;

          let position = new google.maps.LatLng(this.locations['ChIJ_87aSGzctEwRtGtUNnSJTSY'].lat, this.locations['ChIJ_87aSGzctEwRtGtUNnSJTSY'].lng);

          this.infoMap = new google.maps.Map(this.$refs.googleMap, {
            center: position,
            zoom: 6,
            libraries: ["places"]
          });

          // This marker will be overwritten immediately, so actual info doesn't matter
          this.infoMapMarker = new google.maps.Marker({
            position: position,
            map: this.infoMap,
            title: this.locations['ChIJ_87aSGzctEwRtGtUNnSJTSY'].name
          });

          this.createGoogleMarkerForLocation()

      });


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
        console.log("youtube player already loaded");
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
          autoplay: 1,
          enablejsapi: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          disablekb: 1
        }

      });

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

      // After player is ready, set size and load google map
      this.handleResize()
      this.initGoogleMap()

      event.target.playVideo();

      // Set up interval to check time and update info panel
      setInterval(() => {
        this.checkTime()

      }, 100)
    },

    showNotification(notification) {
      this.notification = notification

      setTimeout(() => {
        this.notification = ""
      }, 3000)
    },

    checkTime() {

      let time = this.player.getCurrentTime()

      // Find clip in our tracks array that matches our time
      // Note that there is a buffer of -1 on end time to prevent flashing when
      // seeking to new tags
      // TODO: Optimize linear search if it goes too slow
      let i = 0;
      for (let track of this.tracks) {
        if (track.end - 1 > time) {
          this.trackIndexForTime = i;
          break;
        } else {
          i++
        }
      }



    },

    // Called in watcher for current track index, also called manually when we need to update map
    checkCurrentTrackIndex() {

      // If current track index changes and we're not in the right time for video, seek there
      let currentTrack = this.tracks[this.currentTrackIndex]

      let inRange = currentTrack.start >= this.player.getCurrentTime() && currentTrack.end < this.player.getCurrentTime()
      if (!inRange) {
        // Since track splitting was less than precise, add in buffer zone in case our current movie time
        // is close but not exactly the same as clip we should go to
        let dif = currentTrack.start - this.player.getCurrentTime();
        if (Math.abs(dif) >= 1) {
          this.player.seekTo(currentTrack.start)
        }

      }

      // Center on google map
      if (currentTrack.location && this.googleMapAPILoaded) {
        this.createGoogleMarkerForLocation()
      }
    },

    createGoogleMarkerForLocation() {
      let currentTrack = this.tracks[this.currentTrackIndex]
      let location = this.locations[currentTrack.location]

      if (location) {
        // Remove previous marker
        this.infoMapMarker.setMap(null)

        // Make new marker
        this.infoMapMarker = new google.maps.Marker({
          position: {
            lat: location.lat,
            lng:location.lng
          },
          map: this.infoMap,
          title: location.name
        });

        this.infoMap.setCenter({
          lat: location.lat,
          lng: location.lng
        })
      }
    },

    // Called in watcher for trackIndexforTime, also can be manually triggered by clicking tags
    checkTrackIndexForTime() {
      // When timing track index changes, make sure it matches our tag. If it does, set our new index.
      // If not, seek forward til we find one that does.
      let trackToCheck = this.tracks[this.trackIndexForTime]

      // If we have a 'skip' tag, don't show
      let skipTrack = trackToCheck.tags[0] === "skip"

      let tagMatch = (helpers.arrayInArray(trackToCheck.tags, this.activeTags) || this.activeTags.length === 0) && !skipTrack

      let loopIndex = this.trackIndexForTime;
      let foundMatch = false;

      if (!tagMatch) {

        if (this.seekDirection === "forward") {
          while (loopIndex < this.tracks.length - 1) {
            let trackInLoop = this.tracks[loopIndex]
            if ((helpers.arrayInArray(trackInLoop.tags, this.activeTags) || this.activeTags.length === 0) && trackInLoop.tags[0] !== "skip") {
              foundMatch = true;
              break;
            } else {
              loopIndex++;

              // If we get to the movie without tags matching, start from beginning
              if (loopIndex === this.tracks.length - 1) {
                setTimeout(() => {
                  this.startFromBeginningHandler()

                  this.showNotification("No more snaps left with currently selected tags. Restarting from beginning.")
                })

              }
            }
          }
        } else if (this.seekDirection === "backward") {
          while (loopIndex > -1) {
            let trackInLoop = this.tracks[loopIndex]
            if ((helpers.arrayInArray(trackInLoop.tags, this.activeTags) || this.activeTags.length === 0) && trackInLoop.tags[0] !== "skip") {
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

        this.currentTrackIndex = loopIndex;

      } else {
        this.currentTrackIndex = this.trackIndexForTime
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


    // Click event handlers
    sliderClickHandler() {
      // If we're on tour, don't actually take action, just go to next element
      if (this.tourHighlightedElement === "slider") {
        this.$refs.tour.nextHandler()
        return;
      }
    },
    sliderChangeHandler(sliderValue) {

      // If we're on tour, don't actually take action, just go to next element
      if (this.tourHighlightedElement === "slider") {
        this.$refs.tour.nextHandler()
        return;
      }

      // Debounce dat sucker
      if (this.sliderTimeout) {
        clearTimeout(this.sliderTimeout)
      }

      this.sliderTimeout = setTimeout(() => {
        this.currentTrackIndex = sliderValue

      }, 500)

    },
    infoCloseClickHandler() {
      this.tagsVisible = false;
      this.infoVisible = false;
    },
    infoTourClickHandler() {
      this.$refs.tour.showTour()
    },
    toggleTags() {
      // If we're on tour, don't actually take action, just go to next element
      if (this.tourHighlightedElement === "tagButton") {
        this.$refs.tour.nextHandler()
        return;
      }

      this.tagsVisible = !this.tagsVisible
      this.infoVisible = false;

    },
    toggleInfo() {
      // If we're on tour, don't actually take action, just go to next element
      if (this.tourHighlightedElement === "infoButton") {
        this.$refs.tour.nextHandler()
        return;
      }

      this.infoVisible = !this.infoVisible
      this.tagsVisible = false;

      // Map loads in at 0 by 0 px cause it's hidden, so resize here
      setTimeout(() => {
        google.maps.event.trigger(this.infoMap, 'resize')
      })
    },
    clearTagsHandler() {
      this.activeTags = []
    },
    tagClickHandler(tag) {
      let index = this.activeTags.indexOf(tag)

      if (index === -1) {
        this.activeTags.push(tag)
      } else {
        this.activeTags.splice(index, 1);
      }

      // If tags change, might need to seek ahead so trigger time check
      this.checkTrackIndexForTime()

    },
    playPauseHandler() {

      // If we're on tour, don't actually take action, just go to next element
      if (this.tourHighlightedElement === "playPause") {
        this.$refs.tour.nextHandler()
        return;
      }

      if (this.playerState === 1) {
        this.player.pauseVideo()
      } else {
        this.player.playVideo()
      }
    },
    seekForwardHandler() {
      // If we're on tour, don't actually take action, just go to next element
      if (this.tourHighlightedElement === "seekForward") {
        this.$refs.tour.nextHandler()
        return;
      }

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

      // Trigger time check in case we're paused when seeking
      this.checkTrackIndexForTime()

    },
    startFromBeginningHandler() {
      // If we're on tour, don't actually take action, just go to next element
      if (this.tourHighlightedElement === "startFromBeginning") {
        this.$refs.tour.nextHandler()
        return;
      }

      this.player.seekTo(0, true)
      this.currentTrackIndex = 0;
    },
    seekBackwardHandler() {
      // If we're on tour, don't actually take action, just go to next element
      if (this.tourHighlightedElement === "seekBackward") {
        this.$refs.tour.nextHandler()
        return;
      }

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

      // Trigger time check in case we're paused while seeking
      this.checkTrackIndexForTime()
    }
  },
  watch: {
    currentTrackIndex: function(newVal, oldVal) {
      this.checkCurrentTrackIndex()
    },
    trackIndexForTime: function(newVal, oldVal) {
      this.checkTrackIndexForTime()
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
  background: url("../assets/theater-background.jpg") no-repeat center center fixed;
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

.slider-container {
  height: 20px;
  width: 336px;
  margin: 5px auto 0px auto;
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

  margin-top: 18px;
}

h1 {
  color: #fff;
  height: 50px;
}
h2 {
  color: #fff;
}

// Notifications at top
.notification-container {
  width: 280px;
  height: auto;

  z-index: 1;

  position: absolute;
  top: -50px;
  left: 50%;

  padding: 12px;

  transform: translateX(-50%);
  transition: all .3s linear;

  border: 2px solid #000;
  background: $transparentGray;
  box-shadow: 2px 2px 10px #000;

  &.visible {
    top: 20px;
  }
}

.seek-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #000;

  background-color: $gray1;
  box-shadow: 2px 2px 4px #111;
  color: #000;

  font-size: 30px;
  font-family: "serif";

  position: relative;
  vertical-align: top;

  margin: 0 10px;
  padding: 0;

  cursor: pointer;

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

  &:hover, &.active {
    transform: scale(1.2);
  }

  &:focus {
    outline: 0
  }
}

// Highlighted by first-time tour
.tour-highlightable {
  transition: all .1s linear;
}
.tour-highlighted {
  transform: scale(1.2);
  box-shadow: 0 0 0 4px $orange;
}

// Tag menu animation
.tag-menu-animation-enter-active, .tag-menu-animation-leave-active {
  right: 0px !important;
}
.tag-menu-animation-enter, .tag-menu-animation-leave-to {
  right: -336px !important;
}

// Animation for adding/removing tags

.active-tag-animation-enter {
  transform: scale(0)
}
.active-tag-animation-enter-to {
  animation: active-tag-bounce .7s;
}
.active-tag-animation-leave {
  transform: scale(1)
}
.active-tag-animation-leave-to {
  animation: active-tag-bounce .2s reverse;
}



@keyframes active-tag-bounce {
  0% {
    transform: scale(0);
  }
  40% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

.active-tag {
  display: inline-block;
  margin-right: 4px;
  // animation: active-tag-bounce 10s infinite;
}

.tag-toggle-container {
  display: inline-block;
  vertical-align: top;
}

.info-container {
  position: absolute;

  width: 336px;
  height: calc(100% - 100px);
  border: 2px solid #000;
  border-radius: 5px;

  top: 0px;
  right: 0px;

  background: $transparentGray;
  box-shadow: 2px 2px 10px #444;

  overflow-y: auto;
  overflow-x: hidden;

  -webkit-overflow-scrolling: touch;

  text-align: center;

  transition: all .2s linear;

  @include mobile {
    bottom: 40px;
  }

  h1 {
    margin-top: 12px;
    width: 100%;

    color: #000;
    position: absolute;
    font-size: 16px;

    text-align: center;
  }

  .map-info {
    height: 70px;
    width: 290px;

    margin: 45px auto 12px auto;

    box-shadow: 1px 1px 3px $gray2;
  }

  .tag-info {
    display: block;

    height: 40px;
    width: 290px;
    margin: 52px auto 8px auto;

    font-size: 16px;
    font-weight: bold;

    box-shadow: 1px 1px 3px $gray2;
  }

  p {
    display: block;

    font-size: 14px;
    overflow-y: hidden;
    overflow-x: auto;

    white-space: nowrap;
  }
}

.info-close-button {
  position: absolute;
  top: 12px;
  left: 12px;

  transition: all .2s;

  z-index: 1;

  cursor: pointer;

  &:hover, &:focus {
    transform: scale(1.2);
  }
}

.info-action-button {
  position: absolute;
  top: 12px;
  right: 12px;

  font-size: 14px;
  text-decoration: underline;

  transition: all .2s;

  z-index: 1;
  cursor: pointer;

  &:hover, &:focus {
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

$tagMenuMargin: 100px;
$mapMenuMargin: 127px;

$tagMenuHeight: calc(100% - #{$tagMenuMargin});
$mapMenuHeight: calc(100% - #{$mapMenuMargin});
.tag-button-container {
  width: 100%;
  height: $tagMenuHeight;
  overflow: auto;
}

.google-map {
  width: 336px;
  height: $mapMenuHeight;

  * {
    overflow: visible;
  }
}


</style>
