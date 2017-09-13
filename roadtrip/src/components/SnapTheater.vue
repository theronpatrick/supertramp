<template>
  <div class="snap-theater">
    <h1>{{message}}</h1>
    <button @click="seekBackwardHandler"><-</button>
    <button @click="seekForwardHandler">-></button>
    <div id="player"></div>
  </div>
</template>

<script>

import tracks from "../data/snapchat-tracks.js"

export default {
  data () {
    return {
      player: {},
      currentTrackIndex: 0,
      message: "",
      tracks
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
           height: 900 / 5,
           width: 1500 / 5,
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

      console.log("tracks " , this.tracks);

      setInterval(() => {
        this.checkTime()

      }, 250)
    },

    checkTime() {

      let time = this.player.getCurrentTime()

      let displayCurrentTrackTitle = () => {

        let currentTrack = this.tracks[this.currentTrackIndex]

        if (currentTrack.start <= time && currentTrack.end >= time) {
          this.message = currentTrack.title
        } else if (currentTrack.start > time) {
          // Go back
          this.currentTrackIndex = this.currentTrackIndex - 1
          displayCurrentTrackTitle()
        } else if (currentTrack.end < time) {
          // Go Forward
          this.currentTrackIndex = this.currentTrackIndex + 1

          displayCurrentTrackTitle()

        }
      }


      displayCurrentTrackTitle()


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
    seekForwardHandler() {
      if (this.currentTrackIndex !== this.tracks.length - 1) {
        this.currentTrackIndex = this.currentTrackIndex + 1
        this.player.seekTo(this.tracks[this.currentTrackIndex].start)
        this.checkTime()
      }
    },
    seekBackwardHandler() {
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex = this.currentTrackIndex - 1
        this.player.seekTo(this.tracks[this.currentTrackIndex].start)
        this.checkTime()
      }
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
  width: 1600px / 5;
  height: 900px / 5;
}


</style>
