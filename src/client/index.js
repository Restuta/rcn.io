import React from 'react'
import Component from 'react-pure-render/component'
import { render } from 'react-dom'
import App from './App'
import Home from './Home'
import Dev from './Dev'
import Grid from './styles/grid'
import Cal from './calendar/Index'
import Mtb from './calendar/Mtb'

import { Router, Route, browserHistory, IndexRoute } from 'react-router'

let prevContainerWidth

let renderApp = function() {
  let browserWidth = window.document.body.offsetWidth
  let containerWidth = Grid.getContainerWidth(browserWidth)

  if (containerWidth === prevContainerWidth) {
    return
  }

  prevContainerWidth = containerWidth

  //overriding Router function to pass custom props to a child components
  function createElement(Component, props) {
    return <Component {...props} containerWidth={containerWidth}/>
  }

  render((
    <Router history={browserHistory} createElement={createElement}>
      {/* passing conteiner width in a hacky way, for fast first-time browser render */}
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="/dev" component={Dev} />
        <Route path="/cal" component={Cal} />
        <Route path="/mtb" component={Mtb} />
      </Route>
    </Router>
  ), document.getElementById('root'))

}

window.addEventListener('resize', () => renderApp())

//first time render
renderApp()
