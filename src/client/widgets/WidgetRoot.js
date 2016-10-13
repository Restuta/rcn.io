/* Root component for all Widgets */

import React from 'react'
import Component from 'react-pure-render/component'
import DebugGrid from 'client/temp/debug/DebugGrid.jsx'
import './WidgetRoot.scss'
import { Link } from 'react-router'
import { logRenderPerf } from 'utils/hocs'

class WidgetRoot extends Component {
  render() {

    return (
      <div className="WidgetRoot container-fluid">
      {__ENV.Dev
        && <DebugGrid containerWidth={this.props.containerWidth}/>}

        Hello, I am a widget 🐰 <Link to="bla">bla</Link>
        {this.props.children}
      </div>
    )
  }
}

export default logRenderPerf(WidgetRoot, 'WidgetRoot')
