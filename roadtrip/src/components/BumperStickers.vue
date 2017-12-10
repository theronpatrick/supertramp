<template>
  <div class="main" @mousemove="mouseMoveHandler">
    <div class="background-container" ref="backgroundContainer">
      <img class="background-loader-container" :src="backgroundImage.url" v-on:load="imageLoadedHandler(backgroundImage)" v-show="backgroundImage.loading"></img>
      <img class="background-loader" :src="images.loader" v-show="backgroundImage.loading"></img>
      <div class="background" :style="backgroundStyle" ref="background" :class="{loading: backgroundImage.loading}">
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

      <div class="image-carousel-container" v-show="!backgroundImage.loading">
        <h1 v-if="carouselImages.length === 0">Click a Bumper Sticker to Load Images</h1>

        <h1 v-if="carouselImages.length === 1 && carouselImages[0].url === null">No photos for this park ☹. Please click another one.</h1>

        <div v-for="(image, index) in carouselImages" class="image-carousel-item" @click="carouselImageClick(index)" v-if="carouselImages.length > 1">
          <img
            :class="{'loading': image.thumbnailLoading}"
            v-on:load="thumbnailImageLoadedHandler(image)"
            :src="thumbnailUrl(image.url)"
          ></img>

          <img
            class="loading"
            v-on:load="thumbnailImageLoadedHandler(image)"
            :src="thumbnailUrl(image.url)"></img>
          <img :src="images.loader" v-show="image.thumbnailLoading === true"></img>
        </div>
      </div>

      <div class="lightbox-container" v-show="lightboxVisible" @click="lightboxClick">
        <div class="lightbox">
          <img :src="images.close" class="close-button" role="button" @click="closeLightboxHandler"></img>

          <!-- Normal arrows -->
          <img :src="images.arrow" class="prev-button" role="button" @click="prevImageHandler" v-show="lightboxIndex !== 0"></img>
          <img :src="images.arrow" class="next-button" role="button" @click="nextImageHandler" v-show="lightboxIndex !== carouselImages.length - 1"></img>

          <!-- Disabled arrows -->
          <img :src="images.arrow" class="prev-button" role="button" v-show="lightboxIndex === 0" disabled="true"></img>
          <img :src="images.arrow" class="next-button" role="button" v-show="lightboxIndex === carouselImages.length - 1" disabled="true"></img>

          <img class="lightbox-image"
            :src="lightboxImage.url"
            v-on:load="imageLoadedHandler(lightboxImage)"
            :class="{'loading': lightboxImage.loading}">
          </img>

          <!-- Show thumbnail image until regular one is loaded -->
          <img class="lightbox-image"
            :src="thumbnailUrl(lightboxImage.url)"
            :class="{'loading': !lightboxImage.loading || lightboxImage.thumbnailLoading}">
          </img>

          <img class="lightbox-image" :src="images.loader" v-show="lightboxImage.loading === true && lightboxImage.thumbnailLoading === true"></img>
        </div>
      </div>
    </div>

    <!-- TODO: Remove completely if not using anymore -->
    <div v-if="false" v-on:click="mobileMessageClickHandler" class="mobile-message">
      <h1>This app is only optimized for desktop viewing, sorry! 😪</h1>
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

import close from "../assets/close.svg"
import arrow from "../assets/arrow-white.svg"
import loader from "../assets/loader.svg"

export default {
  data() {
    return {
      images: {
        close,
        arrow,
        loader
      },
      debug: false,
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
      backgroundImage: {
        loading: true
      },
      backgroundUrl: "",
      backgroundWidth: 0,
      backgroundHeight: 0,
      hitboxes: [],
      carouselImages: [],
      parkImages: {}, // key is park name, value is array of loaded carousel images
      activePark: "",
      lightboxIndex: 0,
      lightboxImage: {
        url: ""
      },
      lightboxVisible: false,
      mobileMessageVisible: false
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.resizeHandler)
    window.addEventListener('click', this.globalClickHandler)
    window.addEventListener('keydown', (e) => {
      this.globalKeydown(e)
    });
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeHandler)
    window.removeEventListener('click', this.globalClickHandler)
    window.removeEventListener('keydown', (e) => {
      this.globalKeydown(e)
    });
  },
  mounted() {
    this.getBackground()

    // Draw hitboxes
    this.initHitboxes()

    // TODO: Something for kings canyon
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

      // Show mobile message if dimensions call for it
      if (window.innerWidth < 400 || window.innerWidth < window.innerHeight) {
        this.mobileMessageVisible = true
      } else {
        this.mobileMessageVisible = false;
      }
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

          // TODO: Remove backgroundUrl string now that we have backgroundImage object
          this.backgroundUrl = response.data.link
          this.backgroundImage.url = response.data.link

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

      // Clear old images
      this.carouselImages.length = 0

      let url = bumperStickerData[park].url

      // If there isn't a url for a park, just show `no images` message
      if (!bumperStickerData[park].url) {
        this.carouselImages.push({
          url: null
        })

        return;
      }


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
          console.log("album response: " , response.data);

          // Set up cache array
          this.parkImages[park] = []

          // For each image make an object with the url and flag to set if it's the "active" one
          for (let i = 0; i < response.data.images.length; i++) {
            let image =  {
              active: false,
              loading: true,
              thumbnailLoading: true,
              url: response.data.images[i].link
            }

            this.carouselImages.push(image)
            this.parkImages[park].push(image)
          }
        }
      })
    },
    carouselImageClick(imageIndex) {
      // TODO: Could add watcher for index and update image accordingly
      this.lightboxIndex = imageIndex
      this.lightboxImage = this.carouselImages[imageIndex]
      this.lightboxVisible = true
    },
    prevImageHandler() {
      if (this.lightboxIndex > 0) {
        this.lightboxIndex = this.lightboxIndex - 1
        this.lightboxImage = this.carouselImages[this.lightboxIndex]
      }
    },
    nextImageHandler() {
      if (this.lightboxIndex < this.carouselImages.length - 1) {
        this.lightboxIndex = this.lightboxIndex + 1
        this.lightboxImage = this.carouselImages[this.lightboxIndex]
      }
    },
    lightboxClick(e) {
      if (e.target.tagName.toLowerCase() !== "img") {
        this.closeLightboxHandler()
      }
    },
    closeLightboxHandler() {
      this.lightboxVisible = false
    },
    imageLoadedHandler(image) {
      image.loading = false
    },
    thumbnailImageLoadedHandler(image) {
      image.thumbnailLoading = false
    },
    globalKeydown(e) {
      let code = e.code.toLowerCase()

      if (code === "arrowleft") {
        this.prevImageHandler()
      } else if (code === "arrowright") {
        this.nextImageHandler()
      }
    },
    thumbnailUrl(url) {

      if (!url) {
        return ""
      }

      let thumbnailUrlArray = url.split(".jpg")
      thumbnailUrlArray[0] = thumbnailUrlArray[0] + "m.jpg"
      return thumbnailUrlArray[0]
    },
    mobileMessageClickHandler() {
      this.mobileMessageVisible = false
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

    -webkit-overflow-scrolling: touch;
  }

  .background-container {
    position: relative;

    width: 100%;
    height: 100%;

    overflow-y: hidden;
    overflow-x: auto;
  }

  // Should be noted that this is just to load the image file, not the 'loader' component
  .background-loader-container {
    position: absolute;
    left: -9999px;
    height: 1px;
    width: 1px;
  }

  .background-loader {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);

    height: 200px;
    width: 200px;
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

  // Load images off screen
  .loading {
    position: absolute !important;
    left: -9999px !important;
    height: 1px !important;
    width: 1px !important;
  }

  .image-carousel-container {
    position: fixed;
    width: 80%;

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
      white-space: normal;

      @include mobile {
        padding: 0;
        font-size: 26px;
      }
    }
  }

  .image-carousel-item {

    display: inline-block;
    position: relative;
    vertical-align: top;

    background: #000;

    width: 160px;
    height: 90px;
    border: 1px solid rgba(255,255,255,.9);

    margin: 0 10px;

    cursor: pointer;

    img {
      height: 100%;
      max-width: 100%;
    }
  }

  // Lightbox
  .lightbox-container {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 11;

    width: 100%;
    height: 100%;
  }
  .lightbox {
    position: relative;
    width: 100%;
    height: 100%;

    background: rgba(52, 52, 52, .9);

    text-align: center;

    .lightbox-image {
      height: 80%;
      margin-top: 20px;
      max-width: 80%;

      border: 1px solid #000;
      box-shadow: 1px 1px 1px #000;
    }

    [role="button"] {
      cursor: pointer;
      width: 50px;
      height: 50px;
    }

    .next-button, .prev-button {
      position: absolute;
      transform: translateY(-50%);
      top: 50%;

      &[disabled="disabled"] {
        opacity: 0.5;
        cursor: default;
      }
    }

    .prev-button {
      position: absolute;
      transform: translateY(-50%) rotate(180deg);
      left: 20px;
    }
    .next-button {
      right: 20px;
    }

    .close-button {
      position: absolute;
      top: 25px;
      left: 25px;

      border-radius: 50%;
      background: #fff;
    }
  }

  .mobile-message {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;

    background: rgba(25,25,25,.9);

    h1 {
      position: fixed;
      color: #fff;

      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
  }
</style>
