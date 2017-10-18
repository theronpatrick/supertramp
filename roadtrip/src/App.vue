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

// Make sure scrollbar is visible
::-webkit-scrollbar {
    -webkit-appearance: visible;
    width: 7px;
    background: rgba(255,255,255,.2);
    border-radius: 4px;
}
::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(255,255,255,.5);
    -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);
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
