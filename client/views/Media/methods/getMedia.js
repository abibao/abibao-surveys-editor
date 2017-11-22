export default async function () {
  this.debug('getMedia')
  try {
    const media = await this.$feathers.service('query/getAllUploadedMedia').find({}).catch((error) => {
      throw error
    })
    this.debug('getMedia %o', media)
    this.data.media = {
      total: media.length,
      dataProvider: media
    }
  } catch (error) {
    this.debug('getMedia error %o', error)
    this.data.media = {
      total: 0,
      dataProvider: []
    }
  }
}
