/* eslint-disable no-new */

import Vue from 'vue'

import router from '@/router'
import '@/feathers'
import '@/styles/main.css'

if (process.env.DEBUG === true) window.localStorage.debug = 'abibao:*'

Vue.config.productionTip = false
new Vue({
  router
}).$mount('#root')
