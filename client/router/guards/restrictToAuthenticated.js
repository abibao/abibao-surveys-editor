import Debug from 'debug'
import feathers from '../../feathers'

const debug = Debug('abibao:platform-admin:restrictToAuthenticated')

export default async function (to, from, next) {
  debug('start control')
  try {
    const authenticate = await feathers.authenticate().catch((error) => {
      throw error
    })
    const payload = await feathers.passport.verifyJWT(authenticate.accessToken).catch((error) => {
      error.code = 401
      throw error
    })
    const user = await feathers.service('users').get(payload.userId).catch((error) => {
      error.code = 401
      throw error
    })
    debug('user is %o', user)
    to.meta.user = user
    next()
  } catch (error) {
    debug('not authenticate error %o', error)
    feathers.logout()
    if (error.code && error.code === 401) return next('/login')
  }
}
