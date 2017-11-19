export default async function () {
  this.debug('getEntities')
  try {
    const entities = await this.$feathers.service('api/entities').find({}).catch((error) => {
      throw error
    })
    this.debug('getEntities %o', entities)
    this.data.entities = {
      total: entities.length,
      dataProvider: entities
    }
  } catch (error) {
    this.debug('getEntities error %o', error)
    this.data.entities = {
      total: 0,
      dataProvider: []
    }
  }
}
