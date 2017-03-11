<template>
  <div
    role="button"
    tabindex="0"
    :class="navBubbleClasses"
    @keydown="onKeydown"
    @click="() => {onClick(navBubbleClass)}"
    :style="bubbleStyle"
  >
    <img :src="icon" class="bubble-image" :alt="iconAlt"></img>
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

      // For things like setting top to `0`, this is the padding adjustment based on windowo size
      let paddingBase = "2.5%"
      let centeringAdjustment = `${0 - radius}px`
      let centered = this.isActive || this.start;

      // Adjustments that basically replicatie translateX and translateY adjustments based on type
      switch (this.navBubbleClass) {
        case "top":
          if (!centered) {
            style.top = paddingBase
            style.left = `50%`
            style["margin-left"] = centeringAdjustment
          } else {
            style.top = "0%";
            style.left = `0%`;
            style["margin-left"] = `0px`
          }
          break;
        case "bottom":
          if (!centered) {
            style.bottom = paddingBase
            style.left = `50%`
            style["margin-left"] = centeringAdjustment
          } else {
            style.bottom = "0%"
            style.left = `0%`;
            style["margin-left"] = `0px`
          }
          break;
        case "left":
          if (!centered) {
            style.top = `50%`
            style.left = paddingBase
            style["margin-top"] = centeringAdjustment
          } else {
            style.top = `0%`;
            style.left = "0%"
            style["margin-top"] = `0px`
          }
          break;
        case "right":
          if (!centered) {
            style.top = `50%`
            style.right = paddingBase
            style["margin-top"] = centeringAdjustment
          } else {
            style.top = `0%`;
            style.right = "0%"
            style["margin-top"] = `0px`
          }
          break;
        default:
          console.error("Undefined bubble class");
          break;
      }

      if (this.start) {
        style.left = "50%"
        style['margin-left'] = centeringAdjustment
        if (this.navBubbleClass === "bottom") {
          style.bottom = '100%'
        } else {
          style.top = '-100%'
        }
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
    diameter: { required: true },
    icon: { required: true },
    iconAlt: { required: true }
  }
}
</script>

<style lang="scss" scoped>
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

    .bubble-image {
      width: 0%;
      opacity: 0;
    }
  }

}

.bubble-image {
  position: absolute;
  width: 50%;

  top: 50%;
  left: 50%;

  opacity: 100;

  transform: translateY(-50%) translateX(-50%);
  transition: all .25s ease-in;

  &:focus, &:hover {
    outline: 0;
  }
}

</style>
