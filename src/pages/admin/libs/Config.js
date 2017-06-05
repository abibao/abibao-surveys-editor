let couchdbUser = 'infra'
let couchdbPass = 'infra'
let couchdbPort = '5984'

switch (window.location.hostname) {
  case 'platform.local.abibao.com':
    break
  case 'platform.pprod.abibao.com':
  case 'pprod.id-coll.com':
    couchdbUser = 'rece'
    couchdbPass = 'rece'
    couchdbPort = '59840'
    break
  case 'platform.abibao.com':
  case 'id-coll.com':
    couchdbUser = 'abibao'
    couchdbPass = 'xCEu8rQW9Hnacu6dKu37f46Xm2mPr2'
    break
  default:
}

let couchdbUrl = '$protocol//$user:$pass@$hostname:$port'
couchdbUrl = couchdbUrl.replace('$protocol', window.location.protocol)
couchdbUrl = couchdbUrl.replace('$user', couchdbUser)
couchdbUrl = couchdbUrl.replace('$pass', couchdbPass)
couchdbUrl = couchdbUrl.replace('$hostname', window.location.hostname)
couchdbUrl = couchdbUrl.replace('$port', couchdbPort)

let Config = {
  hosts: {
    couchdb: couchdbUrl
  }
}

export default Config
