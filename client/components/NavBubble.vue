<template>
  <!-- Default is no link, containing section info. If link is present, wrap in anchor -->

  <div
    v-if="!link"
    role="button"
    tabindex="0"
    :class="navBubbleClasses"
    @keydown="onKeydown"
    @click="(e) => {bubbleClick(e)}"
    :style="bubbleStyle"
    :title="title"
  >
    <img :src="icon" class="bubble-image" :alt="iconAlt"></img>
    <img :src="closeImg" role="button" class="close-button" alt="Close"></img>
    <section v-html="content">
    </section>
  </div>

  <a v-else-if="link" :href="link">
    <div
      role="button"
      tabindex="0"
      :class="navBubbleClasses"
      @keydown="onKeydown"
      @click="(e) => {bubbleClick(e)}"
      :style="bubbleStyle"
      :title="title"
    >
      <img :src="icon" class="bubble-image" :alt="iconAlt"></img>
    </div>
  </a>

</template>

<script>

import closeImg from "root/img/close.svg"

export default {
  components: {
  },
  created: function() {
  },
  data: function() {
    return {
      closeImg
    }
  },
  computed: {
    navBubbleClasses: function() {
      let classObject = {
        "nav-bubble": true,
        "active": this.isActive,
        "start": this.start
      }

      // Convert class passed from home to cardinal direction
      let parsedClass = this.getParsedClass();
      classObject[parsedClass] = true;

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

      // For things like setting top to `0`, this is the padding adjustment based on window size
      let paddingBase = "2.5%"
      let centeringAdjustment = `${0 - radius}px`
      let centered = this.isActive || this.start;

      // Adjustments that basically replicate translateX and translateY adjustments based on type
      let parsedClass = this.getParsedClass();
      switch (parsedClass) {
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
          case "center":
            if (!centered) {
              style.top = `50%`
              style.right = `50%`
              style["margin-top"] = centeringAdjustment
              style["margin-right"] = centeringAdjustment
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
        if (parsedClass === "bottom") {
          style.bottom = '100%'
        } else {
          style.top = '-100%'
        }
      }

      return style
    }
  },
  methods: {
    getParsedClass: function() {
      // Convert from class type to cardinal direction
      let parsedClass;
      switch (this.navBubbleClass) {
        case "profile":
          parsedClass = "top"
          break;
        case "projects":
          parsedClass = "right"
          break;
        case "contact":
          parsedClass = "bottom"
          break;
        case "resume":
          parsedClass = "left"
          break;
        case "roadtrip":
          parsedClass = "center"
          break;
        default:
          console.error("Error parsing nav bubble class");
          break;
      }
      return parsedClass;
    },
    onKeydown: function(e) {
      if (e.keyCode === 13) {
        this.onClick(this.navBubbleClass)
      }
    },
    bubbleClick: function(e) {
      let className = e.target.className;

      // Open if clicking on anything, but if we're already active,
      // only close if we click outside section panel or on 'x' button
      if (this.isActive) {
        if (className.indexOf("nav-bubble") > -1 || className.indexOf("close-button") > -1) {
          this.onClick(this.navBubbleClass)
        }
      } else {
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
    iconAlt: { required: true },
    content: { required: true },
    title: { required: true },
    link: { required: false }
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

    // Show/hide contents when bubble is active
    .bubble-image {
      width: 0%;
      opacity: 0;
    }

    section {
      opacity: 1;
      width: 75%;
      height: 75%;
      padding: 5%;
    }

    .close-button {
      opacity: 1;
    }
  }

}

.close-button {
  position: absolute;
  top: 15px;
  left: 15px;

  top: 20px;
  height: 20px;

  opacity: 0;
  transition: all .25s ease-in;
  transform: scale(1);

  cursor: pointer;

  &:hover {
    transform: scale(1.5);
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

section {
  position: absolute;
  z-index: 1;

  width: 0%;
  height: 0%;
  padding: 0%;

  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);

  transition: all .25s ease-in;
  opacity: 0;
  overflow: auto;

  border-radius: 8px;
  background-color: $black;

  -webkit-overflow-scrolling: touch;
}

</style>
