<template>
  <div class="main">
    <div class="background-container"></div>

    <tour
      :tourHighlightElement="tourHighlightElementCallback"
      ref="tour"
      tourId="selfie"
      :messages="tourMessages"
    ></tour>

    <div class="debug-data-container" v-if="debug">
      <p>Current Track : {{activeIndex}}</p>
      Location: {{ locations[images[activeIndex]] ? locations[images[activeIndex].location].name : ""}} <input ref="debugLocationInput" @keyup.enter="debugSaveData"></input>
      <button @click="debugSaveData">Save</button>
      <p>export default [<span v-for="image in images">{"location": "{{image.location}}"},</span>]</p>
      <hr />
      <p style="color: red">{{locations}}</p>
    </div>

    <div class="gallery-image-active-container" ref="activeImageContainer" :style="galleryImageActiveStyle">
      <img
        :src="images[activeIndex] ? images[activeIndex].link: ''"
        :class="{'loading': !images[activeIndex] || images[activeIndex]._roadtripLoaded === false}"
      ></img>
      <img
        :src="loaderImg"
        class="loader"
        :class="{'loading': images[activeIndex] && images[activeIndex]._roadtripLoaded === true}"
      ></img>
    </div>
    <div class="gallery-container" @scroll="imageScrollHandler" ref="galleryContainer">
      <div class="gallery-image-alignment-fixer"></div>
      <div
        v-for="(image, index) in images"
        ref="images"
        class="gallery-image-aligner"
        @click="galleryImageClickHandler"
        :style="{'left': `${image._roadtripLeft}px`, 'height': `${image._roadtripHeight}%`}">
          <img
            :src="loaderImg"
            class="loader"
            :class="{'loading': image._roadtripLoaded}"
          ></img>
          <img
            :src="image.link"
            v-on:load="imageLoaded(index)"
            :class="{'loading': !image._roadtripLoaded}"
          ></img>
      </div>
      <div class="gallery-image-alignment-fixer"></div>
    </div>

    <div :style="debugStyle" v-if="debug"></div>

    <div class="controls-buttons-container">
      <button
        ref="seekBackwardButton"
        @click="seekBackwardHandler"
        class="seek-button seek-back tour-highlightable"
        :class="{'tour-highlighted' : tourHighlightedElement === 'seekBackward'}"
        title="Previous Selfie">
          <img :src="buttons.arrow"></img>
      </button>
      <button
        ref="seekForwardButton"
        @click="seekForwardHandler"
        class="seek-button tour-highlightable"
        :class="{'tour-highlighted' : tourHighlightedElement === 'seekForward'}"
        title="Next Selfie">
        <img :src="buttons.arrow"></img>
      </button>

      <button
        ref="infoButton"
        @click="toggleInfo"
        class="seek-button tour-highlightable"
        :class="{'tour-highlighted' : tourHighlightedElement === 'infoButton', 'active': infoVisible}"
         title="Info Menu">
        <span class="">i</span>
      </button>

    </div>

    <transition name="menu-animation">
      <div v-show="infoVisible" class="info-container" key="info-container" ref="infoContainer">
        <img
          v-show="infoVisible"
          :src="buttons.close"
          class="info-close-button"
          role="button"
          key="close-button"
          @click="infoCloseClickHandler"
          title="Close">
        </img>
        <span
          v-show="infoVisible"
          :src="buttons.question"
          class="info-action-button"
          role="button"
          key="tour-button"
          @click="infoTourClickHandler"
          title="Show Tour"
        >Show Tour</span>

        <h1>Info</h1>
        <div class="map-info">
          <p>{{locations[images[activeIndex].location] ? `${locations[images[activeIndex].location].name}, ${locations[images[activeIndex].location].state}` : ""}}</span></p>

          <p>Selfie {{activeIndex + 1}} of {{images.length}}</p>
        </div>
        <div ref="googleMap" class="google-map "></div>
      </div>
    </transition>
  </div>
</template>

<script>

// imgurClientId
// 27a13f9320a8875

// secret
// 32c51ad35a366a4ce139c0d92e102f29968a58d6

import GoogleMapsLoader  from "google-maps"
import locations from "../data/locations.js"
import imageData from "../data/selfies.js"

import arrow from "../assets/arrow.svg"
import close from "../assets/close.svg"
import question from "../assets/question.svg"
import loaderImg from "../assets/loader.svg"

import tour from "./Tour.vue"

export default {
  components: {
    tour
  },
  data () {
    return {
      debug: false,
      images: [],
      buttons: {
        arrow,
        close,
        question
      },
      loaderImg,
      boundingRects: [],
      activeIndex: 0,
      galleryImageActiveStyle: {},
      debugStyle: {},
      debugSearchBox: {},
      debugGeocoder: {},
      debugSearchBox: {},
      infoMap: {},
      infoMapMarker: {},
      locations,
      imageData,
      infoVisible: false,
      googleMapAPILoaded: false,
      tourHighlightedElement: "",
      tourMessages: [
        {
          message: "Welcome to my Selfie Gallery! Click the arrow to continue.",
          element: ""
        },
        {
          message: `If you're on a desktop, use the scrollbar to scroll through all 130 images. If you're on mobile, tap and drag to swipe through.`,
          element: ""
        },
        {
          message: `Use this button to go one image backwards.`,
          element: "seekBackward"
        },
        {
          message: `Use this button to go one image forwards.`,
          element: "seekForward"
        },
        {
          message: `Use the info button to show or hide the info menu. This menu shows the location where the image was taken.`,
          element: "infoButton"
        },
        {
          message: `Enjoy!`,
          element: ""
        }
      ],
    }
  },
  mounted() {

    this.initGoogleMap()
    this.checkJquery()

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
              lng: place.geometry.location.lng(),
              placeId: place.place_id
            }

            this.images[this.activeIndex].location = place.place_id;

            // Add to our hash
            console.log("locations " , this.locations);
            if (!this.locations[place.place_id]) {
              console.log("adding " , place.name);
              console.log("id " , place.place_id);
              this.locations[place.place_id] = {
                name: place.name,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              }
            }
          })
        })


      }, 1000)

    }
  },
  beforeMount() {
    window.addEventListener('resize', this.calcActiveImage)

    // Set initial data for images before loading from imgur
    this.images = this.imageData;
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.calcActiveImage)
  },
  methods: {
    initGoogleMap() {

      GoogleMapsLoader.KEY = "AIzaSyDY-HfeAAaeqRYsu4qQPYxhnYM4XUKb6m4"
      GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];

      GoogleMapsLoader.load((google) => {

          this.googleMapAPILoaded = true;

          let position = new google.maps.LatLng(this.locations['ChIJ_87aSGzctEwRtGtUNnSJTSY'].lat, this.locations['ChIJ_87aSGzctEwRtGtUNnSJTSY'].lng);

          console.log("loaded google map...");
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
    createGoogleMarkerForLocation() {
      let currentImage = this.images[this.activeIndex]
      let location = this.locations[currentImage.location]

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
    debugSaveData() {
      let places = this.debugSearchBox.getPlaces()

      places.forEach((place) => {

        let location = {
          name: place.name,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          placeId: place.place_id
        }

        this.images[this.activeIndex].location = place.place_id;
      })
    },
    tourHighlightElementCallback(element) {
      this.tourHighlightedElement = element
    },
    checkJquery() {
      // Pretty hacky check to see if jquery is loaded, and if not keep retrying
      // TODO: Fuck with webpack stuff to make sure external dependency is loaded
      if ($) {
        this.loadImages()
      } else {
        setTimeout(() => {
          this.checkJquery()
        }, 1000)
      }
    },
    loadImages() {
      // TODO: Show loader while images are loading in
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.imgur.com/3/album/pU3L4",
        "method": "GET",
        "headers": {
          "authorization": "Client-ID 27a13f9320a8875"
        }
      }

      $.ajax(settings).done((response) => {
        if (response.data) {

          // Images stored in reverse chronological order
          response.data.images.reverse()

          // add "_roadtripActive" to data
          // also add positioning information
          for (let i = 0; i < response.data.images.length; i++) {
            if (i === 0) {
              response.data.images[i]._roadtripActive = true;
            } else {
              response.data.images[i]._roadtripActive = false;
            }

            response.data.images[i]._roadtripHeight = 35;
            response.data.images[i]._roadtripLeft = i * 160;

            // Add location info
            if (imageData[i]) {
              response.data.images[i].location = imageData[i].location
            }

            response.data.images[i]._roadtripLoaded = false;

          }

          this.images = response.data.images

          // Calc initial image
          setTimeout(() => {
            this.calcActiveImage();
          }, 300)


        }
      });

    },
    imageLoaded(index) {
      this.images[index]._roadtripLoaded = true;
    },
    imageScrollHandler(e) {

      this.calcActiveImage()

    },
    seekForwardHandler() {
      // If we're on tour, don't actually take action, just go to next element
      if (this.tourHighlightedElement === "seekForward") {
        this.$refs.tour.nextHandler()
        return;
      }

      // Get element for next image
      let index = this.activeIndex + 1;
      if (index < this.$refs.images.length) {
        this.focusImage(this.$refs.images[index])
      }
    },
    seekBackwardHandler() {
      // If we're on tour, don't actually take action, just go to next element
      if (this.tourHighlightedElement === "seekBackward") {
        this.$refs.tour.nextHandler()
        return;
      }

      // Get element for previous image
      let index = this.activeIndex - 1;
      if (index >= 0) {
        this.focusImage(this.$refs.images[index])
      }
    },
    toggleInfo() {
      // If we're on tour, don't actually take action, just go to next element
      if (this.tourHighlightedElement === "infoButton") {
        this.$refs.tour.nextHandler()
        return;
      }

      this.infoVisible = !this.infoVisible;

      // Map loads in at 0 by 0 px cause it's hidden, so resize here
      setTimeout(() => {
        google.maps.event.trigger(this.infoMap, 'resize')
        this.createGoogleMarkerForLocation()
      })
    },
    calcGalleryImageStyle() {
      let height = window.innerHeight * 0.8;
      let width = height * 0.75;

      this.galleryImageActiveStyle = {
        width: `${width}px`
      }
    },
    calcActiveImage() {

      // If our images aren't loaded yet, don't do anything
      if (this.images.length < 1) {
        return;
      }

      // Calc gallery image style based on height
      this.calcGalleryImageStyle()

      let center = window.innerWidth / 2;

      /*
      this.debugStyle = {
        position: 'absolute',
        'background-color': 'red',
        'height': '100%',
        'width': '1px',
        'top': 0,
        'left': `${center}px`
      }
      */

      let containerRect = this.$refs.activeImageContainer.getBoundingClientRect()

      let matchingImages = [];
      let activeIndex = 0;
      let lowestDistance = 99999;

      for (let i = 0; i < this.images.length; i++) {
        let imageRect = this.$refs.images[i].getBoundingClientRect();

        // Scale image based on distance to center
        let distanceFromCenter = Math.abs(center - (imageRect.left + imageRect.width / 2))

        if (distanceFromCenter < lowestDistance) {
          activeIndex = i;
          lowestDistance = distanceFromCenter
        }

        let heightPercent = 80 - (distanceFromCenter * .05);

        // TODO: Also scale margins

        if (heightPercent < 0) {
          heightPercent = 0;
        }
        this.images[i]._roadtripHeight = heightPercent;

      }

      // Images is an array because more than one image can be inside the 'container' at a time
      this.activeIndex = activeIndex
    },
    galleryImageClickHandler(e) {
      // Scroll over to image
      this.focusImage(e.target)

    },
    focusImage(target) {
      let offset = target.getBoundingClientRect().left - target.getBoundingClientRect().width / 2;
      let width = this.$refs.galleryContainer.offsetWidth;

      let amount = offset - width / 2;

      let frames = 20;

      for (let i = 0; i < frames; i++) {
        setTimeout(() => {
          this.$refs.galleryContainer.scrollLeft = this.$refs.galleryContainer.scrollLeft + (amount / frames);
        }, 16 * i)
      }
    },
    infoCloseClickHandler() {
      this.infoVisible = false;
    },
    infoTourClickHandler() {
      this.$refs.tour.showTour()
    },
  },
  watch: {
    activeIndex: function(newVal, oldVal) {
      this.createGoogleMarkerForLocation()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import "~../styles/colors";
@import "~../styles/variables";

// Make sure scrollbar is visible
::-webkit-scrollbar {
    -webkit-appearance: visible;
    width: 7px;
    background: rgba(255,255,255,.2);
    border-radius: 4px;
}
::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(255,255,255,.5);
    -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);
}

.main {
  width: 100%;
  height: 100%;
  position: relative;

  overflow-x: hidden;
}

.background-container {
  width: 100%;
  height: 100%;
  position: relative;

  background: url("../assets/city.jpg") no-repeat center center fixed;
  background-size: cover;

  filter: brightness(60%) contrast(130%);
}

.gallery-container {

  position: absolute;
  height: 80%;
  width: 80%;

  top: 10%;
  left: 50%;
  transform: translateX(-50%);

  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;

  -webkit-overflow-scrolling: touch;
}

.gallery-image-active-container {
  position: fixed;

  left: 50%;
  top: 10%;
  transform: translateX(-50%) translateY(-18px);

  height: 80%;

  // Note that width is a bit wider than actual images will probably be to decrease chance of overlap

  z-index: 1;

  img {
    height: 100%;

    border-radius: 4px;
    box-shadow: 2px 2px 4px #202020;
  }


}

.gallery-image-alignment-fixer {
  display: inline-block;
  height: 100%;
  width: 50%;
}

.gallery-image-aligner {
  display: inline-block;

  bottom: 0;

  height: 35%;
  width: 103px;

  margin: 60px;

  text-align: center;

  cursor: pointer;

  img {
    height: 100%;
    bottom: 0%;
    transition: all 0.3s linear;

    border-radius: 4px;
    box-shadow: 2px 2px 4px #202020;
    opacity: 1;

    transition: 1s all linear;
  }

  &.active {
    img {
      height: 76%;
      width: 200px;
      position: fixed;
      left: 50% !important;
      bottom: 15%;
      margin: 0;
      transform: translateX(-50%);
    }
  }
}

// When images are loading, make invisible and take out of flow
// TODO: Figure out how to get it to not "bump" in height, maybe by calc'ing what the height for the loader
// should be
.loading {
  opacity: 0 !important;
  position: absolute;
  left: -9999px;
}

.loader {
  box-shadow: inherit !important;
}

// Google map stuff
.debug-data-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 500px;
  height: 80%;
  overflow-y: auto;
  background-color: #fff;

  z-index: 2;

  input {
    width: 100%;
  }
}

// Animation
// Tag menu animation
.menu-animation-enter-active, .menu-animation-leave-active {
  right: 0px !important;
}
.menu-animation-enter, .menu-animation-leave-to {
  right: -336px !important;
}

.info-container {
  position: absolute;

  z-index: 1;

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
    border-radius: 5px;

    box-shadow: 1px 1px 3px $gray2;
  }

  .tag-info {
    display: block;

    height: 40px;
    width: 290px;

    border-radius: 5px;
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

// Control buttons
.controls-buttons-container {

  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);

  text-align: center;

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
  border-radius: 5px;

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

    &+ .active-tag-count-container {
      transform: scale(1.2);
      right: -1px;
      top: -1px;
    }
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

  // Just for filter button
  &+ .active-tag-count-container {
    transform: scale(1.2);
    right: -1px;
    top: -1px;
  }
}

</style>
