<template>
  <div class="main">
    <div class="background-container"></div>
    <div class="image-container">
      <img v-for="image in images" :src="image.link"></img>
    </div>
  </div>
</template>

<script>

// imgurClientId
// 27a13f9320a8875

// secret
// 32c51ad35a366a4ce139c0d92e102f29968a58d6

export default {
  data () {
    return {
      images: []
    }
  },
  mounted() {
    this.checkJquery()
  },
  methods: {
    checkJquery() {
      // Pretty hacky check to see if jquery is loaded, and if not keep retrying
      // TODO: Fuck with webpack stuff to make sure external dependency is loaded
      if ($) {
        this.loadImages()
      } else {
        console.log("in else");
        setTimeout(() => {
          this.checkJquery()
        }, 1000)
      }
    },
    loadImages() {
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.imgur.com/3/album/pU3L4",
        "method": "GET",
        "headers": {
          "authorization": "Client-ID 27a13f9320a8875"
        }
      }

      $.ajax(settings).done((response) => {
        console.log(response);
        if (response.data) {
          this.images = response.data.images
        }
      });

      setTimeout(() => {
        console.log("images ");
        console.log(this.images);
      }, 1500)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import "~../styles/colors";

.main {
  width: 100%;
  height: 100%;
  position: relative;
}

.background-container {
  width: 100%;
  height: 100%;
  position: relative;

  background: url("../assets/city.jpg") no-repeat center center fixed;
  background-size: cover;

  filter: brightness(60%) contrast(130%);
}

.image-container {

  position: absolute;

  img {
    display: inline-block;
    width: 100px;
    height: 100px;
    margin: 8px;
  }
}


</style>
