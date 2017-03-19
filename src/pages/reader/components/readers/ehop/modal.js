// react
import React from 'react'
import Reflux from 'reflux'
import ReactDOMServer from 'react-dom/server'

import { Container, Button, Header, Image, Modal } from 'semantic-ui-react'
import * as Survey from 'survey-react'

Survey.JsonObject.metaData.addProperty('comment', {name: 'htmlmodal', default: false, choices: [true, false]})

class HtmlModalWidget extends Reflux.Component {
	constructor (props) {
    super(props)
		this.state = {
			open: false
		}
		this.handleOpen = () => {
      this.setState({modal: true})
    }
	}
	render() {
		return (
			<Container fluid>
				<Button onClick={this.handleOpen.bind(this)}>Show Modal</Button>
			  <Modal open={this.state.open}>
			    <Modal.Header>Select a Photo</Modal.Header>
			    <Modal.Content image>
			      <Image wrapped size='medium' src='/assets/images/avatar2/large/rachel.png' />
			      <Modal.Description>
			        <Header>Default Profile Image</Header>
			        <p>We've found the following gravatar image associated with your e-mail address.</p>
			        <p>Is it okay to use this photo?</p>
			      </Modal.Description>
			    </Modal.Content>
			  </Modal>
			</Container>
		 )
	 }
}

const htmlModalWidget = {
  name: 'abibao-html-modal',
  isFit: function (question) {
  	return question.htmlmodal === true
  },
  afterRender: function (question, el) {
  	if (question.htmlmodal) {
  	}
  },
  htmlTemplate: ReactDOMServer.renderToString(<HtmlModalWidget />)
}

Survey.CustomWidgetCollection.Instance.addCustomWidget(htmlModalWidget)