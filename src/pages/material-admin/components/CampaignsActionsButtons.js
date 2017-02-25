// react
import React from 'react'
import Reflux from 'reflux'
import Dropzone from 'react-dropzone'
import {browserHistory} from 'react-router'
import {clone} from 'lodash'

// material-ui
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import Dialog from 'material-ui/Dialog'
import SettingsIcon from 'material-ui/svg-icons/action/settings'
import ImageIcon from 'material-ui/svg-icons/image/image'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import PlayIcon from 'material-ui/svg-icons/av/play-arrow'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper'

// store
import ApplicationStore from './../../../stores/ApplicationStore'

// actions
import CampaignActions from './../../../actions/CampaignActions'

// styles
import Colors from '../../../colors'

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
    color: Colors.white,
    border: 'solid 1px #303030',
    padding: '0.5rem',
    paddingBottom: 0,
    paddingTop: 0
  },
  paper: {
    line: {
      padding: '0.2rem',
      marginBottom: '0.2rem'
    }
  }
}

class CampaignsActionsButtons extends Reflux.Component {
  componentDidMount () {
    // console.log('CampaignsActionsButtons', 'componentDidMount')
  }
  constructor (props) {
    super(props)
    this.state = {
      open: false,
      currentCampaign: {
        company: {
          name: 'Aucune'
        }
      },
      selectedCompany: {
        id: 0
      }
    }
    this.store = ApplicationStore
    this.handleOpen = () => {
      this.setState({currentCampaign: clone(this.props.campaign), open: true, selectedCompany: this.props.campaign.company})
    }
    this.handleClose = () => {
      this.setState({open: false})
    }
    this.handleSave = () => {
      CampaignActions.campaignUpdate(this.state.currentCampaign)
      this.setState({open: false})
    }
    this.handleChangeName = (e) => {
      this.state.currentCampaign.name = e.target.value
      this.setState({currentCampaign: this.state.currentCampaign})
    }
    this.handleChangeCompany = (e, index, value) => {
      this.state.currentCampaign.company = this.state.entities[value]
      this.setState({currentCampaign: this.state.currentCampaign, selectedCompany: this.state.entities[value]})
    }
    this.handleChangePicture = (files) => {
      CampaignActions.campaignUpdatePicture(this.props.campaign.id, files[0])
    }
    this.handleOpenEditor = (e) => {
      browserHistory.push('/admin/editor/' + this.props.campaign.id)
    }
    this.handleOpenReader = (e) => {
      browserHistory.push('/admin/reader/' + this.props.campaign.id)
    }
    this.handleOpenDropzone = (e) => {
      this.refs.dropzone.open()
    }
  }

  render () {
    const actions = [
      <FlatButton label="Annuler" onTouchTap={this.handleClose} />,
      <FlatButton label="Sauver" primary onTouchTap={this.handleSave} />
    ]
    return (
      <div>
        <Dropzone style={{display: 'none'}} ref="dropzone" multiple={false} onDrop={this.handleChangePicture} />
        <IconButton tooltipStyles={styles.tooltip} tooltip="Editer les metadata" tooltipPosition="top-center" iconStyle={styles.smallIcon} style={styles.small}><SettingsIcon color={Colors.secondary} onTouchTap={this.handleOpen} /></IconButton>
        <IconButton tooltipStyles={styles.tooltip} tooltip="Editer l'image" tooltipPosition="top-center" iconStyle={styles.smallIcon} style={styles.small}><ImageIcon color={Colors.secondary} onTouchTap={this.handleOpenDropzone} /></IconButton>
        <IconButton tooltipStyles={styles.tooltip} tooltip="Editer le sondage" tooltipPosition="top-center" iconStyle={styles.smallIcon} style={styles.small}><EditIcon color={Colors.secondary} onTouchTap={this.handleOpenEditor} /></IconButton>
        <IconButton tooltipStyles={styles.tooltip} tooltip="Tester le sondage" tooltipPosition="top-center" iconStyle={styles.mediumIcon} style={styles.mediumRight}><PlayIcon color={Colors.primary} onTouchTap={this.handleOpenReader} /></IconButton>
        <Dialog title="Edition des metadata" tooltipPosition="top-center" actions={actions} modal={false} open={this.state.open} onRequestClose={this.handleClose}>
          <div>
            <Paper style={styles.paper.line} zDepth={0}>
              <TextField id="inputUrl" floatingLabelText="URL du sondage" floatingLabelFixed fullWidth disabled defaultValue={process.env.REACT_APP_SURVEY_READER + '/' + this.state.currentCampaign.id} /><br />
            </Paper>
            <Paper style={styles.paper.line} zDepth={0}>
              <TextField id="inputName" floatingLabelText="Nom de la campage" floatingLabelFixed fullWidth onChange={this.handleChangeName} defaultValue={this.state.currentCampaign.name} />
            </Paper>
            <Paper style={styles.paper.line} zDepth={0}>
              <SelectField floatingLabelText="Compagnie propriétaire" autoWidth value={this.state.selectedCompany.id} onChange={this.handleChangeCompany}>
                {Object.keys(this.state.entities).map((key) => (
                  <MenuItem key={this.state.entities[key].id} value={this.state.entities[key].id} label={this.state.entities[key].name} primaryText={this.state.entities[key].name} />
                ))}
              </SelectField>
            </Paper>
          </div>
        </Dialog>
      </div>
    )
  }
}

export default CampaignsActionsButtons
