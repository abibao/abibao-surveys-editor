// react
import Reflux from 'reflux'

const CampaignsActions = Reflux.createActions([
  'populateEntity',
  'loadAsync',
  'create',
  'createdCampaign',
  'save',
  'updatedCampaign',
  'upload'])

export default CampaignsActions
