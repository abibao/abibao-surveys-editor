export default function () {
  this.debug('authGoogle')
  if (process.env.NODE_ENV === 'test') return false
  window.location = 'http://api.abibao.com.local.apvo.net/auth/google'
}
