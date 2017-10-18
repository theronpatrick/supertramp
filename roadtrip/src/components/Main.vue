<template>
  <div
    class="main"
    @click="mainContainerClickHandler"
  >
    <div class="background-container"></div>

    <div class="button-container">
      <div class="link-aligner" ref="linkAligner">
        <router-link :to="'summerofsnap'">
          <button class="link-button snap-button" id="snap-button"></button>
          <label for="snap-button">Summer of Snap</label>
        </router-link>
        <router-link :to="'selfiegallery'">
          <button class="link-button selfie-button" id="selfie-button"></button>
          <label for="selfie-button">Selfie Gallery</label>
        </router-link>
        <router-link :to="''">
          <button class="link-button infographic-button" id="infographic-button"></button>
          <label for="infographic-button" class="disabled">Infographics <br />(coming soon)</label>
        </router-link>
        <router-link :to="''">
          <button class="link-button stickers-button" id="stickers-button"></button>
          <label for="stickers-button" class="disabled">Bumper Sticker Explorer <br />(coming soon)</label>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>

import landscape from "../assets/landscape.jpg"

export default {
  data () {
    return {
      landscape
    }
  },
  mounted() {
    // Current web server is kinda funky so it doesn't like the way routes are set up without hashes
    // So we're setting a redirect from those pages to the main page with a query param, and then send the user to the correct location

    if (this.$route.query) {
      if (this.$route.query.page === "summerofsnap") {
        this.$router.replace({ path: 'summerofsnap' })
      }
    }
  },
  methods: {
    // Prevent silly users on iOS from losing focus on scrollable container
    // TODO: Try to fix swipe behavior as well
    mainContainerClickHandler() {
      if (this.$refs.linkAligner) {
        this.$refs.linkAligner.focus()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import "~../styles/colors";
@import "~../styles/variables";

.main {
  width: 100%;
  height: 100%;
  position: relative;
}

.background-container {
  width: 100%;
  height: 100%;
  position: relative;

  background: url("../assets/landscape.jpg") no-repeat center center fixed;
  background-size: cover;

  filter: brightness(60%) contrast(130%);

}

.globe {
  position: absolute;

  top: 100%;
  left: 50%;

  transform-origin: 0;
  animation: rotation 4s linear infinite;
}

@keyframes rotation {
  0% {
    transform: scaleX(1) translate(-50%)
  }
  50% {
    transform: scaleX(-1) translate(-50%)
  }
  100% {
    transform: scaleX(1) translate(-50%)
  }
}

.button-container {
  width: 100%;
  height: 100%;
  left: 50%;
  top: 50%;
  position: absolute;

  transform: translateX(-50%) translateY(-50%);
  text-align: center;

  -webkit-overflow-scrolling: touch;

  button {
    outline: none;
  }

  .link-aligner {
    position: absolute;
    top: 50%;

    height: 50%;
    max-height: 100%;
    width: 100%;

    overflow-y: auto;
    overflow-x: hidden;

    transform: translateY(-50%);

    text-align: center;
  }

  a {
    display: inline-block;
    vertical-align: top;

    margin: 28px;

    text-decoration: none;
    outline: none;

    transform-origin: center;
    transform: scale(1);

    transition: all .25s linear;

    cursor: pointer;

    &:hover {
      transform: scale(1.2);
    }

    @include mobile {
      display: block;
      margin: 32px auto;
    }
  }
}

label {
  display: block;
  font-size: 22px;
  color: #fff;

  line-height: 1;

  cursor: pointer;

  &.disabled {
    color: $gray1;
  }
}

h1 {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  color: #FFF;

  font-size: 34px;
  letter-spacing: 2px;
}

.link-button {
  width: 100px;
  height: 100px;
  border: 0;

  background-size: cover;
  background-color: transparent;

  transition: all .25s linear;

  cursor: pointer;

  &.snap-button {
    background-image: url("../assets/snap-ghost.png");
  }

  &.selfie-button {
    background-image: url("../assets/smile.svg");
  }

  &.infographic-button {
    background-image: url("../assets/chart.svg");
  }

  &.stickers-button {
    background-image: url("../assets/car.svg");
  }

}


</style>
