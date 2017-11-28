<template>
  <div class="main" @mousemove="mouseMoveHandler">
    <div class="background-container">
      <div class="background" :style="backgroundStyle" ref="background">
        <div
          v-for="(hitbox, index) in hitboxes"
          class="hitbox"
          :style="hitbox.style"
          v-on:mouseenter="hitboxMouseEnter(hitbox)"
          v-on:mouseleave="hitboxMouseLeave(hitbox)"
          ></div>
      </div>

      <div class="magnifier" :style="magnifierStyle">
        <div class="magnifier-background" :style="magnifierBackgroundStyle"></div>
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

import hitboxData from "../data/bumper-sticker-coords.js"

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
      magnifierBackgroundStyle: {},
      backgroundStyle: {},
      backgroundUrl: "",
      backgroundWidth: 0,
      backgroundHeight: 0,
      hitboxes: [],
      activePark: ""
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.resizeHandler)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeHandler)
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
      for (let key in hitboxData) {

        let park = hitboxData[key]

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
      this.zoomX = e.pageX
      this.zoomY = e.pageY

      this.magnifierStyle = {
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

    },
    hitboxMouseEnter(hitbox) {
      this.activePark = hitbox.name
    },
    hitboxMouseLeave(e) {
      this.activePark = ""
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .main {
    position: fixed;
    height: 100%;
    width: 100%;

    background: linear-gradient(to bottom, #a8c1ea 0%, #1c2329 100%);
  }

  .background-container {
    position: relative;

    width: 100%;
    height: 100%;

    overflow: auto;
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
    border: 1px solid #fff;
  }

  .magnifier-background {
    position: absolute;

    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .hitbox {
    position: absolute;
    background: rgba(0,0,255,.2)
  }

  .debug-panel {
    background: white;
    position: absolute;
    top: 0;
    left: 0;
    height: auto;
    width: 300px;

  }
</style>
