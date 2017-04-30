let couchdbUser = 'infra'
let couchdbPass = 'infra'

switch (window.location.hostname) {
  case 'platform.local.abibao.com':
    break
  case 'platform.pprod.abibao.com':
    couchdbUser = 'rece'
    couchdbPass = 'rece'
    break
  case 'platform.abibao.com':
    couchdbUser = 'abibao'
    couchdbPass = 'xCEu8rQW9Hnacu6dKu37f46Xm2mPr2'
    break
  default:
}

let couchdbUrl = '$protocol//$user:$pass@$hostname:5984'
couchdbUrl = couchdbUrl.replace('$protocol', window.location.protocol)
couchdbUrl = couchdbUrl.replace('$user', couchdbUser)
couchdbUrl = couchdbUrl.replace('$pass', couchdbPass)
couchdbUrl = couchdbUrl.replace('$hostname', window.location.hostname)

let Config = {
  hosts: {
    couchdb: couchdbUrl
  }
}

export default Config
