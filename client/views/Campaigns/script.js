import Debug from 'debug'

export default {
  name: 'ui-campaigns',
  data: function () {
    return {
      initialized: false,
      states: {
        STATE_LIST: 'STATE_LIST',
        STATE_CREATE: 'STATE_CREATE'
      },
      user: false,
      isMobile: process.env.isMobile,
      currentState: 'STATE_LIST'
    }
  },
  beforeMount: function () {
    this.debug('beforeMount')
  },
  mounted: function () {
    this.debug('mounted')
    this.user = this.$route.meta.user
    if (this.$route.query.state === 'create') this.currentState = this.states.STATE_CREATE
    this.initialized = true
  },
  updated: function () {
    this.debug('updated')
  },
  destroyed: function () {
    this.debug('destroyed')
  },
  methods: {
    debug: Debug('abibao:platform:ui-campaigns'),
    stateCreate () {
      this.$router.push('campaigns?state=create')
      this.currentState = this.states.STATE_CREATE
    },
    stateList () {
      this.$router.push('campaigns')
      this.currentState = this.states.STATE_LIST
    }
  }
}
