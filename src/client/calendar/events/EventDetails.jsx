import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './EventDetails.scss'
import ExecutionEnvironment from 'exenv'
import Row from 'atoms/Row.jsx'
import Col from 'atoms/Col.jsx'
import { default as ReactModal } from 'react-modal2'

class MyModal extends Component {
  componentWillMount() {
    if (ExecutionEnvironment.canUseDOM) {
      document.body.style.overflow = 'hidden'
    }
  }

  componentWillUnmount() {
    if (ExecutionEnvironment.canUseDOM) {
      document.body.style.overflow = null
    }
  }

  render() {
    return (
      <ReactModal
        onClose={this.props.onClose}
        closeOnEsc={this.props.closeOnEsc}
        closeOnBackdropClick={this.props.closeOnBackdropClick}
        backdropClassName='MyModal overlay'
        modalClassName='content'>
        {this.props.children}
      </ReactModal>
    )
  }
}

export default class EventDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {modalIsOpen: false}

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
          <MyModal closeOnEsc={true} closeOnBackdropClick={true} onClose={this.closeModal}>
            <Row>
              <Col sm={9}>
                <h4 style={{marginTop: 0, color: 'grey'}} className="header-regular w-500">
                  Saturday, May 13th <i>(in 43 days)</i>
                </h4>
                <h3 style={{marginTop: 0}} className="header-regular w-900">Chico Stage Race pb Sierra Nevada Brewing
                  Co — Stage 4: Steve Harrison Memorial Criterium
                </h3>
              </Col>
            </Row>
          </MyModal>
        }

      </div>
    )
  }
}

EventDetails.propTypes = {
  details: PropTypes.string
}
