import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './EventDetails.scss'

import Modal from 'react-modal'

class MyModal extends Component {
  componentWillMount() {
    document.body.style.overflow = 'hidden'
  }

  componentWillUnmount() {
    document.body.style.overflow = null
  }

  render() {
    return (
      <div className="MyModal overlay">
        <div className="content">
          <div>
            <h4 style={{width: '70%', marginTop: 0, color: 'grey'}} className="header-regular w-500">
              Saturday, May 13th <i>(in 43 days)</i>
            </h4>
            <h3 style={{width: '65%', marginTop: 0}} className="header-regular w-900">Chico Stage Race pb Sierra Nevada Brewing
              Co — Stage 4: Steve Harrison Memorial Criterium
            </h3>
          </div>
        </div>
      </div>
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
        <MyModal />
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          >

          <button onClick={this.closeModal}>close</button>
          <div>I am a modal</div>
          <form>
            <input />
            <button>tab navigation</button>
            <button>stays</button>
            <button>inside</button>
            <button>the modal</button>
          </form>
        </Modal>
      </div>
    )
  }
}

EventDetails.propTypes = {
  details: PropTypes.string
}
