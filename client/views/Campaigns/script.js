import Debug from 'debug'
import logout from './methods/logout'
import changeState from './methods/changeState'
import getEntities from './methods/getEntities'
import getCampaigns from './methods/getCampaigns'

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
      data: {
        campaigns: { total: 0, dataProvider: [] },
        entities: { total: 0, dataProvider: [] }
      },
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
    this.getEntities()
    this.getCampaigns()
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
    logout,
    changeState,
    getEntities,
    getCampaigns
  }
}
