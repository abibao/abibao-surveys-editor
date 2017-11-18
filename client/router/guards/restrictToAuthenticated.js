import Debug from 'debug'
import feathers from '../../feathers'

const debug = Debug('abibao:platform-admin:restrictToAuthenticated')

export default async (to, from, next) => {
  const authenticate = await feathers.authenticate().catch(() => {
    debug('not authenticate')
    return next('/login')
  })
  debug('authenticate')
  const payload = await feathers.passport.verifyJWT(authenticate.accessToken).catch((error) => {
    debug('error passport')
    return console.log(error)
  })
  const user = await feathers.service('users').get(payload.userId).catch((error) => {
    debug('error user')
    return console.log(error)
  })
  to.meta.user = user
  next()
}
