<template>
  <transition name="tour-animation">
    <div class="tour-box" v-show="visible">
      <img :src="images.close" class="close-button" role="button" @click="closeHandler"></img>
      <img :src="images.arrow" class="next-button" :class="{'focused': nextArrowFocused}" role="button" @click="nextHandler"></img>
      <span class="message">{{messages[messageIndex].message}}</span>
    </div>
  </transition>
</template>

<script>
import close from "../assets/close.svg"
import arrow from "../assets/arrow.svg"

import tracks from "../data/snapchat-tracks.js"

  export default {
    data() {
      return {
        visible: false,
        images: {
          close,
          arrow
        },
        messageIndex: 0,
        nextArrowFocused: false
      }
    },
    props: ["tourHighlightElement", "messages", "tourId"],
    mounted() {
      let id = `${this.tourId}_hasSeenTour`
      let hasSeen = localStorage.getItem(id)

      if (!hasSeen) {
        setTimeout(() => {
          this.visible = true
        }, 1500)
      }

    },
    methods: {
      closeHandler() {
        this.visible = false

        let id = `${this.tourId}_hasSeenTour`
        localStorage.setItem(id, "true");
      },
      nextHandler() {
        if (this.messageIndex === this.messages.length - 1) {
          this.visible = false;
          this.tourHighlightElement("")
          let id = `${this.tourId}_hasSeenTour`
          localStorage.setItem(id, "true");
        } else {
          this.messageIndex++
          this.tourHighlightElement(this.messages[this.messageIndex].element)
        }
      },
      showTour() {
        this.visible = true;
        this.messageIndex = 0;
      }
    },
    watch: {
      visible() {

        let startTime = 2200;
        let blinkTime = 200;
        let numOfBlinks = 4;
        if (this.visible === true) {
          for (let i = 0; i < numOfBlinks * 2; i = i + 2) {
            setTimeout(() => {
              this.nextArrowFocused = true;
            }, startTime + i * blinkTime)

            setTimeout(() => {
              this.nextArrowFocused = false;
            }, startTime + (i + 1) * blinkTime)
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

@import "~../styles/colors";

// Animation
.tour-animation-enter {
  transform: scale(0) translateX(-50%) !important;
}
.tour-animation-enter-to {
  transform: scale(1) translateX(-50%) !important;
}
.tour-animation-leave {
  transform: scale(1) translateX(-50%) !important;
}
.tour-animation-leave-to {
  transform: scale(0) translateX(-50%) !important;
}


.tour-box {
  position: absolute;
  z-index: 9999;
  height: 200px;
  width: 280px;

  bottom: 105px;
  left: 50%;
  transform: scale(1) translateX(-50%);

  background: rgba(250,250,250,.95);
  box-shadow: 2px 2px 10px #000;
  border: 2px solid #000;

  transition: .75s all ease-in;
  transform-origin: 0;
}

.close-button {
  position: absolute;
  z-index: 2;

  top: 8px;
  left: 8px;

  width: 18px;
  height: 18px;
  border-radius: 50%;

  transition: all .2s linear;

  cursor: pointer;

  &:hover {
    transform: scale(1.2)
  }
}

.next-button {
  position: absolute;
  z-index: 2;

  bottom: 8px;
  right: 8px;

  width: 18px;
  height: 18px;
  border-radius: 50%;

  transition: all .2s linear;

  cursor: pointer;

  &:hover {
    transform: scale(1.2);
  }

  &.focused {
    transform: scale(2);
    box-shadow: 0 0 0 4px $orange;
  }
}

.message {
  position: absolute;
  z-index: 1;

  font-size: 18px;
  line-height: 1.2;

  top: 50%;
  width: 100%;
  transform: translateY(-50%);

  padding: 12px;
  text-align: center;
}

</style>
