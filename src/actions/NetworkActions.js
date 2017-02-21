// react
import Reflux from 'reflux'

const NetworkActions = Reflux.createActions([
  'socketConnect',
  'socketDisconnect',
  'authenticate'])

export default NetworkActions
