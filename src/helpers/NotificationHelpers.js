// react
import uuid from 'uuid'

// actions
import ApplicationActions from '../actions/ApplicationActions'

class NotificationHelpers {
  constructor (context) {
    this.context = context
  }
  add (options) {
    const key = uuid.v4()
    this.context.state.notifications.push({
      message: options.message,
      key,
      action: 'Fermer',
      dismissAfter: options.dismissAfter || 1500,
      onClick: () => ApplicationActions.notificationRemove(key)
    })
    this.context.setState({notifications: this.context.state.notifications})
  }
  remove (uuid) {
    const {notifications} = this.context.state
    this.context.setState({
      notifications: notifications.filter(n => n.key !== uuid)
    })
  }
}

export default NotificationHelpers
