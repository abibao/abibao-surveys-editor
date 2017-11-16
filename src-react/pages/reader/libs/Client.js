import hooks from 'feathers-hooks'
import feathers from 'feathers/client'
import socketio from 'feathers-socketio/client'
import io from 'socket.io-client'
import authentication from 'feathers-authentication-client'

import Debug from 'debug'
const debug = Debug('abibao-platform:reader')

export default (callback) => {
  debug('ClientReader', 'constructor')
  const socket = io()
  const app = feathers()
    .configure(hooks())
    .configure(socketio(socket))
    .configure(authentication({
      storage: window.localStorage,
      storageKey: 'rememberMeClient',
      cookie: 'rememberMeClient'
    }))
  callback(app)
}
