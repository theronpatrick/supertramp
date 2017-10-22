<template>
  <div class="main" @scroll="scrollHandler">
    <section
      :style="{'height': windowHeight}"
      class="purple"
      :class="{'in-viewport': sections[0].inViewport}"
    >
      <div class="content-aligner">
        <h1>Road Trip Stats</h1>
        <img :src="img.doubleArrow" class="scroll-down-arrow"></img>
      </div>
    </section>

    <section
      :style="{'height': windowHeight}"
      class="green"
      :class="{'in-viewport': sections[1].inViewport}"
    >
      <div class="content-aligner">
        <h1>Total Miles Driven / Total Time / Total States</h1>
        <img class="test-image" :src="img.doubleArrow"></img>
      </div>
    </section>

    <section
      :style="{'height': windowHeight}"
      class="teal"
      :class="{'in-viewport': sections[2].inViewport}"
    >
      <div class="content-aligner">
        <h1>Cities Visited / National Parks Visited</h1>
      </div>
    </section>

    <section
      :style="{'height': windowHeight}"
      class="orange"
      :class="{'in-viewport': sections[3].inViewport}"
    >
      <div class="content-aligner">
        <h1>Total Miles Walked</h1>
      </div>
    </section>

    <section
      :style="{'height': windowHeight}"
      class="yellow"
      :class="{'in-viewport': sections[4].inViewport}"
    >
      <div class="content-aligner">
        <h1>Burritos Eaten / Weight Lost</h1>
      </div>
    </section>

    <section
      :style="{'height': windowHeight}"
      class="red"
      :class="{'in-viewport': sections[5].inViewport}"
    >
      <div class="content-aligner">
        <h1>Instagram Photos Posted / Selfies Taken / Snapchats Taken</h1>
      </div>
    </section>

    <section
      :style="{'height': windowHeight}"
      class="brown"
      :class="{'in-viewport': sections[6].inViewport}"
    >
      <div class="content-aligner">
        <h1>Fun Had</h1>
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
      sections: [],
      windowHeight: `${this.windowHeight}px`
    }
  },
  mounted() {
    // Set up initial window bounds
    this.resizeHandler()

    // Store all section DOM elements
    let sections = document.querySelectorAll("section")
    for (let i = 0; i < this.sections.length; i++) {
      this.sections[i].sectionElement = sections[i]
    }

  },
  beforeMount() {
    window.addEventListener('resize', this.resizeHandler)

    // Fill sections array with objects so :class in template doesn't bug out
    let numOfSections = 7
    for (let i = 0; i < numOfSections; i++) {
      this.sections.push({inViewport: false})
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeHandler)
  },
  methods: {
    resizeHandler() {
      this.windowHeight = `${window.innerHeight}px`
    },
    scrollHandler(e) {

      // If bounding rect for a section is 1/2 in screen, animate items in
      // TODO: Play with factor for images to animate in
      for (let i = 0; i < this.sections.length; i++) {
        let rect = this.sections[i].sectionElement.getBoundingClientRect()
        if (rect.y <= window.innerHeight / 2) {
          this.sections[i].inViewport = true
        }
      }

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
  color: #fff;

  -webkit-overflow-scrolling: touch;
}

h1 {
  display: block;
  font-size: 38px;
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

// Animations
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
  &.orange {
    background-color: $infoOrange;
  }
  &.teal {
    background-color: $infoTeal;
  }
  &.yellow {
    background-color: $infoYellow;
  }
  &.red {
    background-color: $infoRed;
  }
  &.brown {
    background-color: $infoBrown;
  }

  .content-aligner {
    display: table-cell;
    vertical-align: middle;
  }

  .test-image {
    position: absolute;
    left: -100px;
    top: 50px;
    transition: 1s all;
  }

  &.in-viewport {
    .test-image {
      left: 50%;
    }
  }
}


</style>
