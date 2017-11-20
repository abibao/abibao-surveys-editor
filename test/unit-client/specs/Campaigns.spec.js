import { createLocalVue, mount } from 'vue-test-utils'
import { expect } from 'chai'
import Promise from 'bluebird'

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
            this.__currentSerice = name
            return this
          },
          find (params) {
            return new Promise((resolve, reject) => {
              console.log(this.__currentSerice)
              if (this.__currentSerice === 'api/campaigns') Promise.resolve([{name: 'NAME'}])
              if (this.__currentSerice === 'api/entities') Promise.reject(new Error('test'))
            })
          }
        }
      }
    })
    wrapper.update()
  })
})
