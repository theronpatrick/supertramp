<template>
  <div class="main-container">
    <nav>
      <NavBubble
        navBubbleClass="top"
        :start="start"
        :isActive="activeNav === 'top'"
        :onClick="navClick"
        :diameter="diameter"
      />
      <NavBubble
        navBubbleClass="right"
        :start="start"
        :isActive="activeNav === 'right'"
        :onClick="navClick"
        :diameter="diameter"
      />
      <NavBubble
        navBubbleClass="left"
        :start="start"
        :isActive="activeNav === 'left'"
        :onClick="navClick"
        :diameter="diameter"
      />
      <NavBubble
        navBubbleClass="bottom"
        :start="start"
        :isActive="activeNav === 'bottom'"
        :onClick="navClick"
        :diameter="diameter"
      />
    </nav>
  </div>
</template>

<script>

import NavBubble from "components/NavBubble"

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
      start: true,
      activeNav: null,
      diameter: 0
    }
  },
  mounted: function() {
    setTimeout(() => {
      this.start = false;
    }, 250)
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
      let diameter = width / 6

      // Set prop to calculated diameter (or min number so the bubbles don't get too small on mobile)
      let minSize = 180
      this.diameter = Math.max(minSize, Math.floor(diameter))

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
}

nav {
  width: 75%;
  display: block;
  margin: 0 auto;
}
</style>
