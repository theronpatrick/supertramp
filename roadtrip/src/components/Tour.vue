<template>
  <div class="tour-box" v-show="visible">
    <img :src="images.close" class="close-button" role="button" @click="closeHandler"></img>
    <img :src="images.arrow" class="next-button" :class="{'focused': nextArrowFocused}" role="button" @click="nextHandler"></img>
    <span class="message">{{messages[messageIndex].message}}</span>
  </div>
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
        messages: [
          {
            message: "Welcome to my Summer of Snap! Click the arrow to continue.",
            element: ""
          },
          {
            message: `You can seek through all ${tracks.length} snaps with this bar.`,
            element: "slider"
          },
          {
            message: `Use this button to start from the beginning`,
            element: "startFromBeginning"
          },
          {
            message: `Use this button (or your left arrow key) to go one snap backwards.`,
            element: "seekBackward"
          },
          {
            message: `Use this button (or your right arrow key) to go one snap forwards.`,
            element: "seekForward"
          },
          {
            message: `Use this button to play or pause the movie.`,
            element: "playPause"
          },
          {
            message: `Use this button to open the tag menu. Click one or more tags from that menu to filter which snaps you see.`,
            element: "tagButton"
          },
          {
            message: `Use the info button to show or hide the info menu, which shows the name, location, and tags of the current snap.`,
            element: "infoButton"
          },
          {
            message: `Enjoy!`,
            element: ""
          }
        ],
        messageIndex: 0,
        nextArrowFocused: false
      }
    },
    props: ["tourHighlightElement"],
    mounted() {
      let hasSeen = localStorage.getItem("hasSeenTour")

      if (!hasSeen) {
        setTimeout(() => {
          this.visible = true
        }, 500)
      }

    },
    methods: {
      closeHandler() {
        this.visible = false
      },
      nextHandler() {
        if (this.messageIndex === this.messages.length - 1) {
          this.visible = false;
          this.tourHighlightElement("")
          localStorage.setItem("hasSeenTour", "true");
        } else {
          this.messageIndex++
          this.tourHighlightElement(this.messages[this.messageIndex].element)
        }
      },
      showTour() {
        this.visible = true;
        this.messageIndex = 1;
      }
    },
    watch: {
      visible() {

        let startTime = 1500;
        let blinkTime = 200;
        if (this.visible === true) {
          setTimeout(() => {
            this.nextArrowFocused = true;
          }, startTime)
          setTimeout(() => {
            this.nextArrowFocused = false;
          }, startTime + blinkTime * 1)
          setTimeout(() => {
            this.nextArrowFocused = true;
          }, startTime + blinkTime * 2)
          setTimeout(() => {
            this.nextArrowFocused = false;
          }, startTime + blinkTime * 3)
          setTimeout(() => {
            this.nextArrowFocused = true;
          }, startTime + blinkTime * 4)
          setTimeout(() => {
            this.nextArrowFocused = false;
          }, startTime + blinkTime * 5)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

@import "~../styles/colors";

.tour-box {
  position: absolute;
  z-index: 9999;
  height: 200px;
  width: 200px;

  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);

  background: $transparentGray;
  border: 2px solid #000;
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
    transform: scale(1.5);
    box-shadow: 0 0 25px $orange;
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
