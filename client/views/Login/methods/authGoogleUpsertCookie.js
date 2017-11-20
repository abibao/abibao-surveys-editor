export default function () {
  this.debug('authGoogleUpsertCookie')
  if (this.$route.query && this.$route.query.accessToken) {
    this.$cookie.set('rememberMe', this.$route.query.accessToken, { expires: '1D' })
    this.$router.push('/')
  }
}
