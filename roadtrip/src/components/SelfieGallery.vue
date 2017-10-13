<template>
  <div class="main">
    <div class="background-container"></div>
    <div class="image-container" @scroll="imageScrollHandler" ref="imageContainer">
      <div class="gallery-image-active-container" ref="activeImageContainer">
        <img :src="images[activeIndex] ? images[activeIndex].link: ''"></img>
      </div>
      <div
        v-for="(image, index) in images"
        ref="images"
        class="gallery-image-aligner"
        :style="{'left': `${image._roadtripLeft}px`, 'height': `${image._roadtripHeight}%`}">
          <img
            :src="image.link"
          ></img>
      </div>
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

      // TODO: Remove if not using
      let left = this.$refs.imageContainer.scrollLeft

      let height = this.$refs.imageContainer.offsetHeight;
      let width = height = height * 0.75;

      this.calcActiveImage()


    },
    calcActiveImage() {
      let center = this.$refs.imageContainer.clientWidth / 2;

      let containerRect = this.$refs.activeImageContainer.getBoundingClientRect()

      let matchingImages = [];
      for (let i = 0; i < this.images.length; i++) {

        let imageRect = this.$refs.images[i].getBoundingClientRect();

        // Scale image based on distance to center
        let distanceFromCenter = Math.abs(center - (imageRect.left + imageRect.width / 2))

        console.log("distance " , distanceFromCenter);

        let heightPercent = 70 - (distanceFromCenter ^ 2) * .05;

        console.log("percent " , heightPercent);

        if (heightPercent < 0) {
          heightPercent = 0;
        }
        this.images[i]._roadtripHeight = heightPercent;

        if (imageRect.left >= containerRect.left && imageRect.right <= containerRect.right) {
          matchingImages.push(i)
        }

      }

      // Images is an array because more than one image can be inside the 'container' at a time
      this.activeIndex = matchingImages[0]
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
  transform: translateX(-50%) translateY(-24px);

  // debug
  height: 80%;
  width: 300px;

  background: white;

  z-index: 1;

  img {
    height: 100%;

    border-radius: 4px;
    box-shadow: 2px 2px 4px #202020;
  }


}

.gallery-image-aligner {
  position: absolute;

  bottom: 0;

  height: 35%;
  width: 103px;

  margin: 8px;

  text-align: center;

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
