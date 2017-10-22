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

  // Should be extraneous, but just in case include to remove delay on mobile
  -ms-touch-action: manipulation;	/* IE10  */
	touch-action: manipulation;
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
  position: fixed;
}

h1, h2, h3, h4, h5, p, span {
  margin: 0;
}

</style>
