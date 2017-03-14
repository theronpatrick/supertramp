<template>
  <div class="main-container">
    <nav>
      <NavBubble
        v-for="bubble in bubbles"
        :navBubbleClass="bubble.class"
        :start="bubble.start"
        :isActive="activeNav === bubble.class"
        :onClick="navClick"
        :diameter="diameter"
        :icon="bubble.icon"
        :content="bubble.content"
        iconAlt="bubble.iconAlt"
      />
    </nav>
  </div>
</template>

<script>

import NavBubble from "components/NavBubble"

import resumeImg from "root/img/file.svg"
import manImg from "root/img/man.svg"
import phoneImg from "root/img/phone.svg"
import workImg from "root/img/work.svg"

export default {
  components: {
    NavBubble
  },
  created: function () {
    // Calc bubble widths at beginning and on resize
    window.addEventListener('resize', this.calcBubbleWidth)

    this.calcBubbleWidth();

    // There's some fishiness going on with mobile screen sizes, so redo calc after a set time
    setTimeout(() => {
      this.calcBubbleWidth()
    }, 500)
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.calcBubbleWidth)
  },
  data: function() {
    return {
      manImg,
      resumeImg,
      workImg,
      phoneImg,
      start: true,
      activeNav: null,
      diameter: 0,
      bubbles: [
        {
          class: "top",
          icon: manImg,
          iconAlt: "profile",
          start: true,
          content: `<p>Welcome to my corner of the Internet. My name's Theron, I'm a developer who lives in Boston with my fat cat and muse Dr. Pickles.</p>
          <p>Front-end design and development has always been my forté, but I've dipped my toes in the waters of back-end development (Node.js is my jam). Love all things mobile development (even Xcode), and have experience with both hybrid apps and native Android and iOS code, with experience deploying to both respective app stores.</p>
          <p>Check out some of <a>my work</a> for a sense of what I can do, and take a look at <a>my GitHub</a> for a sense of how I do it.</p>
          <p>I'm currently open to web front-end or mobile client development contracts, so if you've got a fun and challenging project you need help building please <a>contact me</a>.</p> ` // TODO: Refactor this into a file or something
        },
        {
          class: "right",
          icon: workImg,
          iconAlt: "projects",
          start: true,
          content: ""
        },
        {
          class: "bottom",
          icon: phoneImg,
          iconAlt: "contact",
          start: true,
          content: ""
        },
        {
          class: "left",
          icon: resumeImg,
          iconAlt: "resume",
          start: true,
          content: ""
        }
      ]
    }
  },
  mounted: function() {
    let count = 0;

    let dropBubble = () => {
      this.bubbles[count].start = false;

      count++

      if (count < this.bubbles.length) {
        setTimeout(() => {
          dropBubble()
        }, 250)
      }
    }

    setTimeout(() => {
      dropBubble()
    }, 100)
  },
  methods: {
    navClick: function(nav) {
      console.log("in click " , nav);
      if (!this.activeNav) {
        this.activeNav = nav
      } else {
        this.activeNav = null
      }
    },
    calcBubbleWidth: function() {
      let width = window.innerWidth;
      let height = window.innerHeight;

      let dimension = Math.min(width, height)

      // Set diameter based on screen size
      let diameter = dimension / 3

      // Set prop to calculated diameter (or min number so the bubbles don't get too small on mobile)
      let maxSize = 250
      this.diameter = Math.min(maxSize, Math.floor(diameter))

    }
  },
  computed: {
  }
}
</script>

<style lang="scss">

@import "~styles/colors";

.main-container {
  height: 100%;
  width: 100%;

  position: relative;

  background: $black;
  color: $white;

  // 2017 shouldn't require hardware acceleration like this but just in case...
  transform: translateZ(0)
}

nav {
  width: 75%;
  display: block;
  margin: 0 auto;
}
</style>
