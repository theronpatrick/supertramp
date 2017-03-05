<template>
  <div
    role="button"
    :class="navBubbleClasses"
    @click="() => {onClick(navBubbleClass)}"
  >
    <div class="nav-bubble-content">Inner</div>
  </div>
</template>

<script>

export default {
  components: {
  },
  data: function() {
    return {
    }
  },
  computed: {
    navBubbleClasses: function() {
      let classObject = {
        "nav-bubble": true,
        "active": this.isActive,
        "start": this.start
      }

      classObject[this.navBubbleClass] = true;
      return classObject;

    }
  },
  methods: {
  },
  props: {
    navBubbleClass: { required: true },
    start: { required: true },
    isActive: { required: true },
    onClick: { required: true }
  }
}
</script>

<style lang="scss">
@import "~styles/colors";

.nav-bubble {
  position: absolute;
  display: inline-block;

  font-size: 2.0rem;
  background-color: $blue1;

  // Padding-bottom hack lets us make a circle
  width: 20%;
  height: 0;
  padding-bottom: 20%;

  border-radius: 50%;
  text-align: center;

  cursor: pointer;
  z-index: 10;

  transition: all 1s ease-out;


  &.top {
    top: 0%;
    left: 50%;
    transform: translateX(-50%) translateY(0);
  }

  &.right {
    top: 50%;
    left: 100%;
    transform: translateX(-100%) translateY(-50%);
  }

  &.bottom {
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-100%);
  }

  &.left {
    top: 50%;
    left: 0%;
    transform: translateX(0) translateY(-50%);
  }

  &.start {
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }

  &:focus, &:hover {
    background-color: $orange;
  }

  &.active {
    background-color: $blue1;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    transform: translateX(-50%) translateY(-50%);
    border-radius: 0;
    padding-bottom: 0;
    z-index: 20;

    cursor: default;
  }
}

.nav-bubble-content {
  position: absolute;
  width: 100%;

  top: 50%;
  transform: translateY(-50%)
}

</style>
