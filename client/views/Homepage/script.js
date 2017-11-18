import Debug from 'debug'

export default {
  name: 'ui-homepage',
  data: function () {
    return {
      initialized: false,
      user: false,
      data: {
        campaigns: { total: 0 },
        media: { total: 0 },
        emailings: { total: 0 },
        styles: { total: 0 }
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
    debug: Debug('abibao:platform:ui-homepage')
  }
}
