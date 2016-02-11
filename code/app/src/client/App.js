import React from 'react'
import Component from 'react-pure-render/component'
import './styles/bootstrap.scss'
import './app.scss'
import classNames from 'classnames'
import DebugGrid from './temp/DebugGrid.jsx'
import Grid from './styles/grid'

export default class Dev extends Component {
  constructor(props) {
    super(props)
    this.state = {
      appLevelClasses: '',
      containerWidth: props.route.containerWidth
    }

    this.setContainerWidth = this.setContainerWidth.bind(this)
  }

  setContainerWidth() {
    //in case of server-side rendering we need to assume defaults
    let containerWidth = this.container.offsetWidth || 1140
    //to trigger re-render app on windows resize
    this.setState({
      containerWidth: containerWidth
    })
  }

  componentDidMount() {
    this.setContainerWidth()
    window.addEventListener('resize', this.setContainerWidth)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setContainerWidth)
  }

  setAppStateClasses(classesToSet) {
    this.setState({
      appLevelClasses: classNames('', classesToSet)
    })
  }

  render() {
    console.info('App-level render!')

    let children

    //we delay rendering while we get firt render in dom so we can get real widh of the container
    if (this.state.containerWidth) {
      //adding props to children, passing browser window size to be exact */
      children = React.Children.map(this.props.children, child => {
        return React.cloneElement(child, { containerWidth: this.state.containerWidth })
      })
    }

    return (
      <div className={this.state.appLevelClasses}>
        <DebugGrid setDebugClasses={this.setAppStateClasses.bind(this)}/>
        <div className="container" ref={(x) => this.container = x}>
          {children}
        </div>
      </div>
    )
  }
}
