import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import ExecutionEnvironment from 'exenv'
import { default as ReactModal } from 'react-modal2'
import './Modal.scss'
import classnames from 'classnames'

//for accesibility, to hide app from screen readers while modal is open
ReactModal.getApplicationElement = () => document.getElementById('root')

export default class Modal extends Component {
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
    const modalClassNames = classnames('Modal content', this.props.contentClassName)

    return (
      <ReactModal
        onClose={this.props.onClose}
        closeOnEsc={this.props.closeOnEsc}
        closeOnBackdropClick={this.props.closeOnBackdropClick}
        backdropClassName='Modal backdrop'
        modalClassName={modalClassNames}>
        {this.props.children}
      </ReactModal>
    )
  }
}


Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  closeOnEsc: PropTypes.bool,
  closeOnBackdropClick: PropTypes.bool,
  contentClassName: PropTypes.string,
}
