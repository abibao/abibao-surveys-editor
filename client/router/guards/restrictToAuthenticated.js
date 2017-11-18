import Debug from 'debug'
import feathers from '../../feathers'

const debug = Debug('abibao:platform-admin:restrictToAuthenticated')

export default async (to, from, next) => {
  const authenticate = await feathers.authenticate().catch(() => {
    debug('not authenticate')
    return next('/login')
  })
  debug('authenticate')
  if (!authenticate) {
    return false
  }
  const payload = await feathers.passport.verifyJWT(authenticate.accessToken).catch((error) => {
    debug('passport error %o', error)
    return false
  })
  const user = await feathers.service('users').get(payload.userId).catch((error) => {
    debug('user error %o', error)
    return false
  })
  to.meta.user = user
  next()
}
