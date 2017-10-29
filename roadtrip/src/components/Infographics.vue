<template>
  <div class="main" @scroll="scrollHandler">
    <section
      :style="{'height': windowHeight}"
      class="purple"
      :class="{'in-viewport': sections[0].inViewport}"
    >
      <div class="content-aligner">
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
      <div class="content-aligner">
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
      <div class="content-aligner align-top">
        <div class="sub-panel left">
          <div class="table-aligner">
            <div class="content-aligner">
              <h1>Major Cities Visited: {{citiesVisited}}</h1>
              <h1>National Parks Visited: {{nationalParksVisited}}</h1>
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
      <div class="content-aligner">
        <h1>Total Miles Walked</h1>
      </div>
    </section>

    <section
      :style="{'height': windowHeight}"
      class="yellow"
      :class="{'in-viewport': sections[4].inViewport}"
    >
      <div class="content-aligner">
        <h1>Burritos Eaten / Weight Lost</h1>
      </div>
    </section>

    <section
      :style="{'height': windowHeight}"
      class="red"
      :class="{'in-viewport': sections[5].inViewport}"
    >
      <div class="content-aligner">
        <h1>Instagram Photos Posted / Selfies Taken / Snapchats Taken</h1>
      </div>
    </section>

    <section
      :style="{'height': windowHeight}"
      class="brown"
      :class="{'in-viewport': sections[6].inViewport}"
    >
      <div class="content-aligner">
        <h1>Fun Had</h1>
      </div>
    </section>

  </div>
</template>

<script>

import doubleArrow from "../assets/double-arrow.svg"
import tween from "tween"

export default {
  components: {
  },
  data () {
    return {
      img: {
        doubleArrow
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
      myMapsVisible: false
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
        if (rect.y <= window.innerHeight / 2) {
          this.sections[i].inViewport = true
        }
      }

    },
    inViewportChangeHandler(index) {
      console.log(index);
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
        default:
          // No default case
      }
    },
    tweenAnimate() {
      if (tween.update()) {
        requestAnimationFrame(this.tweenAnimate)
      }
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

        this.tweenAnimate()

        // Days
        setTimeout(() => {
          new tween.Tween({ tweeningNumber: 0 })
            .easing(TWEEN.Easing.Quadratic.Out)
            .to({ tweeningNumber: daysOnRoad }, time2)
            .onUpdate(function () {
              vm.daysOnRoad = this.tweeningNumber.toFixed(0)
            })
            .start()
          this.tweenAnimate()
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
          this.tweenAnimate()
        }, time1 + time2)

        // Oh my
        setTimeout(() => {
          this.speedingTicketVisible = true;
        }, time1 + time2 + time3)
      },
      mapBlockHandler() {
        // Animate up miles driven
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

          this.tweenAnimate()

          // Parks
          setTimeout(() => {
            new tween.Tween({ tweeningNumber: 0 })
              .easing(TWEEN.Easing.Quadratic.Out)
              .to({ tweeningNumber: nationalParksVisited }, time2)
              .onUpdate(function () {
                vm.nationalParksVisited = this.tweeningNumber.toFixed(0)
              })
              .start()
            this.tweenAnimate()
          }, time1)

          // Map
          setTimeout(() => {
            this.myMapsVisible = true;
          }, time1 + time2)

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
}

h2 {
  font-size: 30px;
  margin: 0 auto;
}

h1, h2 {
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
  }
  &.right {
    width: 80%;
  }
}

.map-iframe {
  border: none;
  border-radius: 5px;
  height: 100%;
  width: 80%;
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



</style>
