export default function () {
  this.debug('logout')
  this.$feathers.logout()
  this.$router.push('/')
}
