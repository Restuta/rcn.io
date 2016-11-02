import React from 'react'
import classnames from 'classnames'
import TopNavbar from './navs/TopNavbar.jsx'
import DebugGrid from './temp/debug/DebugGrid.jsx'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Modal from 'atoms/Modal.jsx'
import { logRenderPerf } from 'utils/hocs'

class App extends React.PureComponent {
  //required for proper propagation of locationPathname down to the children
  getChildContext() {
    return { locationPathname: this.props.location.pathname }
  }

  constructor(props) {
    super(props)

    this.onModalClose = this.onModalClose.bind(this)
    this.state = {
      appLevelClasses: 'App',
      containerWidth: props.containerWidth
    }
  }

  onModalClose() {
    const returnLocation = this.props.location.state.returnLocation

    if (returnLocation) {
      this.props.router.replace({
        pathname: returnLocation.pathname,
        state: { backFromModal: true }
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    // if we changed routes...
    if ((
      nextProps.location.key !== this.props.location.key
      && nextProps.location.state
      && nextProps.location.state.modal
    )) {
      // save the old children (just like animation)
      this.previousChildren = this.props.children
    }
  }

  render() {
    const { location } = this.props

    let shouldRenderInModal = (
      location.state
      && location.state.modal
      // && this.previousChildren
    )

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
          <Modal onClose={this.onModalClose}>
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
  locationPathname: React.PropTypes.string
}

export default withRouter(
  connect(state => ({debug: state.debug}))(
    //App
    logRenderPerf(App, 'App')
  )
)
