// react
import React from 'react'
import Reflux from 'reflux'
import {browserHistory} from 'react-router'

// material-ui
import IconButton from 'material-ui/IconButton'
import HomeIcon from 'material-ui/svg-icons/action/home'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import MenuIcon from 'material-ui/svg-icons/navigation/menu'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import CampaignsIcon from 'material-ui/svg-icons/action/assignment'
import SurveysIcon from 'material-ui/svg-icons/action/assignment-ind'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'
import Drawer from 'material-ui/Drawer'
import AppBar from 'material-ui/AppBar'

// styles
import Colors from '../../../colors'

class AppBarAbibao extends Reflux.Component {
  componentDidMount () {
  }
  componentWillUnmount () {
  }
  componentDidUpdate (prevProps, prevState) {
  }
  constructor (props) {
    super(props)
    this.state = {
      open: false
    }
    this.handleToggle = () => this.setState({open: !this.state.open})
    this.handleHomepage = () => {
      this.handleToggle()
      browserHistory.push('/admin')
    }
    this.handleCampaigns = () => {
      this.handleToggle()
      browserHistory.push('/admin/campaigns')
    }
    this.handleEntities = () => {
      this.handleToggle()
      browserHistory.push('/admin/entities')
    }
  }
  render () {
    const styles = {
      appbar: {backgroundColor: Colors.white, position: 'fixed', top: 0, left: 0},
      appbarTitle: {color: Colors.primary}
    }
    const LeftDrawer = (props) => (
      <div>
        <Drawer width={320} open={this.state.open}>
          <AppBar onLeftIconButtonTouchTap={this.handleToggle} title={<img src="/images/abibao-logo-gris-jaune.png" role="presentation" />} style={styles.appbar} titleStyle={styles.appbarTitle} iconElementLeft={<CloseMenu />} />
          <div style={{marginTop: 64}}>
            <MenuItem onTouchTap={this.handleHomepage} primaryText="Accueil" leftIcon={<HomeIcon color={Colors.primary} />} />
            <Divider />
            <MenuItem onTouchTap={this.handleCampaigns} primaryText="Les Campagnes" leftIcon={<CampaignsIcon color={Colors.secondary} />} />
            <MenuItem onTouchTap={this.handleEntities} primaryText="Les entitiés" leftIcon={<CampaignsIcon color={Colors.secondary} />} />
            <MenuItem primaryText="Les Sondages" leftIcon={<SurveysIcon color={Colors.secondary} />} disabled />
            <Divider />
          </div>
        </Drawer>
      </div>
    )
    const CloseMenu = (props) => (
      <IconButton
        {...props}>
        <CloseIcon />
      </IconButton>
    )
    const OpenMenu = (props) => (
      <IconButton
        {...props}>
        <MenuIcon color={Colors.primary} />
      </IconButton>
    )
    const Logged = (props) => (
      <IconMenu
        {...props}
        iconButtonElement={
          <IconButton><MoreVertIcon /></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
        <MenuItem primaryText="Mon profil" disabled />
        <MenuItem primaryText="Configuration" disabled />
        <Divider />
        <MenuItem primaryText="Déconnexion" />
      </IconMenu>
    )
    // components
    let renderer = () => (
      <div>
        <AppBar onLeftIconButtonTouchTap={this.handleToggle} title={<img src="/images/abibao-logo-gris-jaune.png" role="presentation" />} style={styles.appbar} titleStyle={styles.appbarTitle} iconElementLeft={<OpenMenu />} iconElementRight={<Logged />} />
        {LeftDrawer()}
      </div>
    )
    // renderer
    return renderer()
  }
}

export default AppBarAbibao
