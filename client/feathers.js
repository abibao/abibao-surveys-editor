import Feathers from 'feathers/client'
import hooks from 'feathers-hooks'
import authentication from 'feathers-authentication/client'
import socketio from 'feathers-socketio/client'
import io from 'socket.io-client'
import Vue from 'vue'
import VueFeathers from 'vue-feathers'

// Configure Feathers client
const socket = io(process.env.FEATHERS_HOST || 'http://api.abibao.com.local.apvo.net')
const feathers = Feathers()
  .configure(socketio(socket))
  .configure(hooks())
  .configure(authentication({
    storage: window.localStorage,
    storageKey: 'rememberMe',
    cookie: 'rememberMe'
  }))

Vue.use(VueFeathers, feathers)

export default feathers
