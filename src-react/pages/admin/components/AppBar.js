/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'

// semantic
import { Header, Icon, Image, Menu } from 'semantic-ui-react'

import AdminStore from './../libs/Store'

class AppBar extends Reflux.Component {
  constructor (props) {
    super(props)
    this.store = AdminStore
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
            <Image className="icon admin-appbar" shape="circular" src={this.state.currentUser.picture} />
            <a href="/admin/logout"><Image className="icon admin-appbar" shape="circular" src="/images/unplug-icon.png" /></a>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }
}

export default AppBar
