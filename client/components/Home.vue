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
      let width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;

      let diameter = width / 6

      this.diameter = Math.floor(diameter)

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
