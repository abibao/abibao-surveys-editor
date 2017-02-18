import hooks from 'feathers-hooks'
import feathers from 'feathers/client'
import socketio from 'feathers-socketio/client'
import io from 'socket.io-client'
import authentication from 'feathers-authentication-client'

const host = process.env.REACT_APP_FEATHERS_URI
const socket = io(host)

const app = feathers()
  .configure(hooks())
  .configure(socketio(socket))
  .configure(authentication({
    storage: window.localStorage,
    storageKey: 'rememberMe',
    cookie: 'rememberMe'
  }))

export default app
