import Debug from 'debug'

export default {
  name: 'ui-homepage',
  data: function () {
    return {
    }
  },
  beforeMount: function () {
    this.debug('beforeMount')
  },
  mounted: function () {
    this.debug('mounted')
  },
  updated: function () {
    this.debug('updated')
  },
  destroyed: function () {
    this.debug('destroyed')
  },
  methods: {
    debug: Debug('abibao:platform-admin:ui-homepage')
  }
}
