import React from 'react'
import Reflux from 'reflux'

import {grey300, lightGreen800} from 'material-ui/styles/colors'
import {Card, CardMedia, CardTitle, CardActions} from 'material-ui/Card'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import AddIcon from 'material-ui/svg-icons/content/add'
import {Container, Row, Col} from 'react-grid-system'

import AppBarAbibao from './../components/AppBarAbibao'

const styles = {
  container: {
    background: grey300,
    width: '100%',
    height: '100%'
  },
  box: {
    background: grey300,
    width: '100%'
  },
  floating: {position: 'fixed', right: '1rem', bottom: '1rem', zIndex: 9999},
  card: {width: 'auto', margin: '0.5rem'},
  cardTitle: {overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'},
  grid: {
    container: {
      padding: '0',
      margin: '0',
      background: grey300
    },
    row: {
      padding: '0',
      margin: '0'
    },
    col: {
      padding: '0',
      margin: '0'
    }
  }
}

class Campaigns extends Reflux.Component {
  componentDidMount () {
  }
  componentWillUnmount () {
  }
  componentDidUpdate (prevProps, prevState) {
  }
  constructor (props) {
    super(props)
    this.state = {
      campaigns: {
        data: [
          {
            id: 1,
            name: 'name 1'
          },
          {
            id: 2,
            name: 'name 2'
          },
          {
            id: 3,
            name: 'name 3'
          },
          {
            id: 4,
            name: 'name 4'
          }
        ]
      }
    }
  }
  render () {
    // components
    let renderer = () => (
      <div style={styles.container}>
        <div style={styles.box}>
          <AppBarAbibao />
          <Container fluid style={styles.grid.container}>
            <Row>
              <Col xs={12}>
                <h2>Campaigns</h2>
              </Col>
              {this.state.campaigns.data.map((campaign) => (
                <Col key={campaign.id} sm={4}>
                  <Card style={styles.card}>
                    <CardTitle title={campaign.name} titleStyle={styles.cardTitle} subtitle="Abibao" />
                    <CardMedia>
                      <div style={{background: 'url(images/574efe952775faef68604ffc1480273149476.png) no-repeat center / cover', width: 'auto', height: '200px'}} />
                    </CardMedia>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </div>
        <FloatingActionButton onTouchTap={this.handleCreateSurvey} style={styles.floating} backgroundColor={lightGreen800} zDepth={1}>
          <AddIcon />
        </FloatingActionButton>
      </div>
    )
    // renderer
    return renderer()
  }
}

export default Campaigns
