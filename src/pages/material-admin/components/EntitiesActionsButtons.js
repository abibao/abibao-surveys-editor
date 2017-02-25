import React from 'react'
import Reflux from 'reflux'

import {grey800, grey100, white, lightGreen800} from 'material-ui/styles/colors'
import Dialog from 'material-ui/Dialog'
import SettingsIcon from 'material-ui/svg-icons/action/settings'
import ImageIcon from 'material-ui/svg-icons/image/image'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper'
import Dropzone from 'react-dropzone'

import EntityStore from './../../../stores/EntitiesStore'

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

class EntitiesActionsButtons extends Reflux.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false
    }
    this.stores = [EntityStore]
    this.handleOpen = () => {
      this.setState({open: true})
    }
    this.handleClose = () => {
      this.setState({open: false})
    }
    this.handleSave = () => {
      const store = this.stores[0]
      store.update(this.props.entity)
      this.setState({open: false})
    }
    this.handleChangeName = (e) => {
      this.props.entity.name = e.target.value
    }
    this.handleOpenDropzone = (e) => {
      this.refs.dropzone.open()
    }
    this.handleOnDrop = (files) => {
      const store = this.stores[0]
      store.upload(this.props.entity.id, files[0])
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
        <Dialog title="Edition des metadata" tooltipPosition="top-center" actions={actions} modal={false} open={this.state.open} onRequestClose={this.handleClose}>
          <div>
            <Paper style={styles.paper.line} zDepth={0}>
              <TextField id="inputName" floatingLabelText="Nom de l'entité" floatingLabelFixed fullWidth onChange={this.handleChangeName} defaultValue={this.props.entity.name} />
            </Paper>
          </div>
        </Dialog>
      </div>
    )
  }
}

export default EntitiesActionsButtons
