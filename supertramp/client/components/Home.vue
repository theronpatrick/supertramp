<template>
  <div class="main-container">
    <nav>
      <NavBubble navBubbleClass="top" :start="start" :isActive="activeNav === 'top'" :onClick="navClick" />
      <NavBubble navBubbleClass="right" :start="start" :isActive="activeNav === 'right'" :onClick="navClick" />
      <NavBubble navBubbleClass="left" :start="start" :isActive="activeNav === 'left'" :onClick="navClick" />
      <NavBubble navBubbleClass="bottom" :start="start" :isActive="activeNav === 'bottom'" :onClick="navClick" />
    </nav>
  </div>
</template>

<script>

import NavBubble from "components/NavBubble"

export default {
  components: {
    NavBubble
  },
  data: function() {
    return {
      start: true,
      activeNav: null
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
    }
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
