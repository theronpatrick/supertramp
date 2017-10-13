<template>
  <div class="main">
    <div class="background-container"></div>
    <div class="image-container" @scroll="imageScrollHandler" ref="imageContainer">
      <img class="gallery-image active aligner"></img>
      <img v-for="image in images" :src="image.link" ref="images" class="gallery-image" :class="{'active': image._roadtripActive}"></img>
    </div>

    <div :style="debugStyle"></div>
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
      function isInBounds(image) {
        let bounds = image.getBoundingClientRect();

        let imageCenter = bounds.left + bounds.width / 2;

        if (bounds.left - 8 <= center && bounds.right + 8 > center ) {
          return true;
        } else {
          return false;
        }

      }


      let foundActive = false;
      for (let i = 0; i < this.$refs.images.length; i++) {
        let image = this.$refs.images[i]
        if (!foundActive && isInBounds(image)) {
          this.images[i]._roadtripActive = true;
          foundActive = true;
        } else {
          this.images[i]._roadtripActive = false;
        }
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
