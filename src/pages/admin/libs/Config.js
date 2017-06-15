let couchdbUser = 'infra'
let couchdbPass = 'infra'
let couchdbPort = '5984'
let googleAuthURL = 'http://localhost:3000/auth/google'

switch (window.location.hostname) {
  case 'platform.pprod.abibao.com':
  case 'pprod.id-coll.com':
    googleAuthURL = window.location.origin + '/auth/google'
    couchdbUser = 'rece'
    couchdbPass = 'rece'
    couchdbPort = '59840'
    break
  case 'platform.abibao.com':
  case 'id-coll.com':
    googleAuthURL = window.location.origin + '/auth/google'
    couchdbUser = 'abibao'
    couchdbPass = 'xCEu8rQW9Hnacu6dKu37f46Xm2mPr2'
    break
  default:
    break
}

let couchdbUrl = '$protocol//$user:$pass@$hostname:$port'
couchdbUrl = couchdbUrl.replace('$protocol', window.location.protocol)
couchdbUrl = couchdbUrl.replace('$user', couchdbUser)
couchdbUrl = couchdbUrl.replace('$pass', couchdbPass)
couchdbUrl = couchdbUrl.replace('$hostname', window.location.hostname)
couchdbUrl = couchdbUrl.replace('$port', couchdbPort)

let Config = {
  auth: {
    google: googleAuthURL
  },
  hosts: {
    couchdb: couchdbUrl
  }
}

export default Config
