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
        'admin/campaigns': 'Campagnes',
        'admin/styles': 'Styles',
        'admin/mailings': 'Mailings'
      },
      activeItem: 'None'
    }
    this.handleItemClick = (e, { name }) => {
      if (name === 'Campagnes') {
        browserHistory.push('/admin/campaigns')
      }
      if (name === 'Styles') {
        browserHistory.push('/admin/styles')
      }
      if (name === 'Mailings') {
        browserHistory.push('/admin/mailings')
      }
    }
  }
  componentDidMount () {
    switch (true) {
      case window.location.pathname.includes('admin/campaigns'):
        this.setState({activeItem: this.state.items['admin/campaigns']})
        break
      case window.location.pathname.includes('admin/styles'):
        this.setState({activeItem: this.state.items['admin/styles']})
        break
      case window.location.pathname.includes('admin/mailings'):
        this.setState({activeItem: this.state.items['admin/mailings']})
        break
      default:
        this.setState({activeItem: 'None'})
    }
  }
  render () {
    const { activeItem } = this.state
    return (
      <Menu fixed="top" color="red" pointing style={{marginTop: '77px'}}>
        <Menu.Item name="Campagnes" active={activeItem === 'Campagnes'} onClick={this.handleItemClick} />
        <Menu.Item name="Styles" active={activeItem === 'Styles'} onClick={this.handleItemClick} />
        <Menu.Item name="Mailings" active={activeItem === 'Mailings'} onClick={this.handleItemClick} />
      </Menu>
    )
  }
}

export default AppBarSubMenu
