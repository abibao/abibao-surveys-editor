export default async function () {
  this.debug('getCampaigns')
  try {
    const campaigns = await this.$feathers.service('api/campaigns').find({}).catch((error) => {
      throw error
    })
    this.debug('getCampaigns %o', campaigns)
    this.data.campaigns = {
      total: campaigns.length,
      dataProvider: campaigns
    }
  } catch (error) {
    this.debug('getCampaigns error %o', error)
    this.data.campaigns = {
      total: 0,
      dataProvider: []
    }
  }
}
