export default function (path, state) {
  this.debug('changeState')
  this.$router.push(path)
  this.getEntities()
  this.getCampaigns()
  this.data.newCampaign = {}
  this.currentState = state
}