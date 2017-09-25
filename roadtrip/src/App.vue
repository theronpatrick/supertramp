<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">

// App wide styles
html {
  box-sizing: border-box;
}
*, *:before, *:after {
  box-sizing: inherit;
}

body {
  margin: 0;
  font-family: 'Mukta', sans-serif;

  box-sizing: border-box;
}

body, html, #app {
  height: 100%;
  width: 100%;
  position: relative;
}

h1, h2, h3, h4, h5, p, span {
  margin: 0;
}

</style>
