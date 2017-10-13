<template>
  <div class="main">
    <div class="background-container"></div>
    <div class="image-container" @scroll="imageScrollHandler" ref="imageContainer">
      <img class="gallery-image active aligner"></img>
      <img v-for="(image, index) in images" :src="image.link" ref="images" class="gallery-image" :class="{'active': activeIndex === index}"></img>
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

          // add "_roadtripActive" to data
          for (let i = 0; i < response.data.images.length; i++) {
            if (i === 0) {
              response.data.images[i]._roadtripActive = true;
            } else {
              response.data.images[i]._roadtripActive = false;
            }
          }

          this.images = response.data.images

          // Images stored in reverse chronological order
          this.images.reverse()

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

      // Find out threshold for active image
      // width is 75% of height of container (including padding), plus margin between images
      let imageWidth = (this.$refs.imageContainer.offsetHeight - 40) * 0.75 + 16
      let center = this.$refs.imageContainer.clientWidth / 2;

      let leftBounds = center - (imageWidth / 2)

      console.log("image " , imageWidth);
      console.log("center " , center);
      console.log("left " , leftBounds);

      this.debugStyle = {
        position: "absolute",
        width: `${imageWidth}px`,
        height: "100%",
        'background-color': "rgba(255,0,0,.8)",
        left: `${center - imageWidth / 2}px`,
        top: 0
      }

      // For loop below
      // src: https://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
      function isInViewport(image) {
        let rect = image.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );

      }


      let foundActive = false;
      let imagesInViewport = []
      for (let i = 0; i < this.$refs.images.length; i++) {
        if (isInViewport(this.$refs.images[i])) {
          imagesInViewport.push(i)
        }
      }

      let middle = Math.floor(imagesInViewport.length / 2)

      if (middle < 1) {
        middle = 1;
      }

      console.log("middle " , middle);

      this.activeIndex = imagesInViewport[middle - 1]


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

  padding: 0 40% 40px 40%;

  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
}

.gallery-image {
  display: inline-block;
  vertical-align: bottom;

  height: 35%;
  margin: 8px;

  border-radius: 4px;
  box-shadow: 2px 2px 4px #202020;

  transition: all 0.3s linear;

  &.active {
    height: 100%;
  }

  &.aligner {
    width: 0px;
    box-shadow: auto;
  }
}


</style>
