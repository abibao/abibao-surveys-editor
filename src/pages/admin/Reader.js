// react
import React from 'react'
import Reflux from 'reflux'
import {browserHistory} from 'react-router'
import {Container, Row, Col} from 'react-grid-system'

// material-ui
import {grey300, orange800} from 'material-ui/styles/colors'
import Paper from 'material-ui/Paper'
import CircularProgress from 'material-ui/CircularProgress'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back'

// components
import * as Readers from './../../components/readers'

// stores
import CampaignsStore from './../../stores/CampaignsStore'

// actions
import CampaignsActions from './../../actions/CampaignsActions'

// styles
const styles = {
  floating: {position: 'fixed', left: '1rem', top: '1rem', zIndex: 9999},
  container: {
    display: 'flex',
    background: grey300,
    width: '100%',
    height: '100%'
  },
  box: {
    padding: '2rem',
    margin: 'auto',
    width: '320px',
    marginTop: '50vh',
    transform: 'translateY(-50%)',
    textAlign: 'center'
  },
  boxreader: {
    padding: '0',
    margin: 'auto'
  },
  progress: {
    margin: 'auto',
    width: '120px'
  },
  grid: {
    container: {
      padding: '0.5rem',
      margin: '0',
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

class Reader extends Reflux.Component {
  componentDidMount () {
    console.log('Reader', 'componentDidMount')
    this.handleLoadData(this.props.params.id)
  }
  componentWillUnmount () {
    console.log('Reader', 'componentWillUnmount')
  }
  componentDidUpdate (prevProps, prevState) {
    console.log('Reader', 'componentDidUpdate')
  }
  constructor (props) {
    console.log('Reader', 'constructor')
    super(props)
    this.state = {
      data: false,
      readers: {
        abibao: Readers.AbibaoReader,
        mqst: Readers.MQSTReader
      }
    }
    this.store = CampaignsStore
    this.handleBack = () => {
      browserHistory.push('/admin/campaigns')
    }
    this.handleLoadData = (id) => {
      console.log('Reader', 'handleLoadData', id)
      CampaignsActions.loadAsync(id, (campaign) => {
        console.log('Reader', 'loadAsync callback', campaign.id)
        this.setState({data: campaign.data})
      })
    }
  }
  render () {
    // components
    let loader = () => (
      <Paper style={styles.container}>
        <Paper style={styles.box}>
          <h2>Chargement en cours...</h2>
          <CircularProgress color={orange800} style={styles.progress} size={120} thickness={6} />
        </Paper>
      </Paper>
    )
    let renderer = (CurrentReader) => (
      <div style={styles.container}>
        <Paper style={styles.boxreader}>
          <Container fluid style={styles.grid.container}>
            <Row style={styles.grid.row}>
              <Col xs={12} style={styles.grid.col}><CurrentReader data={this.state.data} /></Col>
            </Row>
          </Container>
        </Paper>
        <FloatingActionButton onTouchTap={this.handleBack} style={styles.floating} backgroundColor={orange800} zDepth={1}>
          <BackIcon />
        </FloatingActionButton>
      </div>
    )
    // renderer
    if (this.state.data === false) {
      return loader()
    } else {
      const label = (this.props.location.query.reader) ? this.props.location.query.reader : 'abibao'
      const reader = (this.state.readers[label]) ? this.state.readers[label] : this.state.readers['abibao']
      return renderer(reader)
    }
  }
}

export default Reader
