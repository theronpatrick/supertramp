<template>
  <div class="main">
    <section :style="{'height': windowHeight}" class="purple">
      <div class="content-aligner">
        <div>Content</div>
      </div>
    </section>

    <section :style="{'height': windowHeight}" class="green">
      <div class="content-aligner">
      </div>
    </section>
  </div>
</template>

<script>

export default {
  components: {
  },
  data () {
    return {
      windowHeight: `${this.windowHeight}px`
    }
  },
  mounted() {
    this.resizeHandler()
  },
  beforeMount() {
    window.addEventListener('resize', this.resizeHandler)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeHandler)
  },
  methods: {
    resizeHandler() {
      this.windowHeight = `${window.innerHeight}px`
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import "~../styles/colors";
@import "~../styles/variables";

.main {
  overflow: auto;
  height: 100%;
}

section {
  min-height: 100px;
  width: 100%;
  display: table;

  &.green {
    background-color: $infoGreen;
  }
  &.purple {
    background-color: $infoPurple;
  }

  .content-aligner {
    display: table-cell;
    vertical-align: middle;
  }
}


</style>
