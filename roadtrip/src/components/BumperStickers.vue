<template>
  <div class="main" @mousemove="mouseMoveHandler">
    <div class="background-container" ref="backgroundContainer">
      <div class="background" :style="backgroundStyle" ref="background">
        <div
          v-for="(hitbox, index) in hitboxes"
          class="hitbox"
          :style="hitbox.style"
          v-on:mouseenter="hitboxMouseEnter(hitbox)"
          v-on:mouseleave="hitboxMouseLeave(hitbox)"
          ></div>
      </div>

      <transition name="label-transition">
        <div
          class="magnifier-label-container"
          :style="magnifierLabelContainerStyle"
          v-show="activePark !== ''">
          <label>{{activePark}}</label>
        </div>
      </transition>

      <div class="magnifier" :style="magnifierStyle">
        <div class="magnifier-background" :style="magnifierBackgroundStyle"></div>
      </div>

      <div class="image-carousel-container">
        <h1 v-if="carouselImages.length === 0">Click a Bumper Sticker to Load Images</h1>
        <img
          v-for="image in carouselImages"
          :src="image.url"
          class="image-carousel-item">
        </img>
      </div>
    </div>

    <div class="debug-panel" v-if="debug">
      <p>Zoom X: {{xPercent}}</p>
      <p>Zoom Y: {{yPercent}}</p>
      <p>Active Park: {{activePark}}</p>
    </div>
  </div>
</template>

<script>

import bumperStickerData from "../data/bumper-stickers.js"

export default {
  data() {
    return {
      debug: true,
      // TODO: Take out absolute values if we're just using percent
      zoomX: 0,
      zoomXOffset: 0,
      zoomY: 0,
      xPercent: 0,
      yPercent: 0,
      magnifierStyle: {},
      magnifierLabelContainerStyle: {},
      magnifierBackgroundStyle: {},
      backgroundStyle: {},
      backgroundUrl: "",
      backgroundWidth: 0,
      backgroundHeight: 0,
      hitboxes: [],
      carouselImages: [],
      parkImages: {}, // key is park name, value is array of loaded carousel images
      activePark: ""
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.resizeHandler)
    window.addEventListener('click', this.globalClickHandler)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeHandler)
    window.removeEventListener('click', this.globalClickHandler)
  },
  mounted() {
    this.getBackground()

    // Draw hitboxes
    this.initHitboxes()
  },
  methods: {
    resizeHandler() {
      // TODO: Make sure larger screens get all bumper stickers in, or at least scroll
      // Also should probably force visible scroll bar on mac

      let height = window.innerHeight;

      // TODO: 728 x 308 is what imgur displays in album view, determine if actual size is bit off
      this.backgroundHeight = window.innerHeight
      this.backgroundWidth = window.innerHeight * (728 / 308)

      this.backgroundStyle.width = `${this.backgroundWidth}px`
      this.backgroundStyle.height = `${this.backgroundHeight}px`

      this.magnifierBackgroundStyle.width = `${this.backgroundWidth}px`
      this.magnifierBackgroundStyle.height = `${this.backgroundHeight}px`

      // Set top / left offset based on image size and magnifier size
      let magnifierOffset = 50

      this.magnifierBackgroundStyle.left = `${this.backgroundWidth / 2 + magnifierOffset}px`
      this.magnifierBackgroundStyle.top = `${this.backgroundHeight / 2 + magnifierOffset}px`
    },
    initHitboxes() {
      for (let key in bumperStickerData) {

        let park = bumperStickerData[key]

        this.hitboxes.push({
          name: key,
          style: {
            width: `${park.x2 - park.x1}%`,
            height: `${park.y2 - park.y1}%`,
            left: `${park.x1}%`,
            top: `${park.y1}%`
          }
        })

      }

      console.log(this.hitboxes);
    },
    getBackground() {
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.imgur.com/3/image/yRJOJlA",
        "method": "GET",
        "headers": {
          "authorization": "Client-ID 27a13f9320a8875"
        }
      }

      // TODO: Add in loader
      $.ajax(settings).done((response) => {
        if (response.data) {

          this.backgroundUrl = response.data.link

          this.backgroundStyle = {
            'background-image': `url(${this.backgroundUrl})`
          }

          this.magnifierBackgroundStyle = {
            'background-image': `url(${this.backgroundUrl})`
          }

          // Calc initial dimensions for image
          this.resizeHandler()
        }
      });
    },
    mouseMoveHandler(e) {

      // Get mouse position on image and
      // add offset if we've been scrolling in main container
      let scrollOffset = this.$refs.backgroundContainer.scrollLeft

      this.zoomX = e.pageX + scrollOffset
      this.zoomY = e.pageY

      // Set both magnifier and label for magnifier position
      this.magnifierStyle = this.magnifierLabelContainerStyle = {
        top: `${this.zoomY - 50}px`,
        left: `${this.zoomX - 50}px`
      }

      // Change X position to include image margin offset
      let box = this.$refs.background.getBoundingClientRect()
      this.zoomXOffset = this.zoomX - box.left

      this.xPercent = this.zoomXOffset / box.width
      this.yPercent = this.zoomY / box.height;

      // Adjust background of based on new position
      let transform = `translateX(-${this.xPercent * 100 * 2}%) translateY(-${this.yPercent * 100 * 2}%) scale(2)`

      this.magnifierBackgroundStyle.transform = transform

      // Also add offset from scrolling
      let magnifierOffset = 50
      this.magnifierBackgroundStyle.left = `${this.backgroundWidth / 2 + magnifierOffset + scrollOffset * 2}px`

    },
    hitboxMouseEnter(hitbox) {
      this.activePark = hitbox.name
      this.backgroundStyle.cursor = "none"
    },
    hitboxMouseLeave(e) {
      this.activePark = ""
      this.backgroundStyle.cursor = "default"
    },
    globalClickHandler() {

      // TODO: Loading spinner for images, CSS juice for transitions,
      // actual resolution for images in carousel

      if (this.activePark) {

        if (!this.parkImages[this.activePark]) {
          this.loadImagesForPark(this.activePark)
        } else {
          // Clear out active images and step through to add them so vue picks up the change
          this.carouselImages.length = 0

          for (let i = 0; i < this.parkImages[this.activePark].length; i++) {
            this.carouselImages.push(this.parkImages[this.activePark][i])
          }
        }
      }
    },
    loadImagesForPark(park) {

      let url = bumperStickerData[park].url

      let settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://api.imgur.com/3/album/${url}`,
        "method": "GET",
        "headers": {
          "authorization": "Client-ID 27a13f9320a8875"
        }
      }

      $.ajax(settings).done((response) => {
        if (response.data) {
          console.log("data " , response.data);

          // Clear old images
          this.carouselImages.length = 0

          // Set up cache array
          this.parkImages[park] = []

          // For each image make an object with the url and flag to set if it's the "active" one
          for (let i = 0; i < response.data.images.length; i++) {
            let image =  {
              active: false,
              url: response.data.images[i].link
            }

            this.carouselImages.push(image)
            this.parkImages[park].push(image)
          }
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import "~../styles/colors";
@import "~../styles/variables";

  .main {
    position: fixed;
    height: 100%;
    width: 100%;

    background: linear-gradient(to bottom, #a8c1ea 0%, $carGray 100%);
  }

  .background-container {
    position: relative;

    width: 100%;
    height: 100%;

    overflow-y: hidden;
    overflow-x: auto;
  }

  .background {
    margin: 0 auto;
    position: relative;

    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;

    // background-attachment: fixed;

    border-radius: 8px;
    // TODO: Figure out way to get nice blend into background
    // box-shadow: 0 0 8px 8px transparent inset;
  }

  .magnifier {
    position: absolute;

    // TODO: Make sure this works cross browser
    pointer-events: none;

    width: 100px;
    height: 100px;

    overflow: hidden;

    top: 0;
    left: 0;

    border-radius: 50%;
    border: 1px solid $carGray;
  }

  .magnifier-label-container {
    position: absolute;
    min-width: 200px;
    min-height: 20px;

    margin-top: -40px;
    margin-left: -50px;

    padding: 0 12px;

    text-align: center;

    background-color: rgba(28, 35, 41, .75);

    border: 1px solid $carGray;
    border-radius: 5px;

    font-size: 20px;
    color: #fff;
    text-shadow: 2px 1px 0px $carGray;

    opacity: 1;
    transform: scale(1);
    transition: opacity .2s ease, transform .2s ease;
  }

  .label-transition-enter, .label-transition-leave-active {
    opacity: 0;
    transform: scale(0);
  }

  .label-transition-enter-to {
    opacity: 1;
    transform: scale(1);
  }

  .magnifier-background {
    position: absolute;

    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .hitbox {
    position: absolute;
  }

  .debug-panel {
    background: white;
    position: absolute;
    top: 0;
    left: 0;
    height: auto;
    width: 300px;
  }

  // Image carousel
  .image-carousel-container {
    position: absolute;
    width: 50%;

    height: 120px;
    bottom: 50px;
    padding: 5px;

    text-align: center;
    border-radius: 4px;
    background: rgba(32, 32, 32, .7);
    box-shadow: 0px 2px 4px 3px #111;

    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;

    left: 50%;
    transform: translateX(-50%);

    h1 {
      padding: 25px;
      color: #fff;
      text-shadow: 2px 1px 0px #000;
    }
  }

  .image-carousel-item {

    display: inline-block;
    vertical-align: top;

    width: 160px;
    height: 90px;
    border: 1px solid rgba(255,255,255,.9);

    margin: 0 10px;

    cursor: pointer;
  }
</style>
