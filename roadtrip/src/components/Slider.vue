<template>
  <span>
    <div class="slider-info" v-html="trackInfo" v-show="infoVisible"></div>
    <input
      type="range"
      :min="min"
      step="1"
      :value="infoTrackNumber"
      :max="max"
      :class="{'tour-highlighted': tourHighlighted}"
      @input="sliderChangeHandler"
      @mousedown="mousedownHandler"
      @mouseup="mouseupHandler">
    </input>
  </span>
</template>

<script>
  import tracks from "../data/snapchat-tracks.js"
  import locations from "../data/snapchat-locations.js"

  export default {
    props: ["min", "max", "onChange", "value", "tourHighlighted"],
    data() {
      return {
        infoVisible: false,
        infoTrackNumber: 0
      }
    },
    computed: {
      trackInfo() {
        let track = tracks[this.infoTrackNumber]
        let location = locations[track.location]

        let returnString = `<span>Track ${this.infoTrackNumber + 1} of ${tracks.length}</span>`

        if (location) {
          returnString = returnString + `<br /><span>${location.name}, ${location.state}</span>`
        }

        return returnString
      },
    },
    watch: {
      value() {
        this.infoTrackNumber = this.$props.value
      }
    },
    methods: {
      sliderChangeHandler(e) {
        let val = parseInt(e.target.value, 10)

        // Update info track number independetly from event in snap theater,
        // because we want to update info panel immediately but snap theater
        // will debounce actually seeking in video
        this.infoTrackNumber = val

        this.onChange(val)
      },
      mousedownHandler() {
        this.infoVisible = true;
      },
      mouseupHandler() {
        this.infoVisible = false;
      }
    }
  }
</script>

<style lang="scss" scoped>

@import "~../styles/colors";

  .slider-info {
    position: absolute;
    width: 180px;
    height: 100px;

    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);

    border-radius: 5px;
    border: 2px solid #000;
    background: $transparentGray;
  }

  input {
    transition: all .1s linear;
  }

  .tour-highlighted {
    transform: scale(1.2);
    box-shadow: 0 0 0 4px $orange;
    border-radius: 5px;
  }

  // src: http://www.cssportal.com/style-input-range/
  input[type=range] {
    height: 32px;
    -webkit-appearance: none;
    width: 100%;

    margin: 0;
    background: none;
  }
  input[type=range]:focus {
    outline: none;
  }
  input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 16px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 0px #000000;
    background: #B6B6B6;
    border-radius: 25px;
    border: 1px solid #8A8A8A;
  }
  input[type=range]::-webkit-slider-thumb {
    box-shadow: 1px 1px 1px #828282;
    border: 1px solid #8A8A8A;
    height: 24px;
    width: 35px;
    border-radius: 6px;
    background: #DADADA;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -5px;
  }
  input[type=range]:focus::-webkit-slider-runnable-track {
    background: #B6B6B6;
  }
  input[type=range]::-moz-range-track {
    width: 100%;
    height: 16px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 0px #000000;
    background: #B6B6B6;
    border-radius: 25px;
    border: 1px solid #8A8A8A;
  }
  input[type=range]::-moz-range-thumb {
    box-shadow: 1px 1px 1px #828282;
    border: 1px solid #8A8A8A;
    height: 24px;
    width: 35px;
    border-radius: 6px;
    background: #DADADA;
    cursor: pointer;
  }
  input[type=range]::-ms-track {
    width: 100%;
    height: 16px;
    cursor: pointer;
    animate: 0.2s;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  input[type=range]::-ms-fill-lower {
    background: #B6B6B6;
    border: 1px solid #8A8A8A;
    border-radius: 50px;
    box-shadow: 0px 0px 0px #000000;
  }
  input[type=range]::-ms-fill-upper {
    background: #B6B6B6;
    border: 1px solid #8A8A8A;
    border-radius: 50px;
    box-shadow: 0px 0px 0px #000000;
  }
  input[type=range]::-ms-thumb {
    margin-top: 1px;
    box-shadow: 1px 1px 1px #828282;
    border: 1px solid #8A8A8A;
    height: 24px;
    width: 35px;
    border-radius: 6px;
    background: #DADADA;
    cursor: pointer;
  }
  input[type=range]:focus::-ms-fill-lower {
    background: #B6B6B6;
  }
  input[type=range]:focus::-ms-fill-upper {
    background: #B6B6B6;
  }
</style>
