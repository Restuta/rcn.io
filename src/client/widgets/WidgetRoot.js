/* Root component for all Widgets */

import React from 'react'
import Component from 'react-pure-render/component'
// import DebugGrid from 'client/temp/debug/DebugGrid.jsx'
import './WidgetRoot.scss'

class WidgetRoot extends Component {
  render() {
    //adding props to children, passing browser-calculated container size to be exact */
    const children = this.props.children
      ? React.cloneElement(this.props.children, {containerWidth: this.props.containerWidth})
      : null

    return (
      <div className="container-fluid WidgetRoot">
        {/* {__ENV.Dev && <DebugGrid containerWidth={this.props.containerWidth}/>} */}
        {children}
      </div>
    )
  }
}

// import { logRenderPerf } from 'utils/hocs'
// export default logRenderPerf(WidgetRoot, 'WidgetRoot')

export default WidgetRoot
