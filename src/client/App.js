import React from 'react'
import Component from 'react-pure-render/component'
import './styles/bootstrap.scss'
import './app.scss'
import classnames from 'classnames'
import TopNavbar from './navs/TopNavbar.jsx'
import DebugGrid from './temp/debug/DebugGrid.jsx'
import { connect } from 'react-redux'

let whenRenderStarted

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      appLevelClasses: 'App',
      containerWidth: props.containerWidth
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
    console.info(this.props.debug)
    whenRenderStarted = +new Date()
    const {location} = this.props

    const appLevelClasses = classnames('App',
      (this.props.debug.showContainerEdges && 'debug-container')
    )

    //adding props to children, passing browser-calculated container size to be exact */
    const children = React.cloneElement(this.props.children, { containerWidth: this.props.containerWidth })

    return (
      <div className={appLevelClasses}>
        {__ENV.Dev
          && <DebugGrid containerWidth={this.props.containerWidth}/>}

        <TopNavbar location={location} />
        <div className="App container">
          {children}
        </div>
      </div>
    )
  }
}

const AppConnected = connect(state => ({debug: state.debug}))(App)

export default AppConnected
