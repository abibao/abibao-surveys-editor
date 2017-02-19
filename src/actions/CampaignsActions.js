// react
import Reflux from 'reflux'

const CampaignsActions = Reflux.createActions([
  'initialize',
  'populateEntity',
  'create',
  'createdCampaign',
  'save',
  'updatedCampaign',
  'upload'])

export default CampaignsActions
