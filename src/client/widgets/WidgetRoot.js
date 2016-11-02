/* Root component for all Widgets */

import React from 'react'
import DebugGrid from 'client/temp/debug/DebugGrid.jsx'
import './WidgetRoot.scss'
import { logRenderPerf } from 'utils/hocs'

class WidgetRoot extends React.PureComponent {
  render() {
    //adding props to children, passing browser-calculated container size to be exact */
    const children = React.cloneElement(this.props.children, {containerWidth: this.props.containerWidth})

    return (
      <div className="WidgetRoot container-fluid">
      {__ENV.Dev
        && <DebugGrid containerWidth={this.props.containerWidth}/>}
        {children}
      </div>
    )
  }
}

export default logRenderPerf(WidgetRoot, 'WidgetRoot')
