import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './EventDetails.scss'
import Row from 'atoms/Row.jsx'
import Col from 'atoms/Col.jsx'
import Modal from 'atoms/Modal.jsx'

import { browserHistory } from 'react-router'

export class EventDetailsModal extends Component {
  constructor(props) {
    super(props)
    this.state = {modalIsOpen: true}

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  openModal() {
    // this.setState({modalIsOpen: true})
    // browserHistory.replace('/calendars/norcal-mtb/')
    // window.history.pushState({}, '', '/calendars/norcal-mtb/')
  }

  closeModal() {
    // this.setState({modalIsOpen: false})
    // window.history.pushState({}, '', '/calendars/norcal-mtb/')
    // console.log(browserHistory)
    // browserHistory.replace('/calendars/norcal-mtb')
  }

  render() {
    return (
      <Modal closeOnEsc={true} closeOnBackdropClick={true} onClose={this.props.onClose}
        contentClassName='EventDetailsModal-modal-content'>
        <EventDetails {...this.props}/>
      </Modal>
    )
  }
}


export default class EventDetails extends Component {
  render() {
    const {eventId} = this.props.params || 0

    return (
      <div className="EventDetails">
        <Row>
          <Col xs={14} sm={9}>
            <h4 style={{marginTop: 0, color: 'grey'}} className="header-regular w-500">
              Saturday, May 13th <i>(in 43 days)</i>
            </h4>
            <h3 style={{marginTop: 0}} className="header-regular w-900">Chico Stage Race pb Sierra Nevada Brewing
              Co — Stage 4: Steve Harrison Memorial Criterium
            </h3>
          </Col>
          <Col xs={14} sm={5}>Criterium #{eventId}</Col>
        </Row>
        <Row>
          <Col xs={14} sm={9}>
            <div style={{minHeight: '50rem'}}>map</div>
          </Col>
          <Col xs={14} sm={5}><button className="btn btn-secondary">Register</button></Col>
        </Row>
        <Row>
          <Col xs={14} sm={9}>
          Part of:
          </Col>
          <Col xs={14} sm={5}>Links</Col>
        </Row>
        <Row>
          <Col>
            Flyer
          </Col>
        </Row>
      </div>
    )
  }
}

EventDetails.propTypes = {
  details: PropTypes.string
}
