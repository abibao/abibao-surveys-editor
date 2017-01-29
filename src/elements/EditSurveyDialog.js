import React from 'react'
import Reflux from 'reflux'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import FeathersStore from './../stores/FeathersStore'

export default class EditSurveyDialog extends Reflux.Component {
  constructor (props) {
    super(props)
    this.stores = [FeathersStore]
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
      store.updateSurvey(this.props.survey)
      this.setState({open: false})
    }
    this.handleChangeName = (e) => {
      this.props.survey.name = e.target.value
    }
  }

  render () {
    const actions = [
      <FlatButton label="Close" onTouchTap={this.handleClose} />,
      <FlatButton label="Save" primary onTouchTap={this.handleSave} />
    ]

    return (
      <div>
        <RaisedButton label="Properties" onTouchTap={this.handleOpen} />
        <Dialog title="Edit the survey" actions={actions} modal={false} open={this.state.open} onRequestClose={this.handleClose}>
          Name: <br />
          <TextField id="surveyNameTextField" onChange={this.handleChangeName} defaultValue={this.props.survey.name} />
        </Dialog>
      </div>
    )
  }
}
