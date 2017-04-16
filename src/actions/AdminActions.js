// react
import Reflux from 'reflux'

const AdminActions = Reflux.createActions([
  'networkConnect',
  'networkDisconnect',
  'networkAuthenticate',
  'applicationInitialize',
  'applicationCreationComplete',
  'campaignEmailing',
  'campaignCreate',
  'campaignUpdate',
  'campaignUpdatePicture'
])

export default AdminActions
