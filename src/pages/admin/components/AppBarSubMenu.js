/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'
import {browserHistory} from 'react-router'

// semantic
import { Menu } from 'semantic-ui-react'

class AppBarSubMenu extends Reflux.Component {
  constructor (props) {
    super(props)
    this.state = {
      items: {
        '/admin/campaigns': 'Campagnes',
        '/admin/mailings': 'Mailings'
      },
      activeItem: 'None'
    }
    this.handleItemClick = (e, { name }) => {
      if (name === 'Campagnes') {
        browserHistory.push('/admin/campaigns')
      }
      if (name === 'Mailings') {
        browserHistory.push('/admin/mailings')
      }
    }
  }
  componentDidMount () {
    this.setState({activeItem: this.state.items[window.location.pathname]})
  }
  render () {
    const { activeItem } = this.state
    return (
      <Menu fixed="top" color="red" pointing style={{marginTop: '77px'}}>
        <Menu.Item name="Campagnes" active={activeItem === 'Campagnes'} onClick={this.handleItemClick} />
        <Menu.Item name="Mailings" active={activeItem === 'Mailings'} onClick={this.handleItemClick} />
      </Menu>
    )
  }
}

export default AppBarSubMenu
