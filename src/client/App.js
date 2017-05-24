import React from 'react'
import Component from 'react-pure-render/component'
import classnames from 'classnames'
import TopNavbar from './navs/TopNavbar.jsx'
import DebugGrid from './temp/debug/DebugGrid.jsx'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Modal from 'atoms/Modal.jsx'
import { logRenderPerf } from 'utils/hocs'

class App extends Component {
  // required for proper propagation of locationPathname down to the children
  getChildContext() {
    return {
      locationPathname: this.props.location.pathname,
      locationSearch: this.props.location.search
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      appLevelClasses: 'App',
      containerWidth: props.containerWidth
    }
  }

  onModalClose = () => {
    const returnLocation = this.props.modal.returnLocation
    this.props.closeRoutedModal(returnLocation)
  }

  componentWillReceiveProps(nextProps) {
    // console.info('App: will receive props...')
    // if we changed routes...
    if ((
      nextProps.location.key !== this.props.location.key
      && nextProps.location.state
      && nextProps.location.state.modalIsOpen
    )) {
      // console.info('App: changed from: ')
      // console.log(this.props.location)
      // console.info('App: changed routes to: ')
      // console.log(nextProps.location)
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

App.childContextTypes = {
  locationPathname: React.PropTypes.string,
  locationSearch: React.PropTypes.string,
}

import { closeRoutedModal } from 'shared/actions/actions.js'

export default withRouter(
  connect(
    state => ({
      debug: state.debug,
      modal: state.app.modal
    }),
    (dispatch, ownProps) =>
      ({closeRoutedModal: returnLocation => dispatch(closeRoutedModal(returnLocation))})
  )(logRenderPerf(App, 'App'))
)
