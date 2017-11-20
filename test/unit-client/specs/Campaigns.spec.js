import { createLocalVue, mount } from 'vue-test-utils'
import feathers from 'feathers'
import { expect } from 'chai'

import Campaigns from '@/views/Campaigns/index.vue'

const localVue = createLocalVue()

describe('Campaigns.vue', () => {
  it('should show the page, and click the logout button', () => {
    const wrapper = mount(Campaigns, {
      attachToDocument: true,
      localVue,
      mocks: {
        $router: {
          push (path) {
            expect(path).to.equal('/')
          }
        },
        $route: {
          query: {},
          meta: {
            user: { displayName: 'Phantom JS' }
          }
        },
        $feathers: {
          logout () {
          }
        }
      }
    })
    wrapper.update()
    expect(wrapper.vm.currentState).to.equal('STATE_LIST')
    expect(wrapper.contains('div.content.header')).to.equal(true)
    expect(wrapper.contains('div.content.header button')).to.equal(true)
    wrapper.find('div.content.header button').trigger('click')
  })
  it('should show the page with campaigns loaded', () => {
    const app = feathers()
    app.use('api/campaigns', {
      find (params) {
        return Promise.resolve([])
      }
    })
    app.use('api/entities', {
      find (params) {
        return Promise.resolve([])
      }
    })
    const wrapper = mount(Campaigns, {
      attachToDocument: true,
      localVue,
      mocks: {
        $router: {
          push (path) {
            expect(path).to.equal('/')
          }
        },
        $route: {
          query: {},
          meta: {
            user: { displayName: 'Phantom JS' }
          }
        },
        $feathers: {
          service (name) {
            return app.service(name)
          }
        }
      }
    })
    wrapper.update()
  })
})
