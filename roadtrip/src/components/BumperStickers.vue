<template>
  <div class="main" @mousemove="mouseMoveHandler">
    <div class="background" :style="backgroundStyle">
    </div>

    <div class="magnifier" :style="magnifierStyle">

    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      debug: false,
      zoomX: 0,
      zoomY: 0,
      magnifierStyle: {},
      backgroundStyle: {},
      backgroundUrl: ""
    }
  },
  mounted() {
    console.log("foo");

    this.getBackground()
  },
  methods: {
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
        }
      });
    },
    mouseMoveHandler(e) {
      this.zoomX = e.pageX
      this.zoomY = e.pageY

      this.magnifierStyle = {
        top: `${this.zoomY - 50}px`,
        left: `${this.zoomX - 50}px`,
        'background-image': `url(${this.backgroundUrl})`
      }

      console.log("X" , this.zoomX);
      console.log("Y " , this.zoomY);

      if (this.debug) {
        this.magnifierStyle = {
          top: `50px`,
          left: `50px`,
          'background-image': `url(${this.backgroundUrl})`
        }
      }

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

  .background {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    background-attachment: fixed;

    width: 100%;
    height: 100%;

    &.aftertest {
    content: "";
    position: absolute;
    left: 200px;
    width: 200px;
    top: 100px;
    height: 200px;
    border-radius: 50%;
    background: inherit;
    -webkit-transform: scale(1.1);
    -webkit-animation: inherit;
    -webkit-animation-delay: -4s;
    }
  }

  .magnifier {
    position: absolute;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    background-attachment: fixed;

    width: 100px;
    height: 100px;

    top: 0;
    left: 0;

    transform: scale(2);
    border-radius: 50%;
    border: 1px solid #fff;
  }
</style>
