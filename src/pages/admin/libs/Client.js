import hooks from 'feathers-hooks'
import feathers from 'feathers/client'
import socketio from 'feathers-socketio/client'
import io from 'socket.io-client'
import authentication from 'feathers-authentication-client'

export default (callback) => {
  console.log('ClientReader', 'constructor')
  const socket = io()
  const app = feathers()
    .configure(hooks())
    .configure(socketio(socket))
    .configure(authentication({
      storage: window.localStorage,
      storageKey: 'rememberMe',
      cookie: 'rememberMe'
    }))
  callback(app)
}
