import Debug from 'debug'
import logout from './methods/logout'

export default {
  name: 'ui-media',
  data: function () {
    return {
      initialized: false,
      user: false,
      data: {
      }
    }
  },
  beforeMount: function () {
    this.debug('beforeMount')
  },
  mounted: function () {
    this.debug('mounted')
    this.user = this.$route.meta.user
    this.initialized = true
  },
  updated: function () {
    this.debug('updated')
  },
  destroyed: function () {
    this.debug('destroyed')
  },
  methods: {
    debug: Debug('abibao:platform:ui-media'),
    logout
  }
}
