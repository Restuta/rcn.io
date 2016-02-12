import React from 'react'
import Component from 'react-pure-render/component'
import './styles/bootstrap.scss'
import './app.scss'
import classNames from 'classnames'
import TopNavbar from './navs/TopNavbar.jsx'
import DebugGrid from './temp/DebugGrid.jsx'

let whenRenderStarted

export default class Dev extends Component {
  constructor(props) {
    super(props)
    this.state = {
      appLevelClasses: '',
      containerWidth: props.containerWidth || 1140
    }
  }

  setAppStateClasses(classesToSet) {
    this.setState({
      appLevelClasses: classNames('', classesToSet)
    })
  }

  componentDidMount() {
    let now = +new Date()
    /* eslint-disable  no-console */
    console.info('  App rendred in: ' + (now - whenRenderStarted) + 'ms')
  }

  render() {
    whenRenderStarted = +new Date()
    /* eslint-disable  no-console */
    console.info('App-level render! ')
    //adding props to children, passing browser-calculated container size to be exact */
    const children = React.cloneElement(this.props.children, { containerWidth: this.props.containerWidth })

    return (
      <div className={this.state.appLevelClasses}>
        <TopNavbar />
        <div className="container">
          {children}
        </div>
        <DebugGrid setDebugClasses={this.setAppStateClasses.bind(this)}/>
      </div>
    )
  }
}
