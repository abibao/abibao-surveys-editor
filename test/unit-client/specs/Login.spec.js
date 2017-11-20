import { createLocalVue, mount } from 'vue-test-utils'
import { expect } from 'chai'

import Login from '@/views/Login/index.vue'

const localVue = createLocalVue()

describe('Login.vue', () => {
  it('should show the page, and click the login button', () => {
    const wrapper = mount(Login, {
      attachToDocument: true,
      localVue,
      mocks: {
        $route: {}
      }
    })
    wrapper.update()
    expect(wrapper.isVueComponent).to.equal(true)
    expect(wrapper.name()).to.equal('ui-login')
    expect(wrapper.vm.initialized).to.equal(true)
    expect(wrapper.contains('div h1')).to.equal(true)
    expect(wrapper.contains('div h3')).to.equal(true)
    expect(wrapper.contains('div div.content.login')).to.equal(true)
    expect(wrapper.contains('div div.content.login h3')).to.equal(true)
    expect(wrapper.contains('div div.content.login p')).to.equal(true)
    expect(wrapper.contains('div div.content.login button')).to.equal(true)
    wrapper.find('div div.content.login button').trigger('click')
  })
  it('should set the cookie and redirect to homepage', () => {
    const wrapper = mount(Login, {
      localVue,
      mocks: {
        $router: {
          push (path) {
            expect(path).to.equal('/')
          }
        },
        $route: {
          query: {
            accessToken: '88kj6ZR3JtQXpaQmgk8Q'
          }
        },
        $cookie: {
          set (name, value) {
            expect(name).to.equal('rememberMe')
            expect(value).to.equal('88kj6ZR3JtQXpaQmgk8Q')
          }
        }
      }
    })
    expect(wrapper.isVueComponent).to.equal(true)
    expect(wrapper.name()).to.equal('ui-login')
  })
})
