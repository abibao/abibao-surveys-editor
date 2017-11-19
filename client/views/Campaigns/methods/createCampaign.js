export default async function () {
  this.debug('createCampaigns')
  try {
    Object.assign(this.data.newCampaign, {
      reader: 'abibao',
      position: 0,
      picture: 'images/default/campaign.png',
      data: {pages: [{name: 'page1'}]}
    })
    const result = await this.$feathers.service('api/campaigns').create(this.data.newCampaign).catch((error) => {
      throw error
    })
    this.debug('createCampaigns %o', result)
  } catch (error) {
    this.debug('createCampaigns error %o', error)
  }
}
