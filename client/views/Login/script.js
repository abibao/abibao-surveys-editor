import Debug from 'debug'
import authGoogle from './methods/authGoogle'
import authGoogleUpsertCookie from './methods/authGoogleUpsertCookie'

export default {
  name: 'ui-login',
  data: function () {
    return {
      initialized: false
    }
  },
  beforeMount: function () {
    this.debug('beforeMount')
    this.authGoogleUpsertCookie()
  },
  mounted: function () {
    this.debug('mounted')
    if (this.$route.query) {
      this.initialized = !this.$route.query.accessToken
    } else {
      this.initialized = true
    }
  },
  updated: function () {
    this.debug('updated')
  },
  destroyed: function () {
    this.debug('destroyed')
  },
  methods: {
    debug: Debug('abibao:platform:ui-login'),
    authGoogle,
    authGoogleUpsertCookie
  }
}