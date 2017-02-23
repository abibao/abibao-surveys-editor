// react
import Reflux from 'reflux'

const ApplicationActions = Reflux.createActions([
  'applicationInitialize',
  'applicationCreationComplete',
  'removeNotification',
  'createCampaign'])

export default ApplicationActions
