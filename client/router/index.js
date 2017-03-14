import Vue from 'vue'
import Router from 'vue-router'
import Home from 'components/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/:sectionId',
      component: Home
    }
  ]
})
