// react
import React from 'react'
import Reflux from 'reflux'
import {Container, Row, Col} from 'react-grid-system'

// material-ui
import {orange800, grey300} from 'material-ui/styles/colors'
import {Card, CardMedia, CardTitle, CardActions} from 'material-ui/Card'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import AddIcon from 'material-ui/svg-icons/content/add'

// components
import AppBarAbibao from './components/AppBarAbibao'
import CampaignsActionsButtons from './components/CampaignsActionsButtons'

// store
import CampaignsStore from './../../stores/CampaignsStore'

// action
import CampaignsActions from './../../actions/CampaignsActions'

// styles
const styles = {
  container: {},
  floating: {position: 'fixed', right: '1rem', bottom: '1rem', zIndex: 9999},
  card: {width: 'auto', margin: '0', marginBottom: '1rem'},
  cardTitle: {overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'},
  cardActions: {padding: 0},
  cardActionLeft: {float: 'left'},
  grid: {
    container: {
      padding: '0.5rem',
      margin: '0',
      marginTop: 64,
      background: grey300,
      overflowX: 'hidden'
    },
    row: {
      padding: '0',
      margin: '0'
    },
    col: {
      padding: '0.5rem',
      paddingBottom: '0',
      paddingTop: '0',
      margin: '0',
      width: 'auto'
    }
  }
}

class Campaigns extends Reflux.Component {
  componentDidMount () {
    console.log('Campaigns', 'componentDidMount')
    CampaignsActions.initialize()
  }
  componentWillUnmount () {
    console.log('Campaigns', 'componentWillUnmount')
  }
  componentDidUpdate (prevProps, prevState) {
    console.log('Campaigns', 'componentDidUpdate')
  }
  constructor (props) {
    console.log('Campaigns', 'constructor')
    super(props)
    // prepare state
    this.state = {}
    this.store = CampaignsStore
    // create a campaign
    this.handleCreateCampaign = () => {
      CampaignsActions.create()
    }
  }
  render () {
    let renderer = () => (
      <div style={styles.container}>
        <AppBarAbibao />
        <Container fluid style={styles.grid.container}>
          <Row style={styles.grid.row}>
            <Col xs={12} style={styles.grid.col}>
              <h2>Les campagnes</h2>
              <p>Il y a actuellement {this.state.campaigns.length} campagnes en ligne.</p>
            </Col>
            {this.state.campaigns.map((campaign) => (
              <Col key={campaign.id} xs={12} sm={6} md={4} lg={3} style={styles.grid.col}>
                <Card style={styles.card}>
                  <CardTitle title={campaign.name} titleStyle={styles.cardTitle} subtitle={campaign.company.name || 'Chargement...'} />
                  <CardMedia>
                    <div style={{background: 'url(' + process.env.REACT_APP_FEATHERS_URI + '/' + campaign.picture + ') no-repeat center / cover', width: 'auto', height: '150px'}} />
                  </CardMedia>
                  <CardActions style={styles.cardActions}>
                    <CampaignsActionsButtons style={styles.cardActionLeft} campaign={campaign} />
                  </CardActions>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
        <FloatingActionButton onTouchTap={this.handleCreateCampaign} style={styles.floating} backgroundColor={orange800} zDepth={1}>
          <AddIcon />
        </FloatingActionButton>
      </div>
    )
    return renderer()
  }
}

export default Campaigns
