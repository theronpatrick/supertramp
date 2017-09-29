import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import SnapTheater from '@/components/SnapTheater'

Vue.use(Router)

let router = new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/summerofsnap',
      name: 'SnapTheater',
      component: SnapTheater,
      meta: {
        title: "Summer of Snap"
      }
    },
    // Need to prefix routes with 'roadtrip' in history mode since that's where
    // it'll be hosted on theronp.com
    {
      path: '/roadtrip',
      name: 'ProdMain',
      component: Main,
    },
    {
      path: '/roadtrip/summerofsnap',
      name: 'ProdSnapTheater',
      component: SnapTheater,
      meta: {
        title: "Summer of Snap"
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = "Theron's 2017 Cross Country Adventure"
  }

  next()
})

export default router
