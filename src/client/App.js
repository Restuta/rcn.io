import React from 'react'
import Component from 'react-pure-render/component'
import classnames from 'classnames'
import TopNavbar from './navs/TopNavbar.jsx'
import DebugGrid from './temp/debug/DebugGrid.jsx'
import { connect } from 'react-redux'

import { withRouter } from 'react-router'
import Modal from 'atoms/Modal.jsx'

let whenRenderStarted

class App extends Component {
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
    const returnUrl = this.props.location.state.returnUrl

    if (returnUrl) {
      this.props.router.push(returnUrl)
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

  componentDidMount() {
    let now = +new Date()
    console.info('  App rendred in: ' + (now - whenRenderStarted) + 'ms') // eslint-disable-line  no-console
  }

  componentDidUpdate() {
    let now = +new Date()
    console.info('  App re-rendred in: ' + (now - whenRenderStarted) + 'ms') // eslint-disable-line  no-console
  }

  render() {
    whenRenderStarted = +new Date()

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
  connect(state => ({debug: state.debug}))(App)
)
