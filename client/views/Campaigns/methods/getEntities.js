export default function () {
  this.debug('getEntities')
  this.$feathers.service('api/entities').find({})
    .then(entities => {
      this.debug('entities %o', entities)
      this.data.entities = {
        total: entities.length,
        dataProvider: entities
      }
    })
    .catch((error) => {
      this.debug('entities error %o', error)
      this.data.entities = {
        total: 0,
        dataProvider: []
      }
      console.log(error)
    })
}
