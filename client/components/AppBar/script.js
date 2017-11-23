import Debug from 'debug'
import logout from './methods/logout'

export default {
  name: 'ui-appbar',
  data: function () {
    return {
    }
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
    debug: Debug('abibao:platform:ui-appbar'),
    logout
  }
}
