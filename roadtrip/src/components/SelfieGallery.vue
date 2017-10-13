<template>
  <div class="main">
    <div class="background-container"></div>
    <div class="image-container" @scroll="imageScrollHandler" ref="imageContainer">
      <div class="gallery-image-active-container" ref="activeImageContainer"></div>
      <img v-for="(image, index) in images"
        :src="image.link"
        ref="images"
        class="gallery-image"
        :class="{'active': activeIndex}"
        :style="{'left': `${image._roadtripLeft}px`}"
      ></img>
    </div>

    <div :style="debugStyle" v-if="false"></div>
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
      images: [],
      boundingRects: [],
      windowHeight: 0,
      windowWidth: 0,
      activeIndex: 0,
      debugStyle: {}
    }
  },
  mounted() {
    this.checkJquery()
    // This will set initial window bounds
    this.handleResize();
  },
  beforeMount() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    checkJquery() {
      // Pretty hacky check to see if jquery is loaded, and if not keep retrying
      // TODO: Fuck with webpack stuff to make sure external dependency is loaded
      if ($) {
        this.loadImages()
      } else {
        console.log("in else");
        setTimeout(() => {
          this.checkJquery()
        }, 1000)
      }
    },
    handleResize() {
      this.windowHeight = window.innerHeight
      this.windowWidth = window.innerWidth

    },
    loadImages() {
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
        console.log(response);
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

      // TODO: Remove if not using
      let left = this.$refs.imageContainer.scrollLeft

      let height = this.$refs.imageContainer.offsetHeight;
      let width = height = height * 0.75;

      this.calcActiveImage()


    },
    calcActiveImage() {
      let containerRect = this.$refs.activeImageContainer.getBoundingClientRect()

      this.matchingImages = [];
      for (let i = 0; i < this.images.length; i++) {
        let imageRect = this.$refs.images[i].getBoundingClientRect();

        if (imageRect.left >= containerRect.left && imageRect.right <= containerRect.right) {
          this.matchingImages.push(i)
        }

      }

      console.log("images " , matchingImages);
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

.image-container {

  position: absolute;
  height: 80%;
  width: calc(100% - 48px);

  top: 10%;
  margin: 0 24px;

  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
}

.gallery-image-active-container {
  position: fixed;

  left: 50%;
  transform: translateX(-50%);

  // debug
  height: 80%;
  width: 300px;

  background: white;


}

.gallery-image {
  position: absolute;

  bottom: 0;

  height: 35%;
  margin: 8px;

  border-radius: 4px;
  box-shadow: 2px 2px 4px #202020;

  transition: all 0.3s linear;

  &.active {
    height: 80%;
    width: 200px;
    position: fixed;
    left: 50% !important;
    bottom: auto;
    margin: 0;
    transform: translateX(-50%);
  }
}


</style>
