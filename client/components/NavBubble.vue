<template>
  <div
    role="button"
    tabindex="0"
    :class="navBubbleClasses"
    @keydown="onKeydown"
    @click="() => {onClick(navBubbleClass)}"
    :style="bubbleStyle"
  >
    <a class="nav-bubble-content">Inner</a>
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
    onKeydown: function(e) {
      if (e.keyCode === 13) {
        this.onClick(this.navBubbleClass)
      }
    }
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
  text-align: left;

  cursor: pointer;
  z-index: 10;

  // TODO: Make cooler transition
  transition: all .5s ease-in-out, background-color .25s ease-in-out;

  $padding-perc: 2.5;

  // 2017 shouldn't require hardware acceleration like this but just in case...
  -webkit-backface-visibility: hidden;
	-webkit-perspective: 1000;


  &:focus, &:hover {
    outline: 0;
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
  transform: translateY(-50%);

  text-align: center;

  &:focus, &:hover {
    outline: 0;
  }
}

</style>
