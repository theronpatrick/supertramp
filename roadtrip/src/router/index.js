import Vue from "vue";
import Router from "vue-router";
import Main from "@/components/Main.vue";
import SnapTheater from "@/components/SnapTheater.vue";
import SelfieGallery from "@/components/SelfieGallery.vue";
import Infographics from "@/components/Infographics.vue";
import BumperStickers from "@/components/BumperStickers.vue";

Vue.use(Router);

let router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Main",
      component: Main,
    },
    {
      path: "/summerofsnap",
      name: "SnapTheater",
      component: SnapTheater,
      meta: {
        title: "Summer of Snap",
      },
    },
    {
      path: "/selfiegallery",
      name: "SelfieGallery",
      component: SelfieGallery,
      meta: {
        title: "Selfie Gallery",
      },
    },
    {
      path: "/stats",
      name: "Infographics",
      component: Infographics,
      meta: {
        title: "Stats, Facts, and Fun",
      },
    },
    {
      path: "/bumperstickers",
      name: "BumperStickers",
      component: BumperStickers,
      meta: {
        title: "Bumper Sticker Explorer",
      },
    },
    // Need to prefix routes with 'roadtrip' in history mode since that's where
    // it'll be hosted on theron.dev
    {
      path: "/roadtrip",
      name: "ProdMain",
      component: Main,
    },
    {
      path: "/roadtrip/summerofsnap",
      name: "ProdSnapTheater",
      component: SnapTheater,
      meta: {
        title: "Summer of Snap",
      },
    },
    {
      path: "/roadtrip/selfiegallery",
      name: "ProdSelfieGallery",
      component: SelfieGallery,
      meta: {
        title: "Selfie Gallery",
      },
    },
    {
      path: "/roadtrip/stats",
      name: "ProfInfographics",
      component: Infographics,
      meta: {
        title: "Stats, Facts, and Fun",
      },
    },
    {
      path: "/roadtrip/bumperstickers",
      name: "ProdBumperStickers",
      component: BumperStickers,
      meta: {
        title: "Bumper Sticker Explorer",
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = "Theron's 2017 Cross Country Adventure";
  }

  next();
});

export default router;
