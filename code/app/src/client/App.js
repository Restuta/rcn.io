import React from 'react'
import Component from 'react-pure-render/component'
import './styles/bootstrap.scss'
import './app.scss'
import classNames from 'classnames'
import TopNavbar from './navs/TopNavbar.jsx'
import DebugGrid from './temp/debug/DebugGrid.jsx'

let whenRenderStarted

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      appLevelClasses: 'App',
      containerWidth: props.containerWidth || 1140
    }

    this.setAppStateClasses = this.setAppStateClasses.bind(this)
  }

  setAppStateClasses(classesToSet) {
    this.setState({
      appLevelClasses: classNames('App', classesToSet)
    })
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

    //adding props to children, passing browser-calculated container size to be exact */
    const children = React.cloneElement(this.props.children, { containerWidth: this.props.containerWidth })

    return (
      <div className={this.state.appLevelClasses}>
        <DebugGrid setDebugClasses={this.setAppStateClasses} />
        <TopNavbar />
        <div className="App container">
          {children}
        </div>
      </div>
    )
  }
}
