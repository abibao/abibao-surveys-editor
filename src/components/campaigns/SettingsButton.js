import React from 'react'
import Reflux from 'reflux'

import {grey300, grey800, white, orange800, lightGreen800} from 'material-ui/styles/colors'
import Dialog from 'material-ui/Dialog'
import SettingsIcon from 'material-ui/svg-icons/action/settings'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import PlayIcon from 'material-ui/svg-icons/av/play-arrow'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'

import CampaignStore from './../../stores/CampaignStore'

const styles = {
  smallIcon: {
    width: 36,
    height: 36
  },
  mediumIcon: {
    width: 48,
    height: 48
  },
  small: {
    width: 48,
    height: 48,
    padding: 0
  },
  mediumRight: {
    width: 48,
    height: 48,
    padding: 0,
    float: 'right'
  },
  tooltip: {
    fontWeight: 'bold',
    color: white,
    border: 'solid 1px',
    borderColor: grey800,
    padding: '0.5rem',
    paddingBottom: 0,
    paddingTop: 0
  }
}

class SettingsButton extends Reflux.Component {
  constructor (props) {
    super(props)
    this.stores = [CampaignStore]
    this.state = {
      open: false
    }
    this.handleOpen = () => {
      this.setState({open: true})
    }
    this.handleClose = () => {
      this.setState({open: false})
    }
    this.handleSave = () => {
      const store = this.stores[0]
      store.update(this.props.campaign)
      this.setState({open: false})
    }
    this.handleChangeName = (e) => {
      this.props.campaign.name = e.target.value
    }
  }

  render () {
    const actions = [
      <FlatButton label="Annuler" onTouchTap={this.handleClose} />,
      <FlatButton label="Sauver" primary onTouchTap={this.handleSave} />
    ]
    return (
      <div>
        <IconButton tooltipStyles={styles.tooltip} tooltip="Editer les metadata" tooltipPosition="top-center" iconStyle={styles.smallIcon} style={styles.small}><SettingsIcon color={lightGreen800} onTouchTap={this.handleOpen} /></IconButton>
        <IconButton tooltipStyles={styles.tooltip} tooltip="Editer le sondage" tooltipPosition="top-center" iconStyle={styles.smallIcon} style={styles.small}><EditIcon color={lightGreen800} /></IconButton>
        <IconButton tooltipStyles={styles.tooltip} tooltip="Tester le sondage" tooltipPosition="top-center" iconStyle={styles.mediumIcon} style={styles.mediumRight}><PlayIcon color={orange800} /></IconButton>
        <Dialog title="Edition des metadata" tooltipPosition="top-center" actions={actions} modal={false} open={this.state.open} onRequestClose={this.handleClose}>
          Nom: <br />
          <TextField id="inputName" onChange={this.handleChangeName} defaultValue={this.props.campaign.name} />
        </Dialog>
      </div>
    )
  }
}

export default SettingsButton
