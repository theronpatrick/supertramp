<template>
  <div class="main" v-on:keyup.space="debugClick">
    <div class="background-container"></div>

    <div class="button-container">
      <router-link :to="'SnapTheater'">
        <button class="snap-button" id="snap-button"></button>
        <label for="snap-button">Summer of Snap</label>
      </router-link>
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

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
  width: 50%;
  height: 50%;
  left: 50%;
  top: 50%;
  position: absolute;

  transform: translateX(-50%) translateY(-50%);
  text-align: center;

  button {
    outline: none;
  }

  a {
    display: inline-block;
    position: absolute;

    left: 50%;
    top: 50%;

    text-decoration: none;
    outline: none;

    transform-origin: 0;
    transform: scale(1) translateY(-50%) translateX(-50%);

    transition: all .25s linear;

    &:hover {
      transform: scale(1.2) translateY(-50%) translateX(-50%);
      cursor: pointer;
    }
  }
}

label {
  display: block;
  font-size: 22px;
  color: #fff;

  cursor: pointer;
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

.snap-button {
  width: 100px;
  height: 100px;
  border: 0;

  background: url("../assets/snap-ghost.png");
  background-size: cover;
  background-color: transparent;

  transition: all .25s linear;

  cursor: pointer;

}


</style>
