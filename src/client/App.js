import React from 'react'
import Component from 'react-pure-render/component'
import classnames from 'classnames'
import TopNavbar from './navs/TopNavbar.jsx'
import DebugGrid from './temp/debug/DebugGrid.jsx'
import Modal from 'atoms/Modal.jsx'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      appLevelClasses: 'App',
      containerWidth: props.containerWidth
    }
  }

  onModalClose = () =>
    this.props.closeRoutedModal(this.props.modal.returnLocation)

  componentWillReceiveProps(nextProps) {
    // if we changed routes...
    if ((
      nextProps.location.key !== this.props.location.key
      && nextProps.modal
      && nextProps.modal.isOpen
    )) {
      // save the old children (just like animation)
      this.previousChildren = this.props.children
    }
  }

  render() {
    const { location, modal } = this.props

    // let shouldRenderInModal = (
    //   location.state && location.state.modal
    //   // && this.previousChildren
    // )

    let shouldRenderInModal = modal.isOpen

    const appLevelClasses = classnames('App',
      (this.props.debug.showContainerEdges && 'debug-container')
    )

    //adding props to children, passing browser-calculated container size to be exact */
    this.children = React.cloneElement(this.props.children, {containerWidth: this.props.containerWidth})

    return (
      <div className={appLevelClasses}>
        {__ENV.Dev
          && <DebugGrid containerWidth={this.props.containerWidth}/>}

        <TopNavbar location={location}/>

        {shouldRenderInModal && (
          <Modal onClose={this.onModalClose} hasPadding={modal.hasPadding}>
            {this.props.children}
          </Modal>
        )}

        <div className="App container">
          {shouldRenderInModal
            ? this.previousChildren
            : this.children
          }
        </div>
      </div>
    )
  }
}

import { connect } from 'react-redux'
import { closeRoutedModal } from 'shared/actions/actions.js'
import { flow } from 'lodash'
import { logRenderPerfFor } from 'utils/hocs'

export default flow(
  logRenderPerfFor('App'),
  connect(
    state => ({
      debug: state.debug,
      modal: state.app.modal
    }),
    (dispatch, ownProps) => ({
      closeRoutedModal: returnLocation => dispatch(closeRoutedModal(returnLocation))
    }),
    undefined,
    { pure: true }
  ),
)(App)
