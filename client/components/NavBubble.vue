<template>
  <div
    role="button"
    :class="navBubbleClasses"
    @click="() => {onClick(navBubbleClass)}"
    :style="bubbleStyle"
  >
    <div class="nav-bubble-content">Inner</div>
  </div>
</template>

<script>

export default {
  components: {
  },
  created: function() {
  },
  computed: {
    navBubbleClasses: function() {
      let classObject = {
        "nav-bubble": true,
        "active": this.isActive,
        "start": this.start
      }

      classObject[this.navBubbleClass] = true;
      return classObject;

    },
    bubbleStyle: function() {
      // Have to do all these calculations in JS instead of using transforms because of COURSE
      // animating translateX and translateY doesn't work smoothly on safari

      let style;

      let radius = this.diameter / 2

      // Sizes for all bubbles
      if (!this.isActive) {
        style = {
          width: `${this.diameter}px`,
          height: `${this.diameter}px`
        }
      } else {
        style = {
          width: `100%`,
          height: `100%`
        }
      }

      // Adjustments that basically replicatie translateX and translateY adjustments based on type
      switch (this.navBubbleClass) {
        case "top":
          if (!this.isActive) {
            style.top = `0%`
            style.left = `50%`
            style["margin-left"] = `${0 - radius}px`
          } else {
            style.top = `0%`;
            style.left = `0%`;
            style["margin-left"] = `0px`
          }
          break;
        case "bottom":
          if (!this.isActive) {
            style.bottom = `0%`
            style.left = `50%`
            style["margin-left"] = `${0 - radius}px`
          } else {
            style.bottom = `0%`;
            style.left = `0%`;
            style["margin-left"] = `0px`
          }
          break;
        case "left":
          if (!this.isActive) {
            style.top = `50%`
            style.left = `0%`
            style["margin-top"] = `${0 - radius}px`
          } else {
            style.top = `0%`;
            style.left = `0%`;
            style["margin-top"] = `0px`
          }
          break;
        case "right":
          if (!this.isActive) {
            style.top = `50%`
            style.right = `0%`
            style["margin-top"] = `${0 - radius}px`
          } else {
            style.top = `0%`;
            style.right = `0%`;
            style["margin-top"] = `0px`
          }
          break;
        default:
          console.error("Error calculating widths for bubbles");
          break;
      }

      return style
    }
  },
  methods: {
  },
  props: {
    navBubbleClass: { required: true },
    start: { required: true },
    isActive: { required: true },
    onClick: { required: true },
    diameter: { required: true }
  }
}
</script>

<style lang="scss">
@import "~styles/colors";

.nav-bubble {
  position: absolute;
  display: inline-block;

  font-size: 2.0rem;
  background-color: $blue1;

  border-radius: 50%;
  text-align: center;

  cursor: pointer;
  z-index: 10;

  transition: all 1s ease-out;

  $padding-perc: 2.5;

  // 2017 shouldn't require hardware acceleration like this but just in case...
  -webkit-backface-visibility: hidden;
	-webkit-perspective: 1000;


  &.top {
    top: 0% + $padding-perc;
    left: 50%;
  }

  &.right {
    top: 50%;
    right: 0% + $padding-perc;
  }

  &.bottom {
    bottom: 0% + $padding-perc;
    left: 50%;
  }

  &.left {
    top: 50%;
    left: 0% + $padding-perc;
  }

  &:focus, &:hover {
    background-color: $orange;
  }

  &.active {
    background-color: $blue1;

    width: 100%;
    height: 100%;
    border-radius: 0;
    padding-bottom: 0;
    z-index: 20;

    cursor: default;
  }
}

.nav-bubble-content {
  position: absolute;
  width: 100%;

  top: 50%;
  transform: translateY(-50%)
}

</style>
