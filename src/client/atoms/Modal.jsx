import React from 'react'
import PropTypes from 'prop-types'
import Component from 'react-pure-render/component'
import ExecutionEnvironment from 'exenv'
import { default as ReactModal } from 'react-modal2'
import './Modal.scss'
import classnames from 'classnames'

//for accesibility, to hide app from screen readers while modal is open
ReactModal.getApplicationElement = () => document.getElementById('root')

const documentHasVerticalScrollbar = (window, document) =>
  window.innerWidth > document.documentElement.clientWidth

export default class Modal extends Component {
  componentWillMount() {
    if (ExecutionEnvironment.canUseDOM) {
      // this check has to be performed before overflow is set to hidden
      if (documentHasVerticalScrollbar(window, document)) {
        document.body.style.marginRight = '15px'
      }

      document.body.style.overflow = 'hidden'
    }
  }

  componentWillUnmount() {
    if (ExecutionEnvironment.canUseDOM) {
      document.body.style.marginRight = ''
      document.body.style.overflow = ''
    }
  }

  render() {
    const modalClassNames = classnames('Modal content', this.props.contentClassName, {
      'has-padding': this.props.hasPadding,
    })

    return (
      <ReactModal
        onClose={this.props.onClose}
        closeOnEsc={this.props.closeOnEsc}
        closeOnBackdropClick={this.props.closeOnBackdropClick}
        backdropClassName='Modal backdrop'
        modalClassName={modalClassNames}>
        <button type="button" className="btn-close" onClick={this.props.onClose}>
          <span>×</span>
          <div className="lbl-esc">esc</div>
        </button>
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
  //for certain cases modal should not have padding so we can apply advnaced background styles
  hasPadding: PropTypes.bool,
}

Modal.defaultProps = {
  hasPadding: true,
  closeOnEsc: true,
}
