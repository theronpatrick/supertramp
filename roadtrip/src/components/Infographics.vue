<template>
  <div class="main" @scroll="scrollHandler">
    <section
      :style="{'height': windowHeight}"
      class="purple"
      :class="{'in-viewport': sections[0].inViewport}"
    >
      <div class="content-aligner" :style="{'height': windowHeight}">
        <h1>
          <span class="fade-in" :class="{'visible': statsVisible}">Stats, </span>
          <span class="fade-in" :class="{'visible': factsVisible}">Facts, </span>
          <span class="fade-in" :class="{'visible': funVisible}">and <span>Fun</span></span>
        </h1>
        <h2 class="fade-in" :class="{'visible': subTitleVisible}">From Theron's 2017 Road Trip Extravaganza</h2>
        <img :src="img.doubleArrow" class="scroll-down-arrow fade-in" :class="{'visible': scrollDownArrowVisible}"></img>
      </div>
    </section>

    <section
      :style="{'height': windowHeight}"
      class="green"
      :class="{'in-viewport': sections[1].inViewport}"
    >
      <div class="content-aligner" :style="{'height': windowHeight}">
        <h1>Miles Driven: {{milesDriven}}</h1>
        <h1>Days on the Road: {{daysOnRoad}}</h1>
        <h1>Speeding tickets: {{speedingTickets}} <span class="font-expand" :class="{visible: speedingTicketVisible}">😓</span></h1>
        <img class="test-image" :src="img.doubleArrow" v-if="debug"></img>
      </div>
    </section>

    <section
      :style="{'height': windowHeight}"
      class="teal"
      :class="{'in-viewport': sections[2].inViewport}"
    >
      <div class="content-aligner align-top" :style="{'height': windowHeight}">
        <div class="sub-panel left">
          <div class="table-aligner">
            <div class="content-aligner">
              <h2>Major Cities Visited: {{citiesVisited}}</h2>
              <h2>National Parks Visited: {{nationalParksVisited}}</h2>
            </div>
          </div>
        </div>
        <div class="sub-panel right align-left">
          <iframe
            class="map-iframe fade-in"
            :class="{'visible': myMapsVisible}" src="https://www.google.com/maps/d/u/0/embed?mid=1jBoe1OhHUXtiMh6UfHw4t35spCA"></iframe>
          </div>
      </div>
    </section>

    <section
      :style="{'height': windowHeight}"
      class="orange"
      :class="{'in-viewport': sections[3].inViewport}"
    >
      <div class="content-aligner" :style="{'height': windowHeight}">
        <h1>Miles Walked: {{milesWalked}}</h1>
        <h2
          class="fade-in"
          :class="{'visible': marathonsWalkedVisible}">(that's {{marathonsWalked}} marathons!)</h2>
        <h2 class="fade-in" :class="{'visible': weightLostVisible}">Weight Lost: {{weightLost}}lbs.</h2>
      </div>
        <div class="marathon-animation-block">
          <span
            v-for="(marathonWalker, index) in marathonWalkers"
            class="marathon-walker"
          >{{index % 2 === 0 ? '🚶' : '🏃'}}
          </span>
        </div>
    </section>

    <section
      :style="{'height': windowHeight}"
      class="yellow"
      :class="{'in-viewport': sections[4].inViewport}"
    >
      <div class="content-aligner" :style="{'height': windowHeight}">
        <h1 class="fade-in" :class="{'visible': burritosEatenVisible}">Breakfast Burritos eaten: {{burritosEaten}}</h1>
        <div class="fade-in" :class="{'visible': burritoListVisible}">
          <h1>Top 3 Breakfast Burritos Joints:</h1>
          <div
            class="fade-in burrito-list-item"
            :class="{'visible': burritoRankVisible1}">
              <div>
                <span class="burrito-spinner">🌯</span>
                <span class="burrito-spinner flipped">🌯</span>
                <span class="burrito-spinner">🌯</span>
              </div>
              <h1>1. Colima's</h1>
              <h2>San Diego, CA</h2>
              <div>
                <span class="burrito-spinner">🌯</span>
                <span class="burrito-spinner flipped">🌯</span>
                <span class="burrito-spinner">🌯</span>
              </div>
          </div>
          <div class="fade-in burrito-list-item small" :class="{'visible': burritoRankVisible2}">
            <h1>2. Chill Out Cafe</h1>
            <h2>Santa Cruz, CA</h2>
          </div>
          <div class="fade-in burrito-list-item small" :class="{'visible': burritoRankVisible3}">
            <h1>3. Crossroads Cafe</h1>
            <h2>Joshua Tree, CA</h2>
          </div>
        </div>
      </div>
    </section>

    <section
      :style="{'height': windowHeight}"
      class="red photo-block"
      :class="{'in-viewport': sections[5].inViewport}"
    >
      <div class="content-aligner" :style="{'height': windowHeight}">
        <h1>
          <a href="http://theron.dev/roadtrip/summerofsnap" target="_blank">
            <span>Snapchats Taken: {{snapchatsTaken}}</span>
            <img class="no-border fade-in" :class="{'visible': snapchatsVisible}" :src="img.snapGhost"></img>
          </a>
        </h1>

        <h1>
          <a href="http://theron.dev/roadtrip/selfiegallery" target="_blank">
            <span>Selfies Taken: {{selfiesTaken}} </span>
            <span class="selfie-image-aligner fade-in" :class="{'visible': selfiesVisible}">
              <img class="selfie" src="https://i.imgur.com/CtmHtEW.jpg"></img>
              <img class="selfie reverse" src="https://i.imgur.com/CAZvye8.jpg"></img>
            </span>
          </a>
        </h1>

        <h1>
          <a href="https://www.instagram.com/therontosomething/" target="_blank">
            <span>Instagram Photos Posted: {{instagramsTaken}}</span>
            <img src="https://i.imgur.com/WzTFqkq.jpg" class="fade-in" :class="{'visible': instagramsVisible}"></img>
          </a>
        </h1>
      </div>
    </section>

    <section
      :style="{'height': windowHeight}"
      class="brown"
      :class="{'in-viewport': sections[6].inViewport}"
    >
      <div class="content-aligner favorite-place-background align-top" :style="favoritePlaceStyle">
        <h1>
          <span>Panoramas Taken: {{panos.length}}</span>
        </h1>
        <h2>
          <span>{{favoritePlace}}</span>
        </h2>
        <div><img v-for="place in favoritePlacePreload" :src="place" class="preload-image"></img></div>
      </div>
    </section>

  </div>
</template>

<script>

import doubleArrow from "../assets/double-arrow.svg"
import snapGhost from "../assets/snap-ghost.png"

import panos from "../data/panoramas.js"

import tween from "tween"

export default {
  components: {
  },
  data () {
    return {
      img: {
        doubleArrow,
        snapGhost
      },
      debug: false,
      sections: [],
      windowInnerHeight: window.innerHeight,
      windowHeight: '0px',
      statsVisible: false,
      factsVisible: false,
      funVisible: false,
      scrollDownArrowVisible: false,
      subTitleVisible: false,
      milesDriven: 0,
      daysOnRoad: 0,
      speedingTickets: 0,
      speedingTicketVisible: false,
      citiesVisited: 0,
      nationalParksVisited: 0,
      myMapsVisible: false,
      milesWalked: 0,
      marathonsWalkedVisible: false,
      marathonsWalked: 0,
      marathonWalkers: [],
      burritosEaten: 0,
      weightLost: 0,
      burritosEatenVisible: false,
      weightLostVisible: false,
      burritoListVisible: false,
      burritoRankVisible3: false,
      burritoRankVisible2: false,
      burritoRankVisible1: false,
      snapchatsVisible: false,
      selfiesVisible: false,
      instagramsVisible: false,
      snapchatsTaken: 0,
      selfiesTaken: 0,
      instagramsTaken: 0,
      favoritePlaceIndex: 0,
      favoritePlacePreload: [],
      favoritePlace: "",
      favoritePlaceStyle: {},
      favoritePlaceTimeout: {},
      panos
    }
  },
  mounted() {
    // Set up initial window bounds
    this.resizeHandler()

    // Store all section DOM elements
    let sections = document.querySelectorAll("section")
    for (let i = 0; i < this.sections.length; i++) {
      this.sections[i].sectionElement = sections[i]
    }

    // Load images for last section
    this.loadImages()

    // Set up tween animation loop
    requestAnimationFrame(this.tweenAnimate);

  },
  beforeMount() {
    window.addEventListener('resize', this.resizeHandler)

    // Fill sections array with objects so :class in template doesn't bug out
    let numOfSections = 7
    for (let i = 0; i < numOfSections; i++) {
      this.sections.push({inViewport: false})
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeHandler)

    // Clear timeout if we set it up
    clearTimeout(this.favoritePlaceTimeout)
  },
  methods: {
    resizeHandler() {
      // Save absolute total (for calc) and px size (for template)
      this.windowInnerHeight = window.innerHeight
      this.windowHeight = `${window.innerHeight}px`
    },
    scrollHandler(e) {

      // If bounding rect for a section is 1/2 in screen, animate items in
      // TODO: Play with factor for images to animate in
      for (let i = 0; i < this.sections.length; i++) {
        let rect = this.sections[i].sectionElement.getBoundingClientRect()

        let top = rect.y || rect.top

        if (top <= window.innerHeight / 2) {
          this.sections[i].inViewport = true
        }
      }

    },
    inViewportChangeHandler(index) {
      switch (index) {
        case 0:
          this.introBlockHandler()
          break;
        case 1:
          this.distanceBlockHandler()
          break;
        case 2:
          this.mapBlockHandler()
          break;
        case 3:
          this.walkedBlockHandler()
          break;
        case 4:
          this.burritoBlockHandler()
          break;
        case 5:
          this.photoBlockHandler()
          break;
        case 6:
          this.favoritePlaceBlockHandler()
          break;
        default:
          // No default case
      }
    },
    // TODO: Read more docs about TWEEN, make sure this is not being called too much
    tweenAnimate(time) {
      requestAnimationFrame(this.tweenAnimate);
      tween.update(time);
    },
    introBlockHandler() {

      // Durations
      let time1 = 1200;
      let time2 = 1200;
      let time3 = 1200;
      let time4 = 1200;

      setTimeout(() => {
        this.statsVisible = true
      })

      setTimeout(() => {
        this.factsVisible = true
      }, time1)

      setTimeout(() => {
        this.funVisible = true
      }, time1 + time2)

      setTimeout(() => {
        this.subTitleVisible = true
      }, time1 + time2 + time3)

      setTimeout(() => {
        this.scrollDownArrowVisible = true
      }, time1 + time2 + time3 + time4)

    },
    distanceBlockHandler() {
      // Animate up miles driven
      let vm = this
      let start = 0;
      let distance = 20369;
      let daysOnRoad = 92;
      let speedingTickets = 1;

      // Durations
      let time1 = 2000;
      let time2 = 1500;
      let time3 = 1000;
      let time4 = 500;

      new tween.Tween({ tweeningNumber: 0 })
        .easing(TWEEN.Easing.Quadratic.Out)
        .to({ tweeningNumber: distance }, time1)
        .onUpdate(function () {
          vm.milesDriven = this.tweeningNumber.toFixed(0)
        })
        .start()

        // Days
        setTimeout(() => {
          new tween.Tween({ tweeningNumber: 0 })
            .easing(TWEEN.Easing.Quadratic.Out)
            .to({ tweeningNumber: daysOnRoad }, time2)
            .onUpdate(function () {
              vm.daysOnRoad = this.tweeningNumber.toFixed(0)
            })
            .start()

        }, time1)

        // Speeding ticket
        // Days
        setTimeout(() => {
          new tween.Tween({ tweeningNumber: 0 })
            .easing(TWEEN.Easing.Quadratic.Out)
            .to({ tweeningNumber: speedingTickets }, time3)
            .onUpdate(function () {
              vm.speedingTickets = this.tweeningNumber.toFixed(0)
            })
            .start()
        }, time1 + time2)

        // Oh my
        setTimeout(() => {
          this.speedingTicketVisible = true;
        }, time1 + time2 + time3)
    },
    mapBlockHandler() {
      // Animate map
      let vm = this
      let start = 0;
      let citiesVisited = 23;
      let nationalParksVisited = 33;

      // Durations
      let time1 = 1500;
      let time2 = 1500;

      new tween.Tween({ tweeningNumber: 0 })
        .easing(TWEEN.Easing.Quadratic.Out)
        .to({ tweeningNumber: citiesVisited }, time1)
        .onUpdate(function () {
          vm.citiesVisited = this.tweeningNumber.toFixed(0)
        })
        .start()

        // Parks
        setTimeout(() => {
          new tween.Tween({ tweeningNumber: 0 })
            .easing(TWEEN.Easing.Quadratic.Out)
            .to({ tweeningNumber: nationalParksVisited }, time2)
            .onUpdate(function () {
              vm.nationalParksVisited = this.tweeningNumber.toFixed(0)
            })
            .start()
        }, time1)

        // Map
        setTimeout(() => {
          this.myMapsVisible = true;
        }, time1 + time2)

    },
    walkedBlockHandler() {
      // Animate up miles walked
      let vm = this
      let start = 0;
      let milesWalked = 446.94;
      let marathonsWalked = 17.06;
      let weightLost = 29;

      // Durations
      let time1 = 2500;
      let spawner = 450;
      let time2 = spawner * marathonsWalked.toFixed(0);
      let time3 = 1600;

      new tween.Tween({ tweeningNumber: 0 })
        .easing(TWEEN.Easing.Quadratic.Out)
        .to({ tweeningNumber: milesWalked }, time1)
        .onUpdate(function () {
          vm.milesWalked = this.tweeningNumber.toFixed(2)
        })
        .start()

        // Marathons
        setTimeout(() => {
          new tween.Tween({ tweeningNumber: 0 })
            .easing(TWEEN.Easing.Quadratic.Out)
            .to({ tweeningNumber: marathonsWalked }, time2)
            .onUpdate(function () {
              vm.marathonsWalked = this.tweeningNumber.toFixed(2)
            })
            .start()
          this.marathonsWalkedVisible = true
        }, time1)

        // Spawner animation
        for (let i = 0; i < marathonsWalked.toFixed(0); i++) {
          setTimeout(() => {
            this.marathonWalkers.push(true)

          }, time1 + i * spawner)
        }

        // Weight timeout
        setTimeout(() => {
          new tween.Tween({ tweeningNumber: 0 })
            .easing(TWEEN.Easing.Quadratic.Out)
            .to({ tweeningNumber: weightLost }, time3)
            .onUpdate(function () {
              vm.weightLost = this.tweeningNumber.toFixed(0)
            })
            .start()

          this.weightLostVisible = true
        }, time1 + time2)

    },
    burritoBlockHandler() {
      // Animate up burritos eaten
      let vm = this
      let start = 0;
      let burritosEaten = 25;
      let weightLost = 29;

      // Durations
      let time1 = 1800;
      let time2 = 2000;
      let time3 = 1800;
      let time4 = 2400;

      new tween.Tween({ tweeningNumber: 0 })
        .easing(TWEEN.Easing.Quadratic.Out)
        .to({ tweeningNumber: burritosEaten }, time1)
        .onUpdate(function () {
          vm.burritosEaten = this.tweeningNumber.toFixed(0)
        })
        .start()

      this.burritosEatenVisible = true

      // List
      setTimeout(() => {
        this.burritoListVisible = true
      }, time1)

      // Top 3 burritos
      setTimeout(() => {
        this.burritoRankVisible3 = true
      }, time1 + time2)
      setTimeout(() => {
        this.burritoRankVisible2 = true
      }, time1 + time2 + time3)
      setTimeout(() => {
        this.burritoRankVisible1 = true
      }, time1 + time2 + time3 + time4)

    },
    photoBlockHandler() {
      // Animate through photos
      let vm = this
      let start = 0;
      let snapchatsTaken = 1664;
      let instagramsTaken = 247;
      let selfiesTaken = 130;

      // Durations
      let time1 = 1200;
      let time2 = 1800;
      let time3 = 1800;

      setTimeout(() => {
        new tween.Tween({ tweeningNumber: 0 })
          .easing(TWEEN.Easing.Quadratic.Out)
          .to({ tweeningNumber: snapchatsTaken }, time1)
          .onUpdate(function () {
            vm.snapchatsTaken = this.tweeningNumber.toFixed(0)
          })
          .start()

        this.snapchatsVisible = true
      }, time1)

      setTimeout(() => {
        new tween.Tween({ tweeningNumber: 0 })
          .easing(TWEEN.Easing.Quadratic.Out)
          .to({ tweeningNumber: selfiesTaken }, time1)
          .onUpdate(function () {
            vm.selfiesTaken = this.tweeningNumber.toFixed(0)
          })
          .start()

        this.selfiesVisible = true
      }, time1 + time2)

      setTimeout(() => {
        new tween.Tween({ tweeningNumber: 0 })
          .easing(TWEEN.Easing.Quadratic.Out)
          .to({ tweeningNumber: instagramsTaken }, time1)
          .onUpdate(function () {
            vm.instagramsTaken = this.tweeningNumber.toFixed(0)
          })
          .start()

        this.instagramsVisible = true
      }, time1 + time2 + time3)
    },
    shuffleFavoriteImages() {
      // Randomize our image order in a non-optimized way cuz something weird going on with vue arrays
      let newArray = []

      while (this.panos.length > 0) {
        let length = this.panos.length;
        let index = Math.floor(Math.random() * length) + 0
        newArray.push(this.panos[index])
        this.panos.splice(index, 1)
      }

      // Reset to our shuffled aray
      this.panos = newArray

      // Preload 5 images
      for (let i = 0; i < 5; i++) {
        this.favoritePlacePreload.push(this.panos[i].url)
      }
    },
    favoritePlaceBlockHandler() {
      // Loop through panoramas, set background
      let vm = this
      let start = 0;

      // Start up interval
      this.favoritePlaceInterval()

    },
    favoritePlaceInterval() {
      let interval = 3000;

      let imageIndex = this.favoritePlaceIndex

      // Preload backgrounds
      for (let i = 0; i < 5; i++) {
        // If we previously set imageIndex to be out of bounds, reset to beginning of array
        if (imageIndex === this.panos.length) {
          imageIndex = 0;
        }

        // Use $set so vue sees array update
        this.$set(this.favoritePlacePreload, i, this.panos[imageIndex].url)

        imageIndex++
      }

      // Set background style
      this.favoritePlaceStyle = {
        "background-image": `url(${this.panos[this.favoritePlaceIndex].url})`,
        "height": this.windowHeight
      }
      this.favoritePlace = this.panos[this.favoritePlaceIndex].name

      // Increment index, or reset to 0
      if (this.favoritePlaceIndex === this.panos.length) {
        this.favoritePlaceIndex = 0
      } else {
        this.favoritePlaceIndex++
      }

      this.favoritePlaceTimeout = setTimeout(() => {
        this.favoritePlaceInterval()
      }, interval)
    },
    loadImages() {
      // TODO: Show loader while images are loading in
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.imgur.com/3/album/9Gaeh",
        "method": "GET",
        "headers": {
          "authorization": "Client-ID 27a13f9320a8875"
        }
      }

      $.ajax(settings).done((response) => {
        if (response.data) {

          for (let i = 0; i < response.data.images.length; i++) {
            this.panos[i].url = response.data.images[i].link
          }

          // After loading, shuffle images and start preload
          this.shuffleFavoriteImages()

        }
      });

    }


  },
  watch: {
    sections: {
      handler: function(newVal, oldVal) {
        // Go through our array, trigger onChange for last visible block
        let lastVisibleIndex = 0;
        for (let i = 0; i < newVal.length; i++) {
          if (newVal[i].inViewport) {
            lastVisibleIndex = i;
          }
        }

        this.inViewportChangeHandler(lastVisibleIndex)
      },
      deep: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import "~../styles/colors";
@import "~../styles/variables";

.main {
  overflow-y: auto;
  overflow-x: hidden;

  height: 100%;
  color: #fff;

  -webkit-overflow-scrolling: touch;
}

h1 {
  font-size: 38px;
  margin: 0 auto;

  @include mobile {
    font-size: 28px;
  }
}

h2 {
  font-size: 30px;
  margin: 0 auto;

  @include mobile {
    font-size: 20px;
  }
}

h2 {
  font-size: 22px;
  margin: 0 auto;

  @include mobile {
    font-size: 16px;
  }
}


h1, h2, h3 {
  text-shadow: 2px 1px 0px $gray3
}

section {
  min-height: 100px;
  width: 100%;
  display: table;
  text-align: center;
  position: relative;

  &.green {
    background-color: $infoGreen;
  }
  &.purple {
    background-color: $infoPurple;
  }
  &.orange {
    background-color: $infoOrange;
  }
  &.teal {
    background-color: $infoTeal;
  }
  &.yellow {
    background-color: $infoYellow;
  }
  &.red {
    background-color: $infoRed;
  }
  &.brown {
    background-color: $infoBrown;
  }

  .table-aligner {
    display: table;
    height: 100%;
  }

  .content-aligner {
    display: table-cell;
    vertical-align: middle;
    height: 100%;

    &.align-top {
      display: block;
    }
  }

  .test-image {
    position: absolute;
    left: -100px;
    top: 50px;
    transition: 1s all;
  }

  // Change CSS based on visibility of section in viewport
  &.in-viewport {
    .test-image {
      left: 50%;
    }

  }
}

.align-left {
  text-align: left;
}

.scroll-down-arrow {
  position: absolute;

  transform: rotate(90deg);
  transform-origin: 0;
  width: 94px;
  bottom: 50px;

  animation: arrow-bounce 1s infinite ease-in-out;

}

.sub-panel {
  display: inline-block;
  height: 100%;
  vertical-align: top;

  padding: 5px;

  &.left {
    // TODO: Figure out where phantom 1% is coming from throwing this off
    width: 19%;

    @include mobile {
      width: 29%;
    }
  }
  &.right {
    width: 80%;

    @include mobile {
      width: 70%;
    }
  }
}

.map-iframe {
  border: none;
  border-radius: 5px;
  height: 100%;
  width: 80%;
  pointer-events: none;

  // Prevent scrolling/clicking until map is visible
  &.visible {
    pointer-events: auto;
  }
}

.burrito-list-item {
  &.small {
    h1 {
      font-size: 28px
    }
  }
}

// Animations
@keyframes arrow-bounce {
  0% {
    bottom: 50px;
  }
  50% {
    bottom: 150px
  }
  100% {
    bottom: 50px;
  }
}

// TODO: Make sure fonts are good on mobile
.font-expand {
  font-size: 0px;
  transition: 1s all linear;

  &.visible {
    font-size: 38px
  }
}

.fade-in {
  opacity: 0;
  transition: 1s all linear;

  &.visible {
    opacity: 1;
  }
}

.fly-from-left {
  margin-right: 100%;
  transition: 1s all linear;

  &.visible {
    margin-right: 0%;
  }
}

.marathon-animation-block {
  position: absolute;
  left: 50%;
  top: 0%;
  transform: translateX(-50%);

  height: 100%;
  width: 80%;
}

@keyframes marathon-walk {
  0% {
    top: 0px;
    left: 0px;
    transform: rotate(0deg)
  }
  1% {
    top: 0px;
    left: 0px;
    transform: rotate(-90deg)
  }
  25% {
    left: 0px;
    top: calc(100% - 85px);
    transform: rotate(-90deg)
  }
  26% {
    left: 0px;
    top: calc(100% - 85px);
    transform: rotate(-180deg)
  }
  50% {
    left: calc(100% - 65px);
    top: calc(100% - 85px);
    transform: rotate(-180deg)
  }
  51% {
    left: calc(100% - 65px);
    top: calc(100% - 85px);
    transform: rotate(-270deg)
  }
  75% {
    left: calc(100% - 65px);
    top: 0px;
    transform: rotate(-270deg)
  }
  76% {
    left: calc(100% - 65px);
    top: 0px;
    transform: rotate(-360deg)
  }
  100% {
    top: 0px;
    left: 0px;
    transform: rotate(-360deg)
  }
}

.marathon-walker {
  font-size: 50px;
  position: absolute;

  animation: marathon-walk 10s infinite linear;
}

@keyframes burrito-spin {
  0% {
    transform: rotate(0deg)
  }
  100% {
    transform: rotate(360deg)
  }
}

@keyframes burrito-spin-flipped {
  0% {
    transform: rotate(0deg)
  }
  100% {
    transform: rotate(-360deg)
  }
}

.burrito-spinner {
  display: inline-block;
  animation: burrito-spin 1s infinite linear;

  font-size: 32px;

  &.flipped {
    animation: burrito-spin-flipped 1s infinite linear;
  }
}

@keyframes selfie-switch {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
    display: none;
  }
  100% {
    opacity: 1;
  }
}

@keyframes selfie-switch-reverse {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.photo-block {

  h1 {
    @include mobile {
      font-size: 22px;
      margin-bottom: 20px;
    }
  }

  .selfie-image-aligner {
    display: inline-block;
    height: 66px;

    vertical-align: top;
    position: relative;
  }

  a {
    display: inline-block;
    margin: 0 auto;
    color: #fff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  img {
    display: inline-block;
    vertical-align: middle;
    width: 50px;
    border-radius: 50%;
    border: 1px solid #fff;

    &.no-border {
      border: none;
    }

    &.selfie {
      position: absolute;

      animation: selfie-switch 5s infinite linear;

      &.reverse {
        animation: selfie-switch-reverse 5s infinite linear;
      }
    }
  }
}

.preload-image {
  position: absolute;
  width: 1px;
  height: 1px;
  left: -9999px;
}

.favorite-place-background {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;

  transition: all 1s ease-in-out;
}


</style>
