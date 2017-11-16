import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from '@/router/routes'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  saveScrollPosition: true,
  linkActiveClass: 'active',
  routes
})
