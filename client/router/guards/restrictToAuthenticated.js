import Debug from 'debug'
import feathers from '../../feathers'

const debug = Debug('abibao:platform-admin:restrictToAuthenticated')

export default (to, from, next) => {
  feathers.authenticate()
    .then(() => {
      debug('authenticate')
      next()
    })
    .catch(() => {
      debug('not authenticate')
      next('/login')
    })
}
