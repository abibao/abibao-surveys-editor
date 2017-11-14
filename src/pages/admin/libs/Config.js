let couchdbHostname = 'localhost'
let couchdbUser = 'infra'
let couchdbPass = 'infra'
let googleAuthURL = 'http://localhost:3000/auth/google'

switch (window.location.hostname) {
  case 'platform.pprod.abibao.com':
  case 'pprod.id-coll.com':
    googleAuthURL = window.location.origin + '/auth/google'
    couchdbHostname = 'couchdb-rece.internal.abibao.com'
    couchdbUser = 'rece'
    couchdbPass = 'rece'
    break
  case 'platform.abibao.com':
  case 'id-coll.com':
    googleAuthURL = window.location.origin + '/auth/google'
    couchdbHostname = 'couchdb-platform.internal.abibao.com'
    couchdbUser = 'abibao'
    couchdbPass = 'xCEu8rQW9Hnacu6dKu37f46Xm2mPr2'
    break
  default:
    break
}

let couchdbUrl = 'http://$user:$pass@$hostname'
couchdbUrl = couchdbUrl.replace('$user', couchdbUser)
couchdbUrl = couchdbUrl.replace('$pass', couchdbPass)
couchdbUrl = couchdbUrl.replace('$hostname', couchdbHostname)

let Config = {
  auth: {
    google: googleAuthURL
  },
  hosts: {
    couchdb: couchdbUrl
  }
}

export default Config
