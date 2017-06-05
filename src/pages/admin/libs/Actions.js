// react
import Reflux from 'reflux'

const AdminActions = Reflux.createActions([
  'networkConnect',
  'networkDisconnect',
  'networkAuthenticate',
  'networkLogout',
  'applicationInitialize',
  'applicationCreationComplete',
  'templatesRefresh',
  'campaignEmailing',
  'campaignCreate',
  'campaignUpdate',
  'campaignUpdatePicture',
  'mailingCreate',
  'mailingUpdate',
  'styleCreate',
  'styleUpdate'
])

export default AdminActions
