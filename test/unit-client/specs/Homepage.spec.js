import { createLocalVue, mount } from 'vue-test-utils'
import { expect } from 'chai'

import Homepage from '@/views/Homepage/index.vue'

const localVue = createLocalVue()

describe('Homepage.vue', () => {
  it('should show the page, and click the logout button', () => {
    const wrapper = mount(Homepage, {
      attachToDocument: true,
      localVue,
      mocks: {
        $router: {
          push (path) {
            expect(path).to.equal('/')
          }
        },
        $route: {
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
    expect(wrapper.contains('div.content.header')).to.equal(true)
    expect(wrapper.contains('div.content.header button')).to.equal(true)
    wrapper.find('div.content.header button').trigger('click')
  })
})
