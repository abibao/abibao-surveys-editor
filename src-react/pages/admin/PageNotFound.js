/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'

// semantic
import { Container, Segment, Header, Icon } from 'semantic-ui-react'

class PageNotFound extends Reflux.Component {
  componentDidMount () {
  }
  componentWillUnmount () {
    Reflux.Component.prototype.componentWillUnmount.call(this)
  }
  componentDidUpdate (prevProps, prevState) {
  }
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    let renderer = () => (
      <Container fluid className="error404">
        <Segment basic padded className="error404">
          <Header as="h1" color="red" icon className="error404">
            <Icon name="help circle" size="huge" />
            404
            <Header.Subheader>Oups, vous vous êtes égaré dans la dimension noire !</Header.Subheader>
          </Header>
        </Segment>
      </Container>
    )
    return renderer()
  }
}

export default PageNotFound
