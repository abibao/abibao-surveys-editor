import React from 'react'
import Reflux from 'reflux'

import {grey300, orange800} from 'material-ui/styles/colors'
import {Card, CardMedia, CardTitle, CardActions} from 'material-ui/Card'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import AddIcon from 'material-ui/svg-icons/content/add'
import {Container, Row, Col} from 'react-grid-system'

import AppBarAbibao from './../components/AppBarAbibao'
import SettingsButton from './../components/campaigns/SettingsButton'

import AppStore from './../stores/AppStore'
import CampaignStore from './../stores/CampaignStore'

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
  card: {width: 'auto', margin: '0', marginBottom: '1rem'},
  cardTitle: {overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'},
  cardActions: {padding: 0},
  cardActionLeft: {float: 'left'},
  grid: {
    container: {
      padding: '0',
      margin: '0',
      background: grey300
    },
    row: {
      padding: '0',
      paddingLeft: '1rem',
      paddingRight: '1rem',
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
    let store = this.stores[1]
    store.find()
  }
  componentWillUnmount () {
    console.log('componentWillUnmount')
  }
  componentDidUpdate (prevProps, prevState) {
  }
  constructor (props) {
    super(props)
    this.state = {}
    this.stores = [AppStore, CampaignStore]
    this.handleCreateCampaign = () => {
      let store = this.stores[1]
      store.create()
    }
  }
  render () {
    // components
    let renderer = () => (
      <div style={styles.container}>
        <div style={styles.box}>
          <AppBarAbibao />
          <Container fluid style={styles.grid.container}>
            <Row style={styles.grid.row}>
              <Col xs={12} style={styles.grid.col}>
                <h2>Campaigns</h2>
              </Col>
              {this.state.dataProviderCampaigns.data.map((campaign) => (
                <Col key={campaign.id} xs={12} sm={6} md={4} lg={3} style={styles.grid.col}>
                  <Card style={styles.card}>
                    <CardTitle title={campaign.name} titleStyle={styles.cardTitle} subtitle="Abibao" />
                    <CardMedia>
                      <div style={{background: 'url(images/574efe952775faef68604ffc1480273149476.png) no-repeat center / cover', width: 'auto', height: '150px'}} />
                    </CardMedia>
                    <CardActions style={styles.cardActions}>
                      <SettingsButton style={styles.cardActionLeft} campaign={campaign} />
                    </CardActions>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </div>
        <FloatingActionButton onTouchTap={this.handleCreateCampaign} style={styles.floating} backgroundColor={orange800} zDepth={1}>
          <AddIcon />
        </FloatingActionButton>
      </div>
    )
    // renderer
    return renderer()
  }
}

export default Campaigns
