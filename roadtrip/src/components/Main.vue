<template>
  <div class="main">
    <div class="background-container"></div>
    <h1>COMING SOON...</h1>
  </div>
</template>

<script>

import landscape from "../assets/landscape.jpg"

export default {
  name: 'hello',
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

h1 {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  color: #FFF;

  font-size: 34px;
  letter-spacing: 2px;
}


</style>
