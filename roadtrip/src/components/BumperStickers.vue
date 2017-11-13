<template>
  <div class="main" @mousemove="mouseMoveHandler">
    <div class="background">
    </div>

    <div class="test" :style="magnifierStyle">

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
      magnifierStyle: {}
    }
  },
  mounted() {
    console.log("foo");
  },
  methods: {
    mouseMoveHandler(e) {
      this.zoomX = e.pageX
      this.zoomY = e.pageY

      this.magnifierStyle = {
        top: `${this.zoomY - 50}px`,
        left: `${this.zoomX - 50}px`
      }

      if (this.debug) {
        this.magnifierStyle = {
          top: `50px`,
          left: `50px`
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
  }

  .background {
    background-image: url("../assets/bs.jpg");
    background-size: cover;
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

  .test {
    position: absolute;
    background-image: url("../assets/bs.jpg");
    background-size: cover;
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
