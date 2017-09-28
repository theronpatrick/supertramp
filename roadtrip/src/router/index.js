import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import SnapTheater from '@/components/SnapTheater'

Vue.use(Router)

let router = new Router({
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
