<template>
  <div class="snap-theater">
    <h1>Testeroo</h1>
    <button @click="seekHandler">Seek</button>
    <div id="player"></div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      player: {}
    }
  },
  mounted() {
    console.log("hey");
    this.initPlayer()
  },
  methods: {
    initPlayer() {
      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      var player;
      window.onYouTubeIframeAPIReady = () => {
         this.player = new YT.Player('player', {
           height: '900',
           width: '1600',
           videoId: 'k1TjerKBJt4',
           events: {
             'onReady': this.onPlayerReady,
             'onStateChange': this.onPlayerStateChange
           }
         });
       }
    },
    // 4. The API will call this function when the video player is ready.
    onPlayerReady(event) {
      event.target.playVideo();
    },

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    onPlayerStateChange(event) {
      console.log("Player state change");
    },
    stopVideo() {
      this.player.stopVideo();
    },
    seekHandler() {
      let time = this.player.getCurrentTime()
      this.player.seekTo(time + 5, true)
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

#player {
  width: 1600px;
  height: 900px;
}


</style>
