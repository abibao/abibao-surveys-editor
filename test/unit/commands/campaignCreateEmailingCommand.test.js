const command = require('../../../server/services/domain/commands/campaignCreateEmailingCommand')

const Mock = {
  use (name, value) {
    return value
  },
  service () {
    return {
      before () {}
    }
  },
  execute: command
}

describe('[unit] command campaignCreateEmailing', function () {
  it('should not found individual by email', (done) => {
    Mock.execute()
  })
})
