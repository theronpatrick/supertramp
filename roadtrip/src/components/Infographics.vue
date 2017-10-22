<template>
  <div class="main">
    <section :style="{'height': windowHeight}" class="purple">
      <div class="content-aligner">
        <h1>Road Trip Stats</h1>
        <img :src="img.doubleArrow" class="scroll-down-arrow"></img>
      </div>
    </section>

    <section :style="{'height': windowHeight}" class="green">
      <div class="content-aligner">
      </div>
    </section>
  </div>
</template>

<script>

import doubleArrow from "../assets/double-arrow.svg"

export default {
  components: {
  },
  data () {
    return {
      img: {
        doubleArrow
      },
      windowHeight: `${this.windowHeight}px`
    }
  },
  mounted() {
    this.resizeHandler()
  },
  beforeMount() {
    window.addEventListener('resize', this.resizeHandler)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeHandler)
  },
  methods: {
    resizeHandler() {
      this.windowHeight = `${window.innerHeight}px`
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import "~../styles/colors";
@import "~../styles/variables";

.main {
  overflow: auto;
  height: 100%;
}

h1 {
  display: block;
  font-size: 38px;
  color: #fff;
  margin: 0 auto;
}

.scroll-down-arrow {
  position: absolute;

  transform: rotate(90deg);
  transform-origin: 0;
  width: 94px;
  bottom: 50px;

  animation: arrow-bounce 1s infinite ease-in-out;

}

@keyframes arrow-bounce {
  0% {
    bottom: 50px;
  }
  50% {
    bottom: 150px
  }
  100% {
    bottom: 50px;
  }
}

section {
  min-height: 100px;
  width: 100%;
  display: table;
  text-align: center;
  position: relative;

  &.green {
    background-color: $infoGreen;
  }
  &.purple {
    background-color: $infoPurple;
  }

  .content-aligner {
    display: table-cell;
    vertical-align: middle;
  }
}


</style>
