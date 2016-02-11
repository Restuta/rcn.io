import React from 'react'
import { render } from 'react-dom'
import { App } from './App'
import Dev from './Dev'
import Grid from './styles/grid'

import { Router, Route, browserHistory } from 'react-router'

let renderApp = function() {
  let browserWidth = window.document.body.offsetWidth
  let containerWidth = Grid.getContainerWidth(browserWidth)

  //render(<App containerWidth={containerWidth} />, document.getElementById('root'))

  render((
    <Router history={browserHistory}>
      <Route path="/" component={App}/>
      <Route path="/dev" component={Dev} />
    </Router>
  ), document.getElementById('root'))
}

//re-render app on windows resize
window.addEventListener('resize', () => renderApp())

//first time render
renderApp()
