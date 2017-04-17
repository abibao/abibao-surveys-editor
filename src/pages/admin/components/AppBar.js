
/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'

// semantic
import { Header, Icon, Menu, Button } from 'semantic-ui-react'

import AdminActions from './../libs/Actions'

class AppBar extends Reflux.Component {
  constructor (props) {
    super(props)
    this.handleLogout = () => {
      AdminActions.networkLogout()
    }
  }
  render () {
    return (
      <Menu fixed="top" borderless inverted>
        <Menu.Item>
          <Header as="h1" inverted className="appbar" color="red">
            <Icon name="settings" />
            <Header.Content>
              ABIBAO
              <Header.Subheader>
                platform
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            <Button onClick={this.handleLogout} size="large">Logout</Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }
}

export default AppBar
