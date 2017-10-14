<template>
  <div class="main">
    <div class="background-container"></div>
    <div class="gallery-image-active-container" ref="activeImageContainer" :style="galleryImageActiveStyle">
      <img :src="images[activeIndex] ? images[activeIndex].link: ''"></img>
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
            :src="image.link"
          ></img>
      </div>
      <div class="gallery-image-alignment-fixer"></div>
    </div>

    <div :style="debugStyle" v-if="debug"></div>
  </div>
</template>

<script>

// imgurClientId
// 27a13f9320a8875

// secret
// 32c51ad35a366a4ce139c0d92e102f29968a58d6

export default {
  data () {
    return {
      debug: false,
      images: [],
      boundingRects: [],
      activeIndex: 0,
      galleryImageActiveStyle: {},
      debugStyle: {}
    }
  },
  mounted() {
    this.checkJquery()
  },
  beforeMount() {
    window.addEventListener('resize', this.calcActiveImage)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.calcActiveImage)
  },
  methods: {
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
          }

          this.images = response.data.images

          // Calc initial image
          setTimeout(() => {
            this.calcActiveImage();
          }, 300)


        }
      });

    },
    imageScrollHandler(e) {

      this.calcActiveImage()

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
      let center = window.innerWidth / 2;

      let offset = e.target.getBoundingClientRect().left;
      let width = this.$refs.galleryContainer.offsetWidth;

      let amount = offset - width / 2;

      let frames = 20;

      for (let i = 0; i < frames; i++) {
        setTimeout(() => {
          this.$refs.galleryContainer.scrollLeft = this.$refs.galleryContainer.scrollLeft + (amount / frames);
        }, 16 * i)
      }


    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import "~../styles/colors";

.main {
  width: 100%;
  height: 100%;
  position: relative;
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


</style>
