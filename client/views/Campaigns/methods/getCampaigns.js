export default function () {
  this.debug('getCampaigns')
  this.$feathers.service('api/campaigns').find({})
    .then(campaigns => {
      this.debug('campaigns %o', campaigns)
      this.data.campaigns = {
        total: campaigns.length,
        dataProvider: campaigns
      }
    })
    .catch((error) => {
      this.debug('entities error %o', error)
      this.data.campaigns = {
        total: 0,
        dataProvider: []
      }
      console.log(error)
    })
}
