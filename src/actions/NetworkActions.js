// react
import Reflux from 'reflux'

const NetworkActions = Reflux.createActions([
  'networkConnect',
  'networkDisconnect',
  'networkAuthenticate',
  'networkPostOnSlack'
])

export default NetworkActions
