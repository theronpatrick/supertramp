<template>
  <div class="main">
    <div class="background-container"></div>

    <div class="button-container">
      <h1>COMING SOON... <span class="globe">🌎</span></h1>
      <router-link :to="'SnapTheater'">
        <button class="snap-button"></button>
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
  transform-origin: 50% 50%;

  &:hover {
    width: 150px;
    height: 150px;
    cursor: pointer;
  }

}


</style>
