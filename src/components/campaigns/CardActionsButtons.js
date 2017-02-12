import React from 'react'
import Reflux from 'reflux'

import {browserHistory} from 'react-router'

import {grey800, grey100, white, orange800, lightGreen800} from 'material-ui/styles/colors'
import Dialog from 'material-ui/Dialog'
import SettingsIcon from 'material-ui/svg-icons/action/settings'
import ImageIcon from 'material-ui/svg-icons/image/image'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import PlayIcon from 'material-ui/svg-icons/av/play-arrow'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper'
import Dropzone from 'react-dropzone'

import CampaignStore from './../../stores/CampaignStore'

const reader = process.env.REACT_APP_SURVEY_READER

const styles = {
  smallIcon: {
    width: 24,
    height: 24
  },
  mediumIcon: {
    width: 36,
    height: 36
  },
  small: {
    width: 36,
    height: 36,
    padding: 0
  },
  mediumRight: {
    width: 36,
    height: 36,
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
  },
  paper: {
    line: {
      padding: '0.5rem',
      marginBottom: '0.5rem',
      backgroundColor: grey100
    }
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
    this.handleOpenEditor = (e) => {
      browserHistory.push('/editor/' + this.props.campaign.id)
    }
    this.handleOpenDropzone = (e) => {
      this.refs.dropzone.open()
    }
    this.handleOnDrop = (files) => {
      const store = this.stores[0]
      store.upload(this.props.campaign.id, files[0])
    }
  }

  render () {
    const actions = [
      <FlatButton label="Annuler" onTouchTap={this.handleClose} />,
      <FlatButton label="Sauver" primary onTouchTap={this.handleSave} />
    ]
    return (
      <div>
        <Dropzone style={{display: 'none'}} ref="dropzone" multiple={false} onDrop={this.handleOnDrop} />
        <IconButton tooltipStyles={styles.tooltip} tooltip="Editer les metadata" tooltipPosition="top-center" iconStyle={styles.smallIcon} style={styles.small}><SettingsIcon color={lightGreen800} onTouchTap={this.handleOpen} /></IconButton>
        <IconButton tooltipStyles={styles.tooltip} tooltip="Editer l'image" tooltipPosition="top-center" iconStyle={styles.smallIcon} style={styles.small}><ImageIcon color={lightGreen800} onTouchTap={this.handleOpenDropzone} /></IconButton>
        <IconButton tooltipStyles={styles.tooltip} tooltip="Editer le sondage" tooltipPosition="top-center" iconStyle={styles.smallIcon} style={styles.small}><EditIcon color={lightGreen800} onTouchTap={this.handleOpenEditor} /></IconButton>
        <IconButton tooltipStyles={styles.tooltip} tooltip="Tester le sondage" tooltipPosition="top-center" iconStyle={styles.mediumIcon} style={styles.mediumRight}><PlayIcon color={orange800} /></IconButton>
        <Dialog title="Edition des metadata" tooltipPosition="top-center" actions={actions} modal={false} open={this.state.open} onRequestClose={this.handleClose}>
          <div>
            <Paper style={styles.paper.line} zDepth={0}>
              <TextField id="inputUrl" floatingLabelText="URL du sondage" floatingLabelFixed fullWidth disabled defaultValue={reader + '/' + this.props.campaign.id} /><br />
            </Paper>
            <Paper style={styles.paper.line} zDepth={0}>
              <TextField id="inputName" floatingLabelText="Nom de la campage" floatingLabelFixed fullWidth onChange={this.handleChangeName} defaultValue={this.props.campaign.name} />
            </Paper>
          </div>
        </Dialog>
      </div>
    )
  }
}

export default SettingsButton
