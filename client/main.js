/* eslint-disable no-new */

import Vue from 'vue'
import VueRouter from 'vue-router'

import '@/styles/main.css'

import Homepage from '@/pages/Homepage'

if (process.env.DEBUG === true) window.localStorage.debug = 'nova:admin:*'

Vue.use(VueRouter)
Vue.config.productionTip = false

const routes = [
  { path: '/admin', component: Homepage }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

new Vue({
  router
}).$mount('#root')
