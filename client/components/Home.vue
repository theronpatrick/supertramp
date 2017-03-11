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
          start: true
        },
        {
          class: "right",
          icon: workImg,
          iconAlt: "projects",
          start: true
        },
        {
          class: "bottom",
          icon: phoneImg,
          iconAlt: "contact",
          start: true
        },
        {
          class: "left",
          icon: resumeImg,
          iconAlt: "resume",
          start: true
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
      if (!this.activeNav) {
        this.activeNav = nav
      } else {
        this.activeNav = null
      }
    },
    calcBubbleWidth: function() {
      // Babel probably lets us not have to define all these, but just in case...
      let width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;

      // Set diameter based on screen size
      let diameter = width / 3

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
