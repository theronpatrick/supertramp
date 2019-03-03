<template>
  <div class="main-container">
    <nav>
      <NavBubble
        v-for="bubble in bubbles"
        :key="bubble.title"
        :title="bubble.title"
        :navBubbleClass="bubble.class"
        :start="bubble.start"
        :isActive="activeNav === bubble.class"
        :onClick="navClick"
        :diameter="diameter"
        :icon="bubble.icon"
        :content="bubble.content"
        :iconAlt="bubble.iconAlt"
        :link="bubble.link"
      />
    </nav>
  </div>
</template>

<script>

import NavBubble from "components/NavBubble"

import resumeImg from "root/img/file.svg"
import manImg from "root/img/man.svg"
import phoneImg from "root/img/phone.svg"
import workImg from "root/img/work.svg"
import carImg from "root/img/car.svg"

import content from "root/content/content"

const ROADTRIP_HOST = 'https://theron.dev';

export default {
  components: {
    NavBubble
  },
  created: function () {
    // Calc bubble widths at beginning and on resize
    window.addEventListener('resize', this.calcBubbleWidth)

    this.calcBubbleWidth();

    // There's some fishiness going on with mobile screen sizes, so redo calc after a set time
    setTimeout(() => {
      this.calcBubbleWidth()
    }, 500)

  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.calcBubbleWidth)
  },
  data: function() {
    return {
      manImg,
      resumeImg,
      workImg,
      phoneImg,
      activeNav: null,
      diameter: 0,
      bubbles: [
        {
          class: "profile",
          icon: manImg,
          iconAlt: "profile",
          start: !this.hasActiveRoute(),
          content: content.profile,
          title: "About Me"
        },
        {
          class: "resume",
          icon: resumeImg,
          iconAlt: "resume",
          start: !this.hasActiveRoute(),
          content: content.resume,
          title: "Resume"
        },
        {
          class: "roadtrip",
          link: `${ROADTRIP_HOST}/roadtrip`,
          icon: carImg,
          iconAlt: "roadtrip",
          start: !this.hasActiveRoute(),
          content: "",
          title: "Road Trip"
        },
        {
          class: "contact",
          icon: phoneImg,
          iconAlt: "contact",
          start: !this.hasActiveRoute(),
          content: content.contact,
          title: "Contact"
        },
        {
          class: "projects",
          icon: workImg,
          iconAlt: "projects",
          start: !this.hasActiveRoute(),
          content: content.projects,
          title: "Projects"
        }
      ]
    }
  },
  mounted: function() {
    let count = 0;

    let dropBubble = () => {
      this.bubbles[count].start = false;

      count++

      if (count < this.bubbles.length) {
        setTimeout(() => {
          dropBubble()
        }, 250)
      }
    }

    // If we don't have a route set at mount time, show our nice little drop animation,
    // Otherwise, just maximize the selected route
    if (!this.hasActiveRoute()) {
      setTimeout(() => {
        dropBubble()
      }, 100)
    }
    else {
      this.activeNav = this.$route.params.sectionId
    }

  },
  methods: {
    hasActiveRoute: function() {
      return this.$route.params.sectionId ? true : false
    },
    navClick: function(nav) {

      console.log("click " , nav);
      // For some routes, just open link and don't 'open' a section
      if (nav === "roadtrip") {
        window.open(`${ROADTRIP_HOST}/roadtrip`, "_self");
        return;
      }

      if (!this.activeNav) {
        this.$router.push({
          path: `/${nav}`
        })
      } else {
        this.$router.push({
          path: "/"
        })
      }
    },
    calcBubbleWidth: function() {
      let width = window.innerWidth;
      let height = window.innerHeight;

      let dimension = Math.min(width, height)

      // Set diameter based on screen size
      let diameter = dimension / 3.5

      // Set prop to calculated diameter (or min number so the bubbles don't get too small on mobile)
      let maxSize = 250
      this.diameter = Math.min(maxSize, Math.floor(diameter))

    }
  },
  watch: {
    $route: function(route) {
      this.activeNav = route.params.sectionId
    }
  },
  computed: {
  }
}
</script>

<style lang="scss">

@import "~styles/colors";

.main-container {
  height: 100%;
  width: 100%;

  position: relative;

  background: $black;
  color: $white;

  // 2017 shouldn't require hardware acceleration like this but just in case...
  transform: translateZ(0);
}

nav {
  width: 75%;
  display: block;
  margin: 0 auto;
}
</style>
