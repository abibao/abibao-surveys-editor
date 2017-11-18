export default function () {
  this.debug('logout')
  this.$feathers.logout()
  window.location = '/'
}
