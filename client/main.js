/* eslint-disable no-new */

import Vue from 'vue'
import VueFeathers from 'vue-feathers'
import VueCookie from 'vue-cookie'
import VueModal from 'vue-js-modal'
import VueTooltip from 'v-tooltip'

import is from 'is_js'

import store from '@/store'
import feathers from '@/feathers'
import router from '@/router'

import 'normalize.css'
import '@/styles/main.css'

process.env.isMobile = is.mobile()
if (process.env.DEBUG === true) window.localStorage.debug = 'abibao:*'

Vue.use(VueFeathers, feathers)
Vue.use(VueCookie)
Vue.use(VueModal)
Vue.use(VueTooltip)

Vue.config.productionTip = false

new Vue({
  router,
  store
}).$mount('#root')
