<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">

@import "~lib/styles/lib";
@import "~styles/colors";

// App structure styles
html {
  font-size: 62.5%;

  // Use border-box throughout;
  * {
    box-sizing: border-box;
  }

	overflow: hidden;

  font-family: 'Ubuntu', sans-serif;
}

// Make app size of screen
html, body, #app {
  height: 100%;
  width: 100%;
}

p {
  font-size: 2.0rem;
  line-height: 1.5;
  margin: 0 0 2.0rem 0;
}

a {
  font-weight: 700;
  color: $blue1;
  text-decoration: none;

  transition: all .2s ease-in;

  &:hover {
    color: $orange;
  }
}
</style>
