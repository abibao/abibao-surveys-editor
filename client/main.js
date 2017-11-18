/* eslint-disable no-new */

import Vue from 'vue'
import VueFeathers from 'vue-feathers'
import VueCookie from 'vue-cookie'

import feathers from '@/feathers'
import router from '@/router'

import '@/styles/main.css'

if (process.env.DEBUG === true) window.localStorage.debug = 'abibao:*'

Vue.use(VueFeathers, feathers)
Vue.use(VueCookie)

Vue.config.productionTip = false

new Vue({
  router
}).$mount('#root')
