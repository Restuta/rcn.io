import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './EventDetails.scss'
import Row from 'atoms/Row.jsx'
import Col from 'atoms/Col.jsx'
import Modal from 'atoms/Modal.jsx'


export default class EventDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {modalIsOpen: true}

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  openModal() {
    this.setState({modalIsOpen: true})
  }

  closeModal() {
    this.setState({modalIsOpen: false})
  }

  render() {
    const {eventId} = this.props.params
    return (
      <div className="EventDetails">
        Event Details of: {eventId}
        <hr />
        <a onClick={this.openModal}>Open Modal</a>
        {this.state.modalIsOpen &&
          <Modal closeOnEsc={true} closeOnBackdropClick={true} onClose={this.closeModal}
            contentClassName='EventDetails-modal-content'>
            <Row>
              <Col xs={14} sm={9}>
                <h4 style={{marginTop: 0, color: 'grey'}} className="header-regular w-500">
                  Saturday, May 13th <i>(in 43 days)</i>
                </h4>
                <h3 style={{marginTop: 0}} className="header-regular w-900">Chico Stage Race pb Sierra Nevada Brewing
                  Co — Stage 4: Steve Harrison Memorial Criterium
                </h3>
              </Col>
              <Col xs={14} sm={5}>Criterium</Col>
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
                Flier
              </Col>
            </Row>
          </Modal>
        }

      </div>
    )
  }
}

EventDetails.propTypes = {
  details: PropTypes.string
}
