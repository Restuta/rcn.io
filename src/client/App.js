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

    this.onModalClose = this.onModalClose.bind(this)
    this.state = {
      appLevelClasses: 'App',
      containerWidth: props.containerWidth
    }
  }

  onModalClose() {
    const returnLocation = this.props.location.state.returnLocation
    console.log(returnLocation)

    if (returnLocation) {
      this.props.router.replace({
        pathname: returnLocation.pathname,
        search: returnLocation.search,
        state: { navigatedBackFromModal: true }
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.info('App: will receive props...')
    // if we changed routes...
    if ((
      nextProps.location.key !== this.props.location.key
      && nextProps.location.state
      && nextProps.location.state.modal
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
    const { location } = this.props

    let shouldRenderInModal = (
      location.state && location.state.modal
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
          <Modal onClose={this.onModalClose} {...location.state.modalProps}>
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

export default withRouter(
  connect(state => ({debug: state.debug}))(
    //App
    logRenderPerf(App, 'App')
  )
)
